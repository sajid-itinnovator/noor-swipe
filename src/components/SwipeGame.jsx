import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw, Lightbulb } from 'lucide-react';
import SwipeCard from '../../.agent/skills/ui_coordinator/SwipeCard';
import * as vocabularyLoader from '../../.agent/skills/data_handler/vocabulary_loader';
import * as SessionStorage from '../../.agent/skills/data_handler/storage_provider';
import * as ProgressStorage from '../../.agent/skills/progress_tracker/storage_provider';
import * as leitnerSystem from '../../.agent/skills/learning_engine/leitner_system';
import { generateQuestion } from '../../.agent/skills/session_generator/distractor_engine';
import SessionComplete from './SessionComplete';
import ErrorBoundary from './ErrorBoundary';
import { playAudio } from '../utils/audio_player';

const SwipeGameContent = ({ settings, onOpenSettings }) => {
    const [allWords, setAllWords] = useState([]);
    const [currentSession, setCurrentSession] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(null);
    const [streak, setStreak] = useState(0);
    const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
    const [showCompletion, setShowCompletion] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [levelChanges, setLevelChanges] = useState({}); // Track level changes for session summary

    // Load initial session
    useEffect(() => {
        const loadSession = async () => {
            const vocab = await vocabularyLoader.loadVocabulary();
            setAllWords(vocab);

            // Get words specific to user progress
            // We pass the list of all words, and the system filters based on SR
            // Note: In a real app we might only load a subset, but here we load all and filter
            const sessionWords = leitnerSystem.getWordsForSession(vocab, settings.dailyGoal || 10);
            setCurrentSession(sessionWords);
        };
        loadSession();
    }, [settings.dailyGoal]);

    const currentWord = currentSession[currentIndex];

    // Junior Mode Auto-Play
    useEffect(() => {
        if (settings.userProfile === 'junior' && currentWord && currentWord.audio) {
            // Small delay to allow transition to finish
            const timer = setTimeout(() => {
                playAudio(currentWord.audio);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentWord, settings.userProfile]);

    // Options mapping (Top, Right, Bottom, Left)
    const options = useMemo(() => {
        if (!currentWord || allWords.length < 4) return null;

        try {
            const question = generateQuestion(currentWord, allWords, settings.userProfile);

            // Convert array output from distractor_engine to object map for easier UI rendering
            const map = {};
            question.options.forEach(opt => {
                map[opt.direction] = { text: opt.text, isCorrect: opt.isCorrect };
            });
            return map;
        } catch (e) {
            console.error("Failed to generate options", e);
            return null;
        }
    }, [currentWord, allWords, settings.userProfile]);

    const handleSwipe = (dir) => {
        if (!currentWord || !options) return;

        // If direction is not in options (e.g. diagonal or undefined), ignore
        if (!options[dir]) return;

        const selectedOption = options[dir];
        const isCorrect = selectedOption.isCorrect;

        // Feedback
        setFeedback({
            type: isCorrect ? 'success' : 'error',
            message: isCorrect ? 'Correct!' : 'Incorrect'
        });

        // Update Stats & SRS
        if (isCorrect) {
            setStreak(s => s + 1);
            setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));

            // Level Up
            const { level, nextReview } = leitnerSystem.levelUp(currentWord.id, currentWord.memoryLevel || 0);
            ProgressStorage.saveWordProgress(currentWord.id, level, nextReview);
            setLevelChanges(prev => ({ ...prev, [currentWord.id]: level }));

            // Play audio if enabled
            if (settings.audioEnabled && currentWord.audio) {
                playAudio(currentWord.audio);
            }
        } else {
            setStreak(0);
            setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));

            // Level Down
            const { level, nextReview } = leitnerSystem.levelDown(currentWord.id, currentWord.memoryLevel || 0);
            ProgressStorage.saveWordProgress(currentWord.id, level, nextReview);
            setLevelChanges(prev => ({ ...prev, [currentWord.id]: level }));
        }

        setDirection(dir);

        // Advance to next card or finish
        setTimeout(() => {
            setFeedback(null);
            setDirection(null);
            if (currentIndex < currentSession.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Save Session History
                SessionStorage.saveSession({
                    correct: sessionStats.correct + (isCorrect ? 1 : 0),
                    incorrect: sessionStats.incorrect + (isCorrect ? 0 : 1),
                    total: currentSession.length,
                    mode: settings.userProfile
                });

                // Update Total Stars (Currency)
                ProgressStorage.incrementStars(sessionStats.correct + (isCorrect ? 1 : 0));

                setShowCompletion(true);
            }
        }, 600); // Wait for feedback animation
    };

    if (showCompletion) {
        return <SessionComplete stats={sessionStats} total={currentSession.length} />;
    }

    if (!currentWord) return <div className="flex items-center justify-center h-full text-white">Loading...</div>;

    const progress = ((currentIndex) / currentSession.length) * 100;

    return (
        <div className="h-full flex flex-col relative select-none">
            {/* Header / HUD */}
            <div className="flex justify-between items-center px-6 py-4 pt-8">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-green transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                        <span className="text-orange-500 text-xs font-bold">🔥 {streak}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <span className="text-blue-400 text-xs font-bold">💧 {sessionStats.correct * 10}</span>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex items-center justify-center relative px-6">

                {/* Static Option Targets (The Cross) */}
                {/* Top Target */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-90 transition-opacity duration-300 hover:opacity-100 z-0">
                    <span className="text-lg md:text-xl font-bold font-arabic text-white bg-background-dark/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/10">{options?.top?.text}</span>
                </div>
                {/* Bottom Target */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-90 transition-opacity duration-300 hover:opacity-100 z-0">
                    <span className="text-lg md:text-xl font-bold font-arabic text-white bg-background-dark/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/10">{options?.bottom?.text}</span>
                </div>
                {/* Left Target */}
                <div className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-90 transition-opacity duration-300 hover:opacity-100 z-0 max-w-[80px]">
                    <span className="text-sm md:text-xl font-bold font-arabic text-white bg-background-dark/80 backdrop-blur-md px-2 py-2 rounded-xl text-center shadow-lg border border-white/10 leading-tight break-words">{options?.left?.text}</span>
                </div>
                {/* Right Target */}
                <div className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-90 transition-opacity duration-300 hover:opacity-100 z-0 max-w-[80px]">
                    <span className="text-sm md:text-xl font-bold font-arabic text-white bg-background-dark/80 backdrop-blur-md px-2 py-2 rounded-xl text-center shadow-lg border border-white/10 leading-tight break-words">{options?.right?.text}</span>
                </div>


                {/* Draggable Card */}
                <div className="relative z-10 w-[65%] md:w-full max-w-xs md:max-w-md aspect-[4/5] md:aspect-[2/1] max-h-[460px]">
                    <AnimatePresence mode="wait">
                        {currentWord && (
                            <SwipeCard
                                key={currentWord.id}
                                word={currentWord}
                                onSwipe={handleSwipe}
                                mode={settings.userProfile}
                            />
                        )}
                    </AnimatePresence>

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={`absolute inset-0 flex items-center justify-center z-20 rounded-3xl backdrop-blur-sm ${feedback.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                                    }`}
                            >
                                <div className={`text-3xl font-bold ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'
                                    } shadow-black drop-shadow-lg`}>
                                    {feedback.message}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer / Controls */}
            <div className="px-6 py-6 flex justify-around items-center">
                <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <RotateCcw size={20} />
                    </div>
                </button>
                <button
                    className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors px-6"
                    onClick={() => currentWord && playAudio(currentWord.audio)}
                >
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 text-primary">
                        <Volume2 size={28} />
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <Lightbulb size={20} />
                    </div>
                </button>
            </div>
        </div >
    );
};

const SwipeGame = (props) => (
    <ErrorBoundary>
        <SwipeGameContent {...props} />
    </ErrorBoundary>
);

export default SwipeGame;
