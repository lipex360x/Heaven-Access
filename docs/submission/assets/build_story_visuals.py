"""Author editable, project-specific SVG presentation diagrams (no stock imagery)."""
from pathlib import Path
from html import escape
from PIL import ImageFont
ROOT=Path(__file__).resolve().parent
F='/System/Library/Fonts/Supplemental/Arial.ttf'
NAVY='#163B50';GREEN='#28665C';MUTED='#536870';PALE='#EEF5F3'

def wrap(t,w,size):
 font=ImageFont.truetype(F,size);lines=[];line=''
 for word in t.split():
  new=(line+' '+word).strip()
  if font.getlength(new)>w and line:lines.append(line);line=word
  else:line=new
 if line:lines.append(line)
 return lines

class Art:
 def __init__(self,name):
  self.name=name;self.s=['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="650" viewBox="0 0 1600 650">','<defs><marker id="a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#28665C"/></marker></defs>','<rect width="1600" height="650" fill="white"/>']
 def rect(self,x,y,w,h,fill=PALE,stroke='none',rx=16):self.s.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}"/>')
 def text(self,x,y,t,size=29,color=NAVY,bold=False,w=None,leading=None):
  lines=wrap(t,w,size) if w else [t]
  for i,line in enumerate(lines):self.s.append(f'<text x="{x}" y="{y+i*(leading or size*1.27)}" font-family="Arial,sans-serif" font-size="{size}" font-weight="{"bold" if bold else "normal"}" fill="{color}">{escape(line)}</text>')
  return y+len(lines)*(leading or size*1.27)
 def arrow(self,x1,y1,x2,y2,dashed=False):self.s.append(f'<path d="M{x1} {y1}L{x2} {y2}" fill="none" stroke="{GREEN}" stroke-width="3" marker-end="url(#a)" {"stroke-dasharray=\"8 6\"" if dashed else ""}/>')
 def circle(self,x,y,r=20,fill=GREEN):self.s.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>')
 def save(self):
  svg=''.join(self.s)+'</svg>';(ROOT/f'{self.name}.svg').write_text(svg)
  (ROOT/f'{self.name}.html').write_text('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:1600px;height:650px;overflow:hidden}</style></head><body>'+svg+'</body></html>')

def label(a,x,y,n,title,detail,w=470,h=160):
 a.rect(x,y,w,h);a.circle(x+38,y+40);a.text(x+30,y+49,str(n),25,'white',True)
 a.text(x+72,y+48,title,29,GREEN,True,w=w-90);a.text(x+24,y+96,detail,27,w=w-48)

# Dani: observable failure vs the narrower claim our prototype can test.
a=Art('problem-story')
a.text(20,42,'Stakeholders: who is affected and what they need',35,bold=True)
for x,title,need in [(20,'VISITORS','Clear decisions and assisted access.'),(420,'RECEPTION / SECURITY','Controlled decisions and reliable records.'),(820,'OFFICE OCCUPANTS','Appropriate access for expected visitors.'),(1220,'BUILDING MANAGEMENT','Safe operation and viable controls.')]:
 a.rect(x,85,360,150);a.text(x+20,125,title,23,GREEN,True);a.text(x+20,172,need,28,w=320)
a.rect(20,260,760,245,'#163B50');a.text(44,305,'REAL-WORLD SIGNAL',24,'#B9DDD1',True)
a.text(44,350,'RBS workplace tailgating',34,'white',True)
a.text(44,400,'People followed authorised staff inside. Security interrupted an attempted bicycle theft.',30,'white',w=710)
a.rect(810,260,770,245);a.text(834,305,'WHAT THIS DOES NOT PROVE',24,GREEN,True)
a.text(834,350,'A QR does not stop a follower.',34,bold=True)
a.text(834,400,'Our hypothesis is the approval-to-validation gap. We did not audit a building or measure prevalence.',30,w=718)
a.text(20,554,'Investigation: Dani’s reported experience → desk research → discussion and sketch.',29,GREEN,True)
a.text(20,604,'These needs are our design analysis, not interview findings. Incident prevalence is unknown.',27)
a.save()
# Cris: actual creative process, qualitative comparisons and hardware contingency.
a=Art('solution-options')
for x,n,t,b in [(20,1,'Discuss + sketch','Start from Dani’s workplace scenario.'),(555,2,'Compare alternatives','Test the fit, dependencies and risks.'),(1090,3,'Combine + simplify','Approval + QR + server checkpoint.')]:label(a,x,15,n,t,b,w=490,h=145)
opts=[('Process only','Sign-in / signage','Depends on human compliance.'),('QR only','Registration / pass','Leaves physical bypass routes.'),('Lift interface','Destination permission','Vendor compatibility required.'),('Turnstile','Physical checkpoint','Installation and safety review.'),('Camera detection','Tailgating detection','Privacy and accuracy questions.')]
for i,(title,sub,limit) in enumerate(opts):
 x=20+i*316;a.rect(x,192,296,230,PALE if i!=2 else '#D7E8E2');a.text(x+18,234,title,29,GREEN,True);a.text(x+18,278,sub,26,w=260);a.text(x+18,348,limit,26,w=260)
a.rect(20,455,1560,175,'#163B50');a.text(46,500,'Chosen for the prototype: one joined authorisation workflow, with simulated hardware.',32,'white',True,w=1508)
a.text(46,554,'For deployment: suitable lift interface? Investigate it. If unavailable, assess a specialised turnstile.',29,'white',w=1508)
a.text(46,603,'No confirmed hardware compatibility, installation approval or verified cost.',26,'#B9DDD1')
a.save()
# Felipe: visible interfaces plus a simple shared-state architecture.
a=Art('demo-architecture')
for x,n,t,b in [(20,1,'Visitor phone','Request → private QR'),(420,2,'Reception browser','Approve → revoke'),(820,3,'Camera phone','/device/reader'),(1220,4,'Tablet display','Gate or elevator')]:label(a,x,15,n,t,b,w=360,h=155)
for x in [200,600,1000]:a.arrow(x,175,x,240)
a.s.append('<path d="M1400 175V215H1100V240" fill="none" stroke="#28665C" stroke-width="3" marker-end="url(#a)"/>')
a.rect(20,245,1170,180,'#163B50');a.text(48,290,'ONE CENTRAL ACCESS DECISION',24,'#B9DDD1',True)
a.text(48,337,'The server checks approval, revocation, destination and visit time.',31,'white',w=1110)
a.text(48,390,'Reception, the reader and the display share the same result.',28,'white')
a.rect(1250,245,330,180,PALE);a.text(1280,305,'Access history',31,GREEN,True);a.text(1280,355,'Visits + decisions',27);a.arrow(1193,335,1245,335)
a.rect(20,465,1560,165);a.text(44,508,'Live sequence',26,GREEN,True)
a.text(44,553,'Request → pending → approve → QR scan → open 8s → relock',34,bold=True)
a.text(44,602,'Then confirm revocation and retry the saved QR: refusal, with earlier history preserved.',29)
a.save()
# Bella: implemented decisions linked directly to live-operation responsibilities.
a=Art('responsibility-cards')
for x,title,feature,obligation in [
 (20,'DATA','Name, destination, time. QR frames decoded locally. No face template.','Live operator: justify the processing basis and retention/deletion; keep the data minimal.'),
 (555,'DECISIONS','Approval, server checks and revocation. Revocation keeps the history.','Assess legitimate interests: purpose, necessity and visitor impacts. Screen actual privacy risks for DPIA.'),
 (1090,'PEOPLE','Notice acknowledgement. Reasoned manual assistance. Shared demo login.','Acknowledgement is not consent as a basis. Define human review, individual staff access and safe physical exit.')]:
 a.rect(x,20,490,520);a.rect(x,20,490,70,GREEN);a.text(x+24,66,title,30,'white',True)
 a.text(x+26,137,'IN THE PROTOTYPE',22,GREEN,True);a.text(x+26,183,feature,30,w=438)
 a.text(x+26,335,'BEFORE LIVE USE',22,GREEN,True);a.text(x+26,380,obligation,29,w=438)
a.rect(20,570,1560,64,'#FFF0D8');a.text(44,612,'A working simulation is not proof of GDPR compliance, identity, occupancy or hardware safety.',28,bold=True)
a.save()
# Evaluation facts, balanced sustainability and recurring-occupant needs.
a=Art('evaluation-story')
a.rect(20,15,760,260);a.text(44,60,'VERIFIED WORKFLOW',25,GREEN,True)
a.text(44,110,'Approve • open / relock • revoke • refuse',31,bold=True,w=710)
a.text(44,165,'Recorded tests: 7 unit, 10 visitor/auth, 9 device; 5 browser locally + 5 online.',29,w=710)
a.text(44,244,'Browser video was synthetic, not a physical-camera test.',25)
a.rect(810,15,770,260,'#163B50');a.text(834,60,'WHAT REMAINS UNPROVEN',25,'#B9DDD1',True)
a.text(834,110,'Identity • passage • tailgating prevention',31,'white',True,w=718)
a.text(834,170,'No measured incident reduction or verified integration cost. Access counts are not occupancy.',29,'white',w=718)
a.rect(20,310,760,315);a.text(44,355,'SUSTAINABILITY IS A TRADE-OFF',25,GREEN,True)
a.text(44,405,'Potential: fewer paper passes.',31,bold=True)
a.text(44,457,'Balance against devices, hosting, installation, maintenance and replacement.',29,w=710)
a.text(44,576,'No net environmental saving measured.',27,GREEN,True)
a.rect(810,310,770,315);a.text(834,355,'FUTURE ACCESS NEEDS',25,GREEN,True)
a.text(834,405,'What about regular occupants?',34,bold=True,w=718)
a.text(834,458,'Future recurring permissions: destinations + schedules + review + revocation.',29,w=718)
a.text(834,576,'Not an unlimited visitor QR; not implemented.',27,GREEN,True)
a.save()
# Opening orientation before evidence and design details.
a=Art('presentation-route')
steps=[('01','The challenge','Office access, evidence and affected people.'),('02','The proposal','Alternatives and the complete actor flow.'),('03','The demonstration','One temporary visit: approve, scan, revoke.'),('04','The evaluation','Responsibilities, limits and future needs.')]
for i,(num,title,detail) in enumerate(steps):
 x=20+(i%2)*800;y=20+(i//2)*265
 a.rect(x,y,760,230);a.circle(x+57,y+60,31);a.text(x+39,y+70,num,28,'white',True)
 a.text(x+108,y+70,title,36,GREEN,True);a.text(x+28,y+132,detail,32,w=704)
a.rect(20,570,1560,65,'#163B50');a.text(45,613,'The thread: connect an approved visit to a destination, a time and an access decision.',31,'white',True)
a.save()
a=Art('problem-proposal-introduction')
a.rect(20,20,490,610,PALE)
a.text(44,67,'THE SETTING',25,GREEN,True)
a.text(44,113,'Commercial offices',34,bold=True)
# A simple office illustration, not a drawing of a surveyed building.
a.rect(145,165,235,300,'#D7E8E2',GREEN,4)
for row in range(3):
 for col in range(3):a.rect(172+col*65,195+row*65,39,39,'white',rx=3)
a.rect(234,400,57,65,GREEN,rx=0)
a.text(44,527,'Visitors • reception',29,w=440)
a.text(44,570,'Offices on controlled floors',29,w=440)
a.rect(545,20,1035,270,'#163B50');a.text(573,68,'THE PROBLEM',25,'#B9DDD1',True)
a.text(573,121,'Visitors may reach office floors without their visit being checked.',37,'white',True,w=975)
a.text(573,248,'We investigate the gap between approval and access validation.',28,'white',w=975)
a.rect(545,325,1035,305,PALE);a.text(573,373,'THE PROPOSED SOLUTION',25,GREEN,True)
a.text(573,425,'Approve a temporary visit, issue its QR and validate destination and time at the checkpoint.',35,bold=True,w=975)
a.text(573,550,'We demonstrate the gate/elevator opening on screen.',29,w=975)
a.text(573,595,'This is an authorisation simulation, not a physical barrier.',28,GREEN,w=975)
a.save()
print('Wrote seven editable narrative visuals.')
