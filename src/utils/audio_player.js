/**
 * Simple audio player utility
 */

export const playAudio = (url) => {
    if (!url) return;

    try {
        const audio = new Audio(url);
        audio.play().catch(e => console.warn("Audio play failed", e));
    } catch (error) {
        console.warn("Error creating Audio object", error);
    }
};

export default { playAudio };
