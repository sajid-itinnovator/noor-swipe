import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '../../.agent/skills/ui_coordinator/SwipeCard';
import * as vocabularyLoader from '../../.agent/skills/data_handler/vocabulary_loader';
import * as learningEngine from '../../.agent/skills/learning_engine/leitner_system';
import { generateQuestion } from '../../.agent/skills/session_generator/distractor_engine';
import { logAttempt } from '../../.agent/skills/progress_tracker/telemetry_logger';
import { saveSession } from '../../.agent/skills/data_handler/storage_provider';
import { saveWordProgress } from '../../.agent/skills/progress_tracker/storage_provider'; // Corrected import
import { playFeedbackSequence } from '../../.agent/skills/audio_engine/audio_player';
import vocabularyData from '../data/vocabulary.json';

// MOCK_VOCABULARY removed as per instruction

const SwipeGame = ({ settings, onOpenSettings }) => {
    // Derived state from settings
    const userProfile = settings?.userProfile || 'adult';
    const dailyGoal = settings?.dailyGoal || 10;

    const [sessionQueue, setSessionQueue] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    // currentOptions removed from useState, will be derived via useMemo
    const [feedback, setFeedback] = useState(null); // 'success' or 'error'
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [completedSessionIds, setCompletedSessionIds] = useState([]); // Track words done in this sitting

    // Initial Load
    useEffect(() => {
        // Initialize Vocabulary
        // Ensure IDs are strings for consistency with storage
        const vocab = vocabularyData.map(v => ({ ...v, id: String(v.id) }));
        vocabularyLoader.initializeVocabulary(vocab);
        loadNextBatch();
    }, [dailyGoal]);

    const loadNextBatch = () => {
        const allWords = vocabularyLoader.getAllWords();
        // Use smart selection logic
        const sessionWords = learningEngine.getWordsForSession(allWords, dailyGoal, completedSessionIds);

        setSessionQueue(sessionWords);
        setCurrentWordIndex(0);
        setSessionCompleted(false);
        setStartTime(Date.now());
    };

    // Synchronously derive options for the current word
    const currentOptions = useMemo(() => {
        if (sessionQueue.length > 0 && currentWordIndex < sessionQueue.length) {
            const word = sessionQueue[currentWordIndex];
            const allWords = vocabularyLoader.getAllWords();
            try {
                const question = generateQuestion(word, allWords, userProfile);
                return question.options;
            } catch (e) {
                console.error("Failed to generate question:", e);
                return null;
            }
        }
        return null;
    }, [currentWordIndex, sessionQueue, userProfile]);

    // Side Effects: Reset Timer & Check Completion
    useEffect(() => {
        if (feedback) return;

        if (sessionQueue.length > 0 && currentWordIndex < sessionQueue.length) {
            setStartTime(Date.now()); // Reset timer for new word
        } else if (sessionQueue.length > 0 && currentWordIndex >= sessionQueue.length) {
            setSessionCompleted(true);

            // Add completed words to the ignore list for next batch
            const newCompletedIds = sessionQueue.map(w => w.id);
            setCompletedSessionIds(prev => [...prev, ...newCompletedIds]);

            saveSession({
                profileId: userProfile,
                wordsPracticed: sessionQueue.length,
                duration: Date.now() - startTime
            });
        }
    }, [currentWordIndex, sessionQueue, feedback, userProfile]);

    const handleSwipe = async (direction) => {
        if (!currentOptions) return;

        const selectedOption = currentOptions.find(o => o.direction === direction);
        const currentWord = sessionQueue[currentWordIndex];
        const timeTaken = Date.now() - startTime;
        const isCorrect = selectedOption && selectedOption.isCorrect;

        // Log telemetry
        logAttempt(currentWord.id, isCorrect, { id: userProfile }, timeTaken);

        // --- FEEDBACK LOGIC STARTED ---
        try {
            if (isCorrect) {
                setFeedback('success');
                // Level Up (Optimistic)
                learningEngine.levelUp(currentWord.id, currentWord.memoryLevel, (id, lvl, date) => {
                    console.log(`Word ${id} leveled up to ${lvl}. Next review: ${date}`);
                    saveWordProgress(id, lvl, date); // Persist progress
                });

                // Play Audio Sequence
                await playFeedbackSequence(currentWord, true, settings?.hintLanguage || 'Hindi');

            } else {
                setFeedback('error');
                // Level Down
                learningEngine.levelDown(currentWord.id, currentWord.memoryLevel, (id, lvl, date) => {
                    console.log(`Word ${id} stayed/moved to level ${lvl}`);
                    saveWordProgress(id, lvl, date); // Persist progress
                });

                // Play Error Sequence
                await playFeedbackSequence(currentWord, false, settings?.hintLanguage || 'Hindi');

                // Re-queue the word
                setSessionQueue(prev => [...prev, currentWord]);
            }
        } catch (error) {
            console.error("Feedback sequence error:", error);
        } finally {
            setFeedback(null);
            setCurrentWordIndex(prev => prev + 1);
        }
    };

    if (sessionCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h1 className="text-4xl font-bold mb-4 text-teal-500">Session Complete!</h1>
                <p className="text-xl mb-8">Great job practicing today.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transition font-bold"
                    >
                        Restart
                    </button>
                    <button
                        onClick={loadNextBatch}
                        className="px-6 py-3 bg-teal-500 text-white rounded-lg shadow-lg hover:opacity-90 transition font-bold"
                    >
                        Continue Learning
                    </button>
                </div>
            </div>
        );
    }

    if (sessionQueue.length === 0 || !currentOptions || currentWordIndex >= sessionQueue.length) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans selection:bg-teal-500 selection:text-white pb-20">
            {/* Top Header */}
            <div className="bg-gray-100 text-gray-800 px-4 py-3 flex items-center justify-between shadow-md">
                {/* Left: Streak */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold shadow-sm">
                        🔥
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">3 Day Streak</h3>
                        <p className="text-xs text-gray-500">Keep it up!</p>
                    </div>
                </div>

                {/* Center: Profile Display */}
                <div className="hidden sm:block px-3 py-1 rounded-full text-xs font-bold capitalize bg-white shadow text-teal-600">
                    {userProfile}
                </div>

                {/* Right: Actions & Stats */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/dashboard"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-full text-xs font-bold border border-green-700 transition-colors flex items-center gap-2 shadow-sm"
                        title="Parent Dashboard"
                    >
                        <span>📊</span> <span className="hidden sm:inline">Parent View</span>
                    </Link>

                    <button
                        onClick={onOpenSettings}
                        className="bg-white hover:bg-gray-50 text-gray-600 p-2 rounded-full border border-gray-200 transition-colors shadow-sm"
                        title="Settings"
                    >
                        <Settings size={18} />
                    </button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 rounded-full shadow-sm ml-2">
                        <span>★</span>
                        <span className="font-bold text-sm">420</span>
                    </div>
                </div>
            </div>

            {/* Sub Header & Progress */}
            <div className="px-6 py-4 bg-gray-800/50">
                <div className="flex items-center justify-between text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">
                    <span>Daily Goal</span>
                    <span>{Math.min(currentWordIndex + 1, dailyGoal)}/{dailyGoal} Words</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-teal-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${((currentWordIndex) / dailyGoal) * 100}%` }}
                    />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">Progress: {Math.round((currentWordIndex / dailyGoal) * 100)}%</div>
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative overscroll-none overflow-hidden pb-10">
                <div className="relative z-10 m-auto scale-90 sm:scale-100">
                    <SwipeCard
                        word={sessionQueue[currentWordIndex]}
                        options={currentOptions}
                        onSwipe={handleSwipe}
                        profile={userProfile}
                        feedback={feedback}
                    />
                </div>
                <div className="absolute bottom-8 text-center text-gray-500 text-sm font-medium animate-pulse">
                    Swipe toward the correct meaning
                </div>
            </div>
        </div>
    );
};

export default SwipeGame;
