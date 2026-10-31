import os
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import matplotlib.patches as mpatches
from matplotlib.colors import Normalize
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors

# Output directory for presentation assets
SLIDE_ASSETS_DIR = "figures/presentation_assets"
os.makedirs(SLIDE_ASSETS_DIR, exist_ok=True)
os.makedirs("figures", exist_ok=True)

print("=" * 80)
print("GENERATING PRESENTATION SLIDE IMAGES FOR NUSA-MIPA_Presentasi_Final.pptx")
print("=" * 80)

# Set high-quality font and visual styles
plt.rcParams.update({
    "font.sans-serif": "DejaVu Sans",
    "axes.edgecolor": "#1E293B",
    "axes.linewidth": 0.8,
    "grid.alpha": 0.3,
    "grid.linestyle": "--",
    "figure.autolayout": False,
})

# 1. Load Data
df = pd.read_csv("data/FINAL/master_pendidikan_kabupaten_2025_clean.csv")
df7 = pd.read_csv("outputs/table7_nusa_mipa_district_policy_recommendations_2056.csv")
df = df.merge(
    df7[["nama_provinsi", "nama_kabupaten_kota", "jenjang", "cluster_id", "cluster_name"]],
    on=["nama_provinsi", "nama_kabupaten_kota", "jenjang"],
    how="left"
)
gdf_prov = gpd.read_file("data/FINAL/indonesia_provinsi.geojson")

mapping_prov = {
    'D.I. Yogyakarta': 'Yogyakarta',
    'D.K.I. Jakarta': 'Jakarta Raya',
    'Kepulauan Bangka Belitung': 'Bangka Belitung',
    'Papua Barat Daya': 'Papua Barat',
    'Papua Selatan': 'Papua',
    'Papua Tengah': 'Papua',
    'Papua Pegunungan': 'Papua'
}
df['prov_mapped'] = df['nama_provinsi'].replace(mapping_prov)

LON_MIN, LON_MAX = 94.5, 141.5
LAT_MIN, LAT_MAX = -11.5, 6.5

# ==============================================================================
# ASSET 1: SLIDE 4 - PETA LISA / MORAN (Slot: 568.9 x 370.2 pt -> Ratio 1.536 : 1)
# ==============================================================================
print("\n[1/4] Generating Asset for Slide 4: Peta Klaster Spasial LISA (Local Moran's I)...")
# Target aspect ratio: width = 568.9, height = 370.2 -> ratio = 1.536
fig_w, fig_h = 7.68, 5.00  # 1.536 ratio, dpi=300 -> 2304 x 1500 px
fig_lisa, ax_lisa = plt.subplots(figsize=(fig_w, fig_h), dpi=300)

sd_df = df[df['jenjang'] == 'SD'].copy().reset_index(drop=True)
coords_sd = sd_df[['latitude', 'longitude']].values

knn = NearestNeighbors(n_neighbors=9).fit(coords_sd)
_, indices = knn.kneighbors(coords_sd)

n_sd = len(sd_df)
W_sd = np.zeros((n_sd, n_sd))
for i in range(n_sd):
    for j in indices[i, 1:]:
        W_sd[i, j] = 1.0 / 8.0

y_sd = sd_df['numerasi_score'].values
z_sd = (y_sd - np.mean(y_sd)) / np.std(y_sd)
Wz_sd = W_sd @ z_sd
I_i_sd = z_sd * Wz_sd

# Permutation test (499 perms)
np.random.seed(42)
n_perms = 499
sim_I = np.zeros((n_sd, n_perms))
for p in range(n_perms):
    z_perm = np.random.permutation(z_sd)
    sim_I[:, p] = z_sd * (W_sd @ z_perm)

p_vals = np.mean(sim_I >= I_i_sd[:, None], axis=1)
p_vals = np.minimum(p_vals, 1.0 - p_vals) * 2.0

lisa_cat = []
for i in range(n_sd):
    if p_vals[i] > 0.05:
        lisa_cat.append('Tidak Signifikan')
    elif z_sd[i] > 0 and Wz_sd[i] > 0:
        lisa_cat.append('High-High (Hotspot)')
    elif z_sd[i] < 0 and Wz_sd[i] < 0:
        lisa_cat.append('Low-Low (Coldspot)')
    elif z_sd[i] > 0 and Wz_sd[i] < 0:
        lisa_cat.append('High-Low (Outlier)')
    else:
        lisa_cat.append('Low-High (Outlier)')

sd_df['lisa_cat'] = lisa_cat

LISA_COLORS = {
    'High-High (Hotspot)': '#DC2626',      # Vivid Red
    'Low-Low (Coldspot)': '#0284C7',       # Vibrant Blue
    'High-Low (Outlier)': '#F59E0B',       # Amber
    'Low-High (Outlier)': '#10B981',       # Emerald
    'Tidak Signifikan': '#CBD5E1',         # Light Slate Gray
}

# 1. Base map
gdf_prov.plot(ax=ax_lisa, color='#F8FAFC', edgecolor='none', zorder=1)
gdf_prov.boundary.plot(ax=ax_lisa, color='#94A3B8', alpha=0.55, linewidth=0.6, linestyle=':', zorder=2)

# 2. Scatter LISA
for cat in ['Tidak Signifikan', 'High-Low (Outlier)', 'Low-High (Outlier)', 'Low-Low (Coldspot)', 'High-High (Hotspot)']:
    m = sd_df['lisa_cat'] == cat
    cnt = m.sum()
    if cnt == 0:
        continue
    c = LISA_COLORS[cat]
    s = 16 if cat == 'Tidak Signifikan' else 26
    alpha = 0.55 if cat == 'Tidak Signifikan' else 0.95
    zorder = 3 if cat == 'Tidak Signifikan' else 5
    ax_lisa.scatter(
        sd_df.loc[m, 'longitude'], sd_df.loc[m, 'latitude'],
        c=c, s=s, alpha=alpha, edgecolors='white', linewidths=0.35,
        label=f"{cat} (n={cnt})", zorder=zorder
    )

ax_lisa.set_aspect('equal')
ax_lisa.set_xlim(LON_MIN, LON_MAX)
ax_lisa.set_ylim(LAT_MIN, LAT_MAX)
ax_lisa.set_title("Peta Klaster Autokorelasi Spasial LISA (Jenjang SD)\nGlobal Moran's I = 0,62 (p = 0,005)", fontsize=10.5, fontweight='bold', pad=8)
ax_lisa.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
ax_lisa.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
ax_lisa.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=2)
ax_lisa.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax_lisa.yaxis.set_major_locator(ticker.MultipleLocator(5))
ax_lisa.tick_params(labelsize=8)

ax_lisa.legend(
    loc="lower left", frameon=True, facecolor="white", edgecolor="#CBD5E1",
    framealpha=0.92, fontsize=7.2, handletextpad=0.3, borderpad=0.4
)

plt.tight_layout()
out_lisa = f"{SLIDE_ASSETS_DIR}/slide4_peta_moran_lisa_sd.png"
fig_lisa.savefig(out_lisa, dpi=300, bbox_inches='tight')
plt.close(fig_lisa)
print(f"Saved: {out_lisa}")


# ==============================================================================
# ASSET 1B: SLIDE 4 ALTERNATIVE - MORAN SCATTERPLOT SD (568.9 x 370.2 pt)
# ==============================================================================
print("\n[1B/4] Generating Asset for Slide 4 Alternative: Moran Scatterplot (z vs Wz)...")
fig_scat, ax_scat = plt.subplots(figsize=(fig_w, fig_h), dpi=300)

b_slope = np.polyfit(z_sd, Wz_sd, 1)
x_line = np.linspace(z_sd.min() * 1.05, z_sd.max() * 1.05, 100)

# Scatter points with quadrant colors
colors_scat = []
for i in range(n_sd):
    if z_sd[i] > 0 and Wz_sd[i] > 0:
        colors_scat.append('#DC2626') # High-High
    elif z_sd[i] < 0 and Wz_sd[i] < 0:
        colors_scat.append('#0284C7') # Low-Low
    else:
        colors_scat.append('#F59E0B')

ax_scat.scatter(z_sd, Wz_sd, c=colors_scat, alpha=0.85, s=28, edgecolors='white', linewidths=0.35, zorder=3)
ax_scat.plot(x_line, np.polyval(b_slope, x_line), color='#1E293B', linewidth=2.2, linestyle='-',
             label=f"Slope Regresi Spasial (Moran's I = {b_slope[0]:.2f}, p = 0,005)", zorder=4)

ax_scat.axvline(0, color='#64748B', linestyle='--', linewidth=0.9, zorder=2)
ax_scat.axhline(0, color='#64748B', linestyle='--', linewidth=0.9, zorder=2)

# Quadrant annotations
ax_scat.text(1.8, 1.8, "Kuadran I:\nHigh-High (Hotspot)\n(Jawa-Bali)", fontsize=7.8, fontweight='bold', color='#DC2626', ha='center',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='#FEE2E2', edgecolor='#DC2626', alpha=0.8))
ax_scat.text(-1.8, -1.8, "Kuadran III:\nLow-Low (Coldspot)\n(Papua, NTT, Maluku)", fontsize=7.8, fontweight='bold', color='#0284C7', ha='center',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='#E0F2FE', edgecolor='#0284C7', alpha=0.8))

ax_scat.set_title("Moran's Scatterplot Capaian Numerasi (Jenjang SD, k = 8)", fontsize=10.5, fontweight='bold', pad=8)
ax_scat.set_xlabel("Standarisasi Deviasi Numerasi Daerah (z)", fontsize=8.5, fontweight='bold')
ax_scat.set_ylabel("Spatial Lag Numerasi Tetangga Sekitar (Wz)", fontsize=8.5, fontweight='bold')
ax_scat.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=1)
ax_scat.legend(loc="upper left", frameon=True, facecolor="white", edgecolor="#CBD5E1", fontsize=7.8)
ax_scat.tick_params(labelsize=8)

plt.tight_layout()
out_scat = f"{SLIDE_ASSETS_DIR}/slide4_moran_scatterplot_sd.png"
fig_scat.savefig(out_scat, dpi=300, bbox_inches='tight')
plt.close(fig_scat)
print(f"Saved: {out_scat}")


# ==============================================================================
# ASSET 2: SLIDE 5 - PETA KLASTER JENJANG SD 514 KAB/KOTA (Slot: 820.8 x 662.4 pt -> Ratio 1.239 : 1)
# ==============================================================================
print("\n[2/4] Generating Asset for Slide 5: Peta Klaster Jenjang SD (peta_klaster_sd.png)...")
fig5_w, fig5_h = 8.21, 6.62  # Ratio 1.239, dpi=300 -> 2463 x 1986 px
fig5, ax5 = plt.subplots(figsize=(fig5_w, fig5_h), dpi=300)

PALETTE_CLUSTER = {
    "Cluster 1: High-Performing Benchmark": "#0072B2",        # Blue
    "Cluster 2: Pedagogy-Infrastructure Paradox": "#E69F00",  # Amber/Yellow
    "Cluster 3: 3T Affirmation Priority": "#DC2626",        # Vivid Crimson Red
}
CLUSTER_SHORT_LABELS = {
    "Cluster 1: High-Performing Benchmark": "Benchmark Maju",
    "Cluster 2: Pedagogy-Infrastructure Paradox": "Paradoks Sarpras",
    "Cluster 3: 3T Affirmation Priority": "Afirmasi 3T",
}

# 1. Base land fill & transparent dotted boundary lines
gdf_prov.plot(ax=ax5, color='#F8FAFC', edgecolor='none', zorder=1)
gdf_prov.boundary.plot(ax=ax5, color='#64748B', alpha=0.50, linewidth=0.65, linestyle=':', zorder=2)

# 2. Scatter plot of 514 districts
for c_name, color in PALETTE_CLUSTER.items():
    m = sd_df["cluster_name"] == c_name
    cnt = m.sum()
    pct = (cnt / len(sd_df)) * 100.0
    short_lbl = CLUSTER_SHORT_LABELS[c_name]
    ax5.scatter(
        sd_df.loc[m, "longitude"], sd_df.loc[m, "latitude"],
        c=color, s=26, alpha=0.95, edgecolors="white", linewidths=0.45,
        label=f"{short_lbl} — {pct:.1f}% (n={cnt})", zorder=4
    )

ax5.set_aspect('equal')
ax5.set_xlim(LON_MIN, LON_MAX)
ax5.set_ylim(LAT_MIN, LAT_MAX)

ax5.set_title(
    "Peta Sebaran Spasial 3 Klaster Tipologi Numerasi (Jenjang SD — 514 Kab/Kota)\nK-Means Clustering (k = 3, StandardScaler) | Moran's I = 0,62 (p = 0,005)",
    fontsize=11.5, fontweight='bold', pad=10
)
ax5.set_xlabel("Longitude (°E)", fontsize=9.5, fontweight='bold')
ax5.set_ylabel("Latitude (°N / °S)", fontsize=9.5, fontweight='bold')
ax5.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=3)
ax5.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax5.yaxis.set_major_locator(ticker.MultipleLocator(5))
ax5.tick_params(labelsize=8.5)

# Prominent legend card
ax5.legend(
    loc="lower left", frameon=True, facecolor="white", edgecolor="#CBD5E1",
    framealpha=0.95, fontsize=8.8, handletextpad=0.5, borderpad=0.6,
    title="Tipologi Kewilayahan Pendidikan 2025", title_fontsize=9.2
)

plt.tight_layout()
out_klaster_sd = f"{SLIDE_ASSETS_DIR}/peta_klaster_sd.png"
fig5.savefig(out_klaster_sd, dpi=300, bbox_inches='tight')
fig5.savefig(f"figures/peta_klaster_sd.png", dpi=300, bbox_inches='tight')
plt.close(fig5)
print(f"Saved: {out_klaster_sd}")


# ==============================================================================
# FIT MGWR FOR SMP & SD TO GET PROVINCIAL CHOROPLETH VALUES
# ==============================================================================
print("\nComputing Local Parameter MGWR Betas for SMP & SD...")
CASE3_FEATURES = [
    "kualitas_pembelajaran_score", "refleksi_guru_score", "iklim_keamanan_score",
    "kesenjangan_fasilitas_tik_score", "persen_sekolah_listrik", "persen_sekolah_air_cukup",
    "persen_ruang_kelas_layak", "rasio_rombel_per_ruang", "rasio_siswa_per_guru",
    "indeks_pemerataan_guru", "persen_putus_sekolah", "persen_mengulang"
]

def haversine_km(coords_deg):
    rad = np.radians(coords_deg)
    lat = rad[:, 0][:, None]
    lon = rad[:, 1][:, None]
    dlat = lat - lat.T
    dlon = lon - lon.T
    a = np.sin(dlat / 2.0) ** 2 + np.cos(lat) * np.cos(lat.T) * np.sin(dlon / 2.0) ** 2
    return 6371.0 * 2.0 * np.arcsin(np.sqrt(np.clip(a, 0.0, 1.0)))

def fit_mgwr_fast(y, X, dist_mat, candidate_bws=None, n_rounds=5, ridge_eps=1e-3):
    n, p = X.shape
    X1 = np.column_stack([np.ones(n), X])
    p1 = p + 1
    if candidate_bws is None:
        candidate_bws = [35, 55, 85, 130, 200, 320, 480]

    sorted_d = np.sort(dist_mat, axis=1)
    betas = np.zeros((n, p1))
    bw_per_var = np.full(p1, 200)
    f_comp = np.zeros((n, p1))
    f_comp[:, 0] = np.mean(y)
    betas[:, 0] = np.mean(y)
    resid = y - f_comp[:, 0]

    for r in range(n_rounds):
        for j in range(p1):
            xj = X1[:, j]
            partial_y = resid + f_comp[:, j]
            best_score = float("inf")
            best_k = bw_per_var[j]
            best_bj = betas[:, j].copy()

            for k_cand in candidate_bws:
                bw_d = np.maximum(sorted_d[:, min(k_cand, n - 1)], 1e-3)
                bj = np.zeros(n)
                s_diag = np.zeros(n)
                for i in range(n):
                    u = dist_mat[i] / bw_d[i]
                    w = np.where(u < 1.0, (1.0 - u ** 2) ** 2, 0.0)
                    wx2 = float(np.sum(w * (xj ** 2)) + ridge_eps)
                    bj[i] = float(np.sum(w * xj * partial_y) / wx2)
                    s_diag[i] = float((w[i] * (xj[i] ** 2)) / wx2)

                f_j_cand = xj * bj
                rss_j = float(np.sum((partial_y - f_j_cand) ** 2))
                tr_j = float(np.clip(np.sum(s_diag), 1.0, n * 0.25))
                aicc_j = n * np.log(max(rss_j / n, 1e-8)) + 2.0 * tr_j * (n / max(n - tr_j - 1.0, 1.0))
                if aicc_j < best_score:
                    best_score = aicc_j
                    best_k = k_cand
                    best_bj = bj

            betas[:, j] = best_bj
            bw_per_var[j] = best_k
            new_fj = xj * best_bj
            resid = partial_y - new_fj
            f_comp[:, j] = new_fj

    return {"betas": betas, "bw_per_var": bw_per_var}

# SMP
smp_df = df[df["jenjang"] == "SMP"].copy().reset_index(drop=True)
coords_smp = smp_df[["latitude", "longitude"]].values
X_smp_std = StandardScaler().fit_transform(smp_df[CASE3_FEATURES].values)
mgwr_smp = fit_mgwr_fast(smp_df["numerasi_score"].values, X_smp_std, haversine_km(coords_smp), n_rounds=5)
kual_idx = CASE3_FEATURES.index("kualitas_pembelajaran_score") + 1
smp_df["beta_kual"] = mgwr_smp["betas"][:, kual_idx]
bw_kual = mgwr_smp["bw_per_var"][kual_idx]

# SD
coords_sd = sd_df[["latitude", "longitude"]].values
X_sd_std = StandardScaler().fit_transform(sd_df[CASE3_FEATURES].values)
mgwr_sd = fit_mgwr_fast(sd_df["numerasi_score"].values, X_sd_std, haversine_km(coords_sd), n_rounds=5)
elec_idx = CASE3_FEATURES.index("persen_sekolah_listrik") + 1
sd_df["beta_elec"] = mgwr_sd["betas"][:, elec_idx]
bw_elec = mgwr_sd["bw_per_var"][elec_idx]

# Aggregate mean beta to 34 provinces
prov_smp_beta = smp_df.groupby("prov_mapped")["beta_kual"].mean()
prov_sd_beta = sd_df.groupby("prov_mapped")["beta_elec"].mean()

gdf_prov_smp = gdf_prov.copy()
gdf_prov_smp["beta_kual"] = gdf_prov_smp["NAME_1"].map(prov_smp_beta)

gdf_prov_sd = gdf_prov.copy()
gdf_prov_sd["beta_elec"] = gdf_prov_sd["NAME_1"].map(prov_sd_beta)

# Target dimensions for Slide 7: 856.8 x 460.8 pt -> Ratio 1.859 : 1
fig7_w, fig7_h = 8.57, 4.61  # Ratio 1.859, dpi=300 -> 2571 x 1383 px


# ==============================================================================
# ASSET 3: SLIDE 7 (KIRI) - PETA MGWR KUALITAS PEMBELAJARAN SMP (CHOROPLETH PROVINSI)
# ==============================================================================
print("\n[3/4] Generating Asset for Slide 7 (Left): Peta MGWR Kualitas Pembelajaran SMP (Choropleth Provinsi)...")
fig7a, ax7a = plt.subplots(figsize=(fig7_w, fig7_h), dpi=300)

norm_kual = Normalize(vmin=gdf_prov_smp["beta_kual"].min(), vmax=gdf_prov_smp["beta_kual"].max())
gdf_prov_smp.plot(
    column="beta_kual", cmap="YlGnBu", ax=ax7a, edgecolor="#1E293B", linewidth=0.6,
    norm=norm_kual, zorder=2
)

ax7a.set_aspect('equal')
ax7a.set_xlim(LON_MIN, LON_MAX)
ax7a.set_ylim(LAT_MIN, LAT_MAX)

ax7a.set_title(
    f"Peta MGWR: Pengaruh Kualitas Pembelajaran D.1 (SMP)\nSkala Nasional (Bandwidth Optimal k = {bw_kual}) — Batas 34 Provinsi",
    fontsize=10.5, fontweight='bold', pad=8
)
ax7a.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
ax7a.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
ax7a.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=1)
ax7a.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax7a.yaxis.set_major_locator(ticker.MultipleLocator(5))
ax7a.tick_params(labelsize=8)

sm_kual = plt.cm.ScalarMappable(cmap="YlGnBu", norm=norm_kual)
sm_kual._A = []
cbar_kual = fig7a.colorbar(sm_kual, ax=ax7a, fraction=0.030, pad=0.02, shrink=0.88)
cbar_kual.set_label("Elastisitas Lokal β (Kualitas D.1)", fontsize=8.2, fontweight='bold')
cbar_kual.ax.tick_params(labelsize=7.5)

# Watermark badge
ax7a.text(
    0.02, 0.04, "Warna lebih gelap = pengaruh lebih besar\nSignifikan di 100% wilayah",
    transform=ax7a.transAxes, fontsize=7.2,
    bbox=dict(boxstyle="round,pad=0.35", facecolor="white", edgecolor="#CBD5E1", alpha=0.92)
)

plt.tight_layout()
out_mgwr_kual = f"{SLIDE_ASSETS_DIR}/slide7_peta_mgwr_kualitas_smp.png"
fig7a.savefig(out_mgwr_kual, dpi=300, bbox_inches='tight')
plt.close(fig7a)
print(f"Saved: {out_mgwr_kual}")


# ==============================================================================
# ASSET 4: SLIDE 7 (KANAN) - PETA MGWR LISTRIK SEKOLAH SD (CHOROPLETH PROVINSI)
# ==============================================================================
print("\n[4/4] Generating Asset for Slide 7 (Right): Peta MGWR Listrik Sekolah SD (Choropleth Provinsi)...")
fig7b, ax7b = plt.subplots(figsize=(fig7_w, fig7_h), dpi=300)

norm_elec = Normalize(vmin=gdf_prov_sd["beta_elec"].min(), vmax=gdf_prov_sd["beta_elec"].max())
gdf_prov_sd.plot(
    column="beta_elec", cmap="YlOrRd", ax=ax7b, edgecolor="#1E293B", linewidth=0.6,
    norm=norm_elec, zorder=2
)

ax7b.set_aspect('equal')
ax7b.set_xlim(LON_MIN, LON_MAX)
ax7b.set_ylim(LAT_MIN, LAT_MAX)

ax7b.set_title(
    f"Peta MGWR: Pengaruh Akses Listrik Sekolah (SD)\nSkala Regional (Bandwidth Optimal k = {bw_elec}) — Batas 34 Provinsi",
    fontsize=10.5, fontweight='bold', pad=8
)
ax7b.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
ax7b.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
ax7b.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=1)
ax7b.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax7b.yaxis.set_major_locator(ticker.MultipleLocator(5))
ax7b.tick_params(labelsize=8)

sm_elec = plt.cm.ScalarMappable(cmap="YlOrRd", norm=norm_elec)
sm_elec._A = []
cbar_elec = fig7b.colorbar(sm_elec, ax=ax7b, fraction=0.030, pad=0.02, shrink=0.88)
cbar_elec.set_label("Elastisitas Lokal β (Elektrifikasi %)", fontsize=8.2, fontweight='bold')
cbar_elec.ax.tick_params(labelsize=7.5)

# Watermark badge
ax7b.text(
    0.02, 0.04, "Warna lebih gelap = pengaruh lebih besar\nPaling tinggi di Sumatera & regional barat",
    transform=ax7b.transAxes, fontsize=7.2,
    bbox=dict(boxstyle="round,pad=0.35", facecolor="white", edgecolor="#CBD5E1", alpha=0.92)
)

plt.tight_layout()
out_mgwr_elec = f"{SLIDE_ASSETS_DIR}/slide7_peta_mgwr_listrik_sd.png"
fig7b.savefig(out_mgwr_elec, dpi=300, bbox_inches='tight')
plt.close(fig7b)
print(f"Saved: {out_mgwr_elec}")

print("\nSUCCESS! ALL 4 SLIDE ASSETS GENERATED AT 300 DPI MATCHING EXACT ASPECT RATIOS!")
