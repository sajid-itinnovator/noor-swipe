
/**
 * Storage Provider
 * 
 * Manages LocalStorage for application state.
 */

const STORAGE_KEY = 'noor_swipe_progress';

const defaultState = {
    totalStars: 0,
    currentStreak: 0,
    lastSessionDate: null,
    wordProgress: {} // Map of wordId -> { level, nextReview }
};

/**
 * Retrieves current progress from LocalStorage.
 * @returns {Object}
 */
// In-memory fallback
let memoryStorage = {};

const safeGetItem = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.warn("LocalStorage access denied, using memory storage");
        return memoryStorage[key] || null;
    }
};

const safeSetItem = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        memoryStorage[key] = value;
    }
};

export const getProgress = () => {
    try {
        const data = safeGetItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { ...defaultState };
    } catch (e) {
        console.error("Failed to load progress", e);
        return { ...defaultState };
    }
};

/**
 * Saves progress for a specific word.
 * @param {string|number} wordId 
 * @param {number} newLevel 
 * @param {Date|string} nextReviewDate 
 */
export const saveProgress = (wordId, newLevel, nextReviewDate) => {
    const data = getProgress();
    if (!data.wordProgress) data.wordProgress = {};

    data.wordProgress[wordId] = {
        level: newLevel,
        nextReview: nextReviewDate instanceof Date ? nextReviewDate.toISOString() : nextReviewDate
    };

    safeSetItem(STORAGE_KEY, JSON.stringify(data));
};

export const saveWordProgress = (wordId, level, nextReviewDate) => {
    saveProgress(wordId, level, nextReviewDate);
};

export const getAllWordProgress = () => {
    const data = getProgress();
    return data.wordProgress || {};
};

/**
 * Increments total stars and updates streak.
 * @param {number} amount 
 */
export const incrementStars = (amount) => {
    const data = getProgress();
    data.totalStars = (data.totalStars || 0) + amount;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today

    if (data.lastSessionDate) {
        const lastSession = new Date(data.lastSessionDate);
        const lastSessionDay = new Date(lastSession.getFullYear(), lastSession.getMonth(), lastSession.getDate());

        const diffTime = Math.abs(today - lastSessionDay);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            data.currentStreak = (data.currentStreak || 0) + 1;
        } else if (diffDays > 1) {
            // Missed a day or more
            data.currentStreak = 1;
        }
        // If diffDays === 0, same day, do nothing to streak
    } else {
        data.currentStreak = 1;
    }

    data.lastSessionDate = now.toISOString();
    safeSetItem(STORAGE_KEY, JSON.stringify(data));
};
