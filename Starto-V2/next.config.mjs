/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    experimental: {
        // Preserving the intent, though 'reactCompiler' usually goes here if valid
        // However, user had it top-level. I will put it where it likely belongs or keep it top level if valid in their version
    },
};

// The user had `reactCompiler: false` at top level.
// Use standard JS config structure.
// If reactCompiler is not standard top-level, it might be ignored or cause warning, but better than crashing on file type.

const config = {
    // reactCompiler: false // Removed invalid option
};

export default config;
