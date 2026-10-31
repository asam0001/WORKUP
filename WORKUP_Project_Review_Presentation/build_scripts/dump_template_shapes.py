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
    print(f'Width: {pres.PageSetup.SlideWidth}, Height: {pres.PageSetup.SlideHeight}')
    for i in range(1, pres.Slides.Count + 1):
        sl = pres.Slides(i)
        print(f'\n--- SLIDE {i} (Shapes: {sl.Shapes.Count}) ---')
        for s_idx, sh in enumerate(sl.Shapes):
            sh_info = f'  Shape {s_idx+1}: name="{sh.Name}", type={sh.Type}, left={sh.Left:.1f}, top={sh.Top:.1f}, width={sh.Width:.1f}, height={sh.Height:.1f}'
            if sh.HasTextFrame and sh.TextFrame.HasText:
                tr = sh.TextFrame.TextRange
                font_name = tr.Font.Name
                font_size = tr.Font.Size
                text_preview = tr.Text.replace('\r', '\\r').replace('\n', '\\n')[:80]
                sh_info += f', font={font_name} {font_size}pt, text="{text_preview}"'
            print(sh_info)
    pres.Close()
finally:
    ppt.Quit()
