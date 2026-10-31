import os
import sys

base_pkg = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\OAAt0ANKOFoe2tgg\Lib\site-packages"
if base_pkg not in sys.path:
    sys.path.insert(0, base_pkg)

from pptx import Presentation
from pptx.util import Inches

from slides_part1_frontmatter import (
    build_slide_1, build_slide_2, build_slide_3,
    build_slide_4, build_slide_5, build_slide_6
)
from slides_part2_literature import (
    build_slide_7, build_slide_8, build_slide_9,
    build_slide_10, build_slide_11, build_slide_12
)
from slides_part3_design import (
    build_slide_13, build_slide_14, build_slide_15,
    build_slide_16, build_slide_17
)
from slides_part4_outcomes import (
    build_slide_18, build_slide_19, build_slide_20,
    build_slide_21, build_slide_22, build_slide_23
)

output_dir = os.path.abspath("WORKUP_Project_Review_Presentation")
os.makedirs(output_dir, exist_ok=True)
pptx_path = os.path.join(output_dir, "WORKUP_Project_Review.pptx")

print("Initializing Presentation with 16:9 widescreen layout...")
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

print("Building Part 1 (Slides 1 to 6)...")
build_slide_1(prs)
build_slide_2(prs)
build_slide_3(prs)
build_slide_4(prs)
build_slide_5(prs)
build_slide_6(prs)

print("Building Part 2 (Slides 7 to 12)...")
build_slide_7(prs)
build_slide_8(prs)
build_slide_9(prs)
build_slide_10(prs)
build_slide_11(prs)
build_slide_12(prs)

print("Building Part 3 (Slides 13 to 17)...")
build_slide_13(prs)
build_slide_14(prs)
build_slide_15(prs)
build_slide_16(prs)
build_slide_17(prs)

print("Building Part 4 (Slides 18 to 23)...")
build_slide_18(prs)
build_slide_19(prs)
build_slide_20(prs)
build_slide_21(prs)
build_slide_22(prs)
build_slide_23(prs)

print(f"Total slides added: {len(prs.slides)}")
print(f"Saving to {pptx_path}...")
prs.save(pptx_path)

file_size = os.path.getsize(pptx_path)
print(f"Successfully generated: {pptx_path} (Size: {file_size} bytes)")
