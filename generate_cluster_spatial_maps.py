import os
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker

# Ensure output directories exist
FIG_DIR = "figures"
OUTPUT_DIR = "outputs"
os.makedirs(FIG_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 80)
print("GENERATING UPDATED SPATIAL CLUSTER MAPS (GAMBAR 2) WITH PROVINCE BOUNDARIES")
print("Locked Geographic Aspect Ratio 1:1 (True Landscape, No Vertical Distortion)")
print("=" * 80)

# 1. Load District Dataset with Cluster Labels
data_path = "outputs/table7_nusa_mipa_district_policy_recommendations_2056.csv"
if not os.path.exists(data_path):
    data_path = "data/FINAL/master_pendidikan_kabupaten_2025_clean.csv"

df = pd.read_csv(data_path)
print(f"Loaded district data: {len(df)} records.")

# 2. Load Indonesia Provincial Basemap
geojson_path = "data/FINAL/indonesia_provinsi.geojson"
gdf_prov = gpd.read_file(geojson_path)
print(f"Loaded provincial boundaries: {len(gdf_prov)} provinces.")

# Cluster Palette (Colorblind-Safe Okabe-Ito Palette)
# Kluster 1 (Biru), Kluster 2 (Kuning/Amber), Kluster 3 (Oranye)
PALETTE_CLUSTER = {
    "Cluster 1: High-Performing Benchmark": "#0072B2",        # Blue
    "Cluster 2: Pedagogy-Infrastructure Paradox": "#E69F00",  # Amber/Yellow
    "Cluster 3: 3T Affirmation Priority": "#D55E00",        # Red-Orange
}

CLUSTER_SHORT_LABELS = {
    "Cluster 1: High-Performing Benchmark": "Klaster 1: Benchmark",
    "Cluster 2: Pedagogy-Infrastructure Paradox": "Klaster 2: Paradoks",
    "Cluster 3: 3T Affirmation Priority": "Klaster 3: Afirmasi 3T",
}

JENJANG_ORDER = ["SD", "SMP", "SMA", "SMK"]

# Exact Moran's I values from analysis
MORAN_INFO = {
    "SD": {"I": 0.62, "p": 0.005},
    "SMP": {"I": 0.55, "p": 0.005},
    "SMA": {"I": 0.61, "p": 0.005},
    "SMK": {"I": 0.06, "p": 0.005},
}

LON_MIN, LON_MAX = 94.5, 141.5
LAT_MIN, LAT_MAX = -11.5, 6.5

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#1E293B'
plt.rcParams['axes.linewidth'] = 0.75

# ==============================================================================
# FIGURE 1: 2x2 GRID (Standard Gambar 2 - Wide Landscape with Province Boundaries)
# ==============================================================================
print("\n[1/3] Generating 2x2 Grid Cluster Map with Transparent Provincial Boundaries...")
fig, axes = plt.subplots(2, 2, figsize=(15.5, 8.4), dpi=300)

for idx, jenjang in enumerate(JENJANG_ORDER):
    r, c = idx // 2, idx % 2
    ax = axes[r, c]
    sub = df[df["jenjang"] == jenjang].copy()
    m_info = MORAN_INFO[jenjang]

    # 1. Subtle Land Fill (Subtle off-white/gray)
    gdf_prov.plot(ax=ax, color='#F8FAFC', edgecolor='none', zorder=1)

    # 2. Transparent Dotted Provincial Boundaries (User requested)
    gdf_prov.boundary.plot(
        ax=ax, color='#475569', alpha=0.45, linewidth=0.65, linestyle=':', zorder=2
    )

    # 3. Scatter Plot of 514 Districts with Cluster Colors
    for c_name, color in PALETTE_CLUSTER.items():
        m = sub["cluster_name"] == c_name
        cnt = m.sum()
        short_lbl = CLUSTER_SHORT_LABELS[c_name]
        ax.scatter(
            sub.loc[m, "longitude"], sub.loc[m, "latitude"],
            c=color, s=20, alpha=0.92, edgecolors="white", linewidths=0.35,
            label=f"{short_lbl} (n={cnt})", zorder=4
        )

    # 4. Aspect Ratio & Coordinate Bounds (MANDATORY: True Geographic 1:1)
    ax.set_aspect('equal')
    ax.set_xlim(LON_MIN, LON_MAX)
    ax.set_ylim(LAT_MIN, LAT_MAX)

    ax.set_title(
        f"({chr(97+idx)}) {jenjang} Level — Global Moran's I = {m_info['I']:.2f} (p = {m_info['p']:.3f})",
        fontsize=10.5, fontweight='bold', pad=7
    )
    if r == 1:
        ax.set_xlabel("Longitude (°E)", fontsize=9, fontweight='bold')
    if c == 0:
        ax.set_ylabel("Latitude (°N / °S)", fontsize=9, fontweight='bold')

    ax.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=3)
    ax.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(5))

    # Clean Legend
    ax.legend(
        loc="lower left", frameon=True, facecolor="white", edgecolor="#CBD5E1",
        framealpha=0.92, fontsize=7.2, handletextpad=0.4, borderpad=0.4
    )

fig.suptitle(
    "Spatial Distribution of Educational Numeracy Typologies Across 514 Indonesian Districts (2025)",
    fontsize=12.5, fontweight='bold', y=0.99
)
plt.tight_layout()

out_2x2 = f"{FIG_DIR}/gambar2_peta_klaster_spasial_indonesia_2x2.png"
out_fig5 = f"{FIG_DIR}/fig5_spatial_clusters_indonesia_map.png"
out_fig1 = f"{FIG_DIR}/fig1_spatial_clusters_indonesia.png"

fig.savefig(out_2x2, dpi=300, bbox_inches='tight')
fig.savefig(out_fig5, dpi=300, bbox_inches='tight')
fig.savefig(out_fig1, dpi=300, bbox_inches='tight')
plt.close(fig)
print(f"Saved: {out_2x2}")
print(f"Saved: {out_fig5}")
print(f"Saved: {out_fig1}")

# ==============================================================================
# FIGURE 2: STACKED 4-PANEL FORMAT (Specially Tailored for IEEE Single Column)
# ==============================================================================
print("\n[2/3] Generating Stacked 4-Panel Format (1-Column IEEE Layout)...")
fig, axes = plt.subplots(4, 1, figsize=(9.2, 13.5), dpi=300)

for idx, jenjang in enumerate(JENJANG_ORDER):
    ax = axes[idx]
    sub = df[df["jenjang"] == jenjang].copy()
    m_info = MORAN_INFO[jenjang]

    # Land fill & transparent provincial boundary lines
    gdf_prov.plot(ax=ax, color='#F8FAFC', edgecolor='none', zorder=1)
    gdf_prov.boundary.plot(
        ax=ax, color='#475569', alpha=0.45, linewidth=0.6, linestyle=':', zorder=2
    )

    for c_name, color in PALETTE_CLUSTER.items():
        m = sub["cluster_name"] == c_name
        cnt = m.sum()
        short_lbl = CLUSTER_SHORT_LABELS[c_name]
        ax.scatter(
            sub.loc[m, "longitude"], sub.loc[m, "latitude"],
            c=color, s=22, alpha=0.92, edgecolors="white", linewidths=0.35,
            label=f"{short_lbl} (n={cnt})", zorder=4
        )

    ax.set_aspect('equal')
    ax.set_xlim(LON_MIN, LON_MAX)
    ax.set_ylim(LAT_MIN, LAT_MAX)

    ax.set_title(
        f"({chr(97+idx)}) {jenjang} Level — Global Moran's I = {m_info['I']:.2f} (p = {m_info['p']:.3f})",
        fontsize=10, fontweight='bold', pad=6
    )
    ax.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
    if idx == 3:
        ax.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')

    ax.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=3)
    ax.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(5))

    ax.legend(
        loc="lower left", frameon=True, facecolor="white", edgecolor="#CBD5E1",
        framealpha=0.92, fontsize=7.2, handletextpad=0.3, borderpad=0.3
    )

plt.tight_layout()
out_stacked = f"{FIG_DIR}/gambar2_peta_klaster_spasial_stacked_1col.png"
fig.savefig(out_stacked, dpi=300, bbox_inches='tight')
plt.close(fig)
print(f"Saved: {out_stacked}")

# ==============================================================================
# FIGURE 3: INDIVIDUAL STANDALONE LANDSCAPE MAPS PER JENJANG
# ==============================================================================
print("\n[3/3] Generating Individual Standalone Landscape Maps (SD, SMP, SMA, SMK)...")
for idx, jenjang in enumerate(JENJANG_ORDER):
    fig, ax = plt.subplots(figsize=(10.5, 4.4), dpi=300)
    sub = df[df["jenjang"] == jenjang].copy()
    m_info = MORAN_INFO[jenjang]

    gdf_prov.plot(ax=ax, color='#F8FAFC', edgecolor='none', zorder=1)
    gdf_prov.boundary.plot(
        ax=ax, color='#475569', alpha=0.45, linewidth=0.65, linestyle=':', zorder=2
    )

    for c_name, color in PALETTE_CLUSTER.items():
        m = sub["cluster_name"] == c_name
        cnt = m.sum()
        short_lbl = CLUSTER_SHORT_LABELS[c_name]
        ax.scatter(
            sub.loc[m, "longitude"], sub.loc[m, "latitude"],
            c=color, s=28, alpha=0.92, edgecolors="white", linewidths=0.4,
            label=f"{short_lbl} (n={cnt})", zorder=4
        )

    ax.set_aspect('equal')
    ax.set_xlim(LON_MIN, LON_MAX)
    ax.set_ylim(LAT_MIN, LAT_MAX)

    title_text = f"Peta Sebaran 3 Klaster Tipologi Numerasi: ({chr(97+idx)}) Jenjang {jenjang} — Moran's I = {m_info['I']:.2f} (p = {m_info['p']:.3f})"
    ax.set_title(title_text, fontsize=10.5, fontweight='bold', pad=8)
    ax.set_xlabel("Longitude (°E)", fontsize=9, fontweight='bold')
    ax.set_ylabel("Latitude (°N / °S)", fontsize=9, fontweight='bold')

    ax.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=3)
    ax.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(5))

    ax.legend(
        loc="lower left", frameon=True, facecolor="white", edgecolor="#CBD5E1",
        framealpha=0.92, fontsize=7.8
    )

    plt.tight_layout()
    out_single = f"{FIG_DIR}/gambar2{chr(97+idx)}_klaster_{jenjang.lower()}_landscape.png"
    fig.savefig(out_single, dpi=300, bbox_inches='tight')
    plt.close(fig)
    print(f"Saved: {out_single}")

print("\nSUCCESS! All Gambar 2 maps have been updated with transparent provincial boundaries and true 1:1 geographic aspect ratio.")
