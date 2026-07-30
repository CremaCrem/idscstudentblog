# Design System & Token Specifications

## 1. Color Palette

### 1.1 Base & Background Neutrals
* **Canvas Background:** `#F8F6F0` (Warm Cream / Off-White background inspired by the Essos aesthetic)
* **Surface Background:** `#FFFFFF` (Pure white for main card containers and inner application frame)
* **Subtle Border:** `#E5E2D9` or `#E4E4E7` (Soft neutral border to divide content gracefully)

### 1.2 Brand & Accent Colors
* **Primary Dark / Text:** `#18181B` (Rich Off-Black / Zinc 900 for high-contrast headlines and solid buttons)
* **Primary Warm Accent:** `#9A4222` or `#A84320` (Warm Terra Cotta / Burnt Sienna inspired by the Essos CTA button)
* **Subtle Tag Fill:** `#F4EFEA` with text `#78350F` or `#3F3F46` (Soft pill background for tags like *Artificial Intelligence*, *Information Technology*, *Agriculture*)

### 1.3 State & Status Colors (Admin & Health System)
* **Success / Healthy Link:** `#059669` (Emerald 600 badge for verified active blogs)
* **Warning / Scraped Fallback:** `#D97706` (Amber 600 badge for fallback metadata)
* **Error / Broken Link:** `#DC2626` (Red 600 badge for 404/500 connection timeouts)

---

## 2. Typography Hierarchy

* **Display / Main Headers:** `Inter`, `Plus Jakarta Sans`, or `Playfair Display` (Bold, 32px to 48px, tighter letter-spacing `-0.02em`)
* **Section Headlines:** `Inter` or `System-UI` (SemiBold, 20px to 24px)
* **Body Text:** `Inter` (Regular, 14px to 16px, line-height `1.6`, neutral zinc tone `#52525B`)
* **Metadata & Badges:** `Inter` (Medium, 12px to 13px, uppercase or subtle pill formatting)

---

## 3. Surface & Glassmorphic Utilities

```css
/* Glassmorphic Overlay for Card Image Metadata */
.glass-overlay {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

/* Rounded Framing Container */
.app-frame {
  background-color: #FFFFFF;
  border-radius: 24px;
  box-shadow: 0px 20px 40px -15px rgba(0, 0, 0, 0.05);
}
```