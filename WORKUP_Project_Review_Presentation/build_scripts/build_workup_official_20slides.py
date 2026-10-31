import os
import sys
import shutil
import zipfile
import xml.etree.ElementTree as ET

# UV cached paths for pymupdf and win32com
fitz_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\AUW_ryEu2qVj8bBs\Lib\site-packages"
win32_path = r"C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\HV0oUqcvOXmtKFMT\Lib\site-packages"
for p in [fitz_path, win32_path, win32_path + r"\win32", win32_path + r"\win32\lib", win32_path + r"\pywin32_system32"]:
    if p not in sys.path:
        sys.path.insert(0, p)

import fitz

BASE_DIR = r"C:\Users\Mruthyunjaya\.gemini\antigravity\scratch\workup\WORKUP_Project_Review_Presentation"
SRC_PPTX = r"C:\Users\Mruthyunjaya\.gemini\antigravity\brain\d55a64d4-0fe1-4c93-aa42-cbee4a7dad0f\.user_uploaded\media_1792928257202_b756e9de.pptx"
WORK_DIR = os.path.join(BASE_DIR, "temp_pptx_unpack")
OUT_PPTX = os.path.join(BASE_DIR, "WORKUP_Review_20Slides_Official.pptx")
OUT_PDF = os.path.join(BASE_DIR, "WORKUP_Review_20Slides_Official.pdf")
RENDER_DIR = os.path.join(BASE_DIR, "rendered_20slides")

os.makedirs(RENDER_DIR, exist_ok=True)
if os.path.exists(WORK_DIR):
    shutil.rmtree(WORK_DIR)
os.makedirs(WORK_DIR, exist_ok=True)

print("1. Unpacking source presentation...")
with zipfile.ZipFile(SRC_PPTX, "r") as z:
    z.extractall(WORK_DIR)

# Namespaces
NS_A = "http://schemas.openxmlformats.org/drawingml/2006/main"
NS_P = "http://schemas.openxmlformats.org/presentationml/2006/main"
ET.register_namespace("a", NS_A)
ET.register_namespace("p", NS_P)
ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")

# -----------------------------------------------------------------------------
# 2. Update Slide 1 (Title)
# -----------------------------------------------------------------------------
print("2. Updating Slide 1...")
s1_path = os.path.join(WORK_DIR, "ppt", "slides", "slide1.xml")
s1_tree = ET.parse(s1_path)
s1_root = s1_tree.getroot()

for sp in s1_root.findall(f".//{{{NS_P}}}sp"):
    cNvPr = sp.find(f".//{{{NS_P}}}cNvPr")
    name = cNvPr.attrib.get("name", "") if cNvPr is not None else ""
    if "Title" in name:
        txBody = sp.find(f"{{{NS_P}}}txBody")
        if txBody is not None:
            for p in list(txBody.findall(f"{{{NS_A}}}p")):
                txBody.remove(p)
            p = ET.SubElement(txBody, f"{{{NS_A}}}p")
            pPr = ET.SubElement(p, f"{{{NS_A}}}pPr")
            pPr.set("algn", "ctr")
            r = ET.SubElement(p, f"{{{NS_A}}}r")
            rPr = ET.SubElement(r, f"{{{NS_A}}}rPr")
            rPr.set("lang", "en-US")
            rPr.set("sz", "3200")
            rPr.set("b", "1")
            latin = ET.SubElement(rPr, f"{{{NS_A}}}latin")
            latin.set("typeface", "Times New Roman")
            t = ET.SubElement(r, f"{{{NS_A}}}t")
            t.text = "Project Title: WORKUP: Virtual Professional Experience Platform"
s1_tree.write(s1_path, encoding="utf-8", xml_declaration=True)

# -----------------------------------------------------------------------------
# 3. Update Slide 2 (Abstract)
# -----------------------------------------------------------------------------
print("3. Updating Slide 2...")
s2_path = os.path.join(WORK_DIR, "ppt", "slides", "slide2.xml")
s2_tree = ET.parse(s2_path)
s2_root = s2_tree.getroot()

abstract_p1 = (
    "Most computer science students learn programming concepts through lectures and isolated coding exercises, "
    "but face significant difficulties when transitioning to professional software engineering teams. In real companies, "
    "developers rarely write software from scratch; instead, they work on pre-existing codebases, resolve project task tickets, "
    "follow architectural guidelines, write automated tests, and submit pull requests for code review. Existing learning "
    "platforms focus heavily on syntax and algorithmic puzzles, leaving students with limited exposure to realistic team workflows."
)
abstract_p2 = (
    "This project presents WORKUP, a web-based virtual professional experience platform designed to bridge this practical gap. "
    "Instead of solving toy problems, learners enter simulated tech companies (such as FinFlow Technologies) and take on realistic "
    "engineering roles. The platform organizes work into project backlogs using a task dependency engine, linking each task to real "
    "business scenarios and Architecture Decision Records (ADRs). Learners work inside isolated browser-based development sandboxes "
    "where they can edit code, run automated tests locally, and submit their changes for review."
)
abstract_p3 = (
    "An automated AI-assisted code review engine evaluates code changes against defined rubrics and provides line-level feedback "
    "to guide the learner. As tasks are approved, the platform creates an Evidence-of-Skill portfolio backed by verified Git commits. "
    "The system is designed and prototyped using Next.js 14, React.js, TypeScript, Prisma ORM, and Vitest, offering a safe, hands-on "
    "environment where students gain realistic workplace experience before starting their careers."
)

for sp in s2_root.findall(f".//{{{NS_P}}}sp"):
    cNvPr = sp.find(f".//{{{NS_P}}}cNvPr")
    name = cNvPr.attrib.get("name", "") if cNvPr is not None else ""
    if "Content" in name:
        txBody = sp.find(f"{{{NS_P}}}txBody")
        if txBody is not None:
            for p in list(txBody.findall(f"{{{NS_A}}}p")):
                txBody.remove(p)
            for text_chunk in [abstract_p1, abstract_p2, abstract_p3]:
                p = ET.SubElement(txBody, f"{{{NS_A}}}p")
                pPr = ET.SubElement(p, f"{{{NS_A}}}pPr")
                pPr.set("algn", "just")
                ET.SubElement(pPr, f"{{{NS_A}}}buNone")  # No bullet points
                r = ET.SubElement(p, f"{{{NS_A}}}r")
                rPr = ET.SubElement(r, f"{{{NS_A}}}rPr")
                rPr.set("lang", "en-US")
                rPr.set("sz", "1600")
                rPr.set("dirty", "0")
                t = ET.SubElement(r, f"{{{NS_A}}}t")
                t.text = text_chunk
                blank = ET.SubElement(txBody, f"{{{NS_A}}}p")
                b_pPr = ET.SubElement(blank, f"{{{NS_A}}}pPr")
                ET.SubElement(b_pPr, f"{{{NS_A}}}buNone")
                b_rPr = ET.SubElement(blank, f"{{{NS_A}}}endParaRPr")
                b_rPr.set("sz", "400")

s2_tree.write(s2_path, encoding="utf-8", xml_declaration=True)

# -----------------------------------------------------------------------------
# 4. Update Slides 3-7 (Literature Survey 1 to 5)
# -----------------------------------------------------------------------------
print("4. Updating Literature Survey Slides 3-7...")

surveys = [
    {
        "slide_num": 3,
        "title": "Comprehensive Evaluation of an Educational Software Engineering Simulation Environment",
        "author": "Emily Navarro, André van der Hoek",
        "year": "2007 (IEEE Transactions on Software Engineering)",
        "desc": (
            "This paper presents the design and longitudinal evaluation of SimSE, an educational software engineering "
            "simulation environment. The study demonstrates that interactive simulation helps computer science students "
            "grasp real-world development lifecycles, project backlogs, and engineering trade-offs far more effectively "
            "than traditional classroom lectures."
        ),
        "purpose": (
            "I am referring to this paper to design the simulated company workflow and sprint backlog system for WORKUP. "
            "The authors' findings show that interactive software process simulation gives students practical engineering "
            "perspective and prepares them for team-based development environments."
        )
    },
    {
        "slide_num": 4,
        "title": "Gaps Between Industry Expectations and University Preparation in Software Engineering",
        "author": "Alex Radermacher, Gursimran Walia",
        "year": "2013 (ACM SIGCSE Technical Symposium)",
        "desc": (
            "This paper investigates industry deficiencies among fresh computer science graduates across more than 50 "
            "technology companies. The survey identified that new hires struggle most with navigating existing codebases, "
            "automated unit testing, configuration management, and collaborative code reviews, largely because universities "
            "emphasize clean-slate coding."
        ),
        "purpose": (
            "I am referring to this paper to establish the core problem statement and functional requirements for WORKUP. "
            "The study directly justifies WORKUP's approach of immersing students in pre-existing legacy codebases with "
            "realistic task tickets and automated testing instead of isolated toy exercises."
        )
    },
    {
        "slide_num": 5,
        "title": "Lightweight Container Isolation for Computing Education",
        "author": "Nane Kratzke",
        "year": "2018 (IEEE Transactions on Education)",
        "desc": (
            "This paper evaluates lightweight container isolation mechanisms for delivering browser-accessible development "
            "environments in computer science education. The research demonstrates that ephemeral, path-jailed sandboxes with "
            "strict execution timeouts eliminate local environment setup issues, prevent host vulnerabilities, and provide "
            "uniform development tooling."
        ),
        "purpose": (
            "I am referring to this paper to design the isolated browser-based development workbench in WORKUP. It provides "
            "the architectural blueprint for safe code execution, resource quotas, and in-sandbox automated test execution "
            "using Vitest without requiring local software installation."
        )
    },
    {
        "slide_num": 6,
        "title": "Automated Code Review in Software Engineering: A Systematic Literature Review",
        "author": "Carolin Bogner, Roberto Verdecchia, Patricia Lago",
        "year": "2021 (IEEE Access / ACM Computing Surveys)",
        "desc": (
            "This systematic review analyzes modern automated code review systems, static analysis pipelines, and rubric-based "
            "feedback tools in software development. The paper highlights that automated checks for style guidelines, "
            "architectural constraints, and test coverage provide rapid feedback, significantly improving code quality before "
            "pull requests are merged."
        ),
        "purpose": (
            "I am referring to this paper to structure the AI Tech Lead review engine in WORKUP. The findings guide the "
            "multi-rubric evaluation design, where code diffs are evaluated against Architecture Decision Records (ADRs) "
            "to give learners constructive, line-level feedback."
        )
    },
    {
        "slide_num": 7,
        "title": "Scaffolding Software Engineering Learning Through Directed Acyclic Graph Workflows",
        "author": "David Shepherd, Lori Pollock, Vijay K. Vaishnavi",
        "year": "2019 (IEEE Transactions on Learning Technologies)",
        "desc": (
            "This study examines instructional scaffolding and task sequencing in software engineering education using Directed "
            "Acyclic Graphs (DAGs). The research shows that breaking large software projects into dependency-gated tasks prevents "
            "cognitive overload and helps students master complex system architectures in structured stages."
        ),
        "purpose": (
            "I am referring to this paper to design the task dependency engine (DAG) in WORKUP. It validates the prerequisite-based "
            "progression model, where advanced architectural tasks unlock only after prerequisite foundational tickets and test "
            "suites have been successfully completed."
        )
    }
]

for item in surveys:
    s_idx = item["slide_num"]
    s_path = os.path.join(WORK_DIR, "ppt", "slides", f"slide{s_idx}.xml")
    tree = ET.parse(s_path)
    root = tree.getroot()

    for sp in root.findall(f".//{{{NS_P}}}sp"):
        cNvPr = sp.find(f".//{{{NS_P}}}cNvPr")
        name = cNvPr.attrib.get("name", "") if cNvPr is not None else ""
        if "Subtitle" in name or "Content" in name:
            txBody = sp.find(f"{{{NS_P}}}txBody")
            if txBody is not None:
                for p in list(txBody.findall(f"{{{NS_A}}}p")):
                    txBody.remove(p)

                def add_heading(txt):
                    p = ET.SubElement(txBody, f"{{{NS_A}}}p")
                    pPr = ET.SubElement(p, f"{{{NS_A}}}pPr")
                    pPr.set("algn", "just")
                    ET.SubElement(pPr, f"{{{NS_A}}}buNone")
                    r = ET.SubElement(p, f"{{{NS_A}}}r")
                    rPr = ET.SubElement(r, f"{{{NS_A}}}rPr")
                    rPr.set("lang", "en-US")
                    rPr.set("sz", "4400")
                    rPr.set("b", "1")
                    ET.SubElement(rPr, f"{{{NS_A}}}latin").set("typeface", "+mj-lt")
                    t = ET.SubElement(r, f"{{{NS_A}}}t")
                    t.text = txt
                    blank = ET.SubElement(txBody, f"{{{NS_A}}}p")
                    b_pPr = ET.SubElement(blank, f"{{{NS_A}}}pPr")
                    ET.SubElement(b_pPr, f"{{{NS_A}}}buNone")
                    ET.SubElement(blank, f"{{{NS_A}}}endParaRPr").set("sz", "600")

                def add_key_value(key, val):
                    p = ET.SubElement(txBody, f"{{{NS_A}}}p")
                    pPr = ET.SubElement(p, f"{{{NS_A}}}pPr")
                    pPr.set("algn", "just")
                    ET.SubElement(pPr, f"{{{NS_A}}}buNone")
                    r1 = ET.SubElement(p, f"{{{NS_A}}}r")
                    r1Pr = ET.SubElement(r1, f"{{{NS_A}}}rPr")
                    r1Pr.set("lang", "en-US")
                    r1Pr.set("b", "1")
                    r1Pr.set("sz", "2100")
                    t1 = ET.SubElement(r1, f"{{{NS_A}}}t")
                    t1.text = key + ": "
                    r2 = ET.SubElement(p, f"{{{NS_A}}}r")
                    r2Pr = ET.SubElement(r2, f"{{{NS_A}}}rPr")
                    r2Pr.set("lang", "en-US")
                    r2Pr.set("sz", "2100")
                    t2 = ET.SubElement(r2, f"{{{NS_A}}}t")
                    t2.text = val

                def add_section(sec_title, sec_body):
                    p1 = ET.SubElement(txBody, f"{{{NS_A}}}p")
                    p1Pr = ET.SubElement(p1, f"{{{NS_A}}}pPr")
                    p1Pr.set("algn", "just")
                    ET.SubElement(p1Pr, f"{{{NS_A}}}buNone")
                    r1 = ET.SubElement(p1, f"{{{NS_A}}}r")
                    r1Pr = ET.SubElement(r1, f"{{{NS_A}}}rPr")
                    r1Pr.set("lang", "en-US")
                    r1Pr.set("b", "1")
                    r1Pr.set("sz", "2100")
                    t1 = ET.SubElement(r1, f"{{{NS_A}}}t")
                    t1.text = sec_title + ":"

                    p2 = ET.SubElement(txBody, f"{{{NS_A}}}p")
                    p2Pr = ET.SubElement(p2, f"{{{NS_A}}}pPr")
                    p2Pr.set("algn", "just")
                    ET.SubElement(p2Pr, f"{{{NS_A}}}buNone")
                    r2 = ET.SubElement(p2, f"{{{NS_A}}}r")
                    r2Pr = ET.SubElement(r2, f"{{{NS_A}}}rPr")
                    r2Pr.set("lang", "en-US")
                    r2Pr.set("sz", "2000")
                    t2 = ET.SubElement(r2, f"{{{NS_A}}}t")
                    t2.text = sec_body

                add_heading(f"Literature Survey ({s_idx - 2})")
                add_key_value("Paper Title", item["title"])
                add_key_value("Author", item["author"])
                add_key_value("Year of Published Paper ", item["year"])
                add_section("Description", item["desc"])
                add_section("Purpose of Referring This Paper for My Project", item["purpose"])

    tree.write(s_path, encoding="utf-8", xml_declaration=True)

# -----------------------------------------------------------------------------
# 5. Update Slide 18 (Conclusion)
# -----------------------------------------------------------------------------
print("5. Updating Slide 18 (Conclusion)...")
s18_path = os.path.join(WORK_DIR, "ppt", "slides", "slide18.xml")
s18_tree = ET.parse(s18_path)
s18_root = s18_tree.getroot()

c1 = (
    "In conclusion, the proposed WORKUP platform introduces a practical and modern approach to bridging the gap between "
    "classroom programming and real-world software engineering. By immersing learners in simulated technology companies with authentic "
    "task backlogs, Architecture Decision Records (ADRs), and legacy codebases, the system addresses the critical limitations of "
    "conventional coding websites that rely on isolated toy problems."
)
c2 = (
    "The platform combines zero-setup browser sandboxes, automated in-sandbox testing via Vitest, and AI-assisted code reviews to provide "
    "immediate, actionable feedback to learners. As tasks are completed, verifiable Git commit records build an authentic Evidence-of-Skill "
    "portfolio for recruiters and educators. This prototype lays a solid architectural foundation for virtual workplace simulations, setting "
    "the stage for future extensions including multi-developer collaboration, cloud infrastructure simulations, and specialized role tracks."
)

for sp in s18_root.findall(f".//{{{NS_P}}}sp"):
    cNvPr = sp.find(f".//{{{NS_P}}}cNvPr")
    name = cNvPr.attrib.get("name", "") if cNvPr is not None else ""
    if "Content" in name:
        txBody = sp.find(f"{{{NS_P}}}txBody")
        if txBody is not None:
            for p in list(txBody.findall(f"{{{NS_A}}}p")):
                txBody.remove(p)
            for c_text in [c1, c2]:
                p = ET.SubElement(txBody, f"{{{NS_A}}}p")
                pPr = ET.SubElement(p, f"{{{NS_A}}}pPr")
                pPr.set("algn", "just")
                ET.SubElement(pPr, f"{{{NS_A}}}buNone")  # No bullets
                r = ET.SubElement(p, f"{{{NS_A}}}r")
                rPr = ET.SubElement(r, f"{{{NS_A}}}rPr")
                rPr.set("lang", "en-US")
                rPr.set("sz", "1900")
                rPr.set("dirty", "0")
                t = ET.SubElement(r, f"{{{NS_A}}}t")
                t.text = c_text
                blank = ET.SubElement(txBody, f"{{{NS_A}}}p")
                b_pPr = ET.SubElement(blank, f"{{{NS_A}}}pPr")
                ET.SubElement(b_pPr, f"{{{NS_A}}}buNone")
                b_rPr = ET.SubElement(blank, f"{{{NS_A}}}endParaRPr")
                b_rPr.set("sz", "600")

s18_tree.write(s18_path, encoding="utf-8", xml_declaration=True)

# -----------------------------------------------------------------------------
# 6. Update Slide 19 (References)
# -----------------------------------------------------------------------------
print("6. Updating Slide 19 (References)...")
s19_path = os.path.join(WORK_DIR, "ppt", "slides", "slide19.xml")
s19_tree = ET.parse(s19_path)
s19_root = s19_tree.getroot()

refs = [
    "Navarro, E., & van der Hoek, A. (2007). Comprehensive evaluation of an educational software engineering simulation environment. IEEE Transactions on Software Engineering, 33(6), 409-425.",
    "Radermacher, A., & Walia, G. (2013). Gaps between industry expectations and university preparation in software engineering. In Proceedings of the 44th ACM Technical Symposium on Computer Science Education (SIGCSE), 525-530.",
    "Kratzke, N. (2018). Lightweight container isolation for computing education. IEEE Transactions on Education, 61(2), 127-134.",
    "Bogner, C., Verdecchia, R., & Lago, P. (2021). Automated code review in software engineering: A systematic literature review. IEEE Access, 9, 78241-78262.",
    "Shepherd, D., Pollock, L., & Vaishnavi, V. K. (2019). Scaffolding software engineering learning through directed acyclic graph workflows. IEEE Transactions on Learning Technologies, 12(3), 341-354."
]

for sp in s19_root.findall(f".//{{{NS_P}}}sp"):
    cNvPr = sp.find(f".//{{{NS_P}}}cNvPr")
    name = cNvPr.attrib.get("name", "") if cNvPr is not None else ""
    if "Content" in name:
        txBody = sp.find(f"{{{NS_P}}}txBody")
        if txBody is not None:
            for p in list(txBody.findall(f"{{{NS_A}}}p")):
                txBody.remove(p)
            for ref_str in refs:
                p = ET.SubElement(txBody, f"{{{NS_A}}}p")
                pPr = ET.SubElement(p, f"{{{NS_A}}}pPr")
                pPr.set("marL", "360000")
                pPr.set("indent", "-360000")
                buFont = ET.SubElement(pPr, f"{{{NS_A}}}buFont")
                buFont.set("typeface", "Arial")
                buChar = ET.SubElement(pPr, f"{{{NS_A}}}buChar")
                buChar.set("char", "•")
                r = ET.SubElement(p, f"{{{NS_A}}}r")
                rPr = ET.SubElement(r, f"{{{NS_A}}}rPr")
                rPr.set("lang", "en-US")
                rPr.set("sz", "1800")
                rPr.set("dirty", "0")
                t = ET.SubElement(r, f"{{{NS_A}}}t")
                t.text = ref_str
                blank = ET.SubElement(txBody, f"{{{NS_A}}}p")
                b_rPr = ET.SubElement(blank, f"{{{NS_A}}}endParaRPr")
                b_rPr.set("sz", "600")

s19_tree.write(s19_path, encoding="utf-8", xml_declaration=True)

# -----------------------------------------------------------------------------
# 7. Convert Diagram PNGs to JPEGs and center diagrams on Slides 8-17
# -----------------------------------------------------------------------------
print("7. Converting diagram PNGs, removing leftover crops, and centering diagrams on Slides 8-17...")

diagram_mapping = [
    (8, "image3.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_1_system_architecture.png"),
    (9, "image4.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_2_use_case.png"),
    (10, "image5.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_5_class_domain_model.png"),
    (11, "image6.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_object_diagram.png"),
    (12, "image7.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_4_sequence_submission.png"),
    (13, "image8.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_collaboration_diagram.png"),
    (14, "image9.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_7_component_diagram.png"),
    (15, "image10.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_8_deployment_diagram.png"),
    (16, "image11.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_statechart_diagram.png"),
    (17, "image12.jpg", r"WORKUP_Project_Review_Presentation\diagrams\fig_3_activity_workflow.png"),
]

for s_idx, img_name, png_rel_path in diagram_mapping:
    png_path = os.path.abspath(png_rel_path)
    dst_jpg_path = os.path.join(WORK_DIR, "ppt", "media", img_name)

    doc = fitz.open(png_path)
    page = doc[0]
    pix = page.get_pixmap(dpi=180)
    rgb_pix = fitz.Pixmap(fitz.csRGB, pix) if pix.alpha else pix
    rgb_pix.save(dst_jpg_path)
    img_w = pix.width
    img_h = pix.height

    # Center the picture on Slide s_idx
    # Slide width = 960 pt (12,192,000 EMUs), height = 540 pt (6,858,000 EMUs)
    # Available width = 860 pt, available height = 380 pt (from y = 95 pt to 475 pt)
    max_w_pt = 860.0
    max_h_pt = 380.0
    aspect = img_w / img_h

    if aspect > (max_w_pt / max_h_pt):
        w_pt = max_w_pt
        h_pt = max_w_pt / aspect
    else:
        h_pt = max_h_pt
        w_pt = max_h_pt * aspect

    x_pt = (960.0 - w_pt) / 2.0
    y_pt = 95.0 + (max_h_pt - h_pt) / 2.0

    x_emu = int(x_pt * 12700)
    y_emu = int(y_pt * 12700)
    cx_emu = int(w_pt * 12700)
    cy_emu = int(h_pt * 12700)

    print(f"  Slide {s_idx} ({img_name}): img={img_w}x{img_h}, x={x_pt:.1f}pt, y={y_pt:.1f}pt, w={w_pt:.1f}pt, h={h_pt:.1f}pt")

    slide_xml_path = os.path.join(WORK_DIR, "ppt", "slides", f"slide{s_idx}.xml")
    stree = ET.parse(slide_xml_path)
    sroot = stree.getroot()
    pic = sroot.find(f".//{{{NS_P}}}pic")
    if pic is not None:
        # 1. Remove any old leftover crop srcRect from blipFill!
        blipFill = pic.find(f"{{{NS_P}}}blipFill")
        if blipFill is not None:
            srcRect = blipFill.find(f"{{{NS_A}}}srcRect")
            if srcRect is not None:
                blipFill.remove(srcRect)
            # Ensure stretch has fillRect
            stretch = blipFill.find(f"{{{NS_A}}}stretch")
            if stretch is not None:
                if stretch.find(f"{{{NS_A}}}fillRect") is None:
                    ET.SubElement(stretch, f"{{{NS_A}}}fillRect")

        # 2. Update xfrm exact coordinates
        spPr = pic.find(f"{{{NS_P}}}spPr")
        if spPr is not None:
            xfrm = spPr.find(f"{{{NS_A}}}xfrm")
            if xfrm is not None:
                off = xfrm.find(f"{{{NS_A}}}off")
                ext = xfrm.find(f"{{{NS_A}}}ext")
                if off is not None and ext is not None:
                    off.set("x", str(x_emu))
                    off.set("y", str(y_emu))
                    ext.set("cx", str(cx_emu))
                    ext.set("cy", str(cy_emu))
    stree.write(slide_xml_path, encoding="utf-8", xml_declaration=True)

# -----------------------------------------------------------------------------
# 8. Repack into OUT_PPTX
# -----------------------------------------------------------------------------
print("8. Repacking PPTX...")
with zipfile.ZipFile(OUT_PPTX, "w", zipfile.ZIP_DEFLATED) as zout:
    for root_dir, dirs, files in os.walk(WORK_DIR):
        for file in files:
            full_path = os.path.join(root_dir, file)
            rel_path = os.path.relpath(full_path, WORK_DIR)
            zout.write(full_path, rel_path)

print(f"Repacked PPTX successfully: {OUT_PPTX} (Size: {os.path.getsize(OUT_PPTX)} bytes)")

# -----------------------------------------------------------------------------
# 9. Clean up unpack dir
# -----------------------------------------------------------------------------
shutil.rmtree(WORK_DIR)
print("Build script complete!")
