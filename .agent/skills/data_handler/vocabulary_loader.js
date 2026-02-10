
/**
 * Vocabulary Loader
 * 
 * Handles loading and management of vocabulary words.
 */

let vocabulary = [];

/**
 * Initializes the vocabulary with the specific structure.
 * Validates that the input is an array and extends each word with a memoryLevel.
 * 
 * @param {Array} words - Array of word objects {id, arabic, phonics, meaning_en, hint_hi, hint_mr}
 */
import { getAllWordProgress } from '../progress_tracker/storage_provider';

export const initializeVocabulary = (words) => {
  if (!Array.isArray(words)) {
    console.error("Vocabulary must be an array");
    return;
  }

  const progress = getAllWordProgress();

  vocabulary = words.map(word => {
    const wordProgress = progress[word.id];
    return {
      ...word,
      memoryLevel: wordProgress ? wordProgress.level : (word.memoryLevel !== undefined ? word.memoryLevel : 0),
      nextReview: wordProgress ? wordProgress.nextReview : null
    };
  });
};

/**
 * Retrieves a specific word by its ID.
 * @param {string|number} id 
 * @returns {Object|undefined}
 */
export const getWord = (id) => {
  return vocabulary.find(word => word.id === id);
};

/**
 * Returns all words in the current vocabulary.
 * @returns {Array}
 */
export const getAllWords = () => {
  return vocabulary;
};
