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
    print(f'Pres opened successfully! Slide count: {pres.Slides.Count}')
    for i in range(1, pres.Slides.Count + 1):
        sl = pres.Slides(i)
        txts = []
        for sh in sl.Shapes:
            if sh.HasTextFrame and sh.TextFrame.HasText:
                txts.append(sh.TextFrame.TextRange.Text.replace('\r', ' ').replace('\n', ' '))
        print(f'Slide {i}: {" | ".join(txts)[:120]}')
    pres.Close()
finally:
    ppt.Quit()
