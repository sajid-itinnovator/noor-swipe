// State for audio settings
let isMuted = false;
let volume = 1.0;

export const setMuted = (muted) => { isMuted = muted; };
export const setVolume = (vol) => { volume = Math.max(0, Math.min(1, vol)); };

const playSound = (path) => {
    if (isMuted) return Promise.resolve();
    return new Promise((resolve) => {
        try {
            const audio = new Audio(path);
            audio.volume = volume;
            audio.onended = resolve;
            audio.onerror = () => {
                console.warn(`Audio playback failed for ${path}`);
                resolve();
            };
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Audio playback failed for ${path}:`, error);
                    resolve();
                });
            }
        } catch (e) {
            console.error("Audio construction failed:", e);
            resolve();
        }
    });
};

export function playArabic(wordId) {
    if (!wordId) return Promise.resolve();
    return playSound(`/audio/${wordId}_ar.wav`);
}

export function playHint(wordId, language) {
    if (!wordId || !language) return Promise.resolve();
    // Assuming file naming convention: wordId_hi.mp3 or wordId_mr.mp3
    // Map full language names to codes if necessary, but "Hindi" -> "hi" logic should be handled by caller or here.
    // Let's assume the caller passes 'hi' or 'mr' or 'en'.
    const langCode = language === 'Hindi' ? 'hi' : language === 'Marathi' ? 'mr' : 'en';
    if (langCode === 'en') return Promise.resolve(); // English handled by playMeaning usually

    return playSound(`/audio/${wordId}_${langCode}.wav`);
}

export function playMeaning(text) {
    if (isMuted || !text) return Promise.resolve();

    return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speaking
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.volume = volume;

            // Safety timeout: Resolve after 3 seconds if onend doesn't fire
            // This prevents the game from getting stuck if TTS fails silently
            const timeoutId = setTimeout(() => {
                resolve();
            }, 3000);

            utterance.onend = () => {
                clearTimeout(timeoutId);
                resolve();
            };

            utterance.onerror = (e) => {
                console.warn("TTS Error:", e);
                clearTimeout(timeoutId);
                resolve();
            };

            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("Web Speech API not supported.");
            resolve();
        }
    });
}

export function playSuccess() {
    return playSound('/audio/success.wav');
}

export function playError() {
    return playSound('/audio/error.wav');
}

/**
 * Plays the feedback sequence based on correctness.
 * @param {Object} word - The word object
 * @param {boolean} wasCorrect - Whether the answer was correct
 * @param {string} hintLanguage - 'Hindi', 'Marathi', or 'English'
 * @returns {Promise} Resolves when sequence is complete
 */
export async function playFeedbackSequence(word, wasCorrect, hintLanguage) {
    if (wasCorrect) {
        await playSuccess();
        await playMeaning(word.meaning_en);
        if (hintLanguage !== 'English') {
            await playHint(word.id, hintLanguage);
        }
    } else {
        await playError();
        await playArabic(word.id);
    }
}

