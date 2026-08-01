'use strict';

const dns = require('dns').promises;
const net = require('net');

/**
 * Private/reserved IPv4 CIDR blocks. Requests resolving to any of these
 * must be blocked to prevent Server-Side Request Forgery (SSRF).
 *
 * Sources: RFC 1918, RFC 5735, RFC 6598, RFC 3927, RFC 4291
 */
const BLOCKED_CIDRS_V4 = [
    { prefix: '0.0.0.0',     bits: 8  }, // "This" network
    { prefix: '10.0.0.0',    bits: 8  }, // Private class A (RFC 1918)
    { prefix: '100.64.0.0',  bits: 10 }, // Shared address space (RFC 6598)
    { prefix: '127.0.0.0',   bits: 8  }, // Loopback
    { prefix: '169.254.0.0', bits: 16 }, // Link-local / AWS instance metadata (RFC 3927)
    { prefix: '172.16.0.0',  bits: 12 }, // Private class B (RFC 1918)
    { prefix: '192.0.0.0',   bits: 24 }, // IETF Protocol Assignments
    { prefix: '192.168.0.0', bits: 16 }, // Private class C (RFC 1918)
    { prefix: '198.18.0.0',  bits: 15 }, // Network benchmarking (RFC 2544)
    { prefix: '224.0.0.0',   bits: 4  }, // Multicast (RFC 3171)
    { prefix: '240.0.0.0',   bits: 4  }, // Reserved / future use (RFC 1112)
];

function ipv4ToLong(ip) {
    return ip.split('.').reduce((acc, oct) => ((acc << 8) + Number(oct)) >>> 0, 0);
}

function isBlockedIpv4(ip) {
    const long = ipv4ToLong(ip);
    return BLOCKED_CIDRS_V4.some(({ prefix, bits }) => {
        const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
        return (long & mask) === (ipv4ToLong(prefix) & mask);
    });
}

function isBlockedIpv6(ip) {
    const l = ip.toLowerCase();
    return (
        l === '::1'            || // Loopback
        l.startsWith('fe80:')  || // Link-local (RFC 4291)
        l.startsWith('fc00:')  || // Unique local (RFC 4193)
        l.startsWith('fd')     || // Unique local (RFC 4193)
        l.startsWith('ff')        // Multicast
    );
}

/**
 * Returns true if the address is private, reserved, or loopback.
 * Handles plain IPv4, plain IPv6, and IPv4-mapped IPv6 (::ffff:x.x.x.x).
 *
 * @param {string} ip
 * @returns {boolean}
 */
function isBlockedIp(ip) {
    if (net.isIPv4(ip)) return isBlockedIpv4(ip);
    if (net.isIPv6(ip)) {
        // ::ffff:192.168.1.1 is an IPv4-mapped address — evaluate as IPv4
        const mapped = ip.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
        if (mapped) return isBlockedIpv4(mapped[1]);
        return isBlockedIpv6(ip);
    }
    return true; // Unknown format — block by default (fail-closed)
}

/**
 * Validates a URL for SSRF safety before any HTTP request is made.
 *
 * Checks performed:
 *  1. The URL must parse successfully
 *  2. Protocol must be http or https (blocks file://, ftp://, gopher://, etc.)
 *  3. If the hostname is a bare IP literal, it must be a public address
 *  4. If the hostname is a domain name, every resolved IP must be public
 *
 * Throws an Error with .statusCode and .code set if the URL is unsafe.
 * The caller is responsible for deciding the HTTP response.
 *
 * @param {string} rawUrl
 * @returns {Promise<void>}
 */
async function validateUrlForSsrf(rawUrl) {
    // --- Parse ---
    let parsed;
    try {
        parsed = new URL(rawUrl);
    } catch {
        const err = new Error('Invalid URL format.');
        err.statusCode = 400;
        err.code = 'BAD_REQUEST';
        throw err;
    }

    // --- 1. Protocol allow-list ---
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        const err = new Error(
            `URL scheme '${parsed.protocol.replace(':', '')}' is not permitted. ` +
            'Only http and https are allowed.'
        );
        err.statusCode = 400;
        err.code = 'BAD_REQUEST';
        throw err;
    }

    const { hostname } = parsed;

    // --- 2a. Bare IP literal — validate directly, no DNS needed ---
    if (net.isIP(hostname)) {
        if (isBlockedIp(hostname)) {
            const err = new Error('Requests to private or reserved IP addresses are not permitted.');
            err.statusCode = 400;
            err.code = 'SSRF_BLOCKED';
            throw err;
        }
        return; // Public IP literal — safe to proceed
    }

    // --- 2b. Domain — resolve via DNS and check every returned address ---
    const addresses = [];
    const [v4Result, v6Result] = await Promise.allSettled([
        dns.resolve4(hostname),
        dns.resolve6(hostname),
    ]);
    if (v4Result.status === 'fulfilled') addresses.push(...v4Result.value);
    if (v6Result.status === 'fulfilled') addresses.push(...v6Result.value);

    if (addresses.length === 0) {
        const err = new Error('Hostname could not be resolved. The URL may be invalid or unreachable.');
        err.statusCode = 400;
        err.code = 'BAD_REQUEST';
        throw err;
    }

    const blocked = addresses.find(isBlockedIp);
    if (blocked) {
        const err = new Error('Requests to private or reserved IP addresses are not permitted.');
        err.statusCode = 400;
        err.code = 'SSRF_BLOCKED';
        throw err;
    }
}

module.exports = { validateUrlForSsrf, isBlockedIp };
