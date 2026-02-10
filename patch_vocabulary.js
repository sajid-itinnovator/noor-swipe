import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vocabFile = path.join(process.cwd(), 'src', 'data', 'vocabulary.json');

try {
    const data = fs.readFileSync(vocabFile, 'utf8');
    let vocabulary = JSON.parse(data);

    // Patch ID 1
    const word1 = vocabulary.find(w => w.id === '1');
    if (word1) {
        console.log(`Original ID 1 Arabic: ${word1.arabic}`);
        word1.arabic = 'اللّٰه'; // Correct spelling with shadda/dagger alif if possible, or simple "الله"
        // "الله" is standard. "اللّٰه" is precise. Let's use standard "الله" for better rendering compatibility or "اللّٰه" if we want tashkeel.
        // The PDF extraction had "اﻋﻮذَُُْ ِﺑﺎﷲِ" which is "A'udhu billahi".
        // Let's use "الله" (Simple) or "اللّٰه" (With tashkeel).
        // Application seems to handle tashkeel. Let's use "اللّٰه".
        console.log(`Patched ID 1 Arabic to: ${word1.arabic}`);
    }

    // Patch ID 5 (Anta - You) - Currently has 'Ana'
    const word5 = vocabulary.find(w => w.id === '5');
    if (word5) {
        word5.arabic = 'أَنْتَ';
        console.log(`Patched ID 5 Arabic to: ${word5.arabic}`);
    }

    // Patch ID 6 (Ana - I) - Currently has Example Sentence as meaning
    const word6 = vocabulary.find(w => w.id === '6');
    if (word6) {
        word6.meaning_en = 'I';
        word6.phonics = 'anaa';
        console.log(`Patched ID 6 Meaning/Phonics to: ${word6.meaning_en} / ${word6.phonics}`);
    }

    // Patch ID 17 (Lillahi) - Missing Arabic
    const word17 = vocabulary.find(w => w.id === '17');
    if (word17) {
        word17.arabic = 'لِلَّهِ';
        console.log(`Patched ID 17 Arabic to: ${word17.arabic}`);
    }

    // Write back
    fs.writeFileSync(vocabFile, JSON.stringify(vocabulary, null, 2), 'utf8');
    console.log("Vocabulary patched successfully.");

} catch (e) {
    console.error("Failed to patch vocabulary", e);
}
