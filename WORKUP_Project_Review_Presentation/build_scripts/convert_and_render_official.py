import os
import sys

# Add UV cache paths for win32com and pymupdf
win32_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\HV0oUqcvOXmtKFMT\Lib\site-packages"
fitz_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\AUW_ryEu2qVj8bBs\Lib\site-packages"

for p in [win32_path, win32_path + r"\win32", win32_path + r"\win32\lib", win32_path + r"\pywin32_system32", fitz_path]:
    if p not in sys.path:
        sys.path.insert(0, p)

import win32com.client
import fitz

BASE_DIR = r"C:\Users\Mruthyunjaya\.gemini\antigravity\scratch\workup\WORKUP_Project_Review_Presentation"
pptx_path = os.path.join(BASE_DIR, "WORKUP_Official_Review_Format.pptx")
pdf_path = os.path.join(BASE_DIR, "WORKUP_Official_Review_Format.pdf")
output_dir = os.path.join(BASE_DIR, "rendered_official_slides")

os.makedirs(output_dir, exist_ok=True)

print("Starting PowerPoint export to PDF...")
ppt = win32com.client.Dispatch("PowerPoint.Application")
try:
    pres = ppt.Presentations.Open(os.path.abspath(pptx_path), WithWindow=False)
    # 32 = ppSaveAsPDF
    pres.SaveAs(os.path.abspath(pdf_path), 32)
    pres.Close()
    print(f"Exported PDF successfully to: {pdf_path}")
finally:
    ppt.Quit()

print("Rendering PDF pages to PNG using PyMuPDF...")
doc = fitz.open(pdf_path)
print(f"Total pages in PDF: {len(doc)}")
for idx, page in enumerate(doc):
    # Render at 2.0 zoom factor (approx 144 DPI) for crisp readable text
    mat = fitz.Matrix(2.0, 2.0)
    pix = page.get_pixmap(matrix=mat)
    out_file = os.path.join(output_dir, f"slide_{idx+1:02d}.png")
    pix.save(out_file)
    print(f"Saved {out_file} ({pix.width}x{pix.height})")

print("All slides rendered successfully!")
