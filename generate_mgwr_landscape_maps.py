import os
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
from sklearn.preprocessing import StandardScaler

# Ensure directories exist
OUTPUT_DIR = "outputs"
FIG_DIR = "figures"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(FIG_DIR, exist_ok=True)

print("=" * 75)
print("GENERATING PERFECT LANDSCAPE MGWR ELASTICITY MAPS (GAMBAR 4)")
print("Aspect Ratio: Locked 1:1 Geographic (Zero Vertical Distortion / Stretching)")
print("=" * 75)

# 1. Load Dataset
data_path = "data/FINAL/master_pendidikan_kabupaten_2025_clean.csv"
if not os.path.exists(data_path):
    data_path = "master_pendidikan_kabupaten_2025_clean.csv"

df = pd.read_csv(data_path)
print(f"Loaded district dataset: {len(df)} records across 514 districts.")

# 2. Load Indonesia Provincial Basemap
geojson_path = "data/FINAL/indonesia_provinsi.geojson"
gdf_prov = gpd.read_file(geojson_path)
print(f"Loaded Indonesia provinces GeoJSON: {len(gdf_prov)} provinces.")

# 3. MGWR Backfitting Implementation
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

def fit_mgwr_backfitting(y, X, dist_mat, candidate_bws=None, n_rounds=5, ridge_eps=1e-3):
    n, p = X.shape
    X1 = np.column_stack([np.ones(n), X])
    p1 = p + 1
    if candidate_bws is None:
        candidate_bws = [35, 55, 85, 130, 200, 320, 480]

    sorted_d = np.sort(dist_mat, axis=1)
    betas = np.zeros((n, p1))
    se_betas = np.zeros((n, p1))
    bw_per_var = np.full(p1, 200)
    enp_per_var = np.ones(p1)
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
            best_sej = se_betas[:, j].copy()
            best_tr = 1.0

            for k_cand in candidate_bws:
                bw_d = np.maximum(sorted_d[:, min(k_cand, n - 1)], 1e-3)
                bj = np.zeros(n)
                sej = np.zeros(n)
                s_diag = np.zeros(n)
                for i in range(n):
                    u = dist_mat[i] / bw_d[i]
                    w = np.where(u < 1.0, (1.0 - u ** 2) ** 2, 0.0)
                    wx2 = float(np.sum(w * (xj ** 2)) + ridge_eps)
                    bj[i] = float(np.sum(w * xj * partial_y) / wx2)
                    s_diag[i] = float((w[i] * (xj[i] ** 2)) / wx2)
                    sej[i] = np.sqrt(float(np.sum((w * xj) ** 2)) / (wx2 ** 2))

                f_j_cand = xj * bj
                rss_j = float(np.sum((partial_y - f_j_cand) ** 2))
                tr_j = float(np.clip(np.sum(s_diag), 1.0, n * 0.25))
                aicc_j = n * np.log(max(rss_j / n, 1e-8)) + 2.0 * tr_j * (n / max(n - tr_j - 1.0, 1.0))
                if aicc_j < best_score:
                    best_score = aicc_j
                    best_k = k_cand
                    best_bj = bj
                    best_sej = sej
                    best_tr = tr_j

            betas[:, j] = best_bj
            se_betas[:, j] = best_sej
            bw_per_var[j] = best_k
            enp_per_var[j] = best_tr
            new_fj = xj * best_bj
            resid = partial_y - new_fj
            f_comp[:, j] = new_fj

    return {"betas": betas, "bw_per_var": bw_per_var}

# 4. Compute MGWR for SMP and SD with 5 backfitting rounds
print("Fitting MGWR for SMP level (n_rounds=5)...")
smp_df = df[df["jenjang"] == "SMP"].copy().reset_index(drop=True)
coords_smp = smp_df[["latitude", "longitude"]].values
X_smp_std = StandardScaler().fit_transform(smp_df[CASE3_FEATURES].values)
dist_smp = haversine_km(coords_smp)
mgwr_smp = fit_mgwr_backfitting(smp_df["numerasi_score"].values, X_smp_std, dist_smp, n_rounds=5)

kual_idx = CASE3_FEATURES.index("kualitas_pembelajaran_score") + 1
beta_kual = mgwr_smp["betas"][:, kual_idx]
bw_kual = mgwr_smp["bw_per_var"][kual_idx]
print(f"  -> SMP Instructional Quality D.1: BW = {bw_kual}, Beta range = [{beta_kual.min():.2f}, {beta_kual.max():.2f}], Mean = {beta_kual.mean():.2f}")

print("Fitting MGWR for SD level (n_rounds=5)...")
sd_df = df[df["jenjang"] == "SD"].copy().reset_index(drop=True)
coords_sd = sd_df[["latitude", "longitude"]].values
X_sd_std = StandardScaler().fit_transform(sd_df[CASE3_FEATURES].values)
dist_sd = haversine_km(coords_sd)
mgwr_sd = fit_mgwr_backfitting(sd_df["numerasi_score"].values, X_sd_std, dist_sd, n_rounds=5)

elec_idx = CASE3_FEATURES.index("persen_sekolah_listrik") + 1
beta_elec = mgwr_sd["betas"][:, elec_idx]
bw_elec = mgwr_sd["bw_per_var"][elec_idx]
print(f"  -> SD School Electrification: BW = {bw_elec}, Beta range = [{beta_elec.min():.2f}, {beta_elec.max():.2f}], Mean = {beta_elec.mean():.2f}")

# Geographic Bounding Box for Indonesia
LON_MIN, LON_MAX = 94.5, 141.5
LAT_MIN, LAT_MAX = -11.5, 6.5

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#1E293B'
plt.rcParams['axes.linewidth'] = 0.75

# ==============================================================================
# FIGURE A: WIDE LANDSCAPE (2-Column Full Width IEEE)
# ==============================================================================
print("\nGenerating Figure A: Wide Landscape (2-Column IEEE Format)...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15.5, 4.4), dpi=300)

# (a) SMP
gdf_prov.plot(ax=ax1, color='#F1F5F9', edgecolor='#CBD5E1', linewidth=0.5, zorder=1)
sc1 = ax1.scatter(
    smp_df["longitude"], smp_df["latitude"],
    c=beta_kual, cmap="YlGnBu", s=25, edgecolors="#0F172A", linewidths=0.35, zorder=3, alpha=0.95
)
ax1.set_aspect('equal')
ax1.set_xlim(LON_MIN, LON_MAX)
ax1.set_ylim(LAT_MIN, LAT_MAX)
ax1.set_title(f"(a) SMP: Instructional Quality Elasticity (Optimal BW k={bw_kual})", fontsize=10.5, fontweight='bold', pad=8)
ax1.set_xlabel("Longitude (°E)", fontsize=9, fontweight='bold')
ax1.set_ylabel("Latitude (°N / °S)", fontsize=9, fontweight='bold')
ax1.grid(True, linestyle='--', alpha=0.45, color='#94A3B8', linewidth=0.5, zorder=2)
ax1.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax1.yaxis.set_major_locator(ticker.MultipleLocator(5))
cbar1 = plt.colorbar(sc1, ax=ax1, fraction=0.030, pad=0.02, shrink=0.88)
cbar1.set_label("Local Elasticity β (D.1)", fontsize=8.5, fontweight='bold')
cbar1.ax.tick_params(labelsize=8)

# (b) SD
gdf_prov.plot(ax=ax2, color='#F1F5F9', edgecolor='#CBD5E1', linewidth=0.5, zorder=1)
sc2 = ax2.scatter(
    sd_df["longitude"], sd_df["latitude"],
    c=beta_elec, cmap="YlOrRd", s=25, edgecolors="#0F172A", linewidths=0.35, zorder=3, alpha=0.95
)
ax2.set_aspect('equal')
ax2.set_xlim(LON_MIN, LON_MAX)
ax2.set_ylim(LAT_MIN, LAT_MAX)
ax2.set_title(f"(b) SD: School Electrification Elasticity (Optimal BW k={bw_elec})", fontsize=10.5, fontweight='bold', pad=8)
ax2.set_xlabel("Longitude (°E)", fontsize=9, fontweight='bold')
ax2.set_ylabel("Latitude (°N / °S)", fontsize=9, fontweight='bold')
ax2.grid(True, linestyle='--', alpha=0.45, color='#94A3B8', linewidth=0.5, zorder=2)
ax2.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax2.yaxis.set_major_locator(ticker.MultipleLocator(5))
cbar2 = plt.colorbar(sc2, ax=ax2, fraction=0.030, pad=0.02, shrink=0.88)
cbar2.set_label("Local Elasticity β (Electrification %)", fontsize=8.5, fontweight='bold')
cbar2.ax.tick_params(labelsize=8)

plt.tight_layout()
out_fig9 = f"{FIG_DIR}/fig9_mgwr_local_parameter_maps.png"
out_2col = f"{FIG_DIR}/gambar4_peta_elastisitas_mgwr_landscape_2col.png"
fig.savefig(out_fig9, dpi=300, bbox_inches='tight')
fig.savefig(out_2col, dpi=300, bbox_inches='tight')
plt.close(fig)
print(f"Saved: {out_fig9}")
print(f"Saved: {out_2col}")

# ==============================================================================
# FIGURE B: STACKED FORMAT (Optimized for 1-Column IEEE Layout)
# ==============================================================================
print("\nGenerating Figure B: Stacked Format (1-Column IEEE Layout)...")
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8.8, 7.2), dpi=300)

# (a) SMP
gdf_prov.plot(ax=ax1, color='#F1F5F9', edgecolor='#CBD5E1', linewidth=0.45, zorder=1)
sc1 = ax1.scatter(
    smp_df["longitude"], smp_df["latitude"],
    c=beta_kual, cmap="YlGnBu", s=22, edgecolors="#0F172A", linewidths=0.3, zorder=3, alpha=0.95
)
ax1.set_aspect('equal')
ax1.set_xlim(LON_MIN, LON_MAX)
ax1.set_ylim(LAT_MIN, LAT_MAX)
ax1.set_title(f"(a) SMP: Instructional Quality Elasticity (Optimal BW k={bw_kual})", fontsize=10, fontweight='bold', pad=7)
ax1.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
ax1.grid(True, linestyle='--', alpha=0.45, color='#94A3B8', linewidth=0.5, zorder=2)
ax1.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax1.yaxis.set_major_locator(ticker.MultipleLocator(5))
cbar1 = plt.colorbar(sc1, ax=ax1, fraction=0.026, pad=0.02, shrink=0.88)
cbar1.set_label("Local β (D.1)", fontsize=8, fontweight='bold')
cbar1.ax.tick_params(labelsize=7.5)

# (b) SD
gdf_prov.plot(ax=ax2, color='#F1F5F9', edgecolor='#CBD5E1', linewidth=0.45, zorder=1)
sc2 = ax2.scatter(
    sd_df["longitude"], sd_df["latitude"],
    c=beta_elec, cmap="YlOrRd", s=22, edgecolors="#0F172A", linewidths=0.3, zorder=3, alpha=0.95
)
ax2.set_aspect('equal')
ax2.set_xlim(LON_MIN, LON_MAX)
ax2.set_ylim(LAT_MIN, LAT_MAX)
ax2.set_title(f"(b) SD: School Electrification Elasticity (Optimal BW k={bw_elec})", fontsize=10, fontweight='bold', pad=7)
ax2.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
ax2.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
ax2.grid(True, linestyle='--', alpha=0.45, color='#94A3B8', linewidth=0.5, zorder=2)
ax2.xaxis.set_major_locator(ticker.MultipleLocator(10))
ax2.yaxis.set_major_locator(ticker.MultipleLocator(5))
cbar2 = plt.colorbar(sc2, ax=ax2, fraction=0.026, pad=0.02, shrink=0.88)
cbar2.set_label("Local β (Listrik %)", fontsize=8, fontweight='bold')
cbar2.ax.tick_params(labelsize=7.5)

plt.tight_layout()
out_stacked = f"{FIG_DIR}/gambar4_peta_elastisitas_mgwr_stacked_1col.png"
fig.savefig(out_stacked, dpi=300, bbox_inches='tight')
plt.close(fig)
print(f"Saved: {out_stacked}")

# ==============================================================================
# FIGURE C: INDIVIDUAL STANDALONE LANDSCAPE MAPS
# ==============================================================================
print("\nGenerating Figure C: Individual Standalone Landscape Maps...")
maps_info = [
    ("a", "smp_kualitas_pembelajaran", smp_df, beta_kual, "YlGnBu", "Local β (Instructional Quality D.1)", bw_kual, "SMP"),
    ("b", "sd_sekolah_berlistrik", sd_df, beta_elec, "YlOrRd", "Local β (School Electrification %)", bw_elec, "SD")
]

for tag, file_suffix, data, c_vals, cmap_name, label_txt, bw_val, j_name in maps_info:
    fig, ax = plt.subplots(figsize=(9.8, 3.8), dpi=300)
    gdf_prov.plot(ax=ax, color='#F1F5F9', edgecolor='#CBD5E1', linewidth=0.5, zorder=1)
    sc = ax.scatter(
        data["longitude"], data["latitude"],
        c=c_vals, cmap=cmap_name, s=30, edgecolors="#0F172A", linewidths=0.35, zorder=3, alpha=0.95
    )
    ax.set_aspect('equal')
    ax.set_xlim(LON_MIN, LON_MAX)
    ax.set_ylim(LAT_MIN, LAT_MAX)
    title_text = f"Peta Elastisitas Lokal MGWR: ({tag}) {j_name} - {label_txt} (Optimal BW k={bw_val})"
    ax.set_title(title_text, fontsize=10.5, fontweight='bold', pad=8)
    ax.set_xlabel("Longitude (°E)", fontsize=9, fontweight='bold')
    ax.set_ylabel("Latitude (°N / °S)", fontsize=9, fontweight='bold')
    ax.grid(True, linestyle='--', alpha=0.45, color='#94A3B8', linewidth=0.5, zorder=2)
    ax.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(5))
    cbar = plt.colorbar(sc, ax=ax, fraction=0.030, pad=0.02, shrink=0.88)
    cbar.set_label(label_txt, fontsize=8.5, fontweight='bold')
    cbar.ax.tick_params(labelsize=8)

    plt.tight_layout()
    out_single = f"{FIG_DIR}/gambar4{tag}_{file_suffix}_landscape.png"
    fig.savefig(out_single, dpi=300, bbox_inches='tight')
    plt.close(fig)
    print(f"Saved: {out_single}")

print("\nSUCCESS! All maps are generated with locked 1:1 geographic aspect ratio.")
