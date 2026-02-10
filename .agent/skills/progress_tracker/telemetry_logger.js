/**
 * Telemetry Logger
 * Tracks user performance and identifies weak links.
 */

const STORAGE_KEYS = {
    SWIPES: 'noor_swipes',
    WEAK_LINKS: 'noor_weak_links',
    STATS: 'noor_word_stats'
};

/**
 * Logs a swipe attempt
 * @param {string} wordId - The ID of the word being attempted
 * @param {boolean} isCorrect - Whether the swipe was correct
 * @param {object} profile - The current user profile
 * @param {number} timeTaken - Time taken in milliseconds
 */
export const logAttempt = (wordId, isCorrect, profile, timeTaken) => {
    const attempt = {
        wordId,
        timestamp: Date.now(),
        isCorrect,
        timeTaken,
        profileId: profile?.id || 'default'
    };

    // 1. Save raw attempt to storage (batching could be added for performance)
    saveAttempt(attempt);

    // 2. Update aggregated stats for the word
    updateWordStats(wordId, isCorrect);

    // 3. Check and update weak links
    updateWeakLinks(wordId);
};

// Internal helper to save raw attempts
const saveAttempt = (attempt) => {
    try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.SWIPES) || '[]');
        history.push(attempt);
        // Optional: Limit history size if needed, but requirements say "log every swipe"
        localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save swipe attempt:', error);
    }
};

// Internal helper to update aggregated stats
const updateWordStats = (wordId, isCorrect) => {
    try {
        const allStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');

        if (!allStats[wordId]) {
            allStats[wordId] = { correct: 0, total: 0, streak: 0, level: 0 };
        }

        const stats = allStats[wordId];
        stats.total += 1;
        if (isCorrect) {
            stats.correct += 1;
            stats.streak += 1;
        } else {
            stats.streak = 0; // Reset streak on error
        }

        // Simple level calculation based on mastery (example logic)
        // Level 0: 0-2 correct
        // Level 1: 3-5 correct 
        // ... Level 5: Mastered (e.g., > 20 correct or high streak)
        // For now, let's keep it simple: Level = floor(correct / 5) capped at 5
        stats.level = Math.min(5, Math.floor(stats.correct / 5));

        allStats[wordId] = stats;
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(allStats));
    } catch (error) {
        console.error('Failed to update word stats:', error);
    }
};

// Internal helper to maintain weak links
const updateWeakLinks = (wordId) => {
    try {
        const allStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');
        const stats = allStats[wordId];

        if (!stats) return;

        // specific criteria: > 50% error rate AND at least 3 attempts
        const errorRate = 1 - (stats.correct / stats.total);
        const isWeak = stats.total >= 3 && errorRate > 0.5;

        let weakLinks = JSON.parse(localStorage.getItem(STORAGE_KEYS.WEAK_LINKS) || '[]');
        const index = weakLinks.indexOf(wordId);

        if (isWeak && index === -1) {
            weakLinks.push(wordId);
        } else if (!isWeak && index !== -1) {
            weakLinks.splice(index, 1);
        }

        localStorage.setItem(STORAGE_KEYS.WEAK_LINKS, JSON.stringify(weakLinks));
    } catch (error) {
        console.error('Failed to update weak links:', error);
    }
};

/**
 * Returns statistics for a specific word
 * @param {string} wordId 
 * @returns {object} { correct, total, streak, level }
 */
export const getWordStats = (wordId) => {
    const allStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');
    return allStats[wordId] || { correct: 0, total: 0, streak: 0, level: 0 };
};

/**
 * Returns the list of weak links (word IDs)
 * @returns {string[]}
 */
export const getWeakLinks = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WEAK_LINKS) || '[]');
};

/**
 * Helper to get all stats for dashboard
 */
export const getAllStats = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || '{}');
};
