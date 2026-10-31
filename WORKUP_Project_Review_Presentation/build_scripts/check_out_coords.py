import zipfile
import xml.etree.ElementTree as ET

z = zipfile.ZipFile(r'WORKUP_Project_Review_Presentation\WORKUP_Review_20Slides_Official.pptx')
ns = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
for s in [8, 10, 11, 13, 16]:
    root = ET.fromstring(z.read(f'ppt/slides/slide{s}.xml'))
    pic = root.find('.//p:pic', ns)
    off = pic.find('.//a:off', ns)
    ext = pic.find('.//a:ext', ns)
    x = int(off.attrib['x']) / 12700
    y = int(off.attrib['y']) / 12700
    cx = int(ext.attrib['cx']) / 12700
    cy = int(ext.attrib['cy']) / 12700
    print(f"Slide {s}: x={x:.1f}pt, y={y:.1f}pt, cx={cx:.1f}pt, cy={cy:.1f}pt")
