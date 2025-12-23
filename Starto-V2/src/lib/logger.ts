// src/lib/logger.ts
export function log(label: string, data?: any) {
    console.log(`🟦 [${label}]`, data ?? "");
}

export function error(label: string, err: any) {
    console.error(`🟥 [${label}]`, err);
}
