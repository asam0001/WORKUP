import os
import sys
import win32com.client

report_dir = os.path.abspath("WORKUP_Stage1_Report")
docx_path = os.path.join(report_dir, "WORKUP_Stage1_Report.docx")
pdf_path = os.path.join(report_dir, "WORKUP_Stage1_Report.pdf")

print(f"Opening Word to convert {docx_path} to PDF...")

word = win32com.client.Dispatch("Word.Application")
word.Visible = False

try:
    doc = word.Documents.Open(docx_path)
    # FileFormat=17 is wdFormatPDF
    doc.SaveAs(pdf_path, FileFormat=17)
    doc.Close()
    print(f"Successfully converted to PDF: {pdf_path}")
    print(f"PDF size: {os.path.getsize(pdf_path)} bytes")
except Exception as e:
    print(f"Error during Word PDF conversion: {e}")
finally:
    try:
        word.Quit()
    except Exception:
        pass
