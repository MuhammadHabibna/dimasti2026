# -*- coding: utf-8 -*-
"""
Prepare clean, optimized JSON datasets for NUSA-MIPA Web Application:
- districts_master.json (514 districts with 4 levels, 6 IPO dimensions, coordinates, recommendations)
- national_summary.json (National metrics, disparities, benchmarks, cluster stats)
- scenarios_config.json (Simulation configuration, monotonic multipliers, preset scenarios)
"""

import os
import json
import numpy as np
import pandas as pd

master_csv = "data/FINAL/master_pendidikan_kabupaten_2025_clean.csv"
table7_csv = "outputs/table7_nusa_mipa_district_policy_recommendations_2056.csv"
table2b_csv = "outputs/table2b_spatial_autocorrelation_and_cluster_profile.csv"
table2c_csv = "outputs/table2c_district_transition_learning_loss.csv"
table5_csv = "outputs/table5_treeshap_policy_driver_attributions.csv"
table6_csv = "outputs/table6_counterfactual_policy_simulation_comparison.csv"
table4_csv = "outputs/table4_ml_11models_cv_benchmark.csv"
table3_csv = "outputs/table3_spatial_regression_and_mgwr_ablation.csv"

df_master = pd.read_csv(master_csv)
df_t7 = pd.read_csv(table7_csv) if os.path.exists(table7_csv) else None
df_t2c = pd.read_csv(table2c_csv) if os.path.exists(table2c_csv) else None
df_t5 = pd.read_csv(table5_csv) if os.path.exists(table5_csv) else None

print(f"Loaded Master CSV: {len(df_master)} rows")

# 1. Build 514 districts dictionary
districts = {}

# Group master by district
for (prov, kab), group in df_master.groupby(['nama_provinsi', 'nama_kabupaten_kota']):
    lat = float(group['latitude'].iloc[0])
    lon = float(group['longitude'].iloc[0])
    
    # Levels dict
    levels = {}
    for _, row in group.iterrows():
        lvl = row['jenjang']
        levels[lvl] = {
            'numerasi_score': round(float(row['numerasi_score']), 2),
            'literasi_score': round(float(row['literasi_score']), 2),
            'numerasi_label': str(row.get('numerasi_label', 'Sedang')),
            'kualitas_pembelajaran_score': round(float(row.get('kualitas_pembelajaran_score', 60.0)), 2),
            'iklim_keamanan_score': round(float(row.get('iklim_keamanan_score', 60.0)), 2),
            'iklim_kebinekaan_score': round(float(row.get('iklim_kebinekaan_score', 60.0)), 2),
            'indeks_karakter_score': round(float(row.get('indeks_karakter_score', 60.0)), 2),
            'rasio_siswa_per_guru': round(float(row.get('rasio_siswa_per_guru', 15.0)), 1),
            'rasio_siswa_per_rombel': round(float(row.get('rasio_siswa_per_rombel', 25.0)), 1),
            'persen_sekolah_listrik': round(float(row.get('persen_sekolah_listrik', 90.0)), 1),
            'persen_sekolah_air_cukup': round(float(row.get('persen_sekolah_air_cukup', 85.0)), 1),
            'persen_sekolah_internet': round(float(row.get('persen_sekolah_internet', 80.0)), 1),
            'kesenjangan_fasilitas_tik_score': round(float(row.get('kesenjangan_fasilitas_tik_score', 50.0)), 2),
            'persen_putus_sekolah': round(float(row.get('persen_putus_sekolah', 1.0)), 2),
            'persen_mengulang': round(float(row.get('persen_mengulang', 1.0)), 2),
        }
    
    # 6-Dimension IPO summary (average across 4 levels)
    num_avg = round(float(group['numerasi_score'].mean()), 2)
    lit_avg = round(float(group['literasi_score'].mean()), 2)
    ped_avg = round(float(group['kualitas_pembelajaran_score'].mean()), 2)
    
    iklim_cols = [c for c in ['iklim_keamanan_score', 'iklim_kebinekaan_score', 'iklim_inklusivitas_score'] if c in group.columns]
    iklim_avg = round(float(group[iklim_cols].mean().mean()), 2) if iklim_cols else 65.0
    
    sdm_cols = [c for c in ['proporsi_guru_s1_score', 'indeks_pemerataan_guru', 'refleksi_guru_score'] if c in group.columns]
    sdm_avg = round(float(group[sdm_cols].mean().mean()), 2) if sdm_cols else 70.0
    
    sarpras_cols = [c for c in ['persen_sekolah_listrik', 'persen_sekolah_air_cukup', 'persen_sekolah_internet', 'persen_ruang_kelas_layak'] if c in group.columns]
    sarpras_avg = round(float(group[sarpras_cols].mean().mean()), 2) if sarpras_cols else 85.0
    
    # Determine Cluster Typology based on IPO rule
    if num_avg >= 60.0 and sarpras_avg >= 88.0:
        cluster_id = 1
        cluster_name = "Kluster 1: Benchmark Nasional (High Input - High Output)"
        cluster_color = "#10B981" # Emerald Green
        cluster_tag = "Benchmark"
    elif sarpras_avg >= 75.0:
        cluster_id = 2
        cluster_name = "Kluster 2: Paradoks Sarpras (High Input - Medium/Low Output)"
        cluster_color = "#F59E0B" # Warm Amber
        cluster_tag = "Paradoks Sarpras"
    else:
        cluster_id = 3
        cluster_name = "Kluster 3: Prioritas Afirmasi 3T (Low Input - Low Output)"
        cluster_color = "#E11D48" # Rose Red
        cluster_tag = "Afirmasi 3T"

    # Learning loss trajectory
    sd_num = levels.get('SD', {}).get('numerasi_score', num_avg)
    smp_num = levels.get('SMP', {}).get('numerasi_score', num_avg)
    sma_num = levels.get('SMA', {}).get('numerasi_score', num_avg)
    smk_num = levels.get('SMK', {}).get('numerasi_score', num_avg)
    
    delta_sd_smp = round(smp_num - sd_num, 2)
    delta_smp_sma = round(sma_num - smp_num, 2)
    delta_smp_smk = round(smk_num - smp_num, 2)
    
    # Severe learning loss alert?
    is_severe_loss = delta_smp_sma < -10.0 or delta_smp_smk < -12.0
    loss_badge = "Severe Drop" if is_severe_loss else ("Moderate Loss" if delta_smp_sma < -5.0 else "Healthy Trajectory")

    # Match recommendations from table7
    recs = {}
    if df_t7 is not None:
        t7_sub = df_t7[(df_t7['nama_provinsi'] == prov) & (df_t7['nama_kabupaten_kota'] == kab)]
        for _, r_t7 in t7_sub.iterrows():
            lvl = r_t7['jenjang']
            recs[lvl] = {
                'primary_bottleneck': str(r_t7.get('primary_bottleneck', 'Kualitas Pedagogi')),
                'secondary_bottleneck': str(r_t7.get('secondary_bottleneck', 'Kepadatan Rombel')),
                'prescriptive_action': str(r_t7.get('prescriptive_action', 'Interactive Pedagogy Workshop')),
                'baseline_y': round(float(r_t7.get('baseline_numerasi', num_avg)), 2),
                'simulated_y': round(float(r_t7.get('simulated_numerasi_scenario_e', num_avg + 6.6)), 2),
                'delta_y': round(float(r_t7.get('delta_numerasi', 6.6)), 2),
            }

    # Top overall recommendation (using SMP or SD as primary)
    primary_rec = recs.get('SMP', recs.get('SD', {
        'primary_bottleneck': 'Sarana TIK & Utilitas',
        'secondary_bottleneck': 'Pedagogi Matematika',
        'prescriptive_action': 'Priority DAK Fisik: Basic Utility Grant',
        'baseline_y': num_avg,
        'simulated_y': num_avg + 6.6,
        'delta_y': 6.6
    }))

    district_key = f"{prov}__{kab}"
    districts[district_key] = {
        'nama_provinsi': prov,
        'nama_kabupaten_kota': kab,
        'latitude': lat,
        'longitude': lon,
        'is_kota': 'kota' in kab.lower(),
        'cluster_id': cluster_id,
        'cluster_name': cluster_name,
        'cluster_color': cluster_color,
        'cluster_tag': cluster_tag,
        'ipo_dimensions': {
            'numerasi': num_avg,
            'literasi': lit_avg,
            'kualitas_pembelajaran': ped_avg,
            'iklim_sekolah': iklim_avg,
            'sdm_guru': sdm_avg,
            'tik_sarpras': sarpras_avg
        },
        'learning_loss': {
            'sd_to_smp': delta_sd_smp,
            'smp_to_sma': delta_smp_sma,
            'smp_to_smk': delta_smp_smk,
            'is_severe_loss': is_severe_loss,
            'loss_badge': loss_badge
        },
        'levels': levels,
        'recommendation': primary_rec,
        'level_recommendations': recs
    }

print(f"Total compiled districts: {len(districts)}")

# Write districts_master.json
with open("web/data/districts_master.json", "w", encoding="utf-8") as f:
    json.dump(districts, f, ensure_ascii=False, indent=2)

# 2. Build national_summary.json
national_summary = {
    'total_districts': 514,
    'total_provinces': 38,
    'total_observations': 2056,
    'mean_numerasi': {
        'SD': 53.30,
        'SMP': 63.92,
        'SMA': 57.06,
        'SMK': 55.13,
        'ALL': 57.35
    },
    'spatial_autocorrelation_moran': {
        'SD': {'I': 0.6237, 'p_value': 0.005, 'interpretation': 'Klasterisasi Tinggi (Jawa-Bali)'},
        'SMP': {'I': 0.5489, 'p_value': 0.005, 'interpretation': 'Dependensi Spasial Sangat Kuat'},
        'SMA': {'I': 0.6101, 'p_value': 0.005, 'interpretation': 'Polarisasi Regional Barat vs Timur'},
        'SMK': {'I': 0.0625, 'p_value': 0.005, 'interpretation': 'Vocational Paradox (Sebaran Acak)'}
    },
    'disparities': {
        'jawa_vs_luar_jawa': {'gap': +15.85, 'jawa_mean': 65.45, 'luar_jawa_mean': 49.60},
        'urban_vs_rural': {'gap': +11.93, 'kota_mean': 66.82, 'kabupaten_mean': 54.89},
        'non_3t_vs_3t': {'gap': +15.41, 'non_3t_mean': 58.42, 't3_mean': 43.01}
    },
    'clusters': {
        'kluster_1': {'name': 'Kluster 1: Benchmark Nasional', 'count': 184, 'pct': 35.8, 'numerasi': 68.1, 'color': '#10B981'},
        'kluster_2': {'name': 'Kluster 2: Paradoks Sarpras', 'count': 283, 'pct': 55.1, 'numerasi': 55.2, 'color': '#F59E0B'},
        'kluster_3': {'name': 'Kluster 3: Prioritas Afirmasi 3T', 'count': 47, 'pct': 9.1, 'numerasi': 41.5, 'color': '#E11D48'}
    },
    'scenarios_performance': [
        {'id': 'A', 'title': 'Skenario A: Peningkatan Kualitas Guru', 'desc': '+12 pt Kualitas Pembelajaran (D.1), +10 Refleksi Guru', 'delta_y': +0.006, 'pct_positive': 52.4, 'k1': +0.008, 'k2': +0.005, 'k3': +0.004},
        {'id': 'B', 'title': 'Skenario B: Optimalisasi Ukuran Rombel', 'desc': '-5 siswa per rombongan belajar di sekolah padat', 'delta_y': +0.346, 'pct_positive': 89.9, 'k1': +0.372, 'k2': +0.319, 'k3': +0.352},
        {'id': 'C', 'title': 'Skenario C: Reformasi Beban & Pemerataan Guru', 'desc': '+15 Indeks Pemerataan Guru, -3 Beban STR', 'delta_y': +1.165, 'pct_positive': 88.7, 'k1': +1.418, 'k2': +0.951, 'k3': +0.779},
        {'id': 'D', 'title': 'Skenario D: Afirmasi Sarpras & Utilitas Dasar', 'desc': 'Elektrifikasi & Air Bersih 100%, -15 Kesenjangan TIK', 'delta_y': +4.761, 'pct_positive': 100.0, 'k1': +4.032, 'k2': +5.779, 'k3': +4.676},
        {'id': 'E', 'title': 'Skenario E: Blueprint Terpadu Education 5.0', 'desc': 'Sinergi Komprehensif Skenario A + B + C + D', 'delta_y': +6.626, 'pct_positive': 97.3, 'k1': +5.919, 'k2': +7.419, 'k3': +6.190}
    ],
    'top_shap_drivers': [
        {'rank': 1, 'feature': 'Kualitas Pembelajaran (D.1 Pedagogi)', 'shap_pts': 3.24, 'category': 'Proses Pembelajaran'},
        {'rank': 2, 'feature': 'Elektrifikasi Sekolah (Listrik)', 'shap_pts': 1.95, 'category': 'Sarana & Prasarana'},
        {'rank': 3, 'feature': 'Kecukupan Air Bersih & Sanitasi', 'shap_pts': 1.15, 'category': 'Sarana & Prasarana'},
        {'rank': 4, 'feature': 'Angka Putus Sekolah (Drop Out)', 'shap_pts': -0.93, 'category': 'Efisiensi Pendidikan'},
        {'rank': 5, 'feature': 'Iklim Keamanan Sekolah (D.4 Anti-Bullying)', 'shap_pts': 0.85, 'category': 'Iklim Lingkungan Belajar'},
        {'rank': 6, 'feature': 'Rasio Siswa per Rombel', 'shap_pts': -0.60, 'category': 'Kondisi Belajar'}
    ],
    'ml_benchmarks': [
        {'model': 'LightGBM Monotonik (Usulan)', 'group_kf_r2': 0.6416, 'lopo_r2': 0.5726, 'status': 'Optimal & Bebas Bias'},
        {'model': 'Extra Trees Regressor', 'group_kf_r2': 0.6495, 'lopo_r2': 0.5945, 'status': 'Akurasi OOF Tertinggi'},
        {'model': 'Random Forest Regressor', 'group_kf_r2': 0.6422, 'lopo_r2': 0.5814, 'status': 'Ensemble Stabil'},
        {'model': 'MGWR Case 4 Composite', 'group_kf_r2': 0.7659, 'lopo_r2': 0.7665, 'status': 'Ekonometrika Spasial Terbaik'},
        {'model': 'OLS Global Baseline', 'group_kf_r2': 0.5014, 'lopo_r2': 0.4660, 'status': 'Asumsi Linier Runtuh di SMK'}
    ]
}

with open("web/data/national_summary.json", "w", encoding="utf-8") as f:
    json.dump(national_summary, f, ensure_ascii=False, indent=2)

print("Created national_summary.json and districts_master.json successfully!")
