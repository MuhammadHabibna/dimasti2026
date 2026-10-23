# DRAFT BAB I: PENDAHULUAN (STANDAR IEEE & JNTETI UGM)
**Program:** Divisi Penambangan Data (*Data Mining*) — DIMAS-TI AMLI 2026 (Universitas Negeri Gorontalo)  
**Judul Makalah:** *Spatial-Cluster Mapping, Multiscale Econometric Determinants, and Explainable Domain-Constrained Machine Learning for Educational Numeracy in Indonesia Toward Education 5.0*  
**Format Rujukan:** IEEE / JNTETI UGM Style

---

## I. PENDAHULUAN

### A. LATAR BELAKANG
Transformasi menuju *Education 5.0* menuntut penguatan kemampuan berpikir abstrak pada bidang Matematika dan Sains. Namun, berdasarkan laporan PISA terbaru, capaian murid Indonesia menunjukkan anomali. Skor literasi sains naik 6 poin (383 ke 389) dan membaca naik 6 poin (359 ke 365), tetapi skor matematika justru turun 2 poin (366 ke 364) di tengah lonjakan akses pendidikan formal dengan *Coverage Index* mencapai 0,90 [1]. Hal ini mengindikasikan bahwa perluasan akses sekolah belum diiringi dengan pemerataan kualitas pembelajaran kuantitatif.

Di tingkat nasional, data Rapor Pendidikan dan Dapodik pada 514 kabupaten/kota juga memperlihatkan ketimpangan spasial yang lebar. Rata-rata skor numerasi SD di Pulau Jawa (65,45) unggul 15,85 poin dibandingkan Luar Jawa (49,60), sementara wilayah non-3T unggul hingga 15,41 poin di atas daerah afirmasi 3T. Selain itu, penelusuran lintas jenjang mengungkap fenomena *transition learning loss*. Skor numerasi sempat naik dari jenjang SD (53,30) ke SMP (63,92), namun merosot sebesar 6,86 poin saat memasuki SMA (57,06) dan turun 8,79 poin pada SMK (55,13). Kondisi ini menuntut intervensi kebijakan pendidikan yang spesifik sesuai karakteristik wilayah dan jenjang.

### B. KAJIAN TERKAIT
Evaluasi pendidikan pemerintah saat ini masih bersifat deskriptif melalui agregasi skor tanpa memetakan tipologi kewilayahan lintas jenjang. Di sisi lain, kajian akademis terdahulu umumnya masih bersifat parsial [2]–[5]. Pemodelan faktor penentu dengan regresi global (*Ordinary Least Squares*/OLS) mengabaikan efek ketergantungan spasial [2], sedangkan penggunaan *Multiscale Geographically Weighted Regression* (MGWR) tanpa penyaringan variasi lokal rentan mengalami singularitas matriks dengan *condition number* melebihi $10^9$ [3]. Sementara itu, pemodelan *Machine Learning* (ML) standar kerap memasukkan variabel literasi yang mendominasi model [4] serta rentan terjebak bias pembaur perkotaan (*urban confounding*), seperti memprediksi pengurangan kepadatan kelas justru menurunkan skor numerasi [5]. Penelitian ini mengusulkan kerangka kerja terintegrasi NUSA-MIPA yang perbedaannya dirangkum pada Tabel I.

<div align="center">

**TABEL I**  
**PERBANDINGAN FITUR ANALITIS SOLUSI USULAN DENGAN PENDEKATAN LAIN**

| Fitur / Kemampuan Analitis | Pendekatan Pemerintah Saat Ini | Analisis Akademis Parsial | Solusi Usulan (Model Terintegrasi NUSA-MIPA) |
| :--- | :---: | :---: | :---: |
| Identifikasi Tipologi Wilayah (IPO 4 Jenjang) | ✗ | ✗ | ✓ |
| Analisis Determinan Lokal (MGWR Bebas Multiko) | ✗ | ✓ | ✓ |
| Proyeksi & Prediksi Spasial (Dual Spatial CV) | ✗ | ✓ | ✓ |
| Simulasi What-If Bebas Bias (*Monotonic Constraints*) | ✗ | ✗ | ✓ |
| Sintesis Wawasan Holistik 360° (2.056 Unit Wilayah-Jenjang) | ✗ | ✗ | ✓ |

</div>

### C. TUJUAN DAN MANFAAT PENELITIAN
Tujuan penelitian ini adalah:
1. Memetakan tipologi kewilayahan pendidikan berdasarkan 6 dimensi *Input-Process-Output* (IPO) serta menganalisis *learning loss* lintas jenjang;
2. Mengestimasi determinan numerasi secara multiskala dengan MGWR yang bebas multikolinieritas lokal; dan
3. Membangun simulator kebijakan *Monotonic Machine Learning* berbasis TreeSHAP menuju *Education 5.0*.

Penelitian ini bermanfaat secara teoretis dalam mengatasi singularitas lokal MGWR dan bias pembaur pada ML, serta secara praktis menyediakan matriks rekomendasi preskriptif (alokasi DAK Fisik, pemerataan guru, dan afirmasi keamanan sekolah 3T) di 2.056 unit wilayah-jenjang bagi pengambil kebijakan.

### D. BATASAN MASALAH
Penelitian ini dibatasi pada:
1. 2.056 unit observasi bersih tahun 2025 yang mencakup 514 kabupaten/kota pada empat jenjang pendidikan (SD, SMP, SMA, dan SMK);
2. Penggunaan 1 variabel target (skor capaian numerasi) dan 20 prediktor dari integrasi resmi Rapor Pendidikan dan Dapodikdasmen; serta
3. Fokus pemodelan intervensi pada fitur kebijakan murni (*pure policy features*) tanpa variabel proksi literasi (Kasus 2 dan Kasus 3) agar menghasilkan rekomendasi fisik dan pedagogis yang terukur serta dapat diintervensi secara langsung oleh pemerintah daerah.

---

## DAFTAR PUSTAKA (FORMAT STANDAR IEEE / JNTETI UGM)

[1] OECD, *PISA 2025 Results (Volume I: Future-Ready Students)*, Paris, Prancis: OECD Publishing, 2026.

[2] A. Hapsery dan D. Trishnanti, “Aplikasi Geographically Weighted Regression (GWR) untuk Pemetaan Faktor yang Mempengaruhi Indeks Aktivitas Literasi Membaca di Indonesia,” *Jurnal Riset dan Aplikasi Matematika (JRAM)*, vol. 5, no. 1, hal. 41–52, Apr. 2021.

[3] T. M. Oshan, Z. Li, W. Kang, L. J. Wolf, dan A. S. Fotheringham, “mgwr: A Python implementation of multiscale geographically weighted regression for investigating process spatial heterogeneity and scale,” *ISPRS International Journal of Geo-Information*, vol. 8, no. 6, hal. 269, Jun. 2019.

[4] J. Pan, Z. Zhao, dan D. Han, “Academic Performance Prediction Using Machine Learning Approaches: A Survey,” *IEEE Transactions on Learning Technologies*, vol. 18, hal. 351–368, 2025.

[5] S. M. Lundberg, G. G. Erion, H. Chen, A. J. DeGrave, J. M. Prutkin, B. Nair, R. Katz, M. H. Himmelfarb, N. Bansal, dan S.-I. Lee, “From local explanations to global understanding with explainable AI for trees,” *Nature Machine Intelligence*, vol. 2, no. 1, hal. 56–67, Jan. 2020.
