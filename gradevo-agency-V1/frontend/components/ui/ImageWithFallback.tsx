import React, { useState } from 'react';

interface ImageWithFallbackProps {
    src: string;
    alt: string;
    fallbackSrc?: string;
    className?: string;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'sync' | 'auto';
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    alt,
    fallbackSrc = 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800',
    className = '',
    loading = 'lazy',
    decoding = 'async'
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            console.warn(`Failed to load image: ${src}, using fallback`);
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            loading={loading}
            decoding={decoding}
            onError={handleError}
        />
    );
};

export default ImageWithFallback;
