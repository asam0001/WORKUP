import os
import sys

win32_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\HV0oUqcvOXmtKFMT\Lib\site-packages"
fitz_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\AUW_ryEu2qVj8bBs\Lib\site-packages"
for p in [win32_path, win32_path + r"\win32", win32_path + r"\win32\lib", win32_path + r"\pywin32_system32", fitz_path]:
    if p not in sys.path:
        sys.path.insert(0, p)

import win32com.client
import fitz

BASE_DIR = r"C:\Users\Mruthyunjaya\.gemini\antigravity\scratch\workup\WORKUP_Project_Review_Presentation"
PPTX_PATH = os.path.join(BASE_DIR, "WORKUP_Review_20Slides_Official.pptx")
PDF_PATH = os.path.join(BASE_DIR, "WORKUP_Review_20Slides_Official.pdf")
RENDER_DIR = os.path.join(BASE_DIR, "rendered_20slides")

os.makedirs(RENDER_DIR, exist_ok=True)

print("Starting PowerPoint export to PDF...")
ppt = win32com.client.Dispatch("PowerPoint.Application")
try:
    pres = ppt.Presentations.Open(os.path.abspath(PPTX_PATH), WithWindow=False)
    # 32 = ppSaveAsPDF
    pres.SaveAs(os.path.abspath(PDF_PATH), 32)
    pres.Close()
    print(f"Exported PDF successfully to: {PDF_PATH}")
finally:
    ppt.Quit()

print("Rendering PDF pages to PNG using PyMuPDF...")
doc = fitz.open(PDF_PATH)
print(f"Total pages in PDF: {len(doc)}")
for idx, page in enumerate(doc):
    mat = fitz.Matrix(2.0, 2.0)  # High resolution (1920x1080)
    pix = page.get_pixmap(matrix=mat)
    out_file = os.path.join(RENDER_DIR, f"slide_{idx+1:02d}.png")
    pix.save(out_file)
    print(f"Saved {out_file} ({pix.width}x{pix.height})")

print("All 20 slides rendered successfully!")
