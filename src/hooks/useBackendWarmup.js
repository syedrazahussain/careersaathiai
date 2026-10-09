
import { useEffect } from "react";

const WARMUP_KEY = "risben:warmup:v1";

export default function useBackendWarmup() {
    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
            console.error("VITE_BACKEND_URL is missing");
            return;
        }

        try {
            if (sessionStorage.getItem(WARMUP_KEY) === "done") {
                return;
            }
        } catch {
            // Continue if sessionStorage is unavailable.
        }

        let cancelled = false;

        async function warmup() {
            try {
                const response = await fetch(
                    `${backendUrl.replace(/\/+$/, "")}/api/warmup`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                if (!cancelled) {
                    try {
                        sessionStorage.setItem(WARMUP_KEY, "done");
                    } catch {
                        // Storage is optional.
                    }
                }
            } catch (error) {
                console.warn("Backend warmup failed:", error);
            }
        }

        void warmup();

        return () => {
            cancelled = true;
        };
    }, []);
}