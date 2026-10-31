import os
import fitz

pdf_path = r"WORKUP_Stage1_Report\WORKUP_Stage1_Report.pdf"
pages_dir = r"WORKUP_Stage1_Report\rendered_pages"
os.makedirs(pages_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages in PDF: {len(doc)}")

for idx, page in enumerate(doc):
    pix = page.get_pixmap(dpi=120)
    page_img_path = os.path.join(pages_dir, f"page_{idx+1:02d}.png")
    pix.save(page_img_path)

print(f"Rendered all {len(doc)} pages to {pages_dir}")
