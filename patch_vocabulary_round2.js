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
            id: '103',
            arabic: 'أَنَّ', // Was ﷺ
            meaning_en: 'that',
            phonics: 'Anna'
        },
        {
            id: '104',
            arabic: 'مُحَمَّد', // Was ﷺ
            meaning_en: 'Muhammad',
            phonics: 'Muhammad'
        },
        {
            id: '105',
            arabic: 'رَسُول', // Was ﷺ
            meaning_en: 'Messenger',
            phonics: 'Rasool'
        },
        {
            id: '116',
            arabic: 'سَوْفَ', // Was ﺳفََْ
            meaning_en: 'soon / will', // Was confusing sentence
            phonics: 'Sawfa' // Was Will
        },
        {
            id: '117',
            meaning_en: 'Abraham', // Was ibraaheem
        },
        {
            id: '119',
            phonics: 'Katheer' // Was Ka eer
        },
        {
            id: '110',
            arabic: 'الْعَظِيم',
            meaning_en: 'The Great',
            phonics: 'Al-Adheem'
        },
        {
            id: '111',
            phonics: 'Tayyibaat' // Was ïayyibaat
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
    console.error("Failed to patch vocabulary round 2", e);
}
