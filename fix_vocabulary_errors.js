
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vocabPath = path.join(__dirname, 'src', 'data', 'vocabulary.json');

const corrections = [
    {
        "id": "1",
        "arabic": "الله",
        "phonics": "'Al-lah",
        "meaning_en": "Allah"
    },
    {
        "id": "2",
        "arabic": "الشَّيْطن",
        "phonics": "Ash-shaytaan",
        "meaning_en": "Satan"
    },
    {
        "id": "3",
        "arabic": "هُوَ",
        "phonics": "huwa",
        "meaning_en": "he"
    },
    {
        "id": "4",
        "arabic": "هُمْ",
        "phonics": "hum",
        "meaning_en": "they"
    },
    {
        "id": "5",
        "arabic": "اَنْتَ",
        "phonics": "'anta",
        "meaning_en": "you (singular)"
    },
    {
        "id": "11",
        "arabic": "خَيْر",
        "phonics": "khayr",
        "meaning_en": "best / better"
    },
    {
        "id": "24",
        "arabic": "يَوْمِ",
        "phonics": "yawm",
        "meaning_en": "day"
    },
    {
        "id": "51",
        "arabic": "إِنَّمَا",
        "phonics": "'innamaa",
        "meaning_en": "only"
    },
    {
        "id": "76",
        "arabic": "جَاءَ",
        "phonics": "jaa'a",
        "meaning_en": "he came"
    },
    {
        "id": "125",
        "arabic": "نار",
        "phonics": "naar",
        "meaning_en": "the Fire"
    }
];

try {
    const data = fs.readFileSync(vocabPath, 'utf8');
    let vocabulary = JSON.parse(data);
    let updatedCount = 0;

    corrections.forEach(correction => {
        // Determine the ID as string or number to match file content
        // Based on previous read, IDs are strings in the file.
        const itemIndex = vocabulary.findIndex(v => String(v.id) === String(correction.id));

        if (itemIndex !== -1) {
            const original = vocabulary[itemIndex];
            console.log(`Updating ID ${correction.id}:`);
            console.log(`  Old: ${original.arabic} | ${original.phonics} | ${original.meaning_en}`);

            vocabulary[itemIndex] = {
                ...original,
                arabic: correction.arabic,
                phonics: correction.phonics,
                meaning_en: correction.meaning_en
            };

            console.log(`  New: ${vocabulary[itemIndex].arabic} | ${vocabulary[itemIndex].phonics} | ${vocabulary[itemIndex].meaning_en}`);
            updatedCount++;
        } else {
            console.warn(`Warning: ID ${correction.id} not found in vocabulary.`);
        }
    });

    if (updatedCount > 0) {
        fs.writeFileSync(vocabPath, JSON.stringify(vocabulary, null, 2), 'utf8');
        console.log(`\nSuccessfully updated ${updatedCount} items in ${vocabPath}`);
    } else {
        console.log('\nNo items were updated.');
    }

} catch (err) {
    console.error('Error processing vocabulary file:', err);
}
