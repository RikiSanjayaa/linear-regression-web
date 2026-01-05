# Linear Regression Web App

Aplikasi web interaktif untuk mempelajari dan mendemonstrasikan konsep regresi linear. Dibangun dengan React dan Vite, aplikasi ini memungkinkan pengguna untuk mengeksplorasi bagaimana parameter regresi linear mempengaruhi model dan hasil prediksi.

## Fitur Utama

- **Parameter Controls**: Sesuaikan slope (kemiringan) dan intercept (titik potong) untuk melihat perubahan model secara real-time.
- **Linear Regression Chart**: Visualisasi data points dan garis regresi linear menggunakan Chart.js.
- **Formula Display**: Tampilan rumus matematika seperti untuk garis regresi 2 variable (y = mx + c), **least Square Method** dan metode alternatif **Gradient Descent**.
- **Step-by-Step Guide**: Panduan langkah demi langkah untuk memahami proses regresi linear.
- **Data Generator**: Utilitas untuk menghasilkan data sintetis untuk demonstrasi.

## Teknologi yang Digunakan

- **React**: Library JavaScript untuk membangun antarmuka pengguna.
- **Vite**: Build tool modern untuk pengembangan cepat.
- **Chart.js**: Library untuk visualisasi data dan chart.
- **ESLint**: Linting untuk kode JavaScript/React.

## Instalasi dan Menjalankan

1. **Clone repository**:

   ```bash
   git clone https://github.com/RikiSanjayaa/linear-regression-web.git
   cd linear-regression-web
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Jalankan aplikasi dalam mode development**:

   ```bash
   npm run dev
   ```

4. **Buka browser** dan akses `http://localhost:3000` (atau port yang ditampilkan di terminal).

## Build untuk Production

Untuk build aplikasi untuk production:

```bash
npm run build
```

File build akan tersimpan di folder `dist/`.

## Menjalankan dengan Docker Compose

Pastikan Docker dan Docker Compose terinstall di sistem Anda.

1. **Clone repository** (jika belum):

   ```bash
   git clone https://github.com/RikiSanjayaa/linear-regression-web.git
   cd linear-regression-web
   ```

2. **Jalankan aplikasi dengan Docker Compose**:

   ```bash
   docker-compose up --build
   ```

3. **Buka browser** dan akses `http://localhost:8080`.

Untuk menjalankan di background:

```bash
docker-compose up -d --build
```

Untuk menghentikan:

```bash
docker-compose down
```

## Struktur Proyek

```
linear-regression-web/
├── public/
├── src/
│   ├── components/
│   │   ├── FormulaDisplay.jsx
│   │   ├── LinearRegressionChart.jsx
│   │   ├── ParameterControls.jsx
│   │   └── StepByStepGuide.jsx
│   ├── utils/
│   │   └── dataGenerator.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Dockerfile
├── docker-compose.yml
├── package.json
├── vite.config.js
└── README.md
```

## Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request untuk perbaikan atau fitur baru.

## Lisensi

Proyek ini menggunakan lisensi MIT.
