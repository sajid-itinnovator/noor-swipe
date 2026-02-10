import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Heart, Leaf, ArrowUp, Volume2, CheckCircle, XCircle, Sun, Book, Star } from 'lucide-react';
import { playArabic } from '../audio_engine/audio_player';
import * as juniorProfile from '../profile_adapter/junior_profile';

const SwipeCard = ({ word, options, onSwipe, feedback, profile = 'adult' }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const controls = useAnimation();
    const isJunior = profile === 'junior';

    // Rotate based on X movement
    const rotate = useTransform(x, [-200, 200], [-15, 15]);

    useEffect(() => {
        if (isJunior && juniorProfile.config.autoplayAudio && !feedback) {
            playArabic(word.id);
        }
    }, [word, isJunior, feedback]);

    // Reset card position when word changes or feedback is cleared
    useEffect(() => {
        if (!feedback) {
            x.set(0);
            y.set(0);
            controls.set({ x: 0, y: 0, opacity: 1, rotate: 0 });
        }
    }, [word, feedback, controls, x, y]);

    const handleDragEnd = async (event, info) => {
        const threshold = 100; // Lower threshold for easier interaction
        const { offset } = info;

        if (offset.x > threshold) {
            // await controls.start({ x: 500, opacity: 0 }); // Don't animate out yet!
            onSwipe('right');
        } else if (offset.x < -threshold) {
            // await controls.start({ x: -500, opacity: 0 });
            onSwipe('left');
        } else if (offset.y < -threshold) {
            // await controls.start({ y: -500, opacity: 0 });
            onSwipe('top');
        } else if (offset.y > threshold) {
            // await controls.start({ y: 500, opacity: 0 });
            onSwipe('bottom');
        } else {
            controls.start({ x: 0, y: 0, rotate: 0 });
        }
    };

    const getOption = (dir) => options.find(o => o.direction === dir);

    // Helpers for styling based on direction
    const getOptionStyle = (dir) => {
        const option = getOption(dir);
        if (!option) return {};

        // Default Adult Icons
        let Icon = ArrowUp;
        let iconBg = "bg-gray-500";

        if (isJunior) {
            // Junior Mode Icons and Colors logic (can be refined based on distractor_engine mapping or direct heuristics)
            // Using direction-based mapping consistent with user request if semantic mapping pushes to these directions
            switch (dir) {
                case 'top': Icon = Sun; iconBg = "bg-yellow-400"; break; // Light/Guidance
                case 'bottom': Icon = Heart; iconBg = "bg-pink-500"; break; // Mercy/Love
                case 'left': Icon = Star; iconBg = "bg-purple-500"; break; // Power/Glory
                case 'right': Icon = Book; iconBg = "bg-blue-500"; break; // Knowledge
            }
        } else {
            // Adult Mode Logic (Legacy)
            switch (dir) {
                case 'top': Icon = ThumbsUp; iconBg = "bg-teal-500"; break;
                case 'bottom': Icon = Heart; iconBg = "bg-red-500"; break;
                case 'left': Icon = Leaf; iconBg = "bg-green-500"; break;
                case 'right': Icon = ArrowUp; iconBg = "bg-teal-600"; break;
            }
        }

        switch (dir) {
            case 'top': return {
                container: "top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4",
                iconBg, Icon
            };
            case 'bottom': return {
                container: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-4",
                iconBg, Icon
            };
            case 'left': return {
                container: "left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4",
                iconBg, Icon
            };
            case 'right': return {
                container: "right-0 top-1/2 -translate-y-1/2 translate-x-full ml-4",
                iconBg, Icon
            };
            default: return {};
        }
    };

    // Junior Font Injection
    const juniorFont = isJunior ? { fontFamily: '"Comic Neue", "Quicksand", sans-serif' } : {};

    return (
        <div className="relative flex items-center justify-center w-[300px] h-[300px]">
            {/* Radial Options */}
            <OptionCard dir="top" options={options} isJunior={isJunior} />
            <OptionCard dir="bottom" options={options} isJunior={isJunior} />
            <OptionCard dir="left" options={options} isJunior={isJunior} />
            <OptionCard dir="right" options={options} isJunior={isJunior} />

            {/* Central Draggable Card */}
            <motion.div
                className={`w-64 h-64 bg-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing z-20 border-[6px] ${isJunior ? 'border-pink-300' : 'border-yellow-400'}`}
                drag={!feedback} // Disable drag when showing feedback
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x, y, rotate }}
                whileTap={{ scale: 1.05 }}
            >
                {/* Internal Feedback Overlay */}
                <AnimatePresence>
                    {feedback === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm rounded-[1.5rem] flex flex-col items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2"
                            >
                                <CheckCircle size={48} strokeWidth={3} />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 text-center mb-1">{word.meaning_en}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Meaning</p>
                        </motion.div>
                    )}

                    {feedback === 'error' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-red-50/90 backdrop-blur-sm rounded-[1.5rem] flex flex-col items-center justify-center"
                        >
                            <motion.div
                                animate={{ x: [-5, 5, -5, 5, 0] }}
                                className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2"
                            >
                                <XCircle size={48} strokeWidth={3} />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-800">Review!</h3>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Audio Icon (Absolute) */}
                <div className="absolute top-4 left-4 text-gray-400 cursor-pointer hover:text-teal-500 transition-colors" onClick={(e) => { e.stopPropagation(); playArabic(word.id); }}>
                    <Volume2 size={24} />
                </div>

                {/* Check Icon (Absolute) */}
                {!isJunior && (
                    <div className="absolute bottom-4 right-4 text-gray-400">
                        <CheckCircle size={24} />
                    </div>
                )}

                {/* Main Content */}
                <div className="text-center p-4">
                    {!isJunior && (
                        <h2 className="text-6xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Amiri, serif' }}>
                            {word.arabic}
                        </h2>
                    )}

                    {/* Junior Phonics / Meaning */}
                    <p className={`${isJunior ? 'text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600' : 'text-xl text-gray-600'} font-bold`} style={juniorFont}>
                        {word.phonics}
                    </p>

                    {/* For Junior, maybe show less or different info? keeping it simple */}
                </div>

                {/* Level Indicator */}
                {!isJunior && (
                    <div className="absolute bottom-4 left-4 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                        <Volume2 size={14} className="text-gray-500" />
                        <span className="text-xs font-bold text-gray-500">Lv {word.memoryLevel || 0}</span>
                    </div>
                )}

            </motion.div>

            {/* Connector Lines (SVG Overlay) - Simple implementation */}
            <svg className="absolute inset-[-100px] w-[500px] h-[500px] pointer-events-none z-[-1] opacity-20">
                {/* Cross lines to connect options to center */}
                <line x1="250" y1="250" x2="250" y2="50" stroke={isJunior ? "pink" : "white"} strokeWidth="4" strokeDasharray="10 10" />
                <line x1="250" y1="250" x2="250" y2="450" stroke={isJunior ? "pink" : "white"} strokeWidth="4" strokeDasharray="10 10" />
                <line x1="250" y1="250" x2="50" y2="250" stroke={isJunior ? "pink" : "white"} strokeWidth="4" strokeDasharray="10 10" />
                <line x1="250" y1="250" x2="450" y2="250" stroke={isJunior ? "pink" : "white"} strokeWidth="4" strokeDasharray="10 10" />
            </svg>
        </div>
    );
};

// -- Extracted OptionCard Component --
const OptionCard = ({ dir, options, isJunior }) => {
    const getOption = (d) => options.find(o => o.direction === d);
    const option = getOption(dir);

    // Helpers for styling based on direction
    const getOptionStyle = (d) => {
        // Default Adult Icons
        let Icon = ArrowUp;
        let iconBg = "bg-gray-500";

        if (isJunior) {
            // Junior Mode Icons and Colors logic
            switch (d) {
                case 'top': Icon = Sun; iconBg = "bg-yellow-400"; break; // Light/Guidance
                case 'bottom': Icon = Heart; iconBg = "bg-pink-500"; break; // Mercy/Love
                case 'left': Icon = Star; iconBg = "bg-purple-500"; break; // Power/Glory
                case 'right': Icon = Book; iconBg = "bg-blue-500"; break; // Knowledge
            }
        } else {
            // Adult Mode Logic (Legacy)
            switch (d) {
                case 'top': Icon = ThumbsUp; iconBg = "bg-teal-500"; break;
                case 'bottom': Icon = Heart; iconBg = "bg-red-500"; break;
                case 'left': Icon = Leaf; iconBg = "bg-green-500"; break;
                case 'right': Icon = ArrowUp; iconBg = "bg-teal-600"; break;
            }
        }

        switch (d) {
            case 'top': return {
                container: "top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4",
                iconBg, Icon
            };
            case 'bottom': return {
                container: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-4",
                iconBg, Icon
            };
            case 'left': return {
                container: "left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4",
                iconBg, Icon
            };
            case 'right': return {
                container: "right-0 top-1/2 -translate-y-1/2 translate-x-full ml-4",
                iconBg, Icon
            };
            default: return {};
        }
    };

    if (!option) return null;
    const style = getOptionStyle(dir);
    const Icon = style.Icon;

    return (
        <div className={`absolute ${style.container} flex items-center gap-3 bg-white p-3 rounded-2xl shadow-lg min-w-[160px] max-w-[200px] z-0 transition-transform duration-200`}>
            <div className={`${style.iconBg} text-white p-2 rounded-full shadow-md`}>
                <Icon size={20} />
            </div>
            <div className="flex flex-col">
                {!isJunior && <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{dir}</span>}
                <span className={`font-bold text-gray-800 leading-tight ${isJunior ? 'text-lg font-comic' : 'text-sm'}`}>{option.text}</span>
            </div>
        </div>
    );
};

export default SwipeCard;
