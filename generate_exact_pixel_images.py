import os
from PIL import Image

OUT_DIR = "gambar_presentasi_final"
HD_DIR = os.path.join(OUT_DIR, "hd_2x")
SRC_DIR = "figures/presentation_assets"

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(HD_DIR, exist_ok=True)

print("=" * 80)
print("GENERATING EXACT PIXEL-DIMENSION IMAGES FOR SLIDES IN gambar_presentasi_final/")
print("=" * 80)

def fit_on_white_canvas(src_path, target_w, target_h, out_path):
    img = Image.open(src_path).convert("RGBA")
    orig_w, orig_h = img.size
    
    # Scale proportionally
    scale = min(target_w / orig_w, target_h / orig_h)
    new_w = int(orig_w * scale)
    new_h = int(orig_h * scale)
    
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create white canvas of EXACT dimensions (target_w, target_h)
    canvas = Image.new("RGB", (target_w, target_h), (255, 255, 255))
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    
    canvas.paste(resized, (offset_x, offset_y), resized)
    canvas.save(out_path, dpi=(300, 300))
    print(f"  -> Generated: {out_path} [Ukuran Pixel: {canvas.size[0]} x {canvas.size[1]} px (lebar x tinggi)]")

# Specifications as requested by user:
# 1. Slide 4: ukuran 370.2 x 568.9 (tinggi x lebar) -> Lebar: 569 px, Tinggi: 370 px
fit_on_white_canvas(
    f"{SRC_DIR}/slide4_peta_moran_lisa_sd.png", 569, 370,
    f"{OUT_DIR}/1_peta_moran_lisa_sd.png"
)
fit_on_white_canvas(
    f"{SRC_DIR}/slide4_moran_scatterplot_sd.png", 569, 370,
    f"{OUT_DIR}/1_moran_scatterplot_sd.png"
)

# 2. Slide 5: peta_klaster_sd.png -> ukuran 662.4 x 820.8 (tinggi x lebar) -> Lebar: 821 px, Tinggi: 662 px
fit_on_white_canvas(
    f"{SRC_DIR}/peta_klaster_sd.png", 821, 662,
    f"{OUT_DIR}/2_peta_klaster_sd.png"
)
fit_on_white_canvas(
    f"{SRC_DIR}/peta_klaster_sd.png", 821, 662,
    f"{OUT_DIR}/peta_klaster_sd.png"
)

# 3. Slide 7 (Kiri): MGWR Kualitas SMP -> ukuran 460.8 x 856.8 (tinggi x lebar) -> Lebar: 857 px, Tinggi: 461 px
fit_on_white_canvas(
    f"{SRC_DIR}/slide7_peta_mgwr_kualitas_smp.png", 857, 461,
    f"{OUT_DIR}/3_peta_mgwr_kualitas_pembelajaran_smp.png"
)

# 4. Slide 7 (Kanan): MGWR Listrik SD -> ukuran 460.8 x 856.8 (tinggi x lebar) -> Lebar: 857 px, Tinggi: 461 px
fit_on_white_canvas(
    f"{SRC_DIR}/slide7_peta_mgwr_listrik_sd.png", 857, 461,
    f"{OUT_DIR}/4_peta_mgwr_listrik_sekolah_sd.png"
)

# 5. Slide 12 (Bonus): Screenshot Web -> Lebar: 811 px, Tinggi: 475 px
if os.path.exists(f"{SRC_DIR}/slide12_screenshot_web_nusa_mipa.png"):
    fit_on_white_canvas(
        f"{SRC_DIR}/slide12_screenshot_web_nusa_mipa.png", 811, 475,
        f"{OUT_DIR}/5_screenshot_web_nusa_mipa.png"
    )

print("\nGENERATING 2x RETINA HD EDITIONS (hd_2x/)...")
# 2X HD resolution versions for crystal clear presentation:
fit_on_white_canvas(f"{SRC_DIR}/slide4_peta_moran_lisa_sd.png", 1138, 740, f"{HD_DIR}/1_peta_moran_lisa_sd_2x.png")
fit_on_white_canvas(f"{SRC_DIR}/slide4_moran_scatterplot_sd.png", 1138, 740, f"{HD_DIR}/1_moran_scatterplot_sd_2x.png")
fit_on_white_canvas(f"{SRC_DIR}/peta_klaster_sd.png", 1642, 1325, f"{HD_DIR}/2_peta_klaster_sd_2x.png")
fit_on_white_canvas(f"{SRC_DIR}/peta_klaster_sd.png", 1642, 1325, f"{HD_DIR}/peta_klaster_sd_2x.png")
fit_on_white_canvas(f"{SRC_DIR}/slide7_peta_mgwr_kualitas_smp.png", 1714, 922, f"{HD_DIR}/3_peta_mgwr_kualitas_pembelajaran_smp_2x.png")
fit_on_white_canvas(f"{SRC_DIR}/slide7_peta_mgwr_listrik_sd.png", 1714, 922, f"{HD_DIR}/4_peta_mgwr_listrik_sekolah_sd_2x.png")

print("\nSUCCESS! All images formatted to exact pixel dimensions requested.")
