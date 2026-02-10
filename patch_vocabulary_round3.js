import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vocabFile = path.join(process.cwd(), 'src', 'data', 'vocabulary.json');

try {
    const data = fs.readFileSync(vocabFile, 'utf8');
    let vocabulary = JSON.parse(data);
    let updateCount = 0;

    const patches = [
        {
            id: '10',
            arabic: 'هَلْ', // Standard Arabic
            meaning_en: 'Is / Do / Are',
            phonics: 'Hal'
        },
        {
            id: '108',
            meaning_en: 'What?',
            phonics: 'Maadha'
        },
        {
            id: '47',
            arabic: 'الْقُرْآن',
            meaning_en: 'The Quran',
            phonics: 'Al-Quran'
        },
        {
            id: '114',
            meaning_en: 'Mercy' // Was "the) Mercy"
        }
    ];

    patches.forEach(p => {
        const word = vocabulary.find(w => w.id === p.id);
        if (word) {
            console.log(`Patching ID ${p.id}...`);
            if (p.arabic) word.arabic = p.arabic;
            if (p.meaning_en) word.meaning_en = p.meaning_en;
            if (p.phonics) word.phonics = p.phonics;
            updateCount++;
        }
    });

    if (updateCount > 0) {
        fs.writeFileSync(vocabFile, JSON.stringify(vocabulary, null, 2), 'utf8');
        console.log(`Updated ${updateCount} words.`);
    }

} catch (e) {
    console.error("Failed to patch vocabulary round 3", e);
}
