import { useState, useEffect } from 'react';

export function useSlowRequestTimer(isLoading: boolean, thresholdMs: number = 3000) {
    const [showSlowBanner, setShowSlowBanner] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (isLoading) {
            timer = setTimeout(() => {
                setShowSlowBanner(true);
            }, thresholdMs);
        } else {
            setShowSlowBanner(false);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isLoading, thresholdMs]);

    return showSlowBanner;
}
