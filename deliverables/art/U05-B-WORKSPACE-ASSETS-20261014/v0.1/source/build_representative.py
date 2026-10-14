"""Deterministic first-batch semantic cutouts from frozen U05-B pixels.

No generative call; source image is read-only. Coordinates are full-canvas pixels.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parents[3]
REF = PROJECT / 'deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png'
OUT = ROOT / 'source/representative'
REVIEW = ROOT / 'review'
OUT.mkdir(parents=True, exist_ok=True)
REVIEW.mkdir(parents=True, exist_ok=True)
src = Image.open(REF).convert('RGB')
W, H = src.size

def mask_polygon(points, feather=0.4):
    scale = 4
    mask = Image.new('L', (W*scale, H*scale))
    d = ImageDraw.Draw(mask)
    d.polygon([(round(x*scale), round(y*scale)) for x,y in points], fill=255)
    mask = mask.resize((W,H), Image.Resampling.LANCZOS)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    return mask

def mask_t01():
    s=4
    m=Image.new('L',(W*s,H*s))
    d=ImageDraw.Draw(m)
    def poly(p):d.polygon([(x*s,y*s) for x,y in p],fill=255)
    def ell(b):d.ellipse(tuple(v*s for v in b),fill=255)
    # Separate visible vessel components; transparent opening inside the handle.
    ell((120,429,145,457))
    ell((90,447,174,479))
    ell((88,458,177,483))
    poly([(91,476),(166,476),(177,482),(185,508),(182,538),
          (174,558),(168,565),(82,565),(74,551),(69,526),(73,498)])
    poly([(86,492),(78,479),(67,477),(55,483),(50,492),(52,508),
          (62,527),(72,541),(83,537),(91,520),(89,499)])
    poly([(169,479),(178,477),(187,479),(195,486),(201,498),
          (199,521),(188,542),(178,548),(176,536),(185,526),
          (190,510),(188,493),(180,488),(173,491)])
    # The handle opening shows the shelf; cut it out of the semantic body.
    poly_hole=[(183,491),(190,496),(193,508),(190,519),(182,530),(178,529),(182,517),(183,503)]
    d.polygon([(x*s,y*s) for x,y in poly_hole],fill=0)
    a=m.resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.35))
    # Signed representative ROI bounds are hard safety limits, not alpha geometry.
    roi=Image.new('L',(W,H)); ImageDraw.Draw(roi).rectangle((50,415,211,566),fill=255)
    return Image.composite(a,Image.new('L',(W,H)),roi)

def mask_p01():
    s=4
    m=Image.new('L',(W*s,H*s));d=ImageDraw.Draw(m)
    bowl=[(277,889),(281,882),(289,877),(304,874),(324,872),(375,873),
          (396,878),(405,884),(409,892),(407,902),(399,916),(392,925),
          (292,925),(282,916),(276,902)]
    d.polygon([(x*s,y*s) for x,y in bowl],fill=255)
    a=m.resize((W,H),Image.Resampling.LANCZOS)
    rgb=np.asarray(src)
    blue=(rgb[:,:,2].astype('int16') > rgb[:,:,0].astype('int16')*1.25) & \
         (rgb[:,:,2].astype('int16') > 135)
    flame=np.zeros((H,W),dtype='uint8')
    flame[845:884,286:397]=np.where(blue[845:884,286:397],255,0).astype('uint8')
    flame=Image.fromarray(flame).filter(ImageFilter.MaxFilter(3))
    a=Image.fromarray(np.maximum(np.asarray(a),np.asarray(flame)))
    a=a.filter(ImageFilter.GaussianBlur(0.35))
    roi=Image.new('L',(W,H));ImageDraw.Draw(roi).rectangle((272,845,412,928),fill=255)
    return Image.composite(a,Image.new('L',(W,H)),roi)

def export(name, a):
    rgba = src.convert('RGBA')
    rgba.putalpha(a)
    rgba.save(OUT/name)
    a.save(OUT/(name.replace('_full.png','_alpha.png')))
    return rgba, a

tea, tm = export('T01_youdeng_tea_full.png', mask_t01())
pearls, pm = export('P01_guihuozhu_bowl_full.png', mask_p01())

# The two vacated areas have no source RGB behind the opaque object. Keep the
# surrounding original pixels and fill only the signed object silhouettes.
repair=Image.open(OUT/'repair_candidate_v2.png').convert('RGB')
patch=Image.new('L',(W,H));pd=ImageDraw.Draw(patch)
pd.rectangle((50,416,211,566),fill=255)
pd.rectangle((272,845,412,928),fill=255)
patch=patch.filter(ImageFilter.GaussianBlur(2))
signed_roi=Image.new('L',(W,H));rd=ImageDraw.Draw(signed_roi)
rd.rectangle((50,415,211,566),fill=255)
rd.rectangle((272,845,412,928),fill=255)
patch=Image.composite(patch,Image.new('L',(W,H)),signed_roi)
empty=Image.composite(repair,src,patch)
empty.save(OUT/'empty_shelf_full.png')
rec = empty.convert('RGBA')
rec.alpha_composite(tea)
rec.alpha_composite(pearls)
rec.convert('RGB').save(REVIEW/'representative_reconstructed.png')
delta = np.abs(np.asarray(rec.convert('RGB')).astype('int16')-np.asarray(src).astype('int16'))
Image.fromarray(np.clip(delta*8,0,255).astype('uint8'),'RGB').save(REVIEW/'representative_difference_x8.png')
for label, a in [('T01',tm),('P01',pm)]:
    arr=np.asarray(a)
    ys,xs=np.nonzero(arr)
    print(label,'alpha bbox', (int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1),
          'nonzero',len(xs),'partial',int(np.count_nonzero((arr>0)&(arr<255))))
print('max_abs_diff',int(delta.max()),'mean_abs_diff',float(delta.mean()),
      'changed_pixels',int(np.count_nonzero(delta.max(axis=2))))
outside=np.asarray(signed_roi)==0
print('outside_signed_roi_changed_pixels',int(np.count_nonzero(delta.max(axis=2)[outside])))
