import { useState, useEffect } from 'react'
import { HiLocationMarker, HiTrash, HiViewGrid, HiClipboardCheck, HiCalendar, HiCreditCard, HiMoon, HiSun, HiChevronLeft, HiChevronRight, HiPause, HiPlay } from 'react-icons/hi'
import useSkips from './hooks/useSkips'
import SkipContainerSkeleton from './components/SkipContainerSkeleton'
import './skip-animations.css'
import './components/Mobile.css'

// Import skip container images
import skipContainer1 from './assets/skip-container-1.svg'  // Small skip designs
import skipContainer2 from './assets/skip-container-2.svg'  // V-shaped skips
import skipContainer3 from './assets/skip-container-3.svg'  // Wide open-top skips
import skipContainer4 from './assets/skip-container-4.svg'  // Standard rectangular skips
import skipContainer5 from './assets/skip-container-5.svg'  // Simple wide skips
import skipContainer6 from './assets/skip-container-6.svg'  // Large industrial skips


function App() {
  // Get the  skip image
  const getSkipImageBySize = (size) => {
    const imageMap = {
      4: skipContainer1,   // Small - standard design
      6: skipContainer2,   // Medium small - V-shaped
      8: skipContainer1,   // Medium - standard (rotated)
      10: skipContainer3,  // Medium large - wide open-top
      12: skipContainer4,  // Large - rectangular with compartments
      14: skipContainer2,  // Large variant - V-shaped (larger)
      16: skipContainer5,  // Extra large - simple wide
      20: skipContainer6,  // Industrial - large with compartments
      40: skipContainer6   // Mega industrial - largest
    }
    return imageMap[size] || skipContainer3 // Default to wide open-top
  }


  const getSkipStyling = (size) => {
    let baseScale, rotation, width, height

    if (size <= 4) {
      baseScale = 1.0   // Base scale 
      width = 'w-20'    // Smallest
      height = 'h-16'
      rotation = 0
    } else if (size <= 6) {
      baseScale = 1.0
      width = 'w-28'    // Small
      height = 'h-20'
      rotation = -2
    } else if (size <= 8) {
      baseScale = 1.0
      width = 'w-36'    // Medium small
      height = 'h-24'
      rotation = 3
    } else if (size <= 10) {
      baseScale = 1.0
      width = 'w-44'    // Medium
      height = 'h-28'
      rotation = 0
    } else if (size <= 12) {
      baseScale = 1.0
      width = 'w-52'    // Large
      height = 'h-32'
      rotation = -1
    } else if (size <= 14) {
      baseScale = 1.0
      width = 'w-60'    // Large variation
      height = 'h-36'
      rotation = 2
    } else if (size <= 16) {
      baseScale = 1.0
      width = 'w-68'    // Extra large
      height = 'h-40'
      rotation = 0
    } else if (size <= 20) {
      baseScale = 1.0
      width = 'w-76'    // Industrial
      height = 'h-44'
      rotation = -1
    } else {
      baseScale = 1.0
      width = 'w-96'    // Mega industrial
      height = 'h-56'
      rotation = 1
    }

    return {
      scale: baseScale,
      rotation,
      width,
      height,
      // zoom effect on hover
      hoverScale: baseScale + 0.05
    }
  }

  // Get animation classes based on size
  const getSkipAnimationClasses = (size, index) => {
    let sizeClass, scaleClass, rotationClass, depthClass

    if (size <= 6) {
      sizeClass = 'skip-size-small'
      depthClass = 'skip-depth-small'
    } else if (size <= 12) {
      sizeClass = 'skip-size-medium'
      depthClass = 'skip-depth-medium'
    } else if (size <= 16) {
      sizeClass = 'skip-size-large'
      depthClass = 'skip-depth-large'
    } else {
      sizeClass = 'skip-size-industrial'
      depthClass = 'skip-depth-industrial'
    }

    // Scale classes
    const styling = getSkipStyling(size)
    const scalePercent = Math.round(styling.scale * 100)
    scaleClass = `scale-${scalePercent}`

    // Rotation classes
    const rotation = styling.rotation
    if (rotation < 0) {
      rotationClass = `rotate-n${Math.abs(rotation)}`
    } else {
      rotationClass = `rotate-${rotation}`
    }

    return {
      containerClasses: `skip-container-item skip-fade-in skip-entrance-${(index % 3) + 1} ${depthClass}`,
      imageClasses: `skip-image skip-transform ${sizeClass} ${scaleClass} ${rotationClass}`,
      wrapperClasses: 'skip-container-wrapper'
    }
  }

  // State for managing the booking process
  const [currentStep, setCurrentStep] = useState(2) // Set to step 2 (Select Skip - 0-indexed)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [selectedSkip, setSelectedSkip] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [bookingData, setBookingData] = useState({
    postcode: 'NR32',
    wasteType: '',
    skipId: null,
    permitNeeded: false,
    selectedDate: '',
  })

  // Carousel state
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [screenSize, setScreenSize] = useState('large')

  // Dynamic skips per page based on screen size
  const getSkipsPerPage = () => {
    if (screenSize === 'small') return 1
    return 3
  }
  const skipsPerPage = getSkipsPerPage()

  // Fetch skip data from API
  const { skips: skipContainers, loading, error, refetchSkips } = useSkips(bookingData.postcode, 'Lowestoft')

  // Progress steps for the booking process
  const progressSteps = [
    { id: 0, name: 'Postcode', icon: HiLocationMarker, description: 'Enter your location' },
    { id: 1, name: 'Waste Type', icon: HiTrash, description: 'Select waste category' },
    { id: 2, name: 'Select Skip', icon: HiViewGrid, description: 'Choose container size' },
    { id: 3, name: 'Permit Check', icon: HiClipboardCheck, description: 'Verify requirements' },
    { id: 4, name: 'Choose Date', icon: HiCalendar, description: 'Schedule delivery' },
    { id: 5, name: 'Payment', icon: HiCreditCard, description: 'Complete booking' }
  ]

  // Initialize theme and screen size detection
  useEffect(() => {
    // const savedTheme = localStorage.getItem('theme')
    const savedTheme = 'dark'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else if (prefersDark) {
      setIsDarkMode(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }

    // Screen size detection
    const updateScreenSize = () => {
      let newSize = 'large'
      if (window.innerWidth < 640) { // sm breakpoint
        newSize = 'small'
      } else if (window.innerWidth < 1024) { // lg breakpoint
        newSize = 'medium'
      }

      setScreenSize(newSize)
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(!isDarkMode)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const handleSkipSelection = (skipId) => {
    setSelectedSkip(skipId)
    setBookingData({ ...bookingData, skipId })

    // Scroll to continue section after a short delay
    setTimeout(() => {
      const continueSection = document.getElementById('continue-section')
      if (continueSection) {
        continueSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      }
    }, 300)
  }

  // Carousel functions
  const totalPages = Math.ceil(skipContainers.length / skipsPerPage)

  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToSlide = (index) => {
    setCurrentCarouselIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || skipContainers.length === 0) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlay, skipContainers.length, currentCarouselIndex])



  return (
    <div className="min-h-screen mobile-no-scroll" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-50 mb-24" style={{ backgroundColor: 'transparent' }}>
        <div className={`max-w-7xl mx-auto ${screenSize === 'small' ? 'mobile-container' : screenSize === 'medium' ? 'tablet-container' : 'desktop-container'}`}>
          <div className="flex justify-between items-center py-8">
            {/* <div className="flex items-center space-x-3">
              <img
                src="/skip-hire-logo.svg"
                alt="Skip-Hire Professional Waste Solutions"
                className="h-10 w-auto"
              />
            </div> */}

            {/* <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--border-default)',
                color: 'var(--text-primary)'
              }}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <HiSun className="w-6 h-6" />
              ) : (
                <HiMoon className="w-6 h-6" />
              )}
            </button> */}
          </div>
        </div>
      </header>

      {/* Progress Tracker */}
      <div className={`w-full ${screenSize === 'small' ? 'pt-6 pb-8 mb-10 mobile-progress' : 'pt-12 pb-16 mb-20'} relative z-10`} style={{ backgroundColor: 'transparent' }}>
        <div className={`max-w-4xl mx-auto ${screenSize === 'small' ? 'mobile-container' : screenSize === 'medium' ? 'tablet-container' : 'desktop-container'}`}>
          <div className="relative">
            {/* Progress Line Background*/}
            <div
              className={`absolute ${screenSize === 'small' ? 'top-4' : 'top-6'} h-2 z-20`}
              style={{
                backgroundColor: 'var(--border-muted)',
                left: screenSize === 'small' ? '20px' : '32px',
                right: screenSize === 'small' ? '20px' : '32px',
                borderRadius: '6px',
                opacity: '0.8'
              }}
            />

            {/* Active Progress Line */}
            <div
              className={`absolute ${screenSize === 'small' ? 'top-4' : 'top-6'} h-2 transition-all duration-700 z-30`}
              style={{
                backgroundColor: 'var(--color-accent)',
                left: screenSize === 'small' ? '20px' : '32px',
                width: `calc(${(currentStep / (progressSteps.length - 1)) * 100}% - ${screenSize === 'small' ? '40px' : '64px'} * ${currentStep / (progressSteps.length - 1)})`,
                borderRadius: '6px',
                boxShadow: '0 0 12px rgba(102, 146, 148, 0.6)',
                opacity: '1'
              }}
            />

            {/* Step Circles */}
            <div className="relative flex justify-between z-40">
              {progressSteps.map((step, index) => {
                const IconComponent = step.icon;
                let circleStyle, textColor;

                if (index <= currentStep) {
                  // Completed/Current steps
                  circleStyle = {
                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-desaturated-cyan))',
                    border: `${index === currentStep ? '3px' : '2px'} solid var(--color-accent)`,
                    boxShadow: '0 4px 12px rgba(102, 146, 148, 0.3)'
                  };
                  textColor = 'var(--text-primary)';
                } else {
                  // Future steps
                  circleStyle = {
                    backgroundColor: 'var(--bg-surface)',
                    border: '2px solid var(--border-muted)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  };
                  textColor = 'var(--text-muted)';
                }

                return (
                  <div key={step.id} className={`flex flex-col items-center relative ${screenSize === 'small' ? 'mobile-progress-step' : ''}`} style={{ zIndex: 10 }}>
                    <div className="relative">
                      {index === currentStep && (
                        <div
                          className={`absolute ${screenSize === 'small' ? '-inset-0.5' : '-inset-1'} rounded-full border-2 border-accent opacity-30 animate-pulse`}
                          style={{ borderColor: 'var(--color-accent)' }}
                        />
                      )}

                      {/* Main Circle */}
                      <div
                        className={`${screenSize === 'small' ? 'w-8 h-8 mobile-progress-circle mobile-touch-target' : 'w-12 h-12'} rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 relative`}
                        style={{
                          ...circleStyle,
                          minWidth: screenSize === 'small' ? '2rem' : '3rem',
                          minHeight: screenSize === 'small' ? '2rem' : '3rem',
                          aspectRatio: '1',
                          zIndex: 20
                        }}
                        onClick={() => setCurrentStep(index)}
                      >
                        <IconComponent
                          className={`${screenSize === 'small' ? 'w-5 h-5' : 'w-7 h-7'}`}
                          style={{
                            color: index <= currentStep ? 'white' : 'var(--text-muted)',
                            flexShrink: 0,
                            width: screenSize === 'small' ? '20px' : '28px',
                            height: screenSize === 'small' ? '20px' : '28px'
                          }}
                        />
                      </div>
                    </div>

                    {/* Step Label */}
                    <div className={`${screenSize === 'small' ? 'mt-1' : 'mt-3'} text-center ${screenSize === 'small' ? 'max-w-12' : 'max-w-20'}`}>
                      <div
                        className={`${screenSize === 'small' ? 'text-xs mobile-progress-label' : 'text-xs'} font-medium transition-colors duration-300 ${index === currentStep ? 'font-semibold' : ''} ${screenSize === 'small' ? 'leading-tight' : ''}`}
                        style={{ color: textColor }}
                      >
                        {screenSize === 'small' ? step.name.split(' ')[0] : step.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={`max-w-7xl mx-auto ${screenSize === 'small' ? 'mobile-container pt-0' : screenSize === 'medium' ? 'tablet-container pt-0' : 'desktop-container pt-0'} pb-16 relative z-0`}>

        {/* Skip Selection */}
        <div className={`text-center ${screenSize === 'small' ? 'mb-8 mt-6' : 'mb-12 mt-8'}`}>
          <h2
            className={`${screenSize === 'small' ? 'text-2xl mobile-heading-lg' : 'text-4xl'} font-bold ${screenSize === 'small' ? 'mb-3' : 'mb-4'}`}
            style={{ color: 'var(--text-primary)' }}
          >
            Choose Your Skip Size
          </h2>
          <p
            className={`${screenSize === 'small' ? 'text-lg mobile-text-lg mb-6' : 'text-xl mb-4'} ${screenSize === 'small' ? 'px-4' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            Select the skip size that best suits your needs
          </p>

          {/* Loading State */}
          {loading && (
            <SkipContainerSkeleton
              screenSize={screenSize}
              count={screenSize === 'small' ? 1 : 3}
            />
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <div className="mb-4 text-red-500 text-lg">⚠️ Failed to load skip options</div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{error}</p>
              <button
                onClick={refetchSkips}
                className="btn-primary px-6 py-3 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Skip Container Carousel */}
          {!loading && !error && skipContainers.length > 0 && (
            <div className="mt-12">
              {/* Carousel Controls */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Showing {currentCarouselIndex * skipsPerPage + 1}-{Math.min((currentCarouselIndex + 1) * skipsPerPage, skipContainers.length)} of {skipContainers.length} skips
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className="text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-md flex items-center gap-2"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '2px solid var(--border-default)',
                      color: isAutoPlay ? 'var(--color-accent)' : 'var(--text-primary)'
                    }}
                    aria-label={isAutoPlay ? 'Pause auto-play' : 'Enable auto-play'}
                  >
                    {isAutoPlay ? (
                      <>
                        <HiPause className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <HiPlay className="w-4 h-4" />
                        <span>Auto-play</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid transparent',
                      color: 'var(--text-primary)'
                    }}
                    disabled={totalPages <= 1}
                  >
                    <HiChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid transparent',
                      color: 'var(--text-primary)'
                    }}
                    disabled={totalPages <= 1}
                  >
                    <HiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Carousel Container */}
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
                >
                  {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <div key={pageIndex} className="w-full flex-shrink-0">
                      <div className="space-y-6">
                        {skipContainers.slice(pageIndex * skipsPerPage, (pageIndex + 1) * skipsPerPage).map((container, index) => {
                          const animationClasses = getSkipAnimationClasses(container.size, index)
                          const styling = getSkipStyling(container.size)
                          return (
                            <div
                              key={container.id}
                              className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.01] mobile-touch-target ${selectedSkip === container.id ? 'skip-selected' : ''} ${animationClasses.containerClasses} ${screenSize === 'small' ? 'mobile-skip-card' : ''}`}
                              style={{
                                backgroundColor: 'transparent',
                                border: `3px solid ${selectedSkip === container.id ? 'var(--color-accent)' : 'transparent'}`,
                                borderRadius: screenSize === 'small' ? '16px' : '12px',
                                boxShadow: selectedSkip === container.id ? '0 4px 12px rgba(102, 146, 148, 0.2)' : 'none',
                                margin: '8px', // margin to contain the border and prevent overflow
                                '--skip-scale': styling.scale,
                                '--rotation': styling.rotation,
                                '--hover-scale': styling.hoverScale
                              }}
                              onClick={() => handleSkipSelection(container.id)}
                            >
                              <div className={`grid ${screenSize === 'small' ? 'grid-cols-1 gap-4 p-4' : screenSize === 'medium' ? 'tablet-skip-grid' : 'desktop-skip-grid'} items-center min-h-32 sm:min-h-40 lg:min-h-48`}>

                                {/* Left Column: Skip Visual */}
                                <div className={`flex items-center justify-center ${screenSize === 'small' ? 'p-2 order-1' : 'p-4'} ${animationClasses.wrapperClasses}`} style={{ minHeight: screenSize === 'small' ? '80px' : '120px' }}>
                                  <div
                                    className={`relative ${screenSize === 'small' ? 'w-16 h-12' : styling.width + ' ' + styling.height} transition-all duration-300 group ${animationClasses.imageClasses}`}
                                    style={{
                                      transform: `scale(${styling.scale}) rotate(${styling.rotation}deg)`,
                                      '--skip-scale': styling.scale,
                                      '--rotation': styling.rotation
                                    }}
                                  >
                                    <img
                                      src={getSkipImageBySize(container.size)}
                                      alt={`${container.size} yard skip container`}
                                      className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                                      style={{
                                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                                      }}
                                    />


                                  </div>
                                </div>

                                {/* Middle Column: Skip Information */}
                                <div className={`flex flex-col justify-center ${screenSize === 'small' ? 'px-4 order-2 text-center' : 'px-2 sm:px-4 lg:px-6'}`}>
                                  <div className={`${screenSize === 'small' ? 'text-center mb-3' : 'text-center mb-2 sm:mb-4'}`}>
                                    <h3
                                      className={`${screenSize === 'small' ? 'text-lg font-black uppercase tracking-wide' : 'text-sm sm:text-lg lg:text-2xl font-black uppercase tracking-tight sm:tracking-wide'} leading-tight`}
                                      style={{ color: 'var(--text-primary)' }}
                                    >
                                      {container.size} YARD SKIP CONTAINER
                                    </h3>
                                  </div>
                                  <div className={`${screenSize === 'small' ? 'space-y-2 text-sm' : 'space-y-1 sm:space-y-2 lg:space-y-3 text-xs sm:text-sm lg:text-lg'}`}>
                                    <div className={`flex ${screenSize === 'small' ? 'justify-between' : 'items-center'}`}>
                                      <span className={`font-bold ${screenSize === 'small' ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`} style={{ color: 'var(--text-primary)', minWidth: screenSize === 'small' ? 'auto' : '60px sm:minWidth-80px lg:minWidth-100px' }}>Holds:</span>
                                      <span className={`${screenSize === 'small' ? '' : 'ml-1 sm:ml-2 lg:ml-3'} font-black ${screenSize === 'small' ? 'text-sm' : 'text-xs sm:text-sm lg:text-lg'}`} style={{ color: 'var(--text-primary)' }}>{container.capacity}</span>
                                    </div>
                                    <div className={`flex ${screenSize === 'small' ? 'justify-between' : 'items-center'}`}>
                                      <span className={`font-bold ${screenSize === 'small' ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`} style={{ color: 'var(--text-primary)', minWidth: screenSize === 'small' ? 'auto' : '60px sm:minWidth-80px lg:minWidth-100px' }}>Serves:</span>
                                      <span className={`${screenSize === 'small' ? '' : 'ml-1 sm:ml-2 lg:ml-3'} font-black ${screenSize === 'small' ? 'text-sm' : 'text-xs sm:text-sm lg:text-lg'}`} style={{ color: 'var(--text-primary)' }}>
                                        {container.size <= 6 ? '1-2 people' :
                                          container.size <= 10 ? '2-4 people' :
                                            container.size <= 14 ? '4-6 people' :
                                              container.size <= 20 ? '6-8 people' : '8+ people'}
                                      </span>
                                    </div>
                                    <div className={`flex ${screenSize === 'small' ? 'justify-between' : 'items-center'}`}>
                                      <span className={`font-bold ${screenSize === 'small' ? 'text-sm' : 'text-xs sm:text-sm lg:text-base'}`} style={{ color: 'var(--text-primary)', minWidth: screenSize === 'small' ? 'auto' : '60px sm:minWidth-80px lg:minWidth-100px' }}>Max Weight:</span>
                                      <span className={`${screenSize === 'small' ? '' : 'ml-1 sm:ml-2 lg:ml-3'} font-black ${screenSize === 'small' ? 'text-sm' : 'text-xs sm:text-sm lg:text-lg'}`} style={{ color: 'var(--text-primary)' }}>
                                        Approx {container.size <= 6 ? '2' :
                                          container.size <= 10 ? '4' :
                                            container.size <= 14 ? '6' :
                                              container.size <= 20 ? '8' : '10'}0kg
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Column: Price & Selection */}
                                <div className={`flex flex-col justify-center items-center text-center ${screenSize === 'small' ? 'space-y-3 px-4 order-3' : 'space-y-2 sm:space-y-3 lg:space-y-5 px-2 sm:px-4 lg:px-6'}`}>
                                  <div className="text-center">
                                    {/* Post-tax Price (Main Price) */}
                                    <div
                                      className={`${screenSize === 'small' ? 'text-2xl font-bold mb-2' : 'text-lg sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2'}`}
                                      style={{ color: 'var(--text-primary)' }}
                                    >
                                      {container.price}
                                    </div>
                                    {/* Pre-tax Price */}
                                    <div
                                      className={`${screenSize === 'small' ? 'text-sm text-gray-500 mb-1' : 'text-xs sm:text-sm lg:text-base text-gray-500 mb-1'}`}
                                    >
                                      £{container.priceBeforeVat.toFixed(2)} + VAT
                                    </div>
                                    {/* VAT Info */}
                                    <div
                                      className={`${screenSize === 'small' ? 'text-sm text-gray-400' : 'text-xs lg:text-sm text-gray-400'}`}
                                    >
                                      (VAT: {container.vat}%)
                                    </div>
                                  </div>

                                  <button
                                    className={`${screenSize === 'small' ? 'mobile-button mobile-touch-target' : screenSize === 'medium' ? 'tablet-button' : 'desktop-button'} font-bold transition-all duration-300 ${selectedSkip === container.id
                                      ? 'text-white shadow-lg transform scale-105'
                                      : 'hover:shadow-md hover:scale-105'
                                      }`}
                                    style={{
                                      backgroundColor: selectedSkip === container.id ? 'var(--color-accent)' : '#FFD700',
                                      color: selectedSkip === container.id ? 'white' : '#333',
                                      border: '2px solid transparent',
                                      boxShadow: selectedSkip === container.id ? '0 4px 15px rgba(102, 146, 148, 0.3)' : '0 2px 8px rgba(255, 215, 0, 0.3)'
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSkipSelection(container.id)
                                    }}
                                  >
                                    {selectedSkip === container.id ? '✓ Selected' : 'Order Now'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentCarouselIndex
                        ? 'scale-125'
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                        }`}
                      style={{
                        backgroundColor: index === currentCarouselIndex
                          ? 'var(--color-accent)'
                          : 'var(--border-muted)',
                        boxShadow: index === currentCarouselIndex
                          ? '0 2px 8px rgba(102, 146, 148, 0.3)'
                          : '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Continue Section - Shows when skip is selected */}
              {selectedSkip && (
                <div id="continue-section" className={`${screenSize === 'small' ? 'mt-12 px-4' : 'mt-16 px-8'} continue-button-container`}>
                  {/* Selected Skip Summary Bar */}
                  <div className={`${screenSize === 'small' ? 'mb-6 p-4' : 'mb-8 p-6'} rounded-xl selected-skip-summary`}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-secondary)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                    {(() => {
                      const selectedContainer = skipContainers.find(c => c.id === selectedSkip)
                      return selectedContainer ? (
                        <div className={`flex ${screenSize === 'small' ? 'flex-col gap-4' : 'flex-row justify-between items-center'}`}>
                          {/* Left side - Skip details */}
                          <div className={`${screenSize === 'small' ? 'text-center space-y-3 mobile-skip-details' : 'flex items-center gap-4'}`}>
                            <div className={`${screenSize === 'small' ? 'text-lg mobile-text-lg mobile-text-spacing' : 'text-lg'} font-semibold`}
                              style={{ color: 'var(--text-primary)' }}>
                              {selectedContainer.size} Yard Skip
                            </div>
                            <div className={`${screenSize === 'small' ? 'text-2xl mobile-text-lg font-bold mobile-text-spacing' : 'text-xl font-bold'}`}
                              style={{ color: 'var(--color-accent)' }}>
                              {selectedContainer.price}
                            </div>
                            <div className={`${screenSize === 'small' ? 'text-base mobile-text-sm mobile-text-spacing' : 'text-base'}`}
                              style={{ color: 'var(--text-secondary)' }}>
                              14 day hire
                            </div>
                          </div>

                          {/* Right side - Action buttons */}
                          <div className={`flex ${screenSize === 'small' ? 'mobile-action-buttons' : screenSize === 'medium' ? 'tablet-action-buttons' : 'desktop-action-buttons'} ${screenSize === 'small' ? '' : 'items-center'}`}>
                            <button
                              onClick={() => setSelectedSkip(null)}
                              className={`action-button back-action-button ${screenSize === 'small' ? 'mobile-action-button' : ''} font-semibold focus-visible`}
                              aria-label="Go back to skip selection"
                            >
                              Back
                            </button>

                            <button
                              onClick={() => setCurrentStep(currentStep + 1)}
                              className={`action-button continue-action-button ${screenSize === 'small' ? 'mobile-action-button' : ''} font-semibold focus-visible flex items-center justify-center gap-2`}
                              aria-label="Continue to next step"
                            >
                              <span>Continue</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className={`${screenSize === 'small' ? 'mt-8 px-4' : 'mt-12 px-8'} text-center`}>
                <p
                  className={`${screenSize === 'small' ? 'text-xs' : 'text-sm'} leading-relaxed`}
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="italic">
                    Imagery and information shown throughout this website may not reflect the exact shape or size specification, colours may vary, options and/or accessories may be featured at additional cost.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
