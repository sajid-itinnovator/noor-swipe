import re
import json

def is_arabic_char(char):
    # Arabic, Supplement, Extended A, Presentation Forms A, Presentation Forms B
    codepoint = ord(char)
    return (0x0600 <= codepoint <= 0x06FF) or \
           (0x0750 <= codepoint <= 0x077F) or \
           (0x08A0 <= codepoint <= 0x08FF) or \
           (0xFB50 <= codepoint <= 0xFDFF) or \
           (0xFE70 <= codepoint <= 0xFEFF)

def has_arabic(text):
    return any(is_arabic_char(c) for c in text)

def parse_pdf_text():
    with open("pdf_out.txt", "r", encoding="utf-8") as f:
        content = f.read()

    # Split by the page marker
    matches = list(re.finditer(r'\n(\d+)\s*of\s*125\n', content))
    
    words = []
    
    for i in range(len(matches)):
        start_idx = matches[i].end()
        end_idx = matches[i+1].start() if i + 1 < len(matches) else len(content)
        
        section_text = content[start_idx:end_idx]
        word_id = matches[i].group(1)
        
        lines = [l.strip() for l in section_text.split('\n') if l.strip()]
        
        arabic = ""
        english_line = ""
        
        candidate_arabic_lines = []
        candidate_english_lines = []
        
        for line in lines:
            # Filters
            if "www.understandquran.com" in line: continue
            if "transliteration" in line: continue
            if "Progress Bar" in line: continue
            if "Noun" in line or "Verb" in line or "Particle" in line: continue
            if "Occurs" in line: continue
            if "times in the Qur'an" in line: continue
            if "Root:" in line: continue # Explicit ignore
            if "Compiled by" in line: continue
            if re.match(r'^\d+$', line): continue 
            if "%" in line: continue
            
            # Identify line type
            has_ar = has_arabic(line)
            has_en = bool(re.search(r'[a-zA-Z]', line))
            
            if "with di" in line and "erent" in line: continue # "with different combinations"
            if "combina" in line and "ons" in line: continue
            
            if has_ar and not has_en:
                 candidate_arabic_lines.append(line)
            elif has_en and not has_ar:
                 if "Qur’an" not in line and "Quran" not in line and "Godexcept" not in line:
                     candidate_english_lines.append(line)
            elif has_ar and has_en:
                 # Mixed line - split it!
                 # usually Arabic is on one side, English on other.
                 # Extract all arabic parts
                 ar_part = "".join([c for c in line if is_arabic_char(c) or c.isspace()]).strip()
                 if ar_part: candidate_arabic_lines.append(ar_part)
                 
                 # Extract all english parts
                 en_part = "".join([c for c in line if not is_arabic_char(c)]).strip()
                 # Cleanup noise symbols
                 en_part = re.sub(r'[^\w\s\-\’\']', '', en_part).strip()
                 if en_part and len(en_part) > 2:
                     candidate_english_lines.append(en_part)

        # Select best Arabic candidate
        # Usually the shortest one that isn't empty?
        # Or unique characters?
        cleaned_candidates = []
        for cand in candidate_arabic_lines:
             # Remove punctuation
             clean = "".join([c for c in cand if is_arabic_char(c) or c.isspace()])
             if len(clean.strip()) > 0:
                 cleaned_candidates.append(cand) # Keep original for now
        
        if cleaned_candidates:
             # Pick the shortest one? often the word itself is short.
             # But sometimes "Allah" is short, "Al-lah" is english.
             arabic = min(cleaned_candidates, key=len)
             
             # Clean it
             arabic = "".join([c for c in arabic if is_arabic_char(c) or c.isspace()]).strip()
        
        # Select best English candidate
        # Look for "meaning phonics"
        for cand in candidate_english_lines:
            if not english_line:
                 english_line = cand
            elif len(cand) < len(english_line):
                 # Prefer shorter?
                 pass

        meaning = "???"
        phonics = "???"
        
        if english_line:
            # Handle "Allah Al-lah"
            # Handle "he huwa"
            parts = english_line.split()
            if len(parts) >= 2:
                phonics = parts[-1]
                meaning = " ".join(parts[:-1])
            else:
                meaning = english_line
                phonics = english_line

        words.append({
            "id": word_id,
            "arabic": arabic,
            "meaning_en": meaning,
            "phonics": phonics,
            "memoryLevel": 0
        })

    with open("extracted_vocabulary.json", "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(words)} words.")

if __name__ == "__main__":
    parse_pdf_text()
