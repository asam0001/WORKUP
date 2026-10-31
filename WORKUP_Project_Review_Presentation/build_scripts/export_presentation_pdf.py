import os
import sys

base = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\HV0oUqcvOXmtKFMT\Lib\site-packages"
sys.path.insert(0, base)
sys.path.insert(0, base + r"\win32")
sys.path.insert(0, base + r"\win32\lib")
sys.path.insert(0, base + r"\pywin32_system32")

import win32com.client

pptx_path = os.path.abspath(r"WORKUP_Project_Review_Presentation\WORKUP_Project_Review.pptx")
pdf_path = os.path.abspath(r"WORKUP_Project_Review_Presentation\WORKUP_Project_Review.pdf")

print(f"Opening PowerPoint to export {pptx_path} to PDF...")
ppt = win32com.client.Dispatch("PowerPoint.Application")
try:
    pres = ppt.Presentations.Open(pptx_path, WithWindow=False)
    # ppSaveAsPDF = 32
    pres.SaveAs(pdf_path, 32)
    pres.Close()
    print(f"Successfully converted to PDF: {pdf_path}")
    print(f"PDF size: {os.path.getsize(pdf_path)} bytes")
finally:
    try:
        ppt.Quit()
    except Exception:
        pass
