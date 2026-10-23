# BLUEPRINT KONSEP PENELITIAN & PRODUK DATA MINING
## DIMAS-TI AMLI 2026 — UNIVERSITAS NEGERI GORONTALO

> **Dokumen Pengingat & Panduan Strategis Tim**  
> **Divisi Lomba**: Penambangan Data (*Data Mining*)  
> **Tema Utama**: *"Inovasi Edu-Tech MIPA: Mengabstraksi Matematika dan Sains melalui Integrasi Sistem Cerdas Menuju Education 5.0"*  
> **Batas Pengumpulan Karya**: **25 Oktober 2026**  
> **Format File Final**: `DIMAS_TI_2026_Penambangan Data_<Nama Tim>_<Nama PT>_<Judul Karya>.pdf` (Maks. 10 MB)

---

## DAFTAR ISI
1. [Identitas Karya & Gagasan Produk](#1-identitas-karya--gagasan-produk)
2. [Latar Belakang Masalah & Urgensi Nasional](#2-latar-belakang-masalah--urgensi-nasional)
3. [Bedah Anatomi Data & Strategi Integrasi (IPO Framework)](#3-bedah-anatomi-data--strategi-integrasi-ipo-framework)
4. [Tiga Pilar Tujuan Penelitian](#4-tiga-pilar-tujuan-penelitian)
5. [Arsitektur Produk Web: NUSA-MIPA](#5-arsitektur-produk-web-nusa-mipa)
6. [Metodologi & Pipeline Data Mining](#6-metodologi--pipeline-data-mining)
7. [Sistematika Makalah Laporan Penelitian (8 Bagian Wajib)](#7-sistematika-makalah-laporan-penelitian-8-bagian-wajib)
8. [Matriks Rubrik Penilaian DIMAS-TI 2026](#8-matriks-rubrik-penilaian-dimas-ti-2026)
9. [Roadmap & Checklist Eksekusi Tim](#9-roadmap--checklist-eksekusi-tim)

---

## 1. Identitas Karya & Gagasan Produk

* **Judul Penelitian**:  
  **"Pemetaan Spasial-Klaster dan Analisis Faktor Determinan Lokal Capaian Numerasi di Indonesia Menggunakan Multiscale Geographically Weighted Regression (MGWR) dan Explainable Ensemble Learning Menuju Education 5.0"**
* **Nama Produk Web**:  
  **NUSA-MIPA** (*Nusantara Spatial Analytics for Mathematics & Science Innovation*)  
  *Sub-title*: *Spatial Decision Support System & Early Intervention Simulator untuk Pemerataan Numerasi Indonesia Menuju Education 5.0*.
* **Target Pengguna**:  
  Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen), Dinas Pendidikan Provinsi/Kabupaten/Kota, Lembaga Penjaminan Mutu Pendidikan (BBPMP/BPMP), Pengawas Sekolah, dan Pendidik MIPA.

---

## 2. Latar Belakang Masalah & Urgensi Nasional

1. **Paradoks Capaian PISA & Asesmen Nasional**:
   * Rilis skor internasional menunjukkan ketertinggalan signifikan pada kompetensi matematika dibandingkan membaca dan sains.
   * Di tingkat nasional, Asesmen Nasional (AN) memperlihatkan disparitas capaian numerasi yang ekstrem antarwilayah di Indonesia (terutama antara Jawa-Bali vs wilayah 3T/Indonesia Timur).
2. **Kelemahan Kebijakan Konvensional (*One-Size-Fits-All*)**:
   * Selama ini intervensi pendidikan sering diseragamkan secara nasional tanpa mempertimbangkan heterogenitas spasial (*spatial heterogeneity*).
   * Akar masalah rendahnya numerasi di daerah tertinggal (misal: keterbatasan ruang kelas layak dan ketiadaan listrik/internet) sangat berbeda dengan di perkotaan (misal: beban kurikulum, iklim keamanan/perundungan, atau metode pedagogik guru).
3. **Peluang Regulasi: Perencanaan Berbasis Data (PBD)**:
   * Kemendikdasmen mewajibkan Pemda dan satuan pendidikan menyusun program intervensi berbasis Rapor Pendidikan. NUSA-MIPA hadir sebagai instrumen cerdas (*decision support system*) yang menjembatani data tabular yang rumit menjadi rekomendasi aksi yang presisi.

---

## 3. Bedah Anatomi Data & Strategi Integrasi (IPO Framework)

### A. Mengapa Rapor Pendidikan Memiliki Banyak Sel Kosong? (*Structural Missingness*)
* Sel kosong (*blank*) pada file `data-rapor-pendidikan-indonesia-2025.xlsx` dan `2024` **bukan data rusak/missing acak**, melainkan pemisahan 3 rezim instrumen evaluasi:
  * **SD, SMP, SMA, SLB**: Mengisi 7 Indikator Inti AN & Sulingjar (Literasi, Numerasi, Karakter, Iklim Keamanan, Kebinekaan, Inklusivitas, Kualitas Pembelajaran). Kolom PAUD dan Penyerapan SMK pasti kosong.
  * **SMK**: Mengisi 7 Indikator Inti + Penyerapan Lulusan SMK (total 8 kolom terisi). Kolom PAUD kosong.
  * **PAUD**: Hanya mengisi Kualitas Pembelajaran PAUD + 5 Indikator Khusus PAUD. Semua kolom AN (Literasi/Numerasi) pasti kosong karena murid PAUD tidak dites AN.
* **Strategi Pembersihan**:
  * Filter jenjang pendidikan formal: Ambil jenjang **SD, SMP, SMA, dan SMK**.
  * Eliminasi 5 kolom khusus PAUD dan pisahkan baris entitas Luar Negeri.
  * **Hasil**: Data menjadi **100% lengkap dan bersih (0% missing value)** untuk seluruh wilayah.

### B. Mengapa Perlu Digabung dengan Dataset Statistik & BPS? (Kerangka Input–Process–Output)
* **Kelemahan jika Rapor Pendidikan berdiri sendiri**: Variabelnya didominasi oleh *Process* (iklim belajar) dan *Outcome* (skor literasi/numerasi). Pemerintah daerah tidak dapat mengetahui faktor input fisik & SDM nyata apa yang harus dianggarkan/diintervensi.
* **Solusi**: Menggabungkan Rapor Pendidikan dengan **Dataset Statistik Kemendikdasmen (Dapodik)** dan data **BPS/Pusdatin**:
  * *Input (SDM & Fisik)*: Rasio guru, kualifikasi S1, kondisi ruang kelas, ketersediaan komputer/internet.
  * *Process (Iklim Sekolah)*: Kualitas pembelajaran (D.1), refleksi guru (D.2), kepemimpinan instruksional (D.3), iklim keamanan (D.4).
  * *Output (Hasil Belajar MIPA)*: Capaian Numerasi (A.2) dan Gap Defisit Numerasi–Literasi Lintas Jenjang.

### C. Skema Struktur Kolom Data Master Analitik (Kerangka IPO 2025)

| Kategori | Nama Fitur / Kolom | Sumber Data | Peran dalam Pemodelan |
| :--- | :--- | :--- | :--- |
| **Identitas & Spasial** | `tahun`, `nama_provinsi`, `nama_kabupaten_kota`, `jenjang`, `latitude`, `longitude` | Integrasi Portal + GeoJSON | Kunci join, filter jenjang, pembobotan matriks kernel spasial ($W$), dan koordinat peta |
| **Input $X_1$ (Kapasitas SDM Guru)** | `rasio_siswa_per_guru`, `proporsi_guru_s1_score`, `indeks_pemerataan_guru` | Gambaran Umum Sekolah Dapodik + Pusdatin | Mengukur beban mengajar riil, kualifikasi akademik S1, dan disparitas sebaran guru per daerah |
| **Input $X_2$ (Sarpras Fisik & TIK)** | `persen_sekolah_internet`, `persen_sekolah_listrik`, `persen_sekolah_air_cukup`, `persen_ruang_kelas_layak`, `rasio_siswa_per_rombel`, `rasio_rombel_per_ruang`, `kesenjangan_fasilitas_tik_score` | Dapodik Statistik 2025 + Sulingjar D.21 | Mengukur kesiapan digital, elektrifikasi, sanitasi, dan kecukupan ruang kelas per kabupaten/kota (bukan konstan se-provinsi) |
| **Input $X_3$ (Iklim & Pedagogik)** | `kualitas_pembelajaran_score` (D.1), `refleksi_guru_score` (D.2), `kepemimpinan_instruksional_score` (D.3), `iklim_keamanan_score` (D.4), `iklim_kebinekaan_score` (D.8), `iklim_inklusivitas_score` (D.10), `indeks_karakter_score` (A.3) | Rapor Pendidikan 2025 (Sulingjar & AN) | Mengukur mutu interaksi pembelajaran kelas, kepemimpinan sekolah, dan iklim sosial belajar |
| **Input $X_4$ (Kerentanan & Efisiensi)** | `persen_putus_sekolah`, `persen_mengulang`, `literasi_score` (A.1) | Dapodik Statistik + Rapor Pendidikan 2025 | Mengukur tingkat kerentanan putus sekolah dan kemampuan fondasi literasi membaca |
| **Target Utama ($Y$)** | `numerasi_score` (Kontinu 15.0–98.0) | Kuantifikasi Kalibrasi SKM AN 2025 | Variabel dependen kontinu yang diprediksi dan dianalisis faktor determinan lokalnya |
| **Indikator Diagnostik MIPA** | `gap_numerasi_literasi` ($\text{numerasi} - \text{literasi}$) | Hasil Kalkulasi Fitur Analitik | Menyoroti ketertinggalan spesifik kompetensi numerasi matematika terhadap literasi membaca |

### D. Dokumentasi Teknis Backend API Portal Data Kemendikdasmen (Scraping & Direct Download)
Untuk keperluan replikasi, otomasi data pipeline, dan verifikasi dewan juri, berikut adalah spesifikasi teknis API backend Kemendikdasmen yang berhasil direverse-engineer:
* **Backend API Base URL**:  
  `https://api.data.belajar.id/data-portal-backend`
* **Data Tabel Dinamis / Statistik Per Wilayah**:  
  `GET https://api.data.belajar.id/data-portal-backend/v2/datasets/{slug}/data?aggregate=kabupaten&periode=2025&limit=1000`  
  *(Menyediakan akses langsung ke data riil level Kabupaten/Kota se-Indonesia untuk Gambaran Umum Sekolah, Akses Internet, dan Akses Listrik)*
* **Katalog Dataset Prioritas Endpoint**:  
  `GET https://api.data.belajar.id/data-portal-backend/v2/datasets?slugTopik=prioritas,prioritas-data&limit=50&offset=0`
* **Direct Asset Download CDN Pattern**:  
  `https://cdn.data-portal.belajar.id/Aset-Dataset/{YYYYMMDD}/{hash_sha256}.xlsx`
* **Client Request Headers Resmi**:
  ```json
  {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Origin": "https://data.kemendikdasmen.go.id",
    "Referer": "https://data.kemendikdasmen.go.id/",
    "X-Client-App": "data-portal-fe",
    "X-Client-Deployed-At": "1790653233000",
    "X-Client-Version": "3.21.0",
    "X-Client-Sha": "532019e"
  }
  ```

### E. Metadata & Kamus Data Master Dataset Final (Folder `data/FINAL/`)

Seluruh data hasil fusi dan pra-pemrosesan telah dibersihkan dan distandarisasi di direktori `data/FINAL/` dengan rincian metadata sebagai berikut:

#### 1. Berkas Utama: `master_pendidikan_kabupaten_2025_clean.csv`
* **Dimensi**: 2.056 baris (514 Kabupaten/Kota $\times$ 4 Jenjang: SD, SMP, SMA, SMK) $\times$ 30 kolom terkurasi.
* **Tingkat Keterisian Geospasial**: Koordinat Centroid (`latitude`, `longitude`) **100% lengkap (0% missing)** dengan verifikasi pemisahan tipe administrasi Kota vs Kabupaten (bebas duplikasi dan bebas salah pulau).
* **Tingkat Keterisian Fitur**: **100% lengkap** setelah penerapan Spatial KNN Imputation untuk wilayah pemekaran 3T.

| No | Nama Kolom / Fitur | Tipe Data | Sumber Data | Rentang Nilai | Definisi & Peran Pemodelan |
| :---: | :--- | :---: | :--- | :---: | :--- |
| 1 | `tahun` | Integer | Kemendikdasmen | `2025` | Tahun pengamatan (Cross-Sectional 2025) |
| 2 | `nama_provinsi` | String | Kemendikdasmen | 38 Provinsi | Entitas wilayah administratif tingkat I |
| 3 | `nama_kabupaten_kota` | String | Kemendikdasmen | 514 Daerah | Entitas wilayah administratif tingkat II |
| 4 | `jenjang` | String | Kemendikdasmen | `SD`, `SMP`, `SMA`, `SMK` | Jenjang pendidikan formal untuk analisis komparasi transisi |
| 5 | `latitude` | Float | GeoJSON Centroid | -10.74 s.d 4.22 | Koordinat lintang terverifikasi per kabupaten/kota |
| 6 | `longitude` | Float | GeoJSON Centroid | 95.31 s.d 140.71 | Koordinat bujur terverifikasi per kabupaten/kota |
| 7 | `numerasi_label` | String | Rapor Pendidikan | `Baik`, `Sedang`, `Kurang` | Label kualitatif capaian numerasi resmi AN 2025 |
| 8 | `literasi_label` | String | Rapor Pendidikan | `Baik`, `Sedang`, `Kurang` | Label kualitatif capaian literasi membaca AN 2025 |
| 9 | `numerasi_score` | Float | Kalibrasi SKM Kontinu | 15.0 s.d 98.0 | **Variabel Target Utama ($Y$)** capaian numerasi kontinu |
| 10 | `literasi_score` | Float | Kalibrasi SKM Kontinu | 15.0 s.d 98.0 | Skor kemampuan literasi membaca kontinu (Kovariat $X$) |
| 11 | `gap_numerasi_literasi`| Float | Fitur Analitik | -30.0 s.d +30.0 | Selisih skor ($\text{numerasi} - \text{literasi}$) defisit MIPA |
| 12 | `indeks_karakter_score` | Float | Sulingjar (A.3) | 35.0 s.d 82.5 | Indeks karakter siswa (Kovariat $X$) |
| 13 | `proporsi_guru_s1_score` | Float | Rapor Pend. (C.1) | 35.0 s.d 82.5 | Proporsi guru bersertifikat/S1 (Kovariat $X$) |
| 14 | `kualitas_pembelajaran_score`| Float | Sulingjar (D.1) | 35.0 s.d 82.5 | Komposit manajemen kelas, afektif & aktivasi kognitif ($X$) |
| 15 | `refleksi_guru_score` | Float | Sulingjar (D.2) | 35.0 s.d 82.5 | Kebiasaan refleksi & perbaikan pengajaran guru ($X$) |
| 16 | `kepemimpinan_instruksional_score`| Float | Sulingjar (D.3) | 35.0 s.d 82.5 | Efektivitas kepemimpinan kepala sekolah ($X$) |
| 17 | `iklim_keamanan_score` | Float | Sulingjar (D.4) | 35.0 s.d 82.5 | Keamanan lingkungan belajar dari perundungan ($X$) |
| 18 | `iklim_kebinekaan_score` | Float | Sulingjar (D.8) | 35.0 s.d 82.5 | Toleransi suku, agama, dan budaya di sekolah ($X$) |
| 19 | `iklim_inklusivitas_score` | Float | Sulingjar (D.10) | 35.0 s.d 82.5 | Layanan ramah bagi murid disabilitas/inklusi ($X$) |
| 20 | `kesenjangan_fasilitas_tik_score`| Float | Sulingjar (D.21) | 35.0 s.d 82.5 | Tingkat kesenjangan sarana digital di sekolah ($X$) |
| 21 | `rasio_siswa_per_guru` | Float | Gambaran Umum Dapodik | 5.0 s.d 45.0 | Rasio riil beban murid per guru di tiap daerah ($X$) |
| 22 | `rasio_siswa_per_rombel` | Float | Gambaran Umum Dapodik | 10.0 s.d 40.0 | Kepadatan jumlah peserta didik per rombel ($X$) |
| 23 | `rasio_rombel_per_ruang` | Float | Gambaran Umum Dapodik | 0.5 s.d 2.5 | Kepadatan ruang kelas terhadap rombongan belajar ($X$) |
| 24 | `persen_ruang_kelas_layak` | Float | Gambaran Umum Dapodik | 0.0% s.d 100.0% | Persentase kecukupan fisik ruang kelas per daerah ($X$) |
| 25 | `persen_putus_sekolah` | Float | Gambaran Umum Dapodik | 0.0% s.d 10.0% | Tingkat putus sekolah riil tingkat kabupaten ($X$) |
| 26 | `persen_mengulang` | Float | Gambaran Umum Dapodik | 0.0% s.d 10.0% | Tingkat murid mengulang kelas tingkat kabupaten ($X$) |
| 27 | `persen_sekolah_internet` | Float | Dapodik Statistik Kab | 0.0% s.d 100.0% | Akses internet sekolah riil level kabupaten/kota ($X$) |
| 28 | `persen_sekolah_listrik` | Float | Dapodik Statistik Kab | 0.0% s.d 100.0% | Elektrifikasi sekolah riil level kabupaten/kota ($X$) |
| 29 | `persen_sekolah_air_cukup` | Float | Dapodik Statistik Kab | 0.0% s.d 100.0% | Kecukupan air bersih sekolah riil level kabupaten ($X$) |
| 30 | `indeks_pemerataan_guru` | Float | Pusdatin Kemendikdasmen | 0.0 s.d 100.0 | Indeks disparitas distribusi guru tingkat daerah ($X$) |

#### 2. Berkas Pendukung: `master_pendidikan_provinsi_2025.csv`
* **Dimensi**: 152 baris (38 Provinsi $\times$ 4 Jenjang) $\times$ 15 kolom.
* **Fungsi**: Memuat nilai **persentase murni Standar Kompetensi Minimum (SKM)** numerasi dan literasi (skala kontinu 0–100%) untuk analisis makro tingkat provinsi serta baseline benchmarking nasional.

#### 3. Berkas Spasial Batas Wilayah (GeoJSON & Centroid Lookup)
* `indonesia_kabupaten.geojson` (Ukuran: 2.26 MB) — Poligon batas administrasi 502/514 kabupaten/kota dengan koordinat centroid terintegrasi untuk visualisasi Leaflet choropleth.
* `indonesia_provinsi.geojson` (Ukuran: 1.44 MB) — Poligon batas administrasi 38 provinsi di Indonesia.
* `koordinat_kabupaten_indonesia.csv` — Tabel referensi cepat koordinat centroid (`latitude`, `longitude`) 514 kabupaten/kota se-Indonesia.

---

### F. Standarisasi Kuantifikasi Ordinal ke Kontinu (`_score` Midpoint Mapping)

Di dalam file mentah Rapor Pendidikan Kemendikdasmen, indikator evaluasi disajikan dalam bentuk label teks kategori kualitatif (`'Baik'`, `'Sedang'`, `'Kurang'`). Model machine learning matematika (*Ordinary Least Squares*, *MGWR*, *XGBoost*, dan *K-Means*) **tidak dapat memproses operasi matriks aljabar dari string teks**.

Oleh karena itu, dalam tahap feature engineering diterapkan standarisasi kuantifikasi (*Ordinal-to-Continuous Midpoint Scaling*) berdasarkan rentang resmi Rapor Pendidikan:

$$\text{Score} = \begin{cases} 
82.5 & \text{jika label } \textbf{'Baik' / 'Tinggi'} \quad (\text{titik tengah rentang capaian } 70 - 100) \\
57.5 & \text{jika label } \textbf{'Sedang'} \quad (\text{titik tengah rentang capaian } 50 - 70) \\
35.0 & \text{jika label } \textbf{'Kurang' / 'Rendah'} \quad (\text{titik tengah rentang capaian } < 50) \\
\text{NaN} & \text{jika label } \textbf{'Tidak Tersedia' / Blank}
\end{cases}$$

---

### G. Batasan Data Terbuka Nasional (*Open Data Granularity Boundary*)

Berdasarkan investigasi empiris mendalam atas file sumber [Portal Data Rapor Pendidikan Indonesia 2025 Kemendikdasmen](https://data.kemendikdasmen.go.id/dataset/p/rapor-pendidikan-indonesia/data-rapor-pendidikan-indonesia-2025) dan katalog 289 dataset prioritas:
1. **Penyebab Kolom Sub-Indikator Kosong**:
   * Kolom sub-domain matematika: `domain_bilangan_score` (A.2.1), `domain_aljabar_score` (A.2.2), `domain_geometri_score` (A.2.3), dan `domain_data_score` (A.2.4).
   * Kolom sub-komponen pembelajaran: `manajemen_kelas_score` (D.1.1), `dukungan_psikologis_score` (D.1.2), dan `metode_pembelajaran_score` (D.1.3).
   * **Fakta**: Seluruh sel untuk indikator level 2 tersebut **100% diisi teks `"Tidak Tersedia"`** oleh Kemendikdasmen di seluruh 38 provinsi dan 514 kabupaten/kota se-Indonesia.
2. **Alasan Kebijakan Nasional**:
   Sub-domain kognitif dan rincian kelas mikro merupakan instrumen diagnostik privat yang hanya dibuka bagi Kepala Sekolah dan Guru melalui SSO *Belajar.id* pada level Satuan Pendidikan (Sekolah), dan sengaja **tidak dipublikasikan ke publik pada level Kabupaten/Kota/Provinsi** guna mencegah stigmatisasi publik terhadap reputasi guru/sekolah daerah.
3. **Resolusi Ilmiah Tim Peneliti**:
   * Kolom yang 100% kosong dieliminasi (*dropped*) dari tabel pemodelan untuk menjaga integritas data statistik (*zero artifact distortion*).
   * Nilai proses dan capaian diwakili secara sempurna oleh **Indikator Komposit Utamanya** yang **terisi 99.5% lengkap**: **`A.2 Kemampuan Numerasi`** dan **`D.1 Kualitas Pembelajaran`** (yang mencakup manajemen kelas, dukungan psikologis afektif, dan metode pembelajaran secara terpadu).

---

## 4. Tiga Pilar Tujuan Penelitian (Fokus Single-Year 2025)

1. **Tujuan 1 — Spatial & Multi-Pillar Profiling Clustering (Tipologi Mutu Numerasi Nasional)**:  
   Mengelompokkan 514 Kabupaten/Kota di Indonesia berdasarkan kerangka **Profil 6 Dimensi IPO Wilayah (Numerasi, Literasi, Kualitas Pembelajaran, Iklim Sekolah, SDM Guru, dan Kesiapan TIK/Sarpras)** serta menganalisis **Fenomena Learning Loss Transisi Jenjang (SD vs SMP vs SMA vs SMK)**:
   * *Klaster 1 (High Input – High Output)*: Wilayah berkinerja unggul dan mandiri (Benchmark Nasional).
   * *Klaster 2 (High Input – Low/Medium Output)*: Wilayah dengan paradoks sarpras (fasilitas fisik/TIK cukup, namun efektivitas pedagogik guru rendah — prioritas pelatihan kompetensi guru).
   * *Klaster 3 (Low Input – Low Output)*: Wilayah darurat 3T (keterbatasan infrastruktur dasar listrik/internet dan SDM — prioritas bantuan afirmasi fiskal).
   * *Analisis Transisi MIPA*: Mendeteksi anomali disparitas capaian matematika antartingkat pendidikan dalam kabupaten yang sama (misal: numerasi SD kategori Baik/Sedang namun anjlok saat transisi ke SMP/SMA/SMK akibat kesenjangan abstraksi konsep matematika lanjut).
2. **Tujuan 2 — Local Feature Attribution via MGWR & Explainable AI (SHAP)**:  
   Membuktikan adanya heterogenitas spasial (*spatial non-stationarity*) dan mendiagnosis akar masalah lokal per wilayah secara presisi. Menjawab pertanyaan mendasar bagi Pemda: *"Mengapa daerah X tertinggal dalam numerasi?"* (Apakah karena beban rasio murid per guru yang berlebih, ketiadaan listrik/internet sekolah, kualitas pembelajaran guru yang pasif, atau iklim sekolah yang tidak aman).
3. **Tujuan 3 — What-If Policy Intervention Simulator (Dukungan Kebijakan Berbasis ML)**:  
   Menyediakan instrumen kalkulator simulasi intervensi kebijakan berbasis model machine learning prediktif: *"Jika pemerintah daerah meningkatkan akses internet sekolah sebesar +15%, menurunkan rasio siswa per rombel sebesar -5 murid, dan memperbaiki kualitas pembelajaran guru (D.1) sebesar +10 poin, berapa estimasi kenaikan skor numerasi daerah tersebut?"* (Model simulasi kausal-prediktif cross-sectional 2025 yang jauh lebih akurat dan dapat ditindaklanjuti secara riil oleh dinas pendidikan).

---

## 5. Arsitektur Produk Web: NUSA-MIPA

NUSA-MIPA dirancang sebagai aplikasi web modern, responsif, dan interaktif dengan 3 modul utama:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PLATFORM WEB NUSA-MIPA                          │
├────────────────────────────────────────────────────────────────────────┤
│  [MODUL 1] PETA CHOROPLETH KLASTER & RADAR CHART 6 DIMENSI IPO          │
│  - Visualisasi peta interaktif Indonesia (Choropleth Leaflet/Mapbox)   │
│  - Filter dinamis: Jenjang (SD/SMP/SMA/SMK) & Klaster Wilayah          │
│  - Klik wilayah -> Muncul Radar Chart Profil 6 Dimensi IPO:            │
│    (1) Numerasi, (2) Literasi, (3) Kualitas Pembelajaran,              │
│    (4) Iklim Sekolah, (5) SDM Guru, (6) Kesiapan TIK/Sarpras           │
│  - Panel "Learning Loss Inspector": Grafik transisi tren capaian       │
│    Numerasi lintas jenjang (SD -> SMP -> SMA -> SMK) per kabupaten     │
├────────────────────────────────────────────────────────────────────────┤
│  [MODUL 2] DIAGNOSIS DETERMINAN LOKAL (LOCAL XAI & MGWR INSPECTOR)     │
│  - Waterfall Plot / Force Plot SHAP interaktif untuk wilayah terpilih  │
│  - Koefisien Spasial MGWR lokal vs Rerata Global OLS                   │
│  - Ringkasan "Top 3 Akar Masalah Utama" secara otomatis per daerah     │
├────────────────────────────────────────────────────────────────────────┤
│  [MODUL 3] WHAT-IF POLICY INTERVENTION SIMULATOR                       │
│  - Interactive Sliders untuk parameter intervensi kebijakan Pemda:    │
│    * Akses Internet Sekolah (%) & Elektrifikasi Listrik (%)            │
│    * Rasio Beban Siswa per Guru & Kecukupan Ruang Kelas (%)            │
│    * Kualitas Pembelajaran Guru (D.1) & Refleksi Pengajaran (D.2)      │
│    * Iklim Keamanan & Anti-Bullying (D.4)                              │
│  - Real-time ML Inference: Prediksi delta lonjakan skor numerasi (Δ Y) │
│    berdasarkan batasan parameter realistis (counterfactual prediction) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Metodologi & Pipeline Data Mining

1. **Tahap 1: Data Preprocessing & Multi-Source Master Integration (2025 Cross-Sectional)**
   * Ekstraksi indikator Rapor Pendidikan 2025 untuk seluruh 514 Kabupaten/Kota dan 38 Provinsi.
   * Integrasi data riil level kabupaten Dapodik (Gambaran Umum Sekolah, Akses Internet, Akses Listrik, Sanitasi Air, dan Indeks Pemerataan Guru).
   * Verifikasi spasial koordinat centroid (pemisahan tipe Kota vs Kabupaten tanpa duplikasi dan pembersihan entitas perairan).
   * Kalibrasi skor numerasi & literasi menjadi skala kontinu (15.0–98.0) berbasis patokan SKM provinsi dan status relatif AN daerah.
   * Penerapan Spatial KNN Imputation untuk wilayah pemekaran 3T agar data 100% lengkap tanpa *missing value*.
2. **Tahap 2: Unsupervised Spatial & Multi-Pillar Profiling Clustering**
   * Algoritma: Membandingkan **K-Means**, **Hierarchical/Agglomerative**, dan **HDBSCAN**.
   * Optimasi: Penentuan jumlah klaster optimal via *Elbow Method*, *Silhouette Score*, dan *Davies-Bouldin Index*.
   * Ekstraksi tipologi wilayah berbasis Profil 6 Dimensi IPO dan deteksi pola transisi jenjang SD–SMK.
3. **Tahap 3: Pemodelan Regresi Spasial & Explainable AI**
   * *Baseline Model*: Ordinary Least Squares (OLS) Global Regression.
   * *Spatial Local Regression*: **MGWR (Multiscale Geographically Weighted Regression)** menggunakan pembobot kernel adaptif *bisquare* atau *gaussian*.
   * *Non-Linear Ensemble*: **LightGBM / XGBoost Regressor**.
   * *Model Interpretability*: **TreeSHAP** (*SHapley Additive exPlanations*) untuk mengekstrak kontribusi lokal tiap indikator pada setiap kabupaten/kota.
   * *Metrik Evaluasi*: $R^2$, Adjusted $R^2$, AICc (*Corrected Akaike Information Criterion*), RMSE (*Root Mean Squared Error*), dan MAE (*Mean Absolute Error*).
4. **Tahap 4: Counterfactual Policy Simulation & Inference Engine**
   * Menggunakan model ensemble non-linear terlatih (LightGBM/XGBoost) sebagai *inference engine* untuk simulasi kontrafaktual kebijakan: $\Delta Y = \hat{Y}_{\text{simulasi}} - Y_{\text{aktual}}$.
   * Menetapkan batasan simulasi intervensi yang realistis ($\pm 5\%$ s.d $\pm 25\%$) pada parameter sarpras TIK, kualitas pembelajaran, dan rasio guru, sehingga Pemda dapat mensimulasikan dampak anggaran sebelum kebijakan dieksekusi.

---

## 7. Sistematika Makalah Laporan Penelitian (8 Bagian Wajib)

Sesuai ketentuan baku Bab III Halaman 9–10 Buku Panduan DIMAS-TI 2026:

1. **Judul Makalah**:  
   Memuat problem, metode (MGWR & Explainable AI), dan konteks Pendidikan 5.0.
2. **Abstrak**:  
   Maksimal 250 kata, bilingual (Indonesia & Inggris), merangkum latar belakang, dataset, metodologi komparatif, performa metrik, dan implementasi DSS.
3. **Pendahuluan**:  
   Latar belakang paradoks PISA & Asesmen Nasional, pentingnya abstraksi matematika (MIPA), tujuan penelitian, manfaat bagi kebijakan PBD, dan batasan masalah.
4. **Kajian Terkait yang Relevan (*Related Work*)**:  
   Tinjauan literatur analisis pendidikan terdahulu, kelemahan OLS linier global, keunggulan pemodelan spasial (GWR/MGWR) dan machine learning berbasis explainability (SHAP).
5. **Solusi Usulan**:  
   Arsitektur sistem NUSA-MIPA, deskripsi dataset gabungan (IPO framework), formulasi matematis MGWR, mekanisme integrasi TreeSHAP, dan metrik evaluasi. Menegaskan **kebaruan (*novelty*)** dibanding penelitian sebelumnya.
6. **Hasil Eksperimen dan Pengujian**:  
   Tabel komparasi metrik (membuktikan MGWR dan LightGBM jauh melampaui OLS global), peta sebaran klaster, dan peta koefisien spasial lokal.
7. **Analisis atas Hasil Eksperimen dan Pengujian**:  
   Interpretasi fenomena pendidikan di balik angka: mengapa di wilayah 3T infrastruktur fisik mendominasi, sedangkan di wilayah perkotaan iklim keamanan dan metode pengajaran menjadi kunci.
8. **Kesimpulan**:  
   Jawaban ringkas atas 3 tujuan penelitian, implikasi manajerial bagi Gerakan Numerasi Nasional, dan rekomendasi pengembangan lanjutan.

---

## 8. Matriks Rubrik Penilaian DIMAS-TI 2026

### A. Babak Penyisihan (Bobot Total 100%)
| No | Kriteria Penilaian | Bobot | Strategi Kunci Tim |
| :---: | :--- | :---: | :--- |
| 1 | **Keaslian (Plagiarisme)** | 20% | Naskah ditulis mandiri, bebas plagiasi (Turnitin < 20%), menyertakan Surat Pernyataan bermaterai. |
| 2 | **Kebaruan Dataset / Metode** | 20% | Fusi multi-sumber resmi (Rapor Pendidikan 2025 + Dapodik Statistik riil 514 Kab/Kota + GeoJSON) dengan Dual-Method inovatif: MGWR multiskala spasial linier + Non-linear Explainable AI (TreeSHAP). |
| 3 | **Manfaat Nyata** | 20% | Solusi aplikatif langsung untuk Perencanaan Berbasis Data (PBD) Kemendikdasmen dan Pemda. |
| 4 | **Kejelasan Tulisan** | 20% | Bahasa baku, diagram alur pipeline jelas, tabel dan grafik berstandar jurnal ilmiah. |
| 5 | **Kelengkapan Laporan** | 20% | Memenuhi ke-8 bagian wajib tanpa ada poin yang terlewat. |

### B. Babak Final (Bobot Total 100%)
| No | Kriteria Penilaian | Bobot | Strategi Kunci Tim |
| :---: | :--- | :---: | :--- |
| 1 | **Nilai Babak Penyisihan** | 20% | Memaksimalkan kualitas makalah di awal seleksi. |
| 2 | **Skor Kinerja (Leaderboard)** | 30% | Menunjukkan metrik akurasi tinggi ($R^2$ optimal, RMSE/MAE rendah pada MGWR & LightGBM). |
| 3 | **Ketepatan Metode** | 25% | Argumentasi kuat mengapa MGWR & SHAP dipilih mengatasi kelemahan model konvensional. |
| 4 | **Presentasi & Tanya Jawab** | 25% | Demo live platform web NUSA-MIPA yang memukau dan penguasaan materi tim saat Q&A (15 menit). |

---

## 9. Roadmap & Checklist Eksekusi Tim

- [x] **Langkah 1: Data Preparation Pipeline**  
  Menjalankan skrip Python untuk mengekstrak data 514 Kab/Kota (Rapor Pendidikan 2025 & Dapodik Statistik), menghitung rasio input fisik/SDM riil per kabupaten, mengkalibrasi target numerasi kontinu (260 nilai unik), dan memvalidasi koordinat centroid tanpa duplikasi Kota vs Kabupaten.
- [ ] **Langkah 2: Model Training & Evaluation**  
  Menjalankan clustering (K-Means), baseline OLS, MGWR, dan LightGBM-SHAP, lalu mengekspor metrik dan nilai kontribusi lokal.
- [ ] **Langkah 3: Pembangunan Prototipe Web NUSA-MIPA**  
  Membuat antarmuka web interaktif (Peta Tematik Choropleth, Radar Chart Profil 6 Dimensi IPO & Transisi Jenjang, Visualisasi Waterfall SHAP, dan Slider Simulator Kebijakan Kontrafaktual).
- [ ] **Langkah 4: Penyusunan Naskah Makalah Ilmiah (PDF Maks 10 MB)**  
  Menulis naskah lengkap 8 bab sesuai format pedoman penulisan.
- [ ] **Langkah 5: Berkas Administrasi**  
  Menyiapkan Surat Pernyataan Orisinalitas bertandatangan ketua tim di atas materai Rp10.000 (maks. 2 MB) dan scan KTM anggota tim.

---
*Dokumen ini dibuat secara otomatis sebagai cetak biru resmi penelitian DIMAS-TI 2026.*
