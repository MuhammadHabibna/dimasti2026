# NUSA-MIPA Geo-AI: National Spatio-Econometric & Explainable Policy Simulator for Educational Numeracy Equity in Indonesia Toward Education 5.0

[![DIMAS-TI AMLI 2026](https://img.shields.io/badge/Kompetisi-DIMAS--TI%20AMLI%202026-blue.svg)](https://ung.ac.id)
[![Divisi](https://img.shields.io/badge/Divisi-Penambangan%20Data%20(Data%20Mining)-16A34A.svg)]()
[![Institusi](https://img.shields.io/badge/Institusi-FMIPA%20Universitas%20Negeri%20Surabaya-orange.svg)]()
[![Model](https://img.shields.io/badge/Model-MGWR%20%2B%20Monotonic%20LightGBM-6366F1.svg)]()
[![Dataset](https://img.shields.io/badge/Observasi-2.056%20Unit%20Definitif-0D9488.svg)]()

> **Karya Tulis Ilmiah & Platform Sistem Pendukung Keputusan Spasial (Decision Support System)**  
> Disusun untuk Mengikuti Kompetisi Nasional **DIMAS-TI AMLI 2026** di Universitas Negeri Gorontalo.  
> **Tema:** *Edu-Tech MIPA: Mengabstraksi Matematika dan Sains Menuju Education 5.0*

---

## 👥 Tim Peneliti (Data Science FMIPA UNESA)

* **Horasio Nissi Immanuel**
* **Muhammad Habib Nur Aiman**
* **Ulfa Siti Nuraini**

*Program Studi S1 Sains Data, Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Negeri Surabaya*

---

## 📌 Ringkasan Eksekutif Riset

Krisis capaian numerasi Indonesia pasca-PISA 2022 (di mana 82% siswa berada di bawah standar kompetensi minimum OECD) sering kali disikapi secara keliru melalui kebijakan nasional tunggal (*one-size-fits-all*). Padahal, analisis geospasial membuktikan adanya **dependensi spasial yang masif** (*Moran's I* = +0,6237, $p = 0,005$) serta anomali kesenjangan pulau sebesar **15,85 poin** pada jenjang SD.

**NUSA-MIPA Geo-AI** mengabstraksi **2.056 unit observasi pendidikan** (514 kabupaten/kota di 38 provinsi pada 4 jenjang: SD, SMP, SMA, SMK) dengan memadukan data resmi Dapodikdasmen dan Survei Lingkungan Belajar (Sulingjar 2024–2025). Platform ini memecahkan 3 tantangan utama metodologi:
1. **Eliminasi Multikolinieritas & Singularitas Lokal**: Mengurangi Condition Number lokal dari $> 10^9$ menjadi $4,12$ pada model *Multiscale Geographically Weighted Regression* (MGWR), melenyapkan autokorelasi residu spasial menjadi $-0,0109$.
2. **Eliminasi Confounding Bias Perkotaan-Perdesaan**: Menggunakan **Monotonic LightGBM** dengan pembatasan turunan parsial non-negatif $(\partial \hat{Y}/\partial X \ge 0)$, mengoreksi salah prediksi regresi standar terdahulu yang secara keliru menganggap de-crowding rombel bernilai negatif.
3. **Pemberian Rekomendasi Preskriptif Lokal (Tabel 7)**: Menghasilkan matriks intervensi unik untuk setiap kabupaten/kota dengan proyeksi peningkatan numerasi rata-rata nasional sebesar **+6,63 poin** di bawah Skenario Terpadu Education 5.0 (97,3% daerah mengalami dampak positif).

---

## 🚀 Fitur Unggulan Web Dashboard & Decision Support System

Web aplikasi NUSA-MIPA dibangun menggunakan arsitektur modern (*React + Vite + Leaflet + Bento Grid System*):
* **Halaman Landing Page Storytelling**: Dilengkapi widget *Mini-Simulator Cepat*, ringkasan urgensi krisis, arsitektur IPO, metodologi, dan flowchart riset.
* **Tab 1: Peta Spasial Nasional**: Visualisasi poligon batas wilayah GeoJSON dan centroid 514 daerah dengan pewarnaan 3 tipologi klaster (*Benchmark*, *Paradoks Sarpras*, dan *Afirmasi 3T*).
* **Tab 2: Diagnosis XAI Preskriptif**: Radar Chart 6-dimensi IPO terhadap benchmark nasional, deteksi penalti primer/sekunder, dan blueprint Tabel 7.
* **Tab 3: Simulator Kebijakan What-If**: Simulator interaktif berbasis slider tuas kebijakan (pedagogi, rombel, elektrifikasi, sanitasi, TIK) dengan proyeksi dampak preskriptif seketika.
* **Tab 4: Data 514 Daerah & Policy Brief**: Tabel benchmarking lengkap dengan fitur unduh/cetak dokumen resmi **One-Page Policy Brief** dinamis untuk setiap kabupaten/kota di Indonesia.
* **Panel Bukti Riset & Model**: Repositori interaktif 14 figur publikasi ilmiah 300 DPI, bukti ablasi MGWR, dan benchmark 11 model machine learning di bawah Dual-CV (GroupKFold & LOPO).

---

## 📂 Struktur Repositori

```
dimasti2026/
├── .gitignore                                         # Konfigurasi proteksi commit Git
├── README.md                                          # Dokumentasi resmi repositori
├── Buku Panduan DIMAS-TI 2026.pdf                     # Panduan resmi kompetisi
│
├── Naskah Ilmiah & Dokumentasi:
│   ├── DRAFT_BAB_1_PENDAHULUAN_IEEE.md                # Draft artikel IEEE 2-kolom
│   ├── FLOWCHART_PENELITIAN_NUSA_MIPA.md              # Rincian alur metodologi
│   ├── KONSEP_PENELITIAN_DIMAS_TI_2026.md             # Dokumen konsep & PRD lengkap
│   ├── RINGKASAN_ANALISIS_NOTEBOOK_NUSA_MIPA.md       # Rangkuman analitis numerik
│   ├── referensi_struktur_laporan_nusa_mipa_...md     # Rujukan format KTI
│   └── flowchart_penelitian_nusa_mipa.html            # Visualisasi bagan alir interaktif
│
├── Pemodelan & Skrip Komputasi:
│   ├── build_and_run_nusa_mipa_master_pipeline.py     # Pipeline master analisis end-to-end
│   ├── build_pdf_summary.py                           # Builder PDF ringkasan eksekutif
│   ├── prepare_web_data.py                            # Ekstraksi dataset untuk antarmuka web
│   └── enrich_geojson.py                              # Pengaya metadata spasial GeoJSON
│
├── Notebook & Deliverables Siap Uji:
│   ├── NUSA_MIPA_Pemodelan_Numerasi_2025_Upgraded.ipynb  # Master Jupyter Notebook
│   ├── Ringkasan_Notebook_NUSA-MIPA_Upgraded.pdf         # Ringkasan Eksekutif Publikasi
│   ├── NUSA_MIPA_DIMAS_TI_2026_Upgraded_Package.zip      # Arsip kompresi lengkap
│   └── nusa_mipa_logo.svg                                # Vektor master logo resmi
│
├── data/                                              # Dataset mentah & olahan (Dapodik, GeoJSON)
├── outputs/                                           # 16 Tabel komputasi ilmiah (Tabel 0 - Tabel 7)
├── figures/                                           # 14 Gambar publikasi resolusi tinggi (300 DPI)
└── nusa-mipa-web/                                     # Aplikasi Web Dashboard (React + Vite)
    ├── src/
    │   ├── components/                                # Komponen UI, Peta, Modul Simulasi
    │   ├── data/                                      # Master JSON 514 daerah & ringkasan nasional
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

---

## 💻 Panduan Menjalankan Web Dashboard Secara Lokal

Pastikan Anda telah menginstal **Node.js** (versi 18 ke atas) dan **npm**.

```bash
# 1. Masuk ke direktori aplikasi web
cd nusa-mipa-web

# 2. Instal dependensi paket
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban (browser) Anda dan akses:
`http://localhost:5174/`

Untuk membangun bundel produksi teroptimasi:
```bash
npm run build
```

---

## 🔬 Panduan Menjalankan Master Pipeline Pemodelan (Python)

Pastikan lingkungan Python Anda telah menginstal dependensi:
```bash
pip install numpy pandas scipy scikit-learn lightgbm shap mgwr geopandas matplotlib seaborn reportlab
```

Eksekusi pipeline analitis lengkap:
```bash
python build_and_run_nusa_mipa_master_pipeline.py
```
Skrip ini akan secara otomatis memproses data 2.056 baris, menjalankan audit VIF, K-Means clustering, regresi MGWR multiskala, benchmark 11 model machine learning, TreeSHAP explainability, simulasi counterfactual, dan meregenerasi seluruh 14 gambar di folder `figures/` serta 16 tabel di folder `outputs/`.

---

## 📜 Hak Cipta & Lisensi

Hak Cipta © 2026 **Tim NUSA-MIPA · FMIPA Universitas Negeri Surabaya**.  
Dikembangkan untuk Kompetisi Nasional **DIMAS-TI AMLI 2026** (Universitas Negeri Gorontalo).  
Seluruh hak cipta dilindungi undang-undang.
