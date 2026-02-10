export const config = {
    hideArabic: false, // Changed to false to show simplified script
    showPhonics: true,
    useIcons: true,
    autoplayAudio: true
};

export function transformCard(wordData, profileConfig) {
    if (profileConfig.hideArabic) {
        // Logic to handle hiding Arabic could be here, 
        // but mostly this config is consumed by the UI component directly.
        // We can return a modified object if needed.
    }
    return wordData;
}
