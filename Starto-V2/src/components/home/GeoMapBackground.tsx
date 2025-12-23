"use client";

import React, { useEffect, useRef } from "react";

/**
 * GeoMapBackground
 * Implements the "Starto Map Visual Spec".
 * - High contrast roads (White, variable width)
 * - Defined Blocks (Dark grey, rounded)
 * - Distinct Entity Shapes (Circle, Diamond, Square, dots)
 * - Curved organic paths
 */
export function GeoMapBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // --- Configuration ---
        const GRID_SIZE = 100; // Larger blocks for better readability
        const ROAD_MAIN_WIDTH = 2; // Primary roads
        const ROAD_MINOR_WIDTH = 0.5; // Secondary roads (very subtle)

        // Colors
        const COLOR_BG = "#050505"; // Nearly black
        const COLOR_BLOCK = "#111111"; // Dark grey blocks
        const COLOR_ROAD_MAIN = "rgba(255, 255, 255, 0.15)";
        const COLOR_ROAD_MINOR = "rgba(255, 255, 255, 0.05)";
        const COLOR_ACCENT = "#3b82f6"; // Starto Blue

        // Entity Types
        type EntityType = "founder" | "freelancer" | "investor" | "provider";
        interface MapEntity {
            id: number;
            type: EntityType;
            gx: number; // Grid X
            gy: number; // Grid Y
            offset: number; // Animation offset
        }

        // Generate some static entities scattered on the grid
        const ENTITIES: MapEntity[] = [
            { id: 1, type: "founder", gx: 4, gy: 3, offset: 0 },
            { id: 2, type: "investor", gx: 6, gy: 2, offset: 2 },
            { id: 3, type: "freelancer", gx: 2, gy: 5, offset: 4 },
            { id: 4, type: "provider", gx: 8, gy: 4, offset: 1 },
            { id: 5, type: "founder", gx: 5, gy: 6, offset: 3 },
            // Add a few off-screen ones to ensure density during scrolling
        ];

        // Organic Curves (Bezier control points logic simplified)
        // We'll simulate 2 curves that span the map
        const CURVES = [
            { yStart: 0.3, yEnd: 0.5, amp: 100, color: "rgba(255, 255, 255, 0.08)" },
            { yStart: 0.7, yEnd: 0.6, amp: -150, color: "rgba(255, 255, 255, 0.05)" }
        ];

        // State
        let offsetX = 0;
        let offsetY = 0;
        const SPEED_X = 0.05; // Calm pan
        const SPEED_Y = 0.02;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        // helper to draw rounded rect
        const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();
        };

        const drawEntity = (e: MapEntity, px: number, py: number) => {
            const time = Date.now() * 0.001;
            const pulse = (Math.sin(time + e.offset) + 1) / 2; // 0-1

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;

            // Z-Depth: Entities are highest

            switch (e.type) {
                case "founder": // Solid Circle
                    ctx.beginPath();
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();
                    // Glow
                    ctx.beginPath();
                    ctx.arc(px, py, 6 + pulse * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * pulse})`;
                    ctx.fill();
                    break;

                case "freelancer": // 3 Connected Dots
                    ctx.fillStyle = "#a1a1aa"; // Slightly dimmer
                    ctx.beginPath();
                    ctx.arc(px - 6, py + 4, 2, 0, Math.PI * 2);
                    ctx.arc(px, py - 6, 2, 0, Math.PI * 2);
                    ctx.arc(px + 6, py + 4, 2, 0, Math.PI * 2);
                    ctx.fill();
                    // Connections
                    ctx.strokeStyle = "rgba(161, 161, 170, 0.5)";
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(px - 6, py + 4);
                    ctx.lineTo(px, py - 6);
                    ctx.lineTo(px + 6, py + 4);
                    ctx.lineTo(px - 6, py + 4);
                    ctx.stroke();
                    break;

                case "investor": // Diamond
                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(Math.PI / 4);
                    ctx.strokeStyle = "#ffffff"; // Outline only for investor? Or solid?
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(-4, -4, 8, 8);
                    ctx.restore();
                    break;

                case "provider": // Square
                    ctx.strokeStyle = "#ffffff";
                    ctx.strokeRect(px - 4, py - 4, 8, 8);
                    break;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // 1. Background
            ctx.fillStyle = COLOR_BG;
            ctx.fillRect(0, 0, width, height);

            // Calculate grid offset
            const startX = Math.floor(offsetX / GRID_SIZE) - 1;
            const startY = Math.floor(offsetY / GRID_SIZE) - 1;
            const endX = startX + Math.ceil(width / GRID_SIZE) + 2;
            const endY = startY + Math.ceil(height / GRID_SIZE) + 2;

            const shiftX = Math.floor(offsetX) % GRID_SIZE;
            const shiftY = Math.floor(offsetY) % GRID_SIZE;

            // 2. Blocks (Context Layer)
            ctx.fillStyle = COLOR_BLOCK;
            for (let x = -1; x * GRID_SIZE < width + GRID_SIZE; x++) {
                for (let y = -1; y * GRID_SIZE < height + GRID_SIZE; y++) {
                    const bx = x * GRID_SIZE - shiftX + 4; // +4 gap for roads
                    const by = y * GRID_SIZE - shiftY + 4;
                    const bsize = GRID_SIZE - 8; // visible gap

                    // Draw Block
                    drawRoundedRect(bx, by, bsize, bsize, 4);
                }
            }

            // 3. Roads (Implicitly defined by gaps, but let's draw lines for "Primary" roads)
            // Major grid lines every 4 blocks
            const majorGridMod = GRID_SIZE * 4;
            const shiftMajX = Math.floor(offsetX) % majorGridMod;
            const shiftMajY = Math.floor(offsetY) % majorGridMod;

            ctx.lineWidth = ROAD_MAIN_WIDTH;
            ctx.strokeStyle = COLOR_ROAD_MAIN;

            // Major Vertical
            for (let x = -shiftMajX; x < width; x += majorGridMod) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            // Major Horizontal
            for (let y = -shiftMajY; y < height; y += majorGridMod) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // 4. Organic Curves (Overlay)
            // To make them move, we offset their phase by offsetX
            CURVES.forEach((curve, i) => {
                ctx.strokeStyle = curve.color;
                ctx.lineWidth = 3;
                ctx.beginPath();

                const baseY = curve.yStart * height;

                for (let x = 0; x < width; x += 10) {
                    const realX = x + offsetX * 2; // Move faster than map for parallax
                    const y = baseY + Math.sin(realX * 0.002) * curve.amp;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            // 5. Entities (High Z-Index)
            // We need to loop our static entities and draw them relative to current offset
            ENTITIES.forEach(e => {
                // Calculate screen position based on grid coords and offset
                // We use modulo to wrap them so they reappear
                const worldX = e.gx * GRID_SIZE;
                const worldY = e.gy * GRID_SIZE;

                // Simple wrapping logic:
                // If point moves off left, wrap to right
                // Map logical world space 0..10000 etc
                // Just map (worldX - offsetX) to screen.

                let screenX = (worldX - offsetX);
                let screenY = (worldY - offsetY);

                // Manual wrap for infinite illusion
                const loopW = GRID_SIZE * 12; // Wrap every 12 blocks
                const loopH = GRID_SIZE * 8;

                screenX = ((screenX % loopW) + loopW) % loopW;
                screenY = ((screenY % loopH) + loopH) % loopH;

                // Center in the block/intersection
                drawEntity(e, screenX, screenY);
            });


            // Update Animation
            offsetX += SPEED_X;
            offsetY += SPEED_Y;
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
        />
    );
}
