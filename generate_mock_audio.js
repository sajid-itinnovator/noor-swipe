import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper for ESM directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.join(process.cwd(), 'public', 'audio');
const vocabFile = path.join(process.cwd(), 'src', 'data', 'vocabulary.json');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// Read vocabulary
let vocabulary = [];
try {
    const data = fs.readFileSync(vocabFile, 'utf8');
    vocabulary = JSON.parse(data);
    console.log(`Loaded ${vocabulary.length} words from vocabulary.json`);
} catch (e) {
    console.error("Failed to read vocabulary.json", e);
    process.exit(1);
}

const filesToCreate = [
    'success.wav',
    'error.wav'
];

// Add word files
vocabulary.forEach(word => {
    const id = word.id;
    if (id) {
        filesToCreate.push(`${id}_ar.wav`);
        filesToCreate.push(`${id}_en.wav`);
        filesToCreate.push(`${id}_hi.wav`);
        filesToCreate.push(`${id}_mr.wav`);
    }
});

// Create a valid PCM WAV buffer
function createWavBuffer(frequency, durationSeconds, volume = 0.5) {
    const sampleRate = 44100;
    const numChannels = 1;
    const bitsPerSample = 16;
    const numSamples = Math.floor(sampleRate * durationSeconds);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const chunkSize = 36 + dataSize;

    const buffer = Buffer.alloc(44 + dataSize);

    // RIFF chunk
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(chunkSize, 4);
    buffer.write('WAVE', 8);

    // fmt chunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(byteRate, 28);
    buffer.writeUInt16LE(blockAlign, 32);
    buffer.writeUInt16LE(bitsPerSample, 34);

    // data chunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    // Generate Sine Wave
    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const value = Math.sin(2 * Math.PI * frequency * t);
        const sample = Math.max(-32768, Math.min(32767, value * volume * 32767));
        buffer.writeInt16LE(sample, 44 + i * 2);
    }

    return buffer;
}

console.log(`Generating ${filesToCreate.length} audio files...`);

filesToCreate.forEach(file => {
    const filePath = path.join(audioDir, file);
    let buffer;

    if (file.includes('success')) {
        buffer = createWavBuffer(880, 0.4, 0.5); // Ding
    } else if (file.includes('error')) {
        buffer = createWavBuffer(150, 0.4, 0.5); // Buzz
    } else if (file.includes('_ar')) {
        buffer = createWavBuffer(440, 0.3, 0.5); // Word beep
    } else {
        buffer = createWavBuffer(660, 0.2, 0.3); // Hint beep (higher, softer)
    }

    fs.writeFileSync(filePath, buffer);
});

console.log("Audio generation complete.");
