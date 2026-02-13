import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { useState } from 'react';

const SwipeCard = ({ word, onSwipe, mode }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const controls = useAnimation();

    // Rotation based on X dragging
    const rotate = useTransform(x, [-200, 200], [-25, 25]);

    // Opacity/Color overlay based on drag direction
    const opacityRight = useTransform(x, [0, 150], [0, 1]);
    const opacityLeft = useTransform(x, [0, -150], [0, 1]);
    const opacityUp = useTransform(y, [0, -150], [0, 1]);
    const opacityDown = useTransform(y, [0, 150], [0, 1]);

    const handleDragEnd = async (event, info) => {
        const threshold = 100;
        const velocity = 200;

        // Check for sufficient drag distance or velocity
        if (x.get() > threshold || info.velocity.x > velocity) {
            await controls.start({ x: 500, opacity: 0 });
            onSwipe('right');
        } else if (x.get() < -threshold || info.velocity.x < -velocity) {
            await controls.start({ x: -500, opacity: 0 });
            onSwipe('left');
        } else if (y.get() > threshold || info.velocity.y > velocity) {
            await controls.start({ y: 500, opacity: 0 });
            onSwipe('bottom');
        } else if (y.get() < -threshold || info.velocity.y < -velocity) {
            await controls.start({ y: -500, opacity: 0 });
            onSwipe('top');
        } else {
            // Reset position
            controls.start({ x: 0, y: 0 });
        }
    };

    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.6}
            style={{ x, y, rotate, touchAction: 'none' }}
            animate={controls}
            onDragEnd={handleDragEnd}
            className="w-full h-full relative cursor-grab active:cursor-grabbing perspective-1000"
        >
            {/* Card Content */}
            <div className="w-full h-full bg-card-grey rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden center-card">

                {/* Background Gradient Detail */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -translate-x-10 translate-y-10"></div>

                {/* Dynamic Content based on Mode */}
                {mode === 'junior' ? (
                    <div className="flex flex-col items-center justify-center animate-bounce-slow">
                        <span className="text-8xl mb-4 filter drop-shadow-lg">🔊</span>
                        <p className="text-silver text-2xl font-bold tracking-wider">Listen!</p>
                        <div className="mt-6 bg-white/10 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                            <p className="text-white text-xl font-bold tracking-wide">
                                {word.phonics ? `/${word.phonics}/` : '/.../'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Arabic Text */}
                        <h2 className="text-6xl font-bold text-white mb-6 font-arabic text-center leading-relaxed drop-shadow-lg">
                            {word.arabic}
                        </h2>

                        {/* Transliteration */}
                        <div className="bg-white/5 px-4 py-1.5 rounded-full mb-8 border border-white/5">
                            <p className="text-silver text-lg font-medium tracking-wide">
                                {word.phonics ? `/${word.phonics}/` : '/.../'}
                            </p>
                        </div>
                    </>
                )}

                {/* Hint/Icon Placeholder */}
                <div className="text-4xl opacity-20 filter grayscale hover:grayscale-0 transition-all duration-300">
                    🧩
                </div>

                {/* Drag Indicators (Visual cues overlay) */}
                <motion.div style={{ opacity: opacityRight }} className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-green-500/20 to-transparent flex items-center justify-end px-4 pointer-events-none">
                </motion.div>
                <motion.div style={{ opacity: opacityLeft }} className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-red-500/20 to-transparent flex items-center justify-start px-4 pointer-events-none">
                </motion.div>
                <motion.div style={{ opacity: opacityUp }} className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/20 to-transparent flex items-start justify-center py-4 pointer-events-none">
                </motion.div>
                <motion.div style={{ opacity: opacityDown }} className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-orange-500/20 to-transparent flex items-end justify-center py-4 pointer-events-none">
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SwipeCard;
