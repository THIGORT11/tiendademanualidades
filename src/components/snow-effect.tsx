"use client";

import { useEffect, useState } from "react";

export const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; animationDuration: number; opacity: number }>>([]);

    useEffect(() => {
        const count = 50;
        const newSnowflakes = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: Math.random() * 3 + 2, // 2-5s
            opacity: Math.random(),
        }));
        setSnowflakes(newSnowflakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-[-10px] bg-white rounded-full"
                    style={{
                        left: `${flake.left}%`,
                        width: "8px",
                        height: "8px",
                        opacity: flake.opacity,
                        animation: `fall ${flake.animationDuration}s linear infinite`,
                    }}
                />
            ))}
        </div>
    );
};
