"""Write the editable SVG actor flow; render with headless Chrome at 1600x720."""
from pathlib import Path
from html import escape
ROOT=Path(__file__).resolve().parent
p=['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="720" viewBox="0 0 1600 720">','<defs><marker id="a" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7" fill="#49636c"/></marker></defs>','<style>text{font-family:Arial,sans-serif;fill:#163b50}.path{fill:none;stroke:#49636c;stroke-width:2.5;marker-end:url(#a)}.label{font-size:22px;paint-order:stroke;stroke:white;stroke-width:5px;stroke-linejoin:round}</style>']
for i,(a,b) in enumerate([('VISITOR','Public / private pass'),('RECEPTION','Authenticated staff'),('SERVER','Validation + audit'),('DEVICES','Reader / display')]):
 y=i*175;p.append(f'<rect x="0" y="{y}" width="1600" height="175" fill="{["#eef5f3","#f6f8fa"][i%2]}"/><text x="12" y="{y+60}" font-size="22" font-weight="bold">{a}</text><text x="12" y="{y+88}" font-size="16">{b}</text>')
def line(d,label='',x=0,y=0,dash=False):
 p.append(f'<path class="path" d="{d}" {"stroke-dasharray=\"7 5\"" if dash else ""}/>')
 if label:p.append(f'<text class="label" x="{x}" y="{y}">{escape(label)}</text>')
def box(x,y,w,a,b,fill='white'):
 p.append(f'<rect x="{x}" y="{y}" width="{w}" height="90" rx="12" fill="{fill}" stroke="#8ba7ac" stroke-width="2"/>')
 for dy,t,weight in [(35,a,'bold'),(65,b,'normal')]:p.append(f'<text x="{x+w/2}" y="{y+dy}" text-anchor="middle" font-size="22" font-weight="{weight}">{escape(t)}</text>')
line('M295 130 V390')
line('M410 435 H575 V305')
line('M575 215 V130','Reject',585,165)
line('M690 260 H855 V390','Approve',730,245)
line('M855 390 V130')
line('M970 85 H1000 V610 H1020','Present QR',870,535)
line('M1135 565 V480','Scan',1145,530)
line('M1250 435 H1275 V610 H1300','Yes',1282,510)
line('M1250 410 H1275 V85 H1300','No',1282,365)
line('M1437 130 V215','Ask staff',1447,178)
line('M1437 305 V565','Manual release',1350,495,True)
line('M970 65 H1135 V215','Later',1145,158,True)
line('M1135 305 V390','Blocks QR',1145,350,True)
box(180,40,230,'1  Request visit','Notice acknowledged')
box(460,40,230,'Await decision','Rejected: no QR')
box(740,40,230,'5  Private QR','View / download')
box(1300,40,275,'Refusal / assistance','New request if needed')
box(460,215,230,'3  Review visit','Approve / reject')
box(1020,215,230,'Confirm revocation','QR hidden; keep history')
box(1300,215,275,'Staff decision','Decline / new / manual')
box(180,390,230,'2  Save pending visit','No entry permission')
box(740,390,230,'4  Issue pass','Destination + time')
box(1020,390,230,'7  Validate QR','Credential + permission')
box(1020,565,230,'6  Camera reader','Decode locally')
box(1300,565,275,'8  Open 8s, then relock','QR / manual audit counts','#dcfce7')
p.append('<rect x="0" y="700" width="1600" height="20" fill="white"/></svg>');svg=''.join(p)
(ROOT/'actor-flow.svg').write_text(svg)
(ROOT/'actor-flow.html').write_text('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:1600px;height:720px;overflow:hidden}</style></head><body>'+svg+'</body></html>')
