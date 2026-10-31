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
    for s_idx in range(8, 18):
        sl = pres.Slides(s_idx)
        print(f"\n--- Slide {s_idx}: {sl.Shapes(1).TextFrame.TextRange.Text.strip() if sl.Shapes(1).HasTextFrame else 'No title'} ---")
        for sh in sl.Shapes:
            print(f"  Shape: name='{sh.Name}', type={sh.Type}, left={sh.Left:.1f}, top={sh.Top:.1f}, width={sh.Width:.1f}, height={sh.Height:.1f}")
    pres.Close()
finally:
    ppt.Quit()
