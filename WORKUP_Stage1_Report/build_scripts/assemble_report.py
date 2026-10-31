import os
import sys
import time

print("Assembling complete WORKUP Major Project Stage-I Report...")

from write_full_report import doc, docx_path
from report_part1_frontmatter import build_front_matter
from report_part2_chapters1_2 import build_chapter_1, build_chapter_2
from report_part3_chapter3 import build_chapter_3
from report_part4_chapter4 import build_chapter_4
from report_part5_chapters5_6 import build_chapter_5, build_chapter_6, build_back_matter

print("1. Building Front Matter...")
build_front_matter()

print("2. Building Chapter 1 (Introduction)...")
build_chapter_1()

print("3. Building Chapter 2 (Literature Survey)...")
build_chapter_2()

print("4. Building Chapter 3 (Requirements & Methodology)...")
build_chapter_3()

print("5. Building Chapter 4 (System Design & UML Modeling with 9 Diagrams)...")
build_chapter_4()

print("6. Building Chapter 5 (Modules & Functional Description)...")
build_chapter_5()

print("7. Building Chapter 6 (Implementation Plan & Outcomes)...")
build_chapter_6()

print("8. Building Conclusion, References & Appendices...")
build_back_matter()

print(f"Saving DOCX to {docx_path}...")
doc.save(docx_path)
print(f"Successfully generated: {docx_path} (Size: {os.path.getsize(docx_path)} bytes)")
