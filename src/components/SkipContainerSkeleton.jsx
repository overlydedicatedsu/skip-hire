import { useState, useEffect } from 'react'
import './SkipContainerSkeleton.css'

const SkipContainerSkeleton = ({ screenSize = 'large', count = 3 }) => {
    const [shimmerIndex, setShimmerIndex] = useState(0)

    // Animate shimmer effect with responsive timing
    useEffect(() => {
        const interval = setInterval(() => {
            setShimmerIndex(prev => (prev + 1) % count)
        }, screenSize === 'small' ? 600 : 800) // Faster animation on mobile

        return () => clearInterval(interval)
    }, [count, screenSize])

    const skeletonItems = Array.from({ length: count }, (_, index) => (
        <div
            key={index}
            className={`skeleton-container transition-all duration-300 transform ${shimmerIndex === index ? 'scale-[1.01]' : ''}`}
            style={{
                backgroundColor: 'transparent',
                border: '3px solid transparent',
                borderRadius: '12px',
                margin: '8px',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Enhanced Shimmer overlay */}
            <div className="skeleton-shimmer" />

            <div className={`grid ${screenSize === 'small' ? 'grid-cols-1 gap-4 p-4' : 'grid-cols-3 gap-1 sm:gap-3 lg:gap-6 p-2 sm:p-4 lg:p-8'} items-center min-h-32 sm:min-h-40 lg:min-h-48 relative`}>

                {/* Left Column: Skip Visual Skeleton */}
                <div className={`flex items-center justify-center ${screenSize === 'small' ? 'p-2 order-1' : 'p-4'}`} style={{ minHeight: screenSize === 'small' ? '80px' : '120px' }}>
                    <div
                        className={`${screenSize === 'small' ? 'w-16 h-12' : 'w-20 h-16 sm:w-28 sm:h-20 lg:w-36 lg:h-24'} rounded-lg skeleton-item skeleton-pulse`}
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.6
                        }}
                    />
                </div>

                {/* Middle Column: Skip Information Skeleton */}
                <div className={`flex flex-col justify-center ${screenSize === 'small' ? 'px-4 order-2 text-center space-y-3' : 'px-2 sm:px-4 lg:px-6 space-y-2 sm:space-y-3'}`}>

                    {/* Title Skeleton */}
                    <div className={`${screenSize === 'small' ? 'text-center mb-3' : 'text-center mb-2 sm:mb-4'}`}>
                        <div
                            className={`${screenSize === 'small' ? 'h-5 w-32 mx-auto' : 'h-4 sm:h-5 lg:h-6 w-40 sm:w-48 lg:w-56 mx-auto'} rounded skeleton-item skeleton-pulse`}
                            style={{
                                backgroundColor: 'var(--border-muted)',
                                opacity: 0.8
                            }}
                        />
                    </div>

                    {/* Info Lines Skeleton */}
                    <div className={`${screenSize === 'small' ? 'space-y-2' : 'space-y-1 sm:space-y-2 lg:space-y-3'}`}>
                        {[1, 2, 3].map((item) => (
                            <div key={item} className={`flex ${screenSize === 'small' ? 'justify-between' : 'items-center'}`}>
                                <div
                                    className={`${screenSize === 'small' ? 'h-3 w-12' : 'h-3 sm:h-4 w-12 sm:w-16 lg:w-20'} rounded skeleton-item skeleton-pulse`}
                                    style={{
                                        backgroundColor: 'var(--border-muted)',
                                        opacity: 0.6,
                                        animationDelay: `${item * 0.1}s`
                                    }}
                                />
                                <div
                                    className={`${screenSize === 'small' ? 'h-3 w-16' : 'h-3 sm:h-4 w-16 sm:w-20 lg:w-24'} rounded skeleton-item skeleton-pulse`}
                                    style={{
                                        backgroundColor: 'var(--border-muted)',
                                        opacity: 0.7,
                                        animationDelay: `${item * 0.15}s`
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Price & Button Skeleton */}
                <div className={`flex flex-col justify-center items-center text-center ${screenSize === 'small' ? 'space-y-3 px-4 order-3' : 'space-y-2 sm:space-y-3 lg:space-y-5 px-2 sm:px-4 lg:px-6'}`}>

                    {/* Price Skeleton */}
                    <div className="text-center space-y-2">
                        <div
                            className={`${screenSize === 'small' ? 'h-6 w-16 mx-auto' : 'h-6 sm:h-8 lg:h-10 w-16 sm:w-20 lg:w-24 mx-auto'} rounded skeleton-item skeleton-pulse`}
                            style={{
                                backgroundColor: 'var(--border-muted)',
                                opacity: 0.8
                            }}
                        />
                        <div
                            className={`${screenSize === 'small' ? 'h-3 w-12 mx-auto' : 'h-3 sm:h-4 w-12 sm:w-16 mx-auto'} rounded skeleton-item skeleton-pulse`}
                            style={{
                                backgroundColor: 'var(--border-muted)',
                                opacity: 0.6,
                                animationDelay: '0.1s'
                            }}
                        />
                        <div
                            className={`${screenSize === 'small' ? 'h-3 w-10 mx-auto' : 'h-3 w-10 sm:w-12 mx-auto'} rounded skeleton-item skeleton-pulse`}
                            style={{
                                backgroundColor: 'var(--border-muted)',
                                opacity: 0.5,
                                animationDelay: '0.2s'
                            }}
                        />
                    </div>

                    {/* Button Skeleton */}
                    <div
                        className={`${screenSize === 'small' ? 'h-10 w-full max-w-xs' : 'h-8 sm:h-10 lg:h-12 w-24 sm:w-32 lg:w-48'} rounded-lg skeleton-item skeleton-pulse`}
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.7,
                            animationDelay: '0.3s'
                        }}
                    />
                </div>
            </div>
        </div>
    ))

    return (
        <div className="mt-12">
            {/* Skeleton Carousel Controls */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <div
                        className="h-4 w-32 rounded skeleton-item skeleton-pulse"
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.6
                        }}
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <div
                        className="h-8 w-20 rounded-lg skeleton-item skeleton-pulse"
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.6
                        }}
                    />
                    <div
                        className="w-10 h-10 rounded-full skeleton-item skeleton-pulse"
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.6,
                            animationDelay: '0.1s'
                        }}
                    />
                    <div
                        className="w-10 h-10 rounded-full skeleton-item skeleton-pulse"
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.6,
                            animationDelay: '0.2s'
                        }}
                    />
                </div>
            </div>

            {/* Skeleton Skip Containers */}
            <div className="relative overflow-hidden">
                <div className="w-full">
                    <div className="space-y-6">
                        {skeletonItems}
                    </div>
                </div>
            </div>

            {/* Skeleton Pagination Dots */}
            <div className="flex justify-center items-center gap-4 mt-8">
                {[1, 2, 3].map((dot) => (
                    <div
                        key={dot}
                        className="w-4 h-4 rounded-full skeleton-item skeleton-pulse"
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.6,
                            animationDelay: `${dot * 0.1}s`
                        }}
                    />
                ))}
            </div>

            {/* Skeleton Disclaimer */}
            <div className={`${screenSize === 'small' ? 'mt-8 px-4' : 'mt-12 px-8'} text-center`}>
                <div className="space-y-2">
                    <div
                        className={`${screenSize === 'small' ? 'h-3 w-full' : 'h-3 w-3/4'} mx-auto rounded skeleton-item skeleton-pulse`}
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.5
                        }}
                    />
                    <div
                        className={`${screenSize === 'small' ? 'h-3 w-4/5' : 'h-3 w-2/3'} mx-auto rounded skeleton-item skeleton-pulse`}
                        style={{
                            backgroundColor: 'var(--border-muted)',
                            opacity: 0.5,
                            animationDelay: '0.1s'
                        }}
                    />
                </div>
            </div>

            {/* Loading indicator text */}
            <div className="text-center mt-6">
                <div className="flex justify-center items-center space-x-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--color-accent)' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading skip options...</span>
                </div>
            </div>
        </div>
    )
}

export default SkipContainerSkeleton 