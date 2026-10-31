import os, sys

win32_path = r'C:\Users\Mruthyunjaya\AppData\Local\uv\cache\archive-v0\HV0oUqcvOXmtKFMT\Lib\site-packages'
for p in [win32_path, win32_path + r'\win32', win32_path + r'\win32\lib', win32_path + r'\pywin32_system32']:
    if p not in sys.path:
        sys.path.insert(0, p)
import win32com.client

ppt = win32com.client.Dispatch('PowerPoint.Application')
f2 = os.path.abspath(r'C:\Users\Mruthyunjaya\.gemini\antigravity\brain\d55a64d4-0fe1-4c93-aa42-cbee4a7dad0f\.user_uploaded\media_1792928257202_b756e9de.pptx')
try:
    pres = ppt.Presentations.Open(f2, WithWindow=False)
    for s_idx in [1, 2, 3, 4, 5, 6, 7, 8, 18, 19]:
        sl = pres.Slides(s_idx)
        print(f"\n================ SLIDE {s_idx} ================")
        for sh in sl.Shapes:
            if sh.HasTextFrame and sh.TextFrame.HasText:
                print(f"Shape '{sh.Name}':")
                for p_idx in range(1, sh.TextFrame.TextRange.Paragraphs().Count + 1):
                    p = sh.TextFrame.TextRange.Paragraphs(p_idx)
                    p_txt = p.Text.replace('\r', '').replace('\n', '')
                    if p_txt.strip():
                        print(f"  P{p_idx}: font={p.Font.Name}, size={p.Font.Size}, bold={p.Font.Bold} | '{p_txt}'")
    pres.Close()
finally:
    ppt.Quit()
