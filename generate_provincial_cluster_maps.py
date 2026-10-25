import os
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import matplotlib.patches as mpatches

FIG_DIR = "figures"
os.makedirs(FIG_DIR, exist_ok=True)

print("=" * 80)
print("GENERATING PROVINCIAL CHOROPLETH & 2x4 MULTI-SCALE CLUSTER MAPS")
print("=" * 80)

# 1. Load Data
data_path = "outputs/table7_nusa_mipa_district_policy_recommendations_2056.csv"
if not os.path.exists(data_path):
    data_path = "data/FINAL/master_pendidikan_kabupaten_2025_clean.csv"
df_kab = pd.read_csv(data_path)

gdf_prov = gpd.read_file("data/FINAL/indonesia_provinsi.geojson")

# Mapping province names to match GADM 34 provinces
mapping_prov = {
    'D.I. Yogyakarta': 'Yogyakarta',
    'D.K.I. Jakarta': 'Jakarta Raya',
    'Kepulauan Bangka Belitung': 'Bangka Belitung',
    'Papua Barat Daya': 'Papua Barat',
    'Papua Selatan': 'Papua',
    'Papua Tengah': 'Papua',
    'Papua Pegunungan': 'Papua'
}
df_kab['prov_mapped'] = df_kab['nama_provinsi'].replace(mapping_prov)

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
# OPTION 1: 2x2 PROVINCIAL CHOROPLETH (4 Panels per Jenjang, Full Province Fill)
# ==============================================================================
print("\n[1/3] Generating 2x2 Provincial Choropleth Map (Full Polygons per Provinsi)...")
fig, axes = plt.subplots(2, 2, figsize=(15.5, 8.4), dpi=300)

for idx, jenjang in enumerate(JENJANG_ORDER):
    r, c = idx // 2, idx % 2
    ax = axes[r, c]
    sub = df_kab[df_kab["jenjang"] == jenjang].copy()
    
    # Calculate dominant cluster per mapped province
    dom = sub.groupby(['prov_mapped', 'cluster_name']).size().unstack(fill_value=0).idxmax(axis=1)
    
    gdf_plot = gdf_prov.copy()
    gdf_plot['dom_cluster'] = gdf_plot['NAME_1'].map(dom)
    gdf_plot['color'] = gdf_plot['dom_cluster'].map(PALETTE_CLUSTER)

    # Plot filled polygons
    gdf_plot.plot(ax=ax, color=gdf_plot['color'], edgecolor='#1E293B', linewidth=0.55, zorder=2)

    ax.set_aspect('equal')
    ax.set_xlim(LON_MIN, LON_MAX)
    ax.set_ylim(LAT_MIN, LAT_MAX)

    ax.set_title(
        f"({chr(97+idx)}) {jenjang} Level — Dominansi Tipologi Tingkat Provinsi (N = 34)",
        fontsize=10.5, fontweight='bold', pad=7
    )
    if r == 1:
        ax.set_xlabel("Longitude (°E)", fontsize=9, fontweight='bold')
    if c == 0:
        ax.set_ylabel("Latitude (°N / °S)", fontsize=9, fontweight='bold')

    ax.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=3)
    ax.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(5))

    # Legend with counts of provinces
    counts = gdf_plot['dom_cluster'].value_counts()
    handles = []
    for c_name, color in PALETTE_CLUSTER.items():
        cnt = counts.get(c_name, 0)
        short_lbl = CLUSTER_SHORT_LABELS[c_name]
        patch = mpatches.Patch(facecolor=color, edgecolor='#1E293B', linewidth=0.5,
                               label=f"{short_lbl} ({cnt} Prov)")
        handles.append(patch)

    ax.legend(
        handles=handles, loc="lower left", frameon=True, facecolor="white",
        edgecolor="#CBD5E1", framealpha=0.92, fontsize=7.5, handletextpad=0.5, borderpad=0.4
    )

fig.suptitle(
    "Agregasi Spasial Tipologi Numerasi Pendidikan Tingkat Provinsi di Indonesia (2025)",
    fontsize=12.5, fontweight='bold', y=0.99
)
plt.tight_layout()

out_prov_2x2 = f"{FIG_DIR}/gambar2_peta_klaster_provinsi_choropleth_2x2.png"
fig.savefig(out_prov_2x2, dpi=300, bbox_inches='tight')
plt.close(fig)
print(f"Saved: {out_prov_2x2}")


# ==============================================================================
# OPTION 2: 2x4 (8-PANEL COMPARATIVE FIGURE: ROW 1 MIKRO KABUPATEN, ROW 2 MAKRO PROVINSI)
# ==============================================================================
print("\n[2/3] Generating 2x4 (8-Panel) Comparative Figure: Mikro-Kabupaten vs Makro-Provinsi...")
# 2 Rows of 4 Columns (or 4 Rows of 2 Columns). 4 Rows x 2 Columns is much easier to read in landscape or page width!
# Let's make 2 Rows x 4 Columns (Wide format)
fig_2x4, axes_2x4 = plt.subplots(2, 4, figsize=(22.0, 7.8), dpi=300)

for idx, jenjang in enumerate(JENJANG_ORDER):
    m_info = MORAN_INFO[jenjang]
    sub = df_kab[df_kab["jenjang"] == jenjang].copy()
    dom = sub.groupby(['prov_mapped', 'cluster_name']).size().unstack(fill_value=0).idxmax(axis=1)
    
    # ------------------ TOP ROW: MIKRO KABUPATEN (SCATTER) ------------------
    ax_top = axes_2x4[0, idx]
    gdf_prov.plot(ax=ax_top, color='#F8FAFC', edgecolor='none', zorder=1)
    gdf_prov.boundary.plot(ax=ax_top, color='gray', alpha=0.45, linewidth=0.55, linestyle=':', zorder=2)
    
    for c_name, color in PALETTE_CLUSTER.items():
        m = sub["cluster_name"] == c_name
        ax_top.scatter(
            sub.loc[m, "longitude"], sub.loc[m, "latitude"],
            c=color, s=14, alpha=0.92, edgecolors="white", linewidths=0.25, zorder=4
        )
    ax_top.set_aspect('equal')
    ax_top.set_xlim(LON_MIN, LON_MAX)
    ax_top.set_ylim(LAT_MIN, LAT_MAX)
    ax_top.set_title(
        f"({chr(97+idx)}) {jenjang} (Mikro 514 Daerah)\nMoran's I = {m_info['I']:.2f}",
        fontsize=9.5, fontweight='bold', pad=5
    )
    if idx == 0:
        ax_top.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
    ax_top.grid(True, linestyle='--', alpha=0.3, color='#94A3B8', linewidth=0.4, zorder=3)
    ax_top.xaxis.set_major_locator(ticker.MultipleLocator(15))
    ax_top.yaxis.set_major_locator(ticker.MultipleLocator(5))
    ax_top.tick_params(labelsize=7.5)

    # ------------------ BOTTOM ROW: MAKRO PROVINSI (CHOROPLETH) ------------------
    ax_bot = axes_2x4[1, idx]
    gdf_plot = gdf_prov.copy()
    gdf_plot['dom_cluster'] = gdf_plot['NAME_1'].map(dom)
    gdf_plot['color'] = gdf_plot['dom_cluster'].map(PALETTE_CLUSTER)
    gdf_plot.plot(ax=ax_bot, color=gdf_plot['color'], edgecolor='#334155', linewidth=0.45, zorder=2)
    
    ax_bot.set_aspect('equal')
    ax_bot.set_xlim(LON_MIN, LON_MAX)
    ax_bot.set_ylim(LAT_MIN, LAT_MAX)
    ax_bot.set_title(
        f"({chr(101+idx)}) {jenjang} (Makro 34 Provinsi)\nDominansi Wilayah",
        fontsize=9.5, fontweight='bold', pad=5
    )
    ax_bot.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
    if idx == 0:
        ax_bot.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
    ax_bot.grid(True, linestyle='--', alpha=0.3, color='#94A3B8', linewidth=0.4, zorder=3)
    ax_bot.xaxis.set_major_locator(ticker.MultipleLocator(15))
    ax_bot.yaxis.set_major_locator(ticker.MultipleLocator(5))
    ax_bot.tick_params(labelsize=7.5)

# Shared Legend at Bottom
shared_handles = [
    mpatches.Patch(facecolor="#0072B2", edgecolor='#1E293B', label="Klaster 1: High-Performing Benchmark"),
    mpatches.Patch(facecolor="#E69F00", edgecolor='#1E293B', label="Klaster 2: Pedagogy-Infrastructure Paradox"),
    mpatches.Patch(facecolor="#D55E00", edgecolor='#1E293B', label="Klaster 3: 3T Affirmation Priority"),
]
fig_2x4.legend(
    handles=shared_handles, loc="lower center", ncol=3, frameon=True,
    facecolor="white", edgecolor="#CBD5E1", fontsize=9.5, bbox_to_anchor=(0.5, 0.01)
)

fig_2x4.suptitle(
    "Komparasi Multiskala Tipologi Pendidikan: Resolusi Mikro 514 Kabupaten/Kota (Atas) vs Agregasi Makro Provinsi (Bawah)",
    fontsize=13, fontweight='bold', y=0.99
)
plt.tight_layout(rect=[0, 0.05, 1, 0.96])

out_2x4 = f"{FIG_DIR}/gambar2_peta_klaster_komparasi_makro_mikro_2x4.png"
fig_2x4.savefig(out_2x4, dpi=300, bbox_inches='tight')
plt.close(fig_2x4)
print(f"Saved: {out_2x4}")


# ==============================================================================
# OPTION 3: 4x2 VERTICAL FORMAT (4 Rows of 2 Columns - Ideal for Standard IEEE Page)
# Col 1: Mikro 514 Kab/Kota | Col 2: Makro Provinsi
# ==============================================================================
print("\n[3/3] Generating 4x2 Vertical Comparative Figure (Col 1: Kab/Kota, Col 2: Provinsi)...")
fig_4x2, axes_4x2 = plt.subplots(4, 2, figsize=(15.0, 13.5), dpi=300)

for idx, jenjang in enumerate(JENJANG_ORDER):
    m_info = MORAN_INFO[jenjang]
    sub = df_kab[df_kab["jenjang"] == jenjang].copy()
    dom = sub.groupby(['prov_mapped', 'cluster_name']).size().unstack(fill_value=0).idxmax(axis=1)

    # Col 1: Mikro Kab/Kota
    ax_l = axes_4x2[idx, 0]
    gdf_prov.plot(ax=ax_l, color='#F8FAFC', edgecolor='none', zorder=1)
    gdf_prov.boundary.plot(ax=ax_l, color='gray', alpha=0.45, linewidth=0.55, linestyle=':', zorder=2)
    for c_name, color in PALETTE_CLUSTER.items():
        m = sub["cluster_name"] == c_name
        ax_l.scatter(
            sub.loc[m, "longitude"], sub.loc[m, "latitude"],
            c=color, s=18, alpha=0.92, edgecolors="white", linewidths=0.3, zorder=4
        )
    ax_l.set_aspect('equal')
    ax_l.set_xlim(LON_MIN, LON_MAX)
    ax_l.set_ylim(LAT_MIN, LAT_MAX)
    ax_l.set_title(
        f"({chr(97+idx*2)}) Jenjang {jenjang}: Mikro 514 Kab/Kota — Moran's I = {m_info['I']:.2f}",
        fontsize=9.5, fontweight='bold', pad=5
    )
    ax_l.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
    if idx == 3:
        ax_l.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
    ax_l.grid(True, linestyle='--', alpha=0.3, color='#94A3B8', linewidth=0.4, zorder=3)
    ax_l.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax_l.yaxis.set_major_locator(ticker.MultipleLocator(5))

    # Col 2: Makro Provinsi
    ax_r = axes_4x2[idx, 1]
    gdf_plot = gdf_prov.copy()
    gdf_plot['dom_cluster'] = gdf_plot['NAME_1'].map(dom)
    gdf_plot['color'] = gdf_plot['dom_cluster'].map(PALETTE_CLUSTER)
    gdf_plot.plot(ax=ax_r, color=gdf_plot['color'], edgecolor='#1E293B', linewidth=0.55, zorder=2)
    ax_r.set_aspect('equal')
    ax_r.set_xlim(LON_MIN, LON_MAX)
    ax_r.set_ylim(LAT_MIN, LAT_MAX)
    ax_r.set_title(
        f"({chr(98+idx*2)}) Jenjang {jenjang}: Makro 34 Provinsi (Tipologi Dominan)",
        fontsize=9.5, fontweight='bold', pad=5
    )
    if idx == 3:
        ax_r.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
    ax_r.grid(True, linestyle='--', alpha=0.3, color='#94A3B8', linewidth=0.4, zorder=3)
    ax_r.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax_r.yaxis.set_major_locator(ticker.MultipleLocator(5))

fig_4x2.legend(
    handles=shared_handles, loc="lower center", ncol=3, frameon=True,
    facecolor="white", edgecolor="#CBD5E1", fontsize=10, bbox_to_anchor=(0.5, 0.01)
)
fig_4x2.suptitle(
    "Komparasi Resolusi Mikro (514 Kabupaten/Kota) vs Makro (34 Provinsi) Tipologi Pendidikan",
    fontsize=13, fontweight='bold', y=0.99
)
plt.tight_layout(rect=[0, 0.035, 1, 0.97])

out_4x2 = f"{FIG_DIR}/gambar2_peta_klaster_komparasi_makro_mikro_4x2.png"
fig_4x2.savefig(out_4x2, dpi=300, bbox_inches='tight')
plt.close(fig_4x2)
print(f"Saved: {out_4x2}")

print("\nALL VARIATIONS GENERATED SUCCESSFULLY!")
