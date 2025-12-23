"use client";

import React, { useEffect, useRef } from "react";

export function AbstractMapBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const dots: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
        const DOT_COUNT = 150; // Density
        const CONNECTION_DISTANCE = 100;
        const SPEED = 0.2;

        // Initialize dots
        for (let i = 0; i < DOT_COUNT; i++) {
            dots.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * SPEED,
                vy: (Math.random() - 0.5) * SPEED,
                size: Math.random() * 2 + 1,
            });
        }

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Background
            ctx.fillStyle = "#000000"; // Pitch black
            ctx.fillRect(0, 0, width, height);

            // Draw Dots
            ctx.fillStyle = "#333333";
            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];

                // Move
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Bounce
                if (dot.x < 0 || dot.x > width) dot.vx *= -1;
                if (dot.y < 0 || dot.y > height) dot.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();

                // Connections
                for (let j = i + 1; j < dots.length; j++) {
                    const other = dots[j];
                    const dx = dot.x - other.x;
                    const dy = dot.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(50, 50, 50, ${1 - distance / CONNECTION_DISTANCE})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(dot.x, dot.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            }

            // Accent Pulse (The "Starto" Identity)
            // Fake a glowing node cluster in the center area
            const cx = width * 0.6;
            const cy = height * 0.4;

            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
            gradient.addColorStop(0, "rgba(37, 99, 235, 0.15)"); // Primary blue glow
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }} // Controls global brightness of the map
        />
    );
}
