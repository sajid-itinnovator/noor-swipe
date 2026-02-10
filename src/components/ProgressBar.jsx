import React from 'react';
import { getWord } from '../../.agent/skills/data_handler/vocabulary_loader';

const ProgressBar = ({ wordStats }) => {
    // Generate array of 125 segments (assuming vocabulary size is roughly 125)
    // Requirements: "Visual 125-segment progress bar ... 5 rows x 25 columns"
    const segments = Array.from({ length: 125 }, (_, i) => {
        // We'll create a dummy ID if it doesn't exist, though typically IDs are sequential.
        // If IDs are strings like "word_1", we need a mapping logic or rely on vocabulary list order.
        // For now, let's assume word IDs map generally to index+1 or use the passed stats keys if available.
        // Better approach: Get all words from vocabulary loader to ensure correct IDs.
        // Since we import getWord, let's assume we can traverse an ID range or passed word list.
        // But since vocabulary loader is not React-reactive, we might need a prop for words.
        // Let's rely on index for grid and check stats if available.

        // In a real app, we'd pass the full vocabulary list.
        // For this implementation, we will mock the ID based on index if not provided.
        // Wait, getWord might not be efficient in a loop.
        // Let's assume the parent passes the full word list or we have a way to access it.
        // Using a placeholder ID for now.
        return { index: i };
    });

    const getLevelColor = (level) => {
        switch (level) {
            case 5: return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] border-amber-300'; // Gold/Mastered
            case 4: return 'bg-orange-500 border-orange-400';
            case 3: return 'bg-yellow-500/80 border-yellow-400/50';
            case 2: return 'bg-yellow-500/40 border-yellow-400/20';
            case 1:
            case 0:
            default: return 'bg-white/10 border-white/5';
        }
    };

    // Calculate mastery for header
    const masteredCount = Object.values(wordStats).filter(s => s.level === 5).length;

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold text-white">Vocabulary Mastery</h3>
                <div className="text-right">
                    <div className="text-2xl font-bold text-amber-400">{masteredCount}/125</div>
                    <div className="text-xs text-white/50">words mastered</div>
                </div>
            </div>

            {/* 5 rows x 25 columns grid */}
            <div className="grid grid-cols-[repeat(25,minmax(0,1fr))] gap-[2px] w-full aspect-[25/5]">
                {segments.map((segment) => {
                    // Try to match stats. Requirements imply specific word mapping.
                    // Since we don't have the word list passed as prop yet, using index.
                    // In integration, we should map this to actual word IDs.
                    // Assuming words are indexed 1-125 for this grid visualization.
                    const wordId = `word_${segment.index + 1}`;
                    const stat = wordStats[wordId] || { level: 0 };
                    const word = getWord(wordId);

                    return (
                        <div
                            key={segment.index}
                            className={`
                w-full h-full rounded-[1px] border transition-all duration-300 group relative
                ${getLevelColor(stat.level)}
              `}
                        >
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10">
                                {word ? word.phonics : `Word ${segment.index + 1}`} (Lvl {stat.level})
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between mt-3 text-xs text-white/40">
                <span>Level 0</span>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500/40 rounded-full"></div> Learning</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Familiar</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full"></div> Mastered</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
