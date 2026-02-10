/**
 * Generates a 4-choice question for a given target word.
 * 
 * @param {Object} targetWord - The word object to test (must have 'id' and 'meaning_en').
 * @param {Array} allWords - Array of all available word objects to draw distractors from.
 * @returns {Object} Question object with structure:
 * {
 *   targetWord: Object,
 *   options: Array<{
 *     direction: 'top' | 'right' | 'bottom' | 'left',
 *     text: string,
 *     isCorrect: boolean
 *   }>
 * }
 */
export function generateQuestion(targetWord, allWords, userProfile = 'adult') {
    if (!targetWord || !allWords || allWords.length < 4) {
        throw new Error("Insufficient data to generate question. Need targetWord and at least 4 total words.");
    }

    const directions = ['top', 'right', 'bottom', 'left'];

    // Junior Mode Semantic Mapping (Optional Enhancement)
    // If usage of icons is strict, we should try to put the correct answer 
    // on the direction matching the icon if the Concept matches.
    // Concepts: Mercy/Love -> Bottom (Heart), Light/Guidance -> Top (Sun)
    // Knowledge -> Right (Book), Power/Glory -> Left (Star)

    let forcedDirection = null;
    if (userProfile === 'junior') {
        const lowerMeaning = targetWord.meaning_en.toLowerCase();
        if (lowerMeaning.includes('mercy') || lowerMeaning.includes('love') || lowerMeaning.includes('house') || lowerMeaning.includes('water')) forcedDirection = 'bottom';
        else if (lowerMeaning.includes('light') || lowerMeaning.includes('sun') || lowerMeaning.includes('moon') || lowerMeaning.includes('day')) forcedDirection = 'top';
        else if (lowerMeaning.includes('knowledge') || lowerMeaning.includes('book') || lowerMeaning.includes('read') || lowerMeaning.includes('pen')) forcedDirection = 'right';
        else if (lowerMeaning.includes('power') || lowerMeaning.includes('star') || lowerMeaning.includes('night') || lowerMeaning.includes('fire')) forcedDirection = 'left';
    }

    // 1. Select 3 random distractors (excluding targetWord)
    const distractors = [];
    const availableDistractors = allWords.filter(w => w.id !== targetWord.id);

    // Simple shuffle for distractors
    const shuffledDistractors = [...availableDistractors].sort(() => 0.5 - Math.random());

    if (shuffledDistractors.length < 3) {
        // Fallback if not enough unique distractors (should handle duplications in production, but for now throw or fill)
        throw new Error("Not enough unique distractors available.");
    }

    // Take first 3
    const selectedDistractors = shuffledDistractors.slice(0, 3);

    // 2. Assign positions randomly
    // Shuffle directions to assign correct answer to a random spot
    let shuffledDirections = [...directions].sort(() => 0.5 - Math.random());

    // If semantic mapping dictates a direction for the correct answer, force it
    // But be careful: if we always force it, the user might memorize "Sun is always Top" etc.
    // For now, let's just use the random assignment unless semantic correctness is CRITICAL for the *icon* match.
    // If the icon on Top is ALWAYS Sun, and the answer is "Sun", then yes, it should be Top.

    if (forcedDirection) {
        // Move forced direction to front so it gets assigned to the correct answer
        shuffledDirections = [forcedDirection, ...shuffledDirections.filter(d => d !== forcedDirection)];
    }

    const options = [];

    // Assign correct answer to first direction in shuffled list
    options.push({
        direction: shuffledDirections[0],
        text: targetWord.meaning_en,
        isCorrect: true
    });

    // Assign distractors to remaining 3 directions
    for (let i = 0; i < 3; i++) {
        options.push({
            direction: shuffledDirections[i + 1],
            text: selectedDistractors[i].meaning_en,
            isCorrect: false
        });
    }

    return {
        targetWord,
        options
    };
}
