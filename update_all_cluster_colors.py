import os
import numpy as np
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import matplotlib.patches as mpatches
import seaborn as sns

FIG_DIR = "figures"
OUTPUT_DIR = "outputs"
os.makedirs(FIG_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 80)
print("UPDATING ALL FIGURES TO HARMONIZED COLOR PALETTE")
print("Cluster 1: #0072B2 (Blue)")
print("Cluster 2: #E69F00 (Warm Amber / Yellow)")
print("Cluster 3: #DC2626 (Vivid Crimson Red - Jelas Merah)")
print("=" * 80)

# Harmonized Palette
PALETTE_CLUSTER = {
    "Cluster 1: High-Performing Benchmark": "#0072B2",        # Blue
    "Cluster 2: Pedagogy-Infrastructure Paradox": "#E69F00",  # Amber/Yellow
    "Cluster 3: 3T Affirmation Priority": "#DC2626",        # Vivid Crimson Red
}

CLUSTER_SHORT_LABELS = {
    "Cluster 1: High-Performing Benchmark": "Klaster 1: Benchmark",
    "Cluster 2: Pedagogy-Infrastructure Paradox": "Klaster 2: Paradoks",
    "Cluster 3: 3T Affirmation Priority": "Klaster 3: Afirmasi 3T",
}

plt.rcParams.update({
    "font.sans-serif": "DejaVu Sans",
    "axes.edgecolor": "#1E293B",
    "axes.linewidth": 0.75,
    "grid.alpha": 0.25,
    "grid.linestyle": "--",
})

# ==============================================================================
# 1. RE-GENERATE GAMBAR 6: TreeSHAP Cluster-Conditional Sensitivity
# ==============================================================================
print("\n[1/4] Re-generating Gambar 6 (Cluster-Conditional TreeSHAP Sensitivity)...")
df_shap_summary = pd.read_csv(f"{OUTPUT_DIR}/table5_treeshap_policy_driver_attributions.csv")

fig, ax = plt.subplots(figsize=(10.5, 5.2), dpi=300)
top6_codes = df_shap_summary.head(6)["feature_code"].tolist()
c_shap_melt = df_shap_summary[df_shap_summary["feature_code"].isin(top6_codes)].melt(
    id_vars=["feature_label_en"],
    value_vars=["mean_abs_shap_cluster1_benchmark", "mean_abs_shap_cluster2_paradox", "mean_abs_shap_cluster3_3T_priority"],
    var_name="Cluster", value_name="Mean |SHAP|"
)
c_map_lbl = {
    "mean_abs_shap_cluster1_benchmark": "Cluster 1: High-Performing Benchmark",
    "mean_abs_shap_cluster2_paradox": "Cluster 2: Pedagogy-Infrastructure Paradox",
    "mean_abs_shap_cluster3_3T_priority": "Cluster 3: 3T Affirmation Priority",
}
c_shap_melt["Cluster"] = c_shap_melt["Cluster"].map(c_map_lbl)

sns.barplot(
    data=c_shap_melt, y="feature_label_en", x="Mean |SHAP|", hue="Cluster",
    palette=PALETTE_CLUSTER, orient="h", ax=ax, edgecolor="#1E293B", linewidth=0.65
)

ax.set_title("Cluster-Conditional TreeSHAP Sensitivity Across 3 District Typologies", fontsize=11, fontweight="bold", pad=8)
ax.set_xlabel("Mean |SHAP Value| Magnitude (Points)", fontsize=9.5, fontweight="bold")
ax.set_ylabel("")
ax.grid(True, linestyle="--", alpha=0.3, color="#94A3B8")
ax.legend(title="Typology Stratum", loc="lower right", frameon=True, facecolor="white", edgecolor="#CBD5E1", fontsize=8.2, title_fontsize=8.5)

plt.tight_layout()
fig.savefig(f"{FIG_DIR}/fig13_treeshap_cluster_conditional_and_waterfalls.png", dpi=300, bbox_inches="tight")
fig.savefig(f"{FIG_DIR}/gambar6_treeshap_klaster_kondisional.png", dpi=300, bbox_inches="tight")
plt.close(fig)
print(f"Saved: {FIG_DIR}/fig13_treeshap_cluster_conditional_and_waterfalls.png")
print(f"Saved: {FIG_DIR}/gambar6_treeshap_klaster_kondisional.png")


# ==============================================================================
# 2. RE-GENERATE GAMBAR 7: Counterfactual "What-If" Policy Simulation
# ==============================================================================
print("\n[2/4] Re-generating Gambar 7 (Counterfactual Policy Simulation)...")
df_sim = pd.read_csv(f"{OUTPUT_DIR}/table6_counterfactual_policy_simulation_comparison.csv")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5.2), dpi=300)
nat_sim = df_sim[df_sim["target_stratum"] == "All Districts (National Average)"].copy()
nat_sim["scen_short"] = [
    "A: Pedagogical Quality (+12)", "B: Class Size (-5 Rombel)", "C: Teacher Equity & STR",
    "D: Basic & Digital Infra", "E: Full Education 5.0 Bundle"
]
y_s = np.arange(len(nat_sim))
ax1.barh(y_s - 0.18, nat_sim["delta_Y_unconstrained"], height=0.36, color="#DC2626", label="Unconstrained (Confounded Bias)", edgecolor="#1E293B", linewidth=0.5)
ax1.barh(y_s + 0.18, nat_sim["delta_Y_monotonic"], height=0.36, color="#009E73", label="Monotonic Constrained (Proposed Fix)", edgecolor="#1E293B", linewidth=0.5)
ax1.axvline(0, color="black", linewidth=0.9)
ax1.set_yticks(y_s)
ax1.set_yticklabels(nat_sim["scen_short"], fontsize=8.5)
ax1.set_xlabel("Expected Numeracy Score Gain ΔY (Points)", fontsize=9, fontweight="bold")
ax1.set_title("(a) National Policy Simulation: Eliminating Confounding", fontsize=10.5, fontweight="bold", pad=7)
ax1.grid(True, linestyle="--", alpha=0.3, color="#94A3B8")
ax1.legend(loc="lower right", frameon=True, facecolor="white", edgecolor="#CBD5E1", fontsize=8.5)

# By cluster
clust_sim = df_sim[df_sim["target_stratum"] != "All Districts (National Average)"].copy()
clust_sim["scen_code"] = clust_sim["policy_scenario"].apply(lambda s: s.split(":")[0])
sns.barplot(
    data=clust_sim, x="scen_code", y="delta_Y_monotonic", hue="target_stratum",
    palette=PALETTE_CLUSTER, ax=ax2, edgecolor="#1E293B", linewidth=0.65
)
ax2.axhline(0, color="black", linewidth=0.8)
ax2.set_title("(b) Expected Numeracy Gain (ΔY) by Cluster Under Monotonic Engine", fontsize=10.5, fontweight="bold", pad=7)
ax2.set_xlabel("Policy Scenario (A - E)", fontsize=9, fontweight="bold")
ax2.set_ylabel("Expected Numeracy Gain ΔY (Points)", fontsize=9, fontweight="bold")
ax2.grid(True, linestyle="--", alpha=0.3, color="#94A3B8")
ax2.legend(title="Target Stratum", loc="upper left", frameon=True, facecolor="white", edgecolor="#CBD5E1", fontsize=8.2, title_fontsize=8.5)

plt.tight_layout()
fig.savefig(f"{FIG_DIR}/fig14_counterfactual_whatif_policy_simulation.png", dpi=300, bbox_inches="tight")
fig.savefig(f"{FIG_DIR}/gambar7_simulasi_intervensi_kebijakan.png", dpi=300, bbox_inches="tight")
plt.close(fig)
print(f"Saved: {FIG_DIR}/fig14_counterfactual_whatif_policy_simulation.png")
print(f"Saved: {FIG_DIR}/gambar7_simulasi_intervensi_kebijakan.png")


# ==============================================================================
# 3. RE-GENERATE GAMBAR 2 (2x2 Grid Map with Matching Vivid Red)
# ==============================================================================
print("\n[3/4] Re-generating Gambar 2 (2x2 Map & Stacked 1-Col with Matching Vivid Red)...")
data_path = f"{OUTPUT_DIR}/table7_nusa_mipa_district_policy_recommendations_2056.csv"
df_dist = pd.read_csv(data_path)
gdf_prov = gpd.read_file("data/FINAL/indonesia_provinsi.geojson")

JENJANG_ORDER = ["SD", "SMP", "SMA", "SMK"]
MORAN_INFO = {
    "SD": {"I": 0.62, "p": 0.005},
    "SMP": {"I": 0.55, "p": 0.005},
    "SMA": {"I": 0.61, "p": 0.005},
    "SMK": {"I": 0.06, "p": 0.005},
}
LON_MIN, LON_MAX = 94.5, 141.5
LAT_MIN, LAT_MAX = -11.5, 6.5

fig2, axes2 = plt.subplots(2, 2, figsize=(15.5, 8.4), dpi=300)
for idx, jenjang in enumerate(JENJANG_ORDER):
    r, c = idx // 2, idx % 2
    ax = axes2[r, c]
    sub = df_dist[df_dist["jenjang"] == jenjang].copy()
    m_info = MORAN_INFO[jenjang]

    gdf_prov.plot(ax=ax, color='#F8FAFC', edgecolor='none', zorder=1)
    gdf_prov.boundary.plot(ax=ax, color='#475569', alpha=0.45, linewidth=0.65, linestyle=':', zorder=2)

    for c_name, color in PALETTE_CLUSTER.items():
        m = sub["cluster_name"] == c_name
        cnt = m.sum()
        short_lbl = CLUSTER_SHORT_LABELS[c_name]
        ax.scatter(
            sub.loc[m, "longitude"], sub.loc[m, "latitude"],
            c=color, s=20, alpha=0.92, edgecolors="white", linewidths=0.35,
            label=f"{short_lbl} (n={cnt})", zorder=4
        )

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
    ax.legend(loc="lower left", frameon=True, facecolor="white", edgecolor="#CBD5E1", framealpha=0.92, fontsize=7.2, handletextpad=0.4, borderpad=0.4)

fig2.suptitle("Spatial Distribution of Educational Numeracy Typologies Across 514 Indonesian Districts (2025)", fontsize=12.5, fontweight='bold', y=0.99)
plt.tight_layout()
fig2.savefig(f"{FIG_DIR}/gambar2_peta_klaster_spasial_indonesia_2x2.png", dpi=300, bbox_inches='tight')
fig2.savefig(f"{FIG_DIR}/fig5_spatial_clusters_indonesia_map.png", dpi=300, bbox_inches='tight')
fig2.savefig(f"{FIG_DIR}/fig1_spatial_clusters_indonesia.png", dpi=300, bbox_inches='tight')
plt.close(fig2)
print(f"Saved: {FIG_DIR}/gambar2_peta_klaster_spasial_indonesia_2x2.png")


# ==============================================================================
# 4. RE-GENERATE KOMPARASI MAKRO-MIKRO (4x2 & 2x4) with Matching Vivid Red
# ==============================================================================
print("\n[4/4] Re-generating Multi-Scale Comparative Maps (4x2 & 2x4 & Choropleth)...")
mapping_prov = {
    'D.I. Yogyakarta': 'Yogyakarta',
    'D.K.I. Jakarta': 'Jakarta Raya',
    'Kepulauan Bangka Belitung': 'Bangka Belitung',
    'Papua Barat Daya': 'Papua Barat',
    'Papua Selatan': 'Papua',
    'Papua Tengah': 'Papua',
    'Papua Pegunungan': 'Papua'
}
df_dist['prov_mapped'] = df_dist['nama_provinsi'].replace(mapping_prov)

shared_handles = [
    mpatches.Patch(facecolor="#0072B2", edgecolor='#1E293B', label="Klaster 1: High-Performing Benchmark"),
    mpatches.Patch(facecolor="#E69F00", edgecolor='#1E293B', label="Klaster 2: Pedagogy-Infrastructure Paradox"),
    mpatches.Patch(facecolor="#DC2626", edgecolor='#1E293B', label="Klaster 3: 3T Affirmation Priority (Merah)"),
]

# 4x2 Vertical
fig_4x2, axes_4x2 = plt.subplots(4, 2, figsize=(15.0, 13.5), dpi=300)
for idx, jenjang in enumerate(JENJANG_ORDER):
    m_info = MORAN_INFO[jenjang]
    sub = df_dist[df_dist["jenjang"] == jenjang].copy()
    dom = sub.groupby(['prov_mapped', 'cluster_name']).size().unstack(fill_value=0).idxmax(axis=1)

    # Col 1: Mikro
    ax_l = axes_4x2[idx, 0]
    gdf_prov.plot(ax=ax_l, color='#F8FAFC', edgecolor='none', zorder=1)
    gdf_prov.boundary.plot(ax=ax_l, color='gray', alpha=0.45, linewidth=0.55, linestyle=':', zorder=2)
    for c_name, color in PALETTE_CLUSTER.items():
        m = sub["cluster_name"] == c_name
        ax_l.scatter(sub.loc[m, "longitude"], sub.loc[m, "latitude"], c=color, s=18, alpha=0.92, edgecolors="white", linewidths=0.3, zorder=4)
    ax_l.set_aspect('equal')
    ax_l.set_xlim(LON_MIN, LON_MAX)
    ax_l.set_ylim(LAT_MIN, LAT_MAX)
    ax_l.set_title(f"({chr(97+idx*2)}) Jenjang {jenjang}: Mikro 514 Kab/Kota — Moran's I = {m_info['I']:.2f}", fontsize=9.5, fontweight='bold', pad=5)
    ax_l.set_ylabel("Latitude (°N / °S)", fontsize=8.5, fontweight='bold')
    if idx == 3:
        ax_l.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
    ax_l.grid(True, linestyle='--', alpha=0.3, color='#94A3B8', linewidth=0.4, zorder=3)
    ax_l.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax_l.yaxis.set_major_locator(ticker.MultipleLocator(5))

    # Col 2: Makro
    ax_r = axes_4x2[idx, 1]
    gdf_plot = gdf_prov.copy()
    gdf_plot['dom_cluster'] = gdf_plot['NAME_1'].map(dom)
    gdf_plot['color'] = gdf_plot['dom_cluster'].map(PALETTE_CLUSTER)
    gdf_plot.plot(ax=ax_r, color=gdf_plot['color'], edgecolor='#1E293B', linewidth=0.55, zorder=2)
    ax_r.set_aspect('equal')
    ax_r.set_xlim(LON_MIN, LON_MAX)
    ax_r.set_ylim(LAT_MIN, LAT_MAX)
    ax_r.set_title(f"({chr(98+idx*2)}) Jenjang {jenjang}: Makro 34 Provinsi (Tipologi Dominan)", fontsize=9.5, fontweight='bold', pad=5)
    if idx == 3:
        ax_r.set_xlabel("Longitude (°E)", fontsize=8.5, fontweight='bold')
    ax_r.grid(True, linestyle='--', alpha=0.3, color='#94A3B8', linewidth=0.4, zorder=3)
    ax_r.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax_r.yaxis.set_major_locator(ticker.MultipleLocator(5))

fig_4x2.legend(handles=shared_handles, loc="lower center", ncol=3, frameon=True, facecolor="white", edgecolor="#CBD5E1", fontsize=10, bbox_to_anchor=(0.5, 0.01))
fig_4x2.suptitle("Komparasi Resolusi Mikro (514 Kabupaten/Kota) vs Makro (34 Provinsi) Tipologi Pendidikan", fontsize=13, fontweight='bold', y=0.99)
plt.tight_layout(rect=[0, 0.035, 1, 0.97])
fig_4x2.savefig(f"{FIG_DIR}/gambar2_peta_klaster_komparasi_makro_mikro_4x2.png", dpi=300, bbox_inches='tight')
plt.close(fig_4x2)
print(f"Saved: {FIG_DIR}/gambar2_peta_klaster_komparasi_makro_mikro_4x2.png")

# 2x2 Provincial Choropleth
fig_c2x2, axes_c2x2 = plt.subplots(2, 2, figsize=(15.5, 8.4), dpi=300)
for idx, jenjang in enumerate(JENJANG_ORDER):
    r, c = idx // 2, idx % 2
    ax = axes_c2x2[r, c]
    sub = df_dist[df_dist["jenjang"] == jenjang].copy()
    dom = sub.groupby(['prov_mapped', 'cluster_name']).size().unstack(fill_value=0).idxmax(axis=1)
    gdf_plot = gdf_prov.copy()
    gdf_plot['dom_cluster'] = gdf_plot['NAME_1'].map(dom)
    gdf_plot['color'] = gdf_plot['dom_cluster'].map(PALETTE_CLUSTER)
    gdf_plot.plot(ax=ax, color=gdf_plot['color'], edgecolor='#1E293B', linewidth=0.55, zorder=2)
    ax.set_aspect('equal')
    ax.set_xlim(LON_MIN, LON_MAX)
    ax.set_ylim(LAT_MIN, LAT_MAX)
    ax.set_title(f"({chr(97+idx)}) {jenjang} Level — Dominansi Tipologi Tingkat Provinsi (N = 34)", fontsize=10.5, fontweight='bold', pad=7)
    if r == 1:
        ax.set_xlabel("Longitude (°E)", fontsize=9, fontweight='bold')
    if c == 0:
        ax.set_ylabel("Latitude (°N / °S)", fontsize=9, fontweight='bold')
    ax.grid(True, linestyle='--', alpha=0.35, color='#94A3B8', linewidth=0.5, zorder=3)
    ax.xaxis.set_major_locator(ticker.MultipleLocator(10))
    ax.yaxis.set_major_locator(ticker.MultipleLocator(5))
    counts = gdf_plot['dom_cluster'].value_counts()
    handles = []
    for c_name, color in PALETTE_CLUSTER.items():
        cnt = counts.get(c_name, 0)
        short_lbl = CLUSTER_SHORT_LABELS[c_name]
        patch = mpatches.Patch(facecolor=color, edgecolor='#1E293B', linewidth=0.5, label=f"{short_lbl} ({cnt} Prov)")
        handles.append(patch)
    ax.legend(handles=handles, loc="lower left", frameon=True, facecolor="white", edgecolor="#CBD5E1", framealpha=0.92, fontsize=7.5, handletextpad=0.5, borderpad=0.4)

fig_c2x2.suptitle("Agregasi Spasial Tipologi Numerasi Pendidikan Tingkat Provinsi di Indonesia (2025)", fontsize=12.5, fontweight='bold', y=0.99)
plt.tight_layout()
fig_c2x2.savefig(f"{FIG_DIR}/gambar2_peta_klaster_provinsi_choropleth_2x2.png", dpi=300, bbox_inches='tight')
plt.close(fig_c2x2)
print(f"Saved: {FIG_DIR}/gambar2_peta_klaster_provinsi_choropleth_2x2.png")

print("\nALL HARMONIZATION COMPLETED SUCCESSFULLY!")
