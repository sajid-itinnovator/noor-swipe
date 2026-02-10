import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vocabFile = path.join(process.cwd(), 'src', 'data', 'vocabulary.json');

const replacements = [
    { id: '2', phonics: 'Ash-shaytaan' }, // Was Ash-shayaan
    { id: '3', phonics: 'Huwa' },
    { id: '4', phonics: 'Hum' },
    { id: '5', phonics: 'Anta' },
    { id: '6', phonics: 'Ana' },
    { id: '7', phonics: 'Antum' },
    { id: '8', phonics: 'Nahnu' },
    { id: '13', phonics: 'Ar-Rahmaan' }, // Was Ar-ra…maan
    { id: '14', phonics: 'Ar-Raheem' }, // Was Ar-raeem
    { id: '16', phonics: 'Al-Hamd' }, // Was Al-…amd
    { id: '15', phonics: 'Al-Kareem' },
    { id: '23', phonics: 'Saalih' }, // Was Œaali…
    { id: '25', phonics: 'Ad-Deen' },
    { id: '29', phonics: 'As-Siraat' }, // Was A‹-‹iraaë
    { id: '31', phonics: 'Alladheena' }, // Was Al-la’eena
    { id: '32', phonics: 'Ghayr' }, // Was Ähayr
    { id: '39', phonics: 'Ard' }, // Was arÆ
    { id: '66', phonics: 'Ahsan' }, // Was A…san
    { id: '81', phonics: 'Qul' }, // Was Âul
    { id: '85', phonics: 'Nasr' }, // Was na‹r
    { id: '94', phonics: 'Hadeeth' }, // Was …adee
    { id: '96', phonics: 'Sadr' }, // Was adr
    { id: '106', phonics: 'As-Salaat' }, // Was A-alat
    { id: '109', phonics: 'Subhana' }, // Was sub…aana
    { id: '113', phonics: 'An-Nabi' }
];

// Heuristic replacements for common garbage characters if found
const charMap = {
    '…': 'h',
    '‹': 's',
    'ë': 't',
    'Æ': 'd',
    'Ä': 'gh',
    'Œ': 'S',
    'Â': 'Q',
    '’': 'dh'
};

try {
    const data = fs.readFileSync(vocabFile, 'utf8');
    let vocabulary = JSON.parse(data);
    let updateCount = 0;

    // Apply explicit replacements
    replacements.forEach(rep => {
        const word = vocabulary.find(w => w.id === rep.id);
        if (word) {
            if (word.phonics !== rep.phonics) {
                console.log(`ID ${rep.id}: ${word.phonics} -> ${rep.phonics}`);
                word.phonics = rep.phonics;
                updateCount++;
            }
        }
    });

    // Apply heuristic fix to all words
    vocabulary.forEach(word => {
        let p = word.phonics;
        let original = p;
        for (const [char, rep] of Object.entries(charMap)) {
            if (p.includes(char)) {
                p = p.replace(new RegExp(char, 'g'), rep);
            }
        }

        // Clean up lowercase start if looks like a name/title
        if (word.id < 126 && /^[a-z]/.test(p) && !['he', 'she', 'it'].includes(word.meaning_en.toLowerCase())) {
            // Optional: capitalize first letter
            p = p.charAt(0).toUpperCase() + p.slice(1);
        }

        if (p !== original) {
            console.log(`Heuristic Fix ID ${word.id}: ${original} -> ${p}`);
            word.phonics = p;
            updateCount++;
        }
    });

    if (updateCount > 0) {
        fs.writeFileSync(vocabFile, JSON.stringify(vocabulary, null, 2), 'utf8');
        console.log(`Updated ${updateCount} words.`);
    } else {
        console.log("No changes needed.");
    }

} catch (e) {
    console.error("Failed to fix transliterations", e);
}
