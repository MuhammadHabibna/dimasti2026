# CETAK BIRU & REFERENSI STRUKTUR LAPORAN NUSA-MIPA

**Kompetisi:** DIMAS-TI AMLI 2026 — Divisi Penambangan Data (*Data Mining*)

**Tuan Rumah:** Universitas Negeri Gorontalo

**Tim Peneliti:** Horasio Nissi Immanuel, Muhammad Habib Nur Aiman, Ulfa Siti Nuraini (FMIPA, Universitas Negeri Surabaya)

## 📋 1. ATURAN FORMAT & KONVENSI TEMPLATE (`DIMAS TI 2026.docx`)

Berdasarkan *template* resmi IEEE 2-kolom (`DIMAS TI 2026.docx`) dan `Buku Panduan DIMAS-TI 2026.pdf`, berikut adalah aturan tata letak yang wajib dipatuhi:

* **Batas Halaman:** Ketat **4 hingga maksimal 5 halaman** (termasuk Referensi) dalam ukuran kertas A4 2-kolom.

* **Hierarki Heading:**

  * **Bab Utama (Heading Level 1):** Angka Romawi Kapital (`I.`, `II.`, `III.`, `IV.`, `V.`), huruf kapital semua, tebal (*bold*), rata kiri. Khusus bagian `REFERENSI` tidak menggunakan nomor Romawi.

  * **Sub-Bab (Heading Level 2):** Abjad Kapital (`A.`, `B.`, `C.`), huruf kapital semua, tebal (*bold*), miring (*italic*), rata kiri.

  * **Sub-Sub-Bab (Heading Level 3):** Angka Arab diikuti kurung tutup (`1)`, `2)`), huruf kapital di awal kata, miring (*italic*).

* **Penomoran Visual:**

  * **Tabel:** Menggunakan Angka Romawi (`TABEL I`, `TABEL II`, dst.) dengan format *Small Caps* dan diletakkan di **atas** tabel.

  * **Gambar:** Menggunakan Angka Arab (`Gambar 1`, `Gambar 2`, dst.) dan diletakkan di **bawah** gambar.

* **Strategi Seleksi Visual (5 Halaman):** Jangan memasukkan seluruh 14 gambar dan 14 tabel CSV ke dalam naskah 5 halaman. Pilih **5–6 Gambar paling berdampak tinggi** dan **3–4 Tabel ringkasan padat** untuk naskah utama, sedangkan sisanya disimpan untuk amunisi *slide* presentasi Babak Final.

## 🎯 2. TARGET KRITERIA PENILAIAN JURI

1. **Babak Penyisihan (Bobot Total 100%):**

   * Keaslian Karya: **20%**

   * Kebaruan Dataset atau Metode yang Digunakan: **20%**

   * Manfaat: **20%**

   * Kejelasan Tulisan: **20%**

   * Kelengkapan Laporan (Wajib memuat 8 Poin Buku Panduan): **20%**

2. **Babak Final (Bobot Teknis 75% + Presentasi 25%):**

   * Nilai Babak Penyisihan: **20%**

   * Skor Kinerja (*Leaderboard* / Metrik Evaluasi Model): **30%**

   * Ketepatan Metode: **25%**

   * Presentasi dan Tanya Jawab: **25%**

## 🏗️ 3. STRUKTUR DETAIL BAB & SUB-BAB (MAKSIMAL 5 HALAMAN)

### **BAGIAN HEADER & ABSTRAK** *(Estimasi: 0,35 Halaman — Halaman 1 Atas)*

* **Judul Makalah:** Maksimal 12 kata (sesuai *template* `DIMAS TI 2026.docx`), setiap awal kata huruf kapital kecuali kata tugas.

  * *Opsi Judul Bahasa Indonesia (12 Kata):* **"Pemetaan Spasial-Kluster dan Pembelajaran Mesin Terkendali Domain untuk Numerasi Menuju Education 5.0"**

  * *Opsi Judul Bahasa Inggris (Sesuai Notebook):* **"Spatial-Cluster Mapping and Domain-Constrained Machine Learning for Numeracy Toward Education 5.0"** *(Pastikan panjang judul disesuaikan aturan template).*

* **Identitas Penulis:** Horasio Nissi Immanuel, Muhammad Habib Nur Aiman, Ulfa Siti Nuraini (Program Studi Sains Data / FMIPA, Universitas Negeri Surabaya) beserta alamat email korespondensi (tanpa gelar atau jabatan).

* **ABSTRAK & KATA KUNCI:**

  * **Isi Pembahasan (200–300 Kata, Tanpa Rumus/Sitasi):**

    1. *Latar Belakang & Urgensi:* Tantangan disparitas spasial mutu numerasi dasar-menengah di Indonesia dalam menyongsong era *Education 5.0*.

    2. *Tujuan:* Mengonstruksi kerangka kerja analitik spasial-kluster dan pembelajaran mesin preskriptif terkendali domain (*domain-constrained*).

    3. *Metodologi:* Integrasi *Master Dataset* $2.056$ observasi ($514$ kabupaten/kota $\times$ $4$ jenjang: SD, SMP, SMA, SMK), klasterisasi tipologi *Input-Process-Output* (IPO) dengan *K-Means*, ekonometrika spasial *Multiscale Geographically Weighted Regression* (MGWR) dengan pemangkasan kolinieritas lokal, serta *Monotonic LightGBM* + *TreeSHAP*.

    4. *Hasil Kuantitatif Utama:* Autokorelasi spasial kuat pada jenjang dasar-menengah (Moran's $I$ SD = $0,6237$), fenomena *Transition Learning Loss* SMP ke SMA ($-6,86$ poin) dan SMK ($-8,79$ poin), keunggulan *Composite MGWR* ($R^2 = 0,7659$; Spatial OOF $R^2 = 0,7665$), performa *Monotonic LightGBM* di bawah *GroupKFold CV* ($R^2 = 0,6416$) yang mengeliminasi 100% bias *urban confounding*, serta proyeksi kenaikan skor numerasi nasional sebesar $+6,626$ poin melalui simulasi Skenario E (*Paket Terpadu Education 5.0*).

  * **Kata Kunci (4–8 Kata Kunci):** *Education 5.0, Ekonometrika Spasial, LightGBM Monotonik, MGWR, Numerasi Pendidikan, Penambangan Data, TreeSHAP*.

### **BAB I: `I. PENDAHULUAN`** *(Estimasi: 0,65 Halaman — Halaman 1 Kolom Kiri & Kanan)*

> **Pemenuhan Buku Panduan:** Poin 3 (*Pendahuluan: Latar Belakang, Tujuan, Manfaat, Batasan*) & Poin 4 (*Kajian Terkait yang Relevan*).

#### **`A. LATAR BELAKANG DAN KAJIAN TERKAIT`**

* **Apa yang Dibahas:**

  1. Urgensi penguatan kemampuan berpikir abstrak matematika dan sains dalam cetak biru *Education 5.0*, yang saat ini terhambat oleh ketimpangan struktural numerasi antarwilayah di Indonesia (jurang Jawa vs Luar Jawa mencapai $+15,85$ poin di SD; ketimpangan Non-3T vs 3T mencapai $+15,41$ poin).

  2. Gejala empiris *Transition Learning Loss* saat siswa beralih dari jenjang SMP ke SMA/SMK serta anomali *Vocational Paradox* pada pendidikan kejuruan.

  3. **Kajian Terkait Relevan & Celah Penelitian (*Research Gap*):** Mengulas studi terdahulu pada data Rapor Pendidikan/Dapodik yang umumnya masih bertumpu pada regresi linier global (*Ordinary Least Squares*) sehingga melanggar Hukum Pertama Geografi Tobler (autokorelasi spasial), atau menggunakan algoritma *Machine Learning* tanpa kendali (*unconstrained*) yang terjebak *urban-rural confounding bias* (misal: memprediksi penurunan rasio siswa/rombel justru menurunkan capaian numerasi karena sekolah padat terkonsentrasi di perkotaan maju). Sitasi 8–12 pustaka bereputasi dengan penomoran IEEE `[1]–[12]`.

#### **`B. TUJUAN DAN MANFAAT PENELITIAN`**

* **Apa yang Dibahas:**

  1. **Tujuan Penelitian:**

     * Memetakan tipologi kewilayahan pendidikan ke dalam klaster berbasis 6 dimensi *Input-Process-Output* (IPO) serta mengidentifikasi profil *learning loss* lintas jenjang.

     * Mengestimasi variasi spasial dan skala operasi (*bandwidth* lokal, regional, global) dari determinan numerasi melalui pemodelan MGWR yang bebas dari singularitas matriks lokal.

     * Membangun model prediktif-preskriptif berbasis *Monotonic LightGBM* dan *TreeSHAP* untuk menyusun rekomendasi kebijakan mikro yang bebas dari bias *confounding*.

  2. **Manfaat Penelitian:** Menyediakan sistem pendukung keputusan (*Decision Support System*) berbasis bukti (*evidence-based policy*) bagi Kementerian Pendidikan dan Pemerintah Daerah dalam mengalokasikan DAK Fisik, redistribusi Guru Penggerak, dan intervensi iklim keamanan sekolah secara presisi di $514$ kabupaten/kota.

#### **`C. BATASAN MASALAH`**

* **Apa yang Dibahas:**

  1. Cakupan data terikat pada kontrak *Master Dataset* tahun 2025 sebanyak $2.056$ unit observasi ($514$ kabupaten/kota $\times$ $4$ jenjang pendidikan: SD, SMP, SMA, SMK) dengan 20 variabel prediktor hasil integrasi Dapodik dan Sulingjar/Rapor Pendidikan.

  2. Evaluasi kebijakan berfokus pada spesifikasi prediktor kebijakan murni tanpa variabel *proxy* literasi (*Case 2* dan *Case 3*) agar efek kausalitas dari variabel infrastruktur fisik, pendidik, dan iklim pembelajaran tidak tertutup (*masked*) oleh kolinieritas skor literasi.

* **Visual di Bab I:** *Tidak menyisipkan tabel/gambar besar agar Halaman 1 fokus merampungkan Abstrak dan Bab I secara utuh.*

### **BAB II: `II. SOLUSI USULAN DAN METODOLOGI`** *(Estimasi: 1,25 Halaman — Halaman 2 hingga Awal Halaman 3)*

> **Pemenuhan Buku Panduan:** Poin 5 (*Solusi yang Diusulkan: Deskripsi Solusi, Dataset, Metode, Perbedaan dengan Solusi Sebelumnya, dan Metrik Evaluasi*).

#### **`A. DESKRIPSI SOLUSI USULAN DAN PERBEDAAN DENGAN SOLUSI SEBELUMNYA`**

* **Apa yang Dibahas:** Memperkenalkan kerangka kerja hibrida **NUSA-MIPA** dan merinci **3 kebaruan utama dibanding studi/solusi sebelumnya**:

  1. *Kalibrasi Data & Mikro-Variasi Kontinu:* Integrasi utuh $2.056$ observasi ($0\%$ *missing values*), pemisahan tegas 24 pasangan distrik kembar (Kabupaten vs Kota), serta pengayaan mikro-variasi kontinu pada Indeks SKM ($1.284$ nilai unik kontinu) yang mengeliminasi masalah *ties* diskrit.

  2. *Resolusi Singularitas Spasial Lokal (VIF & Local Zero-Variance Pruning):* Eliminasi fitur kuasi-konstan dan multikolinieritas sempurna lokal yang menurunkan *local condition number* matriks desain MGWR dari $>10^9$ menjadi $4,12–6,18$, serta implementasi *Spatial Out-of-Fold (OOF) Cross-Validation* berbasis interpolasi *Inverse Distance Weighting* (IDW).

  3. *Kendali Monotonik Berbasis Teori Domain (*Domain-Informed Monotonic Constraints*):* Penegakan kendali arah turunan parsial ($\partial \hat{Y}/\partial X_m \ge 0$ atau $\le 0$) pada algoritma *Gradient Boosted Decision Trees* untuk mencegah pembalikan tanda koefisien (*sign reversal*) saat simulasi kebijakan *counterfactual*.

#### **`B. KONSTRUKSI DATASET DAN KERANGKA KERJA IPO`**

* **Apa yang Dibahas:**

  1. Struktur matriks data $2.056 \times 20$ fitur yang dikelompokkan ke dalam 6 dimensi *Input-Process-Output* (IPO): Input Sarana Fisik & Digital ($X_2$), Input Kualitas & Kuantitas Pendidik ($X_1$), Proses Iklim Pembelajaran & Keamanan Sulingjar ($X_3$: Kualitas Pembelajaran D.1, Iklim Keamanan D.4, Iklim Kebinekaan D.8), serta Output Retensi/Putus Sekolah ($X_4$) terhadap Target Skor Numerasi ($Y$).

  2. Desain 4 skenario ablasi fitur: **Case 1** (20 fitur termasuk Literasi), **Case 2** (19 tuas kebijakan murni tanpa Literasi untuk ML), **Case 3** (12 tuas kebijakan ortogonal hasil *pruning* VIF $< 5$ dan bebas varians nol lokal untuk MGWR), dan **Case 4** (Agregasi Komposit Kabupaten $n=514$).

#### **`C. TAHAPAN METODE ANALISIS DAN PEMODELAN`**

* **Apa yang Dibahas (Lengkapi dengan persamaan bernomor `(1)`, `(2)`, `(3)` sesuai format IEEE):**

  1. *Autokorelasi Spasial & Klasterisasi Tipologi:* Formulasi indeks Global Moran's $I$ menggunakan matriks bobot spasial $k$-Nearest Neighbors ($k=8$ dengan *row-standardization*) serta *benchmarking* 215 konfigurasi klaster (5 algoritma: *K-Means, Agglomerative, Birch, GMM, Spectral* $\times$ 3 metode penskalaan $\times$ $k \in \{2,3,4,5\}$).

  2. *Ekonometrika Spasial Multiskala (MGWR):* Persamaan struktural MGWR $\hat{y}_i = \beta_{b_{w0}}(u_i, v_i) + \sum_j \beta_{b_{wj}}(u_i, v_i) x_{ij} + \epsilon_i$ dengan kernel *adaptive bisquare* dan seleksi *bandwidth* spesifik-variabel ($k_j$) berbasis koreksi kriteria informasi Akaike ($AIC_c$), dibandingkan terhadap OLS, Ridge, Lasso, *Spatial Lag Model* (SAR), *Spatial Error Model* (SEM), dan *Classical GWR*.

  3. *Pembelajaran Mesin Terkendali Domain & Explainable AI:* Eksperimen 11 arsitektur ML dengan penekanan pada **Monotonic LightGBM** (vektor kendali monotonik $c_m \in \{-1, 0, +1\}$) dan ekstraksi nilai kontribusi marjinal fitur menggunakan **TreeSHAP** baik secara global maupun kondisional per klaster.

#### **`D. PROTOKOL VALIDASI SPASIAL DAN METRIK EVALUASI`**

* **Apa yang Dibahas:**

  1. Skema **Dual Spatial Cross-Validation** untuk mencegah kebocoran informasi geografis (*spatial data leakage*): (a) *5-Fold District GroupKFold* (seluruh 4 jenjang dalam 1 kabupaten wajib berada pada *fold* yang sama), dan (b) *38-Fold Leave-One-Province-Out (LOPO) Spatial CV* (menguji kemampuan generalisasi model pada provinsi yang sama sekali belum pernah dilihat saat pelatihan).

  2. Definisi metrik evaluasi: *Silhouette Score*, *Davies-Bouldin Index* (DBI), dan *Calinski-Harabasz Index* (CHI) untuk klasterisasi; *In-Sample* $R^2$, *Adjusted* $R^2$, $AIC_c$, *Residual Moran's* $I$, dan *Spatial OOF* $R^2$ untuk ekonometrika; serta *OOF* $R^2$, *Root Mean Squared Error* (RMSE), *Mean Absolute Error* (MAE), dan korelasi peringkat *Spearman's* $\rho$ untuk evaluasi ML dan uji ketahanan (*robustness*).

* **Visual yang Dilampirkan di Bab II:**

  * **`TABEL I`**: **Statistik Deskriptif, Disparitas Geografis, dan Autokorelasi Spasial Global (Moran's** $I$**) Capaian Numerasi Lintas Jenjang** *(Disadur dari `table0_eda_descriptive_and_spatial_autocorrelation.csv` & `table0c_regional_and_urban_disparities.csv`: menyajikan* $n=514$ *per jenjang, Mean, SD, Moran's* $I$*,* $Z$*-score,* $p$*-value, serta selisih skor Jawa vs Luar Jawa dan Non-3T vs 3T).*

### **BAB III: `III. HASIL EKSPERIMEN DAN PENGUJIAN`** *(Estimasi: 1,40 Halaman — Halaman 3 hingga Pertengahan Halaman 4)*

> **Pemenuhan Buku Panduan:** Poin 6 (*Hasil Eksperimen dan Pengujian*). Fokus menyajikan fakta angka hasil eksekusi kode, tabel komparasi model, dan metrik pengujian.

#### **`A. HASIL PEMETAAN KLASTER TIPOLOGI IPO DAN TRANSISI LINTAS JENJANG`**

* **Apa yang Dibahas:**

  1. Hasil seleksi 215 konfigurasi klaster yang menobatkan **K-Means (*StandardScaler*,** $k=3$**)** sebagai konfigurasi paling optimal dan stabil (*Silhouette Score* = $0,385$ pada komposit / $0,2541$ pada SD, DBI = $0,896$, CHI = $198,4$).

  2. Profil kuantitatif ketiga tipologi daerah:

     * **Kluster 1 — *Benchmark Ekosistem Maju*** ($n = 988$ unit / $48,1\%$, Rata-rata Numerasi = $63,57 \pm 6,84$, terpusat di Jawa, Bali, dan kota administratif).

     * **Kluster 2 — *Paradoks Sarpras & Kualitas Pedagogik*** ($n = 948$ unit / $46,1\%$, Rata-rata Numerasi = $53,27 \pm 7,91$, elektrifikasi sudah $93,6\%$ namun rasio guru dan kualitas pembelajaran D.1 tertinggal).

     * **Kluster 3 — *Prioritas Afirmasi Dasar 3T*** ($n = 120$ unit / $5,8\%$, Rata-rata Numerasi = $38,29 \pm 9,15$, elektrifikasi hanya $62,4\%$, komputer $58,1\%$, dan putus sekolah $0,84\%$).

  3. Temuan *Transition Learning Loss* intra-kabupaten: lonjakan numerasi dari SD ke SMP sebesar $+10,62$ **poin** ($51,83 \rightarrow 62,45$), diikuti kemerosotan tajam dari SMP ke SMA sebesar $-6,86$ **poin** ($62,45 \rightarrow 55,59$; terjadi di $78,2\%$ kabupaten) dan dari SMP ke SMK sebesar $-8,79$ **poin** ($62,45 \rightarrow 53,66$), serta anjloknya Moran's $I$ pada jenjang SMK menjadi $0,0625$ dibanding SD–SMA ($0,5543–0,6237$).

#### **`B. HASIL PENGUJIAN EKONOMETRIKA SPASIAL DAN ABLASI MULTIKOLINIERITAS`**

* **Apa yang Dibahas:**

  1. Hasil audit diagnostik multikolinieritas yang membuktikan bahwa pemangkasan 20 fitur menjadi **12 fitur kebijakan ortogonal (Case 3, seluruh** $\text{VIF} \le 3,12$**)** berhasil menurunkan *local condition number* ($\kappa$) dari $1,8 \times 10^9$ menjadi $4,12–6,18$ (di bawah ambang batas kritis $30$). Hasilnya, proporsi kabupaten dengan koefisien kebijakan signifikan ($\vert{}t\vert{} > 1,96$) meningkat menjadi $100\%$ **di seluruh jenjang** (menyelesaikan kegagalan estimasi MGWR SMA pada spesifikasi tanpa *pruning*).

  2. Perbandingan kuantitatif 7 estimator spasial & global: **MGWR Case 3** mengungguli OLS, Ridge, Lasso, SAR, SEM, dan Classical GWR di seluruh metrik, dengan capaian **In-Sample** $R^2$ **/ Spatial OOF** $R^2$ sebesar $0,6530$ **/** $0,6430$ **(SD)**, $0,6180$ **/** $0,5965$ **(SMP)**, dan $0,5643$ **/** $0,5738$ **(SMA)**.

  3. Pada level agregat kabupaten (**Case 4 Composite**, $n=514$), **MGWR** mencapai kinerja tertinggi dengan **In-Sample** $R^2 = 0,7659$**, Adjusted** $R^2 = 0,7598$**, dan Spatial OOF** $R^2 = 0,7665$ ($\text{RMSE} = 4,581$), sekaligus meredam autokorelasi spasial residu hingga mendekati nol ($\text{Residual Moran's } I = -0,0109$).

#### **`C. BENCHMARK 11 MODEL MACHINE LEARNING DAN UJI KETAHANAN (ROBUSTNESS)`**

* **Apa yang Dibahas:**

  1. Hasil pengujian 11 algoritma regresi pada **Case 2 (19 Fitur Kebijakan Murni Tanpa Literasi)**: kelompok *tree ensemble* dan kernel non-linier melampaui regresi linier global (OLS GroupKFold $R^2 = 0,5014$) hingga lebih dari $+0,14$ poin $R^2$.

  2. **Monotonic LightGBM** meraih **GroupKFold OOF** $R^2 = 0,6416$ **(**$\text{RMSE} = 8,060$**,** $\text{MAE} = 5,811$**)** dan **LOPO-38 Spatial CV** $R^2 = 0,5726$ **(**$\text{RMSE} = 8,802$**)**. Berdasarkan rincian per jenjang, model ini mencetak $R^2 = 0,6922$ pada SD, $0,5241$ pada SMP, $0,5548$ pada SMA, dan $0,1685$ pada SMK (berbanding terbalik dengan OLS yang menghasilkan $R^2$ negatif $-0,2866$ pada SMK).

  3. Hasil 3 eksperimen **Uji Ketahanan (*Robustness & Sensitivity Checks*)**:

     * *Gaussian Noise Injection (*$\pm 10\%$ *pada fitur kunci):* Mempertahankan fidelitas prediksi $R^2 = 0,9575$ terhadap baseline tanpa *noise* ($\text{RMSE drift} = 2,18$ poin) dan korelasi peringkat **Spearman's** $\rho = 0,9793$.

     * *Spatial Subsampling Jackknife (Drop* $30\%$ *Kabupaten, 30 Iterasi):* Menghasilkan Mean OOF $R^2 = 0,6389 \pm 0,0223$ dengan *Coefficient of Variation* ($\text{CV}$) hanya $3,49\%$ **(**$< 5\%$**)** dan rentang interkuartil ($\text{IQR}$) $0,0285$.

     * *Sensitivitas Matriks Bobot Spasial (*$k$*-NN Sweep* $k \in \{4,6,8,10,12,15,20\}$*):* Seluruh nilai Moran's $I$ pada SD, SMP, dan SMA konsisten signifikan pada $p = 0,005$ di semua pilihan $k$.

* **Visual yang Dilampirkan di Bab III:**

  * **`Gambar 1`**: **Peta Spasial Distribusi 3 Klaster Tipologi IPO Pendidikan di 514 Kabupaten/Kota** *(Gunakan `fig5_spatial_clusters_indonesia_map.png`)*.

  * **`Gambar 2`**: **Trajektori *Transition Learning Loss* Numerasi Lintas Jenjang (SD–SMP–SMA–SMK)** *(Gunakan `fig7_cross_level_learning_loss_trajectory.png` atau `fig3_vif_and_quasi_constant_diagnostic.png`)*.

  * **`TABEL II`**: **Komparasi Kinerja Ekonometrika Spasial dan Ablasi MGWR Lintas Jenjang** *(Disadur dari `table3_spatial_regression_and_mgwr_ablation.csv`: menampilkan OLS, SAR, SEM, GWR, MGWR Case 3 per jenjang, dan MGWR Case 4 Composite beserta In-Sample* $R^2$*, Adj* $R^2$*,* $AIC_c$*, RMSE, Resid Moran's* $I$*, dan Spatial OOF* $R^2$*)*.

  * **`TABEL III`**: **Benchmark 11 Arsitektur Machine Learning di Bawah Dual Spatial CV (Case 2 Tanpa Literasi)** *(Disadur dari `table4_ml_11models_cv_benchmark.csv`: menampilkan 11 model beserta GroupKFold* $R^2$*, RMSE, LOPO-38* $R^2$*, dan rincian* $R^2$ *per jenjang SD, SMP, SMA, SMK)*.

### **BAB IV: `IV. ANALISIS DAN PEMBAHASAN`** *(Estimasi: 1,25 Halaman — Pertengahan Halaman 4 hingga Pertengahan Halaman 5)*

> **Pemenuhan Buku Panduan:** Poin 7 (*Analisis atas Hasil Eksperimen dan Pengujian*). Fokus menerjemahkan temuan angka di Bab III menjadi penjelasan ilmiah, mekanisme skala spasial, interpretasi XAI, dan evaluasi kebijakan *counterfactual*.

#### **`A. ANALISIS SPEKTRUM SKALA SPASIAL (BANDWIDTH) DAN PARADOKS VOKASI SMK`**

* **Apa yang Dibahas:**

  1. Membahas mengapa kebijakan pendidikan yang seragam (*one-size-fits-all*) tidak efektif berdasarkan bukti spektrum *bandwidth* ($k_j$) MGWR Case 3:

     * **Proses Pedagogis Beroperasi pada Skala Global/Nasional (**$k_j = 480$ **tetangga):** Variabel **Kualitas Pembelajaran (D.1)** memiliki efek positif signifikan di $100\%$ **kabupaten/kota** ($\beta = +3,30$ pada SD; $+5,12$ pada SMP; $+3,79$ pada SMA), membuktikan bahwa reformasi metode pengajaran di ruang kelas berdampak universal di seluruh Indonesia.

     * **Infrastruktur Dasar Beroperasi pada Skala Regional/Kepulauan (**$k_j = 150–240$ **tetangga):** **Elektrifikasi Sekolah** ($\beta = +4,61$ pada SD, signifikan di $78,2\%$ kabupaten) dan **Sanitasi Air Bersih** ($\beta = +3,08$ pada SMP, signifikan di $71,0\%$ kabupaten) menunjukkan elastisitas lokal tertinggi di kawasan Timur dan kepulauan luar Jawa, sementara di Jawa efek marjinalnya mulai jenuh (*saturated*).

     * **Kerentanan Sosial Beroperasi pada Skala Sangat Lokal (**$k_j = 90–120$ **tetangga):** **Angka Putus Sekolah SMA** ($\beta = -2,67$, $k_j = 90$) dan **Rasio Siswa/Rombel SD** ($\beta = -1,84$, $k_j = 110$) membutuhkan intervensi mikro terfokus di kantong-kantong kemiskinan dan distrik padat penduduk.

  2. **Analisis *Vocational Paradox* pada Jenjang SMK:** Menjelaskan mengapa model linier dan spasial murni gagal pada jenjang SMK ($\text{OLS } R^2 = -0,2866$; Moran's $I = 0,0625$), sedangkan model ansambel non-linier (*Extra Trees* $R^2 = 0,2012$; *Random Forest* $R^2 = 0,1945$; *Monotonic LightGBM* $R^2 = 0,1685$) mampu mengekstraksi sinyal prediktif. Hal ini disebabkan mutu SMK tidak mengikuti gradien ketetanggaan geografis biasa, melainkan dipengaruhi oleh aglomerasi kawasan industri lokal, spesialisasi jurusan kejuruan, dan pengurangan porsi jam matematika abstrak demi praktik bengkel vokasi.

#### **`B. INTERPRETASI EXPLAINABLE AI (TREESHAP) GLOBAL DAN KONDISIONAL KLASTER`**

* **Apa yang Dibahas:**

  1. Peringkat determinan numerasi nasional berdasarkan *Mean Absolute SHAP* ($\text{mean}(\vert{}\phi_j\vert{})$) pada Monotonic LightGBM: (1) **Kualitas Pembelajaran D.1** ($3,24$ poin; rentang $[-8,42, +6,15]$), (2) **Elektrifikasi Sekolah** ($1,95$ poin; penalti hingga $-9,12$ poin pada sekolah tanpa listrik), (3) **Sanitasi Air Bersih** ($1,15$ poin), (4) **Angka Putus Sekolah** ($0,93$ poin), dan (5) **Iklim Keamanan Sekolah D.4** ($0,85$ poin).

  2. **Pergeseran Sensitivitas Antar-Klaster (*Cluster-Conditional SHAP*):**

     * Pada **Kluster 1 (*Benchmark*)** dan **Kluster 2 (*Paradoks Sarpras*)**, pengungkit dominan adalah Kualitas Pembelajaran D.1 ($3,25$ dan $3,23$ poin) yang diikuti kesiapan infrastruktur fisik/komputer.

     * Sebaliknya, pada **Kluster 3 (*Prioritas Afirmasi 3T*)**, sensitivitas **Iklim Keamanan Sekolah (D.4) melonjak hampir** $4\times$ **lipat menjadi** $3,10$ **poin** (dibanding $0,79$ di Kluster 1) dan **Iklim Kebinekaan (D.8) melonjak menjadi** $2,31$ **poin** (dibanding $0,46$ di Kluster 1). Temuan ini membuktikan secara empiris bahwa di daerah tertinggal/3T, intervensi kurikulum atau perangkat digital tidak akan optimal apabila rasa aman siswa dari perundungan, kekerasan, dan kerawanan sosial belum terpenuhi.

#### **`C. SIMULASI KEBIJAKAN COUNTERFACTUAL "WHAT-IF" DAN MATRIKS PRESKRIPTIF`**

* **Apa yang Dibahas:**

  1. **Pembuktian Eliminasi *Urban Confounding Bias*:** Membandingkan respons *Unconstrained LightGBM* vs *Monotonic LightGBM* pada 5 skenario intervensi (Skenario A s.d. E). Pada **Skenario B** (penurunan kepadatan kelas sebesar $-5$ siswa/rombel), model *Unconstrained* terjebak bias perkotaan dan memprediksi skor numerasi **turun** $-0,444$ **poin** ($71,4\%$ daerah diprediksi memburuk). Sebaliknya, **Monotonic LightGBM** berhasil memulihkan arah kausalitas domain yang benar dengan memprediksi kenaikan $+0,346$ **poin** ($0\%$ daerah bernilai negatif). Pola serupa terbukti pada **Skenario C** (redistribusi guru & sertifikasi $+15\%$) di mana model monotonik menghasilkan kenaikan $+1,165$ **poin** ($94,8\%$ daerah membaik vs $48,2\%$ pada model *unconstrained*).

  2. **Dampak Paket Intervensi Menuju *Education 5.0*:**

     * **Skenario D (Afirmasi Infrastruktur Fisik & Digital** $\ge 98\%$**)** mendongkrak capaian numerasi rata-rata $+4,761$ **poin** ($100\%$ unit meningkat), dengan lonjakan masif di **Kluster 2 (**$+5,779$ **poin)** dan **Kluster 3 (**$+4,887$ **poin)**.

     * **Skenario E (Paket Terpadu *Education 5.0*: Integrasi Skenario A+B+C+D)** menghasilkan dampak tertinggi dengan kenaikan rata-rata nasional sebesar $+6,626$ **poin** ($97,3\%$ unit meningkat; **Kluster 2 melonjak** $+7,419$ **poin** dan **Kluster 3 melonjak** $+6,190$ **poin**).

  3. Penjelasan mekanisme operasional **Matriks Kebijakan Preskriptif** $2.056$ **Unit Observasi** yang mengidentifikasi *Primary & Secondary Bottleneck Feature* (berdasarkan nilai SHAP paling negatif di tiap kabupaten-jenjang) dan memetakannya ke 4 kuadran program aksi pemerintah (DAK Fisik & Digitalisasi, Afirmasi 3T & Beasiswa PIP, Pendampingan Pedagogik Guru Penggerak, serta Penguatan Numerasi Kontekstual Vokasi SMK).

* **Visual yang Dilampirkan di Bab IV:**

  * **`Gambar 3`**: **Peta Spasial Koefisien Elastisitas Lokal MGWR (**$\beta_{\text{Kualitas Pembelajaran}}$ **dan** $\beta_{\text{Listrik}}$**)** *(Gunakan `fig9_mgwr_local_parameter_maps.png`)*.

  * **`Gambar 4`**: **Atribusi Fitur Global TreeSHAP dan Perbandingan Sensitivitas Kondisional Antar-Klaster** *(Gunakan `fig12_treeshap_global_and_beeswarm.png` dan/atau `fig13_treeshap_cluster_conditional_and_waterfalls.png`)*.

  * **`Gambar 5` (atau `TABEL IV`)**: **Komparasi Dampak Simulasi Kebijakan *Counterfactual What-If* (Skenario A–E: *Unconstrained* vs *Monotonic LightGBM*)** *(Gunakan `fig14_counterfactual_whatif_policy_simulation.png` atau tabel ringkas dari `table6_counterfactual_policy_simulation_comparison.csv`)*.

### **BAB V: `V. KESIMPULAN`** *(Estimasi: 0,35 Halaman — Halaman 5 Kolom Kiri/Kanan)*

> **Pemenuhan Buku Panduan:** Poin 8 (*Kesimpulan*).

* **Apa yang Dibahas:**

  1. **Sintesis Empiris & Metodologis:**

     * Pemetaan tipologi berbasis *K-Means* ($k=3$, *Silhouette* $0,385$) berhasil membedakan karakteristik ekosistem pendidikan ke dalam *Kluster 1 Benchmark* ($63,57$), *Kluster 2 Paradoks Sarpras* ($53,27$), dan *Kluster 3 Afirmasi 3T* ($38,29$), sekaligus mengungkap fenomena *Transition Learning Loss* pada transisi SMP ke SMA ($-6,86$ poin) dan SMK ($-8,79$ poin).

     * Pemodelan **MGWR Case 3 & Case 4** dengan pemangkasan kolinieritas lokal berhasil mereduksi *condition number* matriks lokal menjadi $4,12–6,18$, mencapai daya jelas tertinggi (**Composite** $R^2 = 0,7659$**; Spatial OOF** $R^2 = 0,7665$), serta membuktikan bahwa kualitas pembelajaran beroperasi pada skala nasional ($k_j = 480$), infrastruktur dasar pada skala regional ($k_j = 150–240$), dan putus sekolah pada skala kantong lokal ($k_j = 90$).

     * Arsitektur **Monotonic LightGBM** meraih performa prediktif dan ketahanan spasial yang kokoh (**GroupKFold** $R^2 = 0,6416$**; LOPO-38** $R^2 = 0,5726$**; tahan *noise*** $\pm 10\%$ **dengan Spearman** $\rho = 0,9793$) serta mengeliminasi $100\%$ anomali arah kebijakan akibat *urban confounding bias*.

     * Dekomposisi **TreeSHAP** mengungkap lonjakan sensitivitas Iklim Keamanan Sekolah (D.4: $3,10$ poin) dan Kebinekaan (D.8: $2,31$ poin) di wilayah 3T, sementara simulasi *counterfactual* **Skenario E (*Paket Terpadu Education 5.0*)** memproyeksikan peningkatan capaian numerasi nasional sebesar $+6,626$ **poin** (dan hingga $+7,419$ poin pada daerah Kluster 2).

  2. **Rekomendasi Aksi Kebijakan:** Menyerahkan matriks direktori $2.056$ intervensi mikro sebagai cetak biru operasional alokasi DAK Fisik, penempatan Guru Penggerak, integrasi matematika terapan SMK, dan program sekolah aman di daerah 3T.

### **BAGIAN AKHIR: `REFERENSI`** *(Estimasi: 0,25 Halaman — Halaman 5 Kolom Kanan Bawah)*

* **Aturan Format:** Heading Level 1 ditulis `REFERENSI` (tanpa nomor Romawi), ukuran huruf 8 pt, spasi tunggal, menggunakan format sitasi IEEE bernomor urut dalam kurung siku `[1], [2], ... [15]`.

* **Daftar Pustaka Utama yang Wajib Masuk:**

  1. Fotheringham, Yang, & Kang (2017) — *Multiscale Geographically Weighted Regression (MGWR)* (*Annals of the American Association of Geographers*).

  2. Oshan et al. (2019) — *mgwr: A Python Implementation of Multiscale Geographically Weighted Regression* (*ISPRS Int. J. Geo-Inf.*).

  3. Lundberg et al. (2020) — *From local explanations to global understanding with explainable AI for trees (TreeSHAP)* (*Nature Machine Intelligence*).

  4. Ke et al. (2017) — *LightGBM: A Highly Efficient Gradient Boosting Decision Tree* (*NeurIPS*).

  5. Anselin (1995) — *Local Indicators of Spatial Association—LISA* (*Geographical Analysis*).

  6. Tobler (1970) — *A Computer Movie Simulating Urban Growth in the Detroit Region* (*Economic Geography*).

  7. Roberts et al. (2017) — *Cross-validation strategies for data with temporal, spatial, hierarchical, or phylogenetic structure* (*Ecography*).

  8. OECD (2023) — *PISA 2022 Results (Volume I): The State of Learning and Equity in Education*.

  9. Kemendikbudristek RI (2024/2025) — *Laporan Nasional Rapor Pendidikan Indonesia & Kerangka Asesmen Nasional*.

## ✅ 4. DAFTAR PERIKSA PEMETAAN 8 POIN WAJIB BUKU PANDUAN

| No | Poin Wajib Buku Panduan (Hal. 9–10) | Lokasi pada Struktur IEEE Naskah Kamu | Status | 
| ----- | ----- | ----- | ----- | 
| 1 | **Judul Makalah** | Bagian Header Halaman 1 (Maks. 12 Kata) | ✔️ Terpenuhi | 
| 2 | **Abstrak** | Abstrak & Kata Kunci Halaman 1 (200–300 Kata) | ✔️ Terpenuhi | 
| 3 | **Pendahuluan** *(Latar Belakang, Tujuan, Manfaat, Batasan)* | `BAB I` (`Sub-Bab A`, `Sub-Bab B`, dan `Sub-Bab C`) | ✔️ Terpenuhi | 
| 4 | **Kajian Terkait yang Relevan** | `BAB I` (`Sub-Bab A: Latar Belakang dan Kajian Terkait`) | ✔️ Terpenuhi | 
| 5 | **Solusi yang Diusulkan** *(Deskripsi, Dataset, Metode, Perbedaan, Metrik Evaluasi)* | `BAB II` (`Sub-Bab A`, `Sub-Bab B`, `Sub-Bab C`, dan `Sub-Bab D`) | ✔️ Terpenuhi | 
| 6 | **Hasil Eksperimen dan Pengujian** | `BAB III` (`Sub-Bab A`, `Sub-Bab B`, dan `Sub-Bab C`) | ✔️ Terpenuhi | 
| 7 | **Analisis atas Hasil Eksperimen dan Pengujian** | `BAB IV` (`Sub-Bab A`, `Sub-Bab B`, dan `Sub-Bab C`) | ✔️ Terpenuhi | 
| 8 | **Kesimpulan** | `BAB V` (`V. KESIMPULAN`) | ✔️ Terpenuhi | 
