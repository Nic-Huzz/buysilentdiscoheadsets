#!/usr/bin/env python3
"""Build Carousel A v2: 5-slide breathwork carousel with merged pricing slide."""

import base64
import io
import os
from PIL import Image, ImageOps

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def encode_img(path, max_width=1200, crop_top_pct=0):
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if crop_top_pct > 0:
        crop_px = int(img.height * crop_top_pct)
        img = img.crop((0, crop_px, img.width, img.height))
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=92)
    return base64.b64encode(buf.getvalue()).decode()

def build():
    print("Loading images...")
    img1 = encode_img(os.path.join(SCRIPT_DIR, 'slide1-final-v2.jpg'))
    img3 = encode_img(
        '/Users/nichuzz/creations/landingpages/Headset-sales/prototype/images/why-section/why-breathwork.jpg',
        crop_top_pct=0
    )

    html = ''.join([
        '''<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Poppins", sans-serif; background: #08060f; display: flex; gap: 80px; padding: 60px; width: max-content; }
  .slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; flex-shrink: 0; }
</style>
</head>
<body>

<!-- SLIDE 1: HOOK (text top, breathwork photo) -->
<div class="slide" style="background:#1a1330;">
  <div style="position:absolute; inset:0; background-image:url('data:image/jpeg;base64,''',
        img1,
        ''''); background-size:cover; background-position:center;"></div>
  <div style="position:absolute; inset:0; background:linear-gradient(to bottom, rgba(8,6,15,0.88) 0%, rgba(8,6,15,0.55) 32%, rgba(8,6,15,0) 50%, rgba(8,6,15,0) 70%, rgba(8,6,15,0.15) 100%);"></div>
  <div style="position:absolute; left:64px; right:120px; top:80px; display:flex; flex-direction:column; gap:28px; z-index:2;">
    <span style="font:700 26px 'Poppins'; letter-spacing:0.28em; text-transform:uppercase; color:#ffdd27;">The Shift</span>
    <h1 style="font:800 62px/1.12 'Poppins'; letter-spacing:-0.02em; color:#fff; text-shadow:0 2px 30px rgba(0,0,0,0.5);">Reformers let Pilates studios charge <span style="color:#ffdd27;">3x more</span>. Here's how <span style="color:#ffdd27;">breathwork facilitators</span> are doing the same.</h1>
  </div>
  <div style="position:absolute; right:52px; top:50%; transform:translateY(-50%); z-index:10; font:400 72px 'Poppins'; color:rgba(255,255,255,0.85); text-shadow:0 2px 20px rgba(0,0,0,0.6);">&#x203a;</div>
  <div style="position:absolute; left:64px; right:64px; bottom:56px; z-index:10; height:5px; border-radius:100px; background:rgba(255,255,255,0.25);"><div style="width:20%; height:100%; border-radius:100px; background:#fff;"></div></div>
</div>

<!-- SLIDE 2: MERGED PRICING PROOF (bridge line + 3 rows) -->
<div class="slide" style="background:radial-gradient(circle at 22% 16%, rgba(255,221,39,0.16), transparent 46%), radial-gradient(circle at 82% 88%, rgba(140,70,245,0.55), transparent 52%), linear-gradient(155deg, #3a0d97 0%, #5e17eb 55%, #7326ef 100%);">
  <div style="position:absolute; left:80px; right:80px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:28px; z-index:2;">
    <span style="font:700 26px 'Poppins'; letter-spacing:0.28em; text-transform:uppercase; color:#ffdd27;">What The Leaders Charge</span>
    <p style="font:600 36px/1.3 'Poppins'; color:rgba(255,255,255,0.9);">Reformers created a premium tier in Pilates. Headphones are doing the same.</p>

    <div style="display:flex; flex-direction:column; gap:20px;">
      <div style="background:rgba(255,255,255,0.08); border-radius:24px; padding:28px 36px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="font:400 22px 'Poppins'; color:rgba(255,255,255,0.5);">Average class: $30</p>
          <p style="font:700 32px 'Poppins'; color:#fff;">9D Breathwork</p>
        </div>
        <div style="text-align:right;">
          <p style="font:800 48px 'Poppins'; color:#ffdd27;">$60</p>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.08); border-radius:24px; padding:28px 36px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="font:400 22px 'Poppins'; color:rgba(255,255,255,0.5);">Average event: $20</p>
          <p style="font:700 32px 'Poppins'; color:#fff;">Dawnbreaker, AU</p>
        </div>
        <div style="text-align:right;">
          <p style="font:800 48px 'Poppins'; color:#ffdd27;">$50</p>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.08); border-radius:24px; padding:28px 36px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="font:400 22px 'Poppins'; color:rgba(255,255,255,0.5);">Average session: $25</p>
          <p style="font:700 32px 'Poppins'; color:#fff;">Sanctum (WEF)</p>
        </div>
        <div style="text-align:right;">
          <p style="font:800 48px 'Poppins'; color:#ffdd27;">$70</p>
        </div>
      </div>
    </div>

    <p style="font:700 36px/1.28 'Poppins'; color:#ffdd27;">All use headphones. All charge 2-3x more.</p>
  </div>
  <div style="position:absolute; right:52px; top:50%; transform:translateY(-50%); z-index:10; font:400 72px 'Poppins'; color:rgba(255,255,255,0.85); text-shadow:0 2px 20px rgba(0,0,0,0.6);">&#x203a;</div>
  <div style="position:absolute; left:64px; right:64px; bottom:56px; z-index:10; height:5px; border-radius:100px; background:rgba(255,255,255,0.25);"><div style="width:40%; height:100%; border-radius:100px; background:#fff;"></div></div>
</div>

<!-- SLIDE 3: THE EQUIPMENT -->
<div class="slide" style="background:#140f26;">
  <div style="position:absolute; inset:0; background-image:url('data:image/jpeg;base64,''',
        img3,
        ''''); background-size:cover; background-position:center top;"></div>
  <div style="position:absolute; inset:0; background:linear-gradient(to bottom, rgba(8,6,15,0.82) 0%, rgba(8,6,15,0.25) 18%, rgba(8,6,15,0.0) 32%, rgba(8,6,15,0.0) 58%, rgba(8,6,15,0.55) 72%, rgba(8,6,15,0.88) 85%, rgba(8,6,15,0.96) 100%);"></div>
  <div style="position:absolute; left:64px; right:64px; top:100px; z-index:2;">
    <span style="font:700 26px 'Poppins'; letter-spacing:0.28em; text-transform:uppercase; color:#ffdd27;">The Equipment</span>
    <h2 style="font:800 54px/1.1 'Poppins'; letter-spacing:-0.02em; color:#fff; text-shadow:0 2px 24px rgba(0,0,0,0.55); margin-top:20px;">Sound so good they forget the outside world.</h2>
    <p style="font:600 34px/1.3 'Poppins'; color:#ffdd27; margin-top:16px; text-shadow:0 2px 16px rgba(0,0,0,0.5);">$39 per headset. Direct from the factory, no retail markup.</p>
  </div>
  <div style="position:absolute; left:64px; right:64px; bottom:110px; z-index:2; display:flex; flex-direction:column; gap:18px;">
    <div style="display:flex; align-items:center; gap:16px;">
      <span style="font:500 30px 'Poppins'; color:#4ade80;">&#x2713;</span>
      <span style="font:500 28px/1.3 'Poppins'; color:#fff;">Creates a sound cocoon: no distractions, any venue</span>
    </div>
    <div style="display:flex; align-items:center; gap:16px;">
      <span style="font:500 30px 'Poppins'; color:#4ade80;">&#x2713;</span>
      <span style="font:500 28px/1.3 'Poppins'; color:#fff;">10-hour battery, 500m range, 3-channel LED</span>
    </div>
    <div style="display:flex; align-items:center; gap:16px;">
      <span style="font:500 30px 'Poppins'; color:#4ade80;">&#x2713;</span>
      <span style="font:500 28px/1.3 'Poppins'; color:#fff;">1,000+ headsets shipped to 7 countries</span>
    </div>
  </div>
  <div style="position:absolute; right:52px; top:50%; transform:translateY(-50%); z-index:10; font:400 72px 'Poppins'; color:rgba(255,255,255,0.85); text-shadow:0 2px 20px rgba(0,0,0,0.6);">&#x203a;</div>
  <div style="position:absolute; left:64px; right:64px; bottom:56px; z-index:10; height:5px; border-radius:100px; background:rgba(255,255,255,0.25);"><div style="width:60%; height:100%; border-radius:100px; background:#fff;"></div></div>
</div>

<!-- SLIDE 4: MERGED OFFER + CTA -->
<div class="slide" style="background:radial-gradient(circle at 22% 16%, rgba(255,221,39,0.16), transparent 46%), radial-gradient(circle at 82% 88%, rgba(140,70,245,0.55), transparent 52%), linear-gradient(155deg, #3a0d97 0%, #5e17eb 55%, #7326ef 100%);">
  <div style="position:absolute; left:80px; right:80px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:34px; z-index:2;">
    <span style="font:700 26px 'Poppins'; letter-spacing:0.28em; text-transform:uppercase; color:#ffdd27;">This Month Only</span>
    <h2 style="font:800 76px/1.05 'Poppins'; letter-spacing:-0.03em; color:#fff;">3 free headsets with any order.</h2>
    <div style="font:800 68px 'Poppins'; letter-spacing:-0.02em; color:#ffdd27;">From $39<span style="font:500 34px 'Poppins'; color:rgba(255,221,39,0.85);">/headphone</span></div>
    <p style="font:400 32px 'Poppins'; color:rgba(255,255,255,0.75);">buysilentdiscoheadphones.com</p>
    <div style="display:inline-flex; align-self:flex-start; padding:24px 48px; border-radius:100px; background:#ffdd27; color:#1a0b3d; font:700 34px 'Poppins'; letter-spacing:-0.01em; box-shadow:0 10px 34px rgba(255,221,39,0.4);">Build Your Package &#x2192;</div>
  </div>
  <div style="position:absolute; right:52px; top:50%; transform:translateY(-50%); z-index:10; font:400 72px 'Poppins'; color:rgba(255,255,255,0.85); text-shadow:0 2px 20px rgba(0,0,0,0.6);">&#x203a;</div>
  <div style="position:absolute; left:64px; right:64px; bottom:56px; z-index:10; height:5px; border-radius:100px; background:rgba(255,255,255,0.25);"><div style="width:80%; height:100%; border-radius:100px; background:#fff;"></div></div>
</div>

<!-- SLIDE 5: FOUNDER VIDEO PLACEHOLDER -->
<div class="slide" style="background:#1a1330;">
  <div style="position:absolute; inset:0; background:#0a0812;"></div>
  <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:40px; z-index:2;">
    <div style="width:160px; height:160px; border-radius:50%; background:rgba(255,221,39,0.15); display:flex; align-items:center; justify-content:center; border:3px solid rgba(255,221,39,0.5);">
      <div style="width:0; height:0; border-left:50px solid #ffdd27; border-top:30px solid transparent; border-bottom:30px solid transparent; margin-left:12px;"></div>
    </div>
    <p style="font:700 44px 'Poppins'; color:#fff; text-align:center;">Why I went direct<br>to the factory</p>
    <p style="font:400 28px 'Poppins'; color:rgba(255,255,255,0.6);">Nic Huzz, Founder</p>
  </div>
  <div style="position:absolute; left:64px; right:64px; bottom:56px; z-index:10; height:5px; border-radius:100px; background:rgba(255,255,255,0.25);"><div style="width:100%; height:100%; border-radius:100px; background:#ffdd27;"></div></div>
</div>

</body></html>'''])

    out_path = os.path.join(SCRIPT_DIR, 'carousel-a-final.html')
    with open(out_path, 'w') as f:
        f.write(html)
    print(f'Written: {out_path} ({len(html)//1024}KB)')

    # Render PNGs
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 6500, 'height': 1500})
        page.goto(f'file://{out_path}')
        page.wait_for_timeout(2000)
        
        slides = page.locator('.slide')
        out_dir = os.path.join(SCRIPT_DIR, 'carousel-a-final')
        os.makedirs(out_dir, exist_ok=True)
        for i in range(5):
            path = os.path.join(out_dir, f'slide_{i+1}.png')
            slides.nth(i).screenshot(path=path)
            print(f'Slide {i+1} saved: {path}')
        browser.close()

    print('\nDone! 5 slides rendered.')

if __name__ == '__main__':
    build()
