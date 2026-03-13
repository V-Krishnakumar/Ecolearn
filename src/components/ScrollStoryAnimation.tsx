import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Replace with the actual number of frames you have
const TOTAL_FRAMES = 120;

const ScrollStoryAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine frame based on current scroll position within this component's container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0 to 1) to frame index (1 to TOTAL_FRAMES)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Preload all frames on mount
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      // Ensure your images are named like ezgif-frame-001.jpg, ezgif-frame-002.jpg, etc.
      // Adjust the path and extension based on your exact files in /public/images/scroll-animation
      const formattedNumber = i.toString().padStart(3, '0');
      img.src = `/images/scroll-animation/ezgif-frame-${formattedNumber}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      
      // Fallback in case of image load error so the app doesn't hang forever
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      loadedImages.push(img);
    }
    
    setImages(loadedImages);
  }, []);

  // Update canvas when frameIndex or images change
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrameId: number;

    const render = () => {
      // floor to get integer index, handling the boundary case
      const currentIndex = Math.min(
        Math.floor(frameIndex.get()) - 1, 
        TOTAL_FRAMES - 1
      );
      
      // Prevent rendering issue if image failed to load or index is out of bounds
      if (currentIndex >= 0 && currentIndex < images.length) {
        const currentImage = images[currentIndex];
        if (currentImage.complete && currentImage.naturalWidth > 0) {
          // Adjust canvas size to match the image dimensions maintaining aspect ratio
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          
          const hRatio = canvas.width / currentImage.width;
          const vRatio = canvas.height / currentImage.height;
          // Use Math.max for 'cover' behavior or Math.min for 'contain'
          const ratio = Math.max(hRatio, vRatio); 
          
          const centerShift_x = (canvas.width - currentImage.width * ratio) / 2;
          const centerShift_y = (canvas.height - currentImage.height * ratio) / 2;

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(
            currentImage,
            0,
            0,
            currentImage.width,
            currentImage.height,
            centerShift_x,
            centerShift_y,
            currentImage.width * ratio,
            currentImage.height * ratio
          );
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, images, frameIndex]);

  // --- Story Text Overlay Opacities ---
  // Mapping scroll progress to opacity for each text stage (fade in -> hold -> fade out)
  // Stage 1: Seed (0% - 15%)
  const seedOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  
  // Stage 2: Sprout (15% - 35%)
  const sproutOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.3, 0.35], [0, 1, 1, 0]);
  
  // Stage 3: Plant (35% - 55%)
  const plantOpacity = useTransform(scrollYProgress, [0.35, 0.4, 0.5, 0.55], [0, 1, 1, 0]);
  
  // Stage 4: Tree (55% - 75%)
  const treeOpacity = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  
  // Stage 5: Earth Reveal (75% - 100%)
  const earthOpacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]); // stays opaque till end

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#020602]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020602]">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white/80 font-inter text-lg">Growing the future...</p>
          </div>
        )}
        
        <canvas ref={canvasRef} className="w-full h-full object-cover" />

        {/* Text Overlays */}
        {/* Stage 1 - Seed */}
        <motion.div 
          style={{ opacity: seedOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h2 className="text-white/95 text-4xl md:text-5xl lg:text-6xl font-inter font-bold tracking-wide text-center px-4 text-shadow-lg drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            Every change begins with a seed.
          </h2>
        </motion.div>

        {/* Stage 2 - Sprout */}
        <motion.div 
           style={{ opacity: sproutOpacity }}
           className="absolute inset-0 flex items-center justify-start px-8 md:px-24 pointer-events-none"
        >
          <h2 className="text-white/95 text-4xl md:text-5xl lg:text-6xl font-inter font-bold tracking-wide max-w-2xl text-shadow-lg drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            Learning sparks growth.
          </h2>
        </motion.div>

        {/* Stage 3 - Plant */}
        <motion.div 
           style={{ opacity: plantOpacity }}
           className="absolute inset-0 flex items-center justify-end px-8 md:px-24 pointer-events-none"
        >
           <h2 className="text-white/95 text-4xl md:text-5xl lg:text-6xl font-inter font-bold tracking-wide max-w-2xl text-right text-shadow-lg drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            Small actions nurture the planet.
          </h2>
        </motion.div>

        {/* Stage 4 - Tree */}
        <motion.div 
           style={{ opacity: treeOpacity }}
           className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
           <h2 className="text-white/95 text-4xl md:text-5xl lg:text-6xl font-inter font-bold tracking-wide text-center px-4 text-shadow-lg drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            Communities grow stronger together.
          </h2>
        </motion.div>

        {/* Stage 5 - Earth Reveal */}
        <motion.div 
           style={{ opacity: earthOpacity }}
           className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
           <div className="text-center px-4">
             <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-inter font-bold tracking-tight mb-4 text-shadow-lg drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">
               EcoLearn
             </h1>
             <h2 className="text-white/95 text-2xl md:text-4xl lg:text-5xl font-inter font-bold tracking-wide text-shadow-lg drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              Together we grow a sustainable world.
            </h2>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollStoryAnimation;
