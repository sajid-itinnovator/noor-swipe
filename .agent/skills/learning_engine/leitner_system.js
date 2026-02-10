
/**
 * Leitner System Logic
 * 
 * Implements spaced repetition logic with 6 levels (0-5).
 */

const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 90]; // Days for levels 0-5

/**
 * Calculates the next review date based on the level.
 * @param {number} level - Current mastery level (0-5)
 * @returns {Date} - Next review date
 */
export const getNextReviewDate = (level) => {
    const days = REVIEW_INTERVALS[Math.min(level, REVIEW_INTERVALS.length - 1)];
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

/**
 * Promotes a word to the next level.
 * @param {string|number} wordId 
 * @param {Function} saveCallback - Function to persist changes (id, level, date)
 * @returns {Object} { level, nextReview }
 */
export const levelUp = (wordId, currentLevel, saveCallback) => {
    const nextLevel = Math.min(currentLevel + 1, 5);
    const nextReview = getNextReviewDate(nextLevel);
    if (saveCallback) {
        saveCallback(wordId, nextLevel, nextReview);
    }
    return { level: nextLevel, nextReview };
};

/**
 * Demotes a word to the previous level (or resets).
 * @param {string|number} wordId 
 * @param {Function} saveCallback 
 * @returns {Object} { level, nextReview }
 */
export const levelDown = (wordId, currentLevel, saveCallback) => {
    const nextLevel = Math.max(currentLevel - 1, 0);
    const nextReview = getNextReviewDate(nextLevel);
    if (saveCallback) {
        saveCallback(wordId, nextLevel, nextReview);
    }
    return { level: nextLevel, nextReview };
};

/**
 * Filters words that are due for review or are new (level 0).
 * @param {Array} words - Array of word objects with {id, memoryLevel, nextReview}
 * @param {number} targetLevel - Optional: filter by specific level
 * @returns {Array}
 */
export const getWordsForSession = (words, limit = 10, completedSessionIds = []) => {
    const now = new Date();

    // 1. Overdue Words (Priority 1)
    const overdue = words.filter(w => {
        if (completedSessionIds.includes(w.id)) return false;
        return w.memoryLevel > 0 && w.nextReview && new Date(w.nextReview) <= now;
    });

    // 2. New Words (Priority 2) - Level 0
    const newWords = words.filter(w => {
        if (completedSessionIds.includes(w.id)) return false;
        return w.memoryLevel === 0;
    });

    // Combine and slice
    let sessionWords = [...overdue];

    // Fill remaining slots with new words
    if (sessionWords.length < limit) {
        sessionWords = [...sessionWords, ...newWords.slice(0, limit - sessionWords.length)];
    }

    // 3. Random Review (if still not enough) - Review known words even if not strictly due
    if (sessionWords.length < limit) {
        const review = words.filter(w =>
            !sessionWords.includes(w) &&
            !completedSessionIds.includes(w.id) &&
            w.memoryLevel > 0
        );
        // Shuffle review words
        const shuffledReview = review.sort(() => 0.5 - Math.random());
        sessionWords = [...sessionWords, ...shuffledReview.slice(0, limit - sessionWords.length)];
    }

    return sessionWords;
};
