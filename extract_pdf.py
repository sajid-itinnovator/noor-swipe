import pypdf

pdf_path = r"e:\AI_Projects\Arabic_Learning\noor-swipe\C-1_125_Words_English (1).pdf"

try:
    reader = pypdf.PdfReader(pdf_path)
    print(f"Found {len(reader.pages)} pages.")
    
    with open("pdf_out.txt", "w", encoding="utf-8") as f:
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            f.write(text + "\n")
            print(f"Processed page {i+1}")
            
    print("Saved pdf_out.txt options")
except Exception as e:
    print(f"Error reading PDF: {e}")
