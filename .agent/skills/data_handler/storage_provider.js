/**
 * Storage Provider
 * Manages session history and data persistence.
 */

const STORAGE_KEYS = {
    SESSIONS: 'noor_sessions',
    SETTINGS: 'noor_settings'
};

/**
 * Saves a completed session to history
 * @param {object} sessionData - Stats and details of the completed session
 */
export const saveSession = (sessionData) => {
    try {
        const history = getSessionHistory();

        const newSession = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            ...sessionData
        };

        history.push(newSession);

        // Prune history older than 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentHistory = history.filter(session => session.timestamp > thirtyDaysAgo);

        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(recentHistory));
        return newSession;
    } catch (error) {
        console.error('Failed to save session:', error);
        return null;
    }
};

/**
 * Retrieves full session history
 * @returns {Array} List of session objects
 */
export const getSessionHistory = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to retrieve session history:', error);
        return [];
    }
};

/**
 * Exports all user data as a JSON object
 * @returns {object} Full data dump
 */
export const exportUserData = () => {
    const exportData = {};

    // Dump all local storage items prefixed with 'noor_'
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('noor_')) {
            try {
                exportData[key] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                exportData[key] = localStorage.getItem(key);
            }
        }
    }

    // Generate a downloadable JSON file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "noor_swipe_data_export.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    return exportData;
};

/**
 * Calculates streak data for the calendar
 * @returns {object} Map of date strings (YYYY-MM-DD) to activity count
 */
export const getStreakData = () => {
    const history = getSessionHistory();
    const streakMap = {};

    history.forEach(session => {
        const date = new Date(session.timestamp).toISOString().split('T')[0];
        streakMap[date] = (streakMap[date] || 0) + 1;
    });

    return streakMap;
};
