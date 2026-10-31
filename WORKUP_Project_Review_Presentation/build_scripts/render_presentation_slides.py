import os
import sys

base = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\AUW_ryEu2qVj8bBs\Lib\site-packages"
sys.path.insert(0, base)

import fitz

pdf_path = r"WORKUP_Project_Review_Presentation\WORKUP_Project_Review.pdf"
slides_dir = r"WORKUP_Project_Review_Presentation\rendered_slides"
os.makedirs(slides_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total slides in PDF: {len(doc)}")

for idx, page in enumerate(doc):
    pix = page.get_pixmap(dpi=120)
    slide_img_path = os.path.join(slides_dir, f"slide_{idx+1:02d}.png")
    pix.save(slide_img_path)

print(f"Successfully rendered all {len(doc)} slides to {slides_dir}")
