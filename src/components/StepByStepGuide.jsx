import { useState } from 'react';
import FormulaDisplay from './FormulaDisplay';

const STEPS = [
  {
    number: 1,
    title: "Memahami Tujuan",
    description: "Regresi linear menemukan garis lurus yang paling sesuai melalui titik-titik data. Tujuannya adalah meminimalkan jarak (error) antara garis dan titik data aktual.",
    content: (
      <>
        <p className="step-description">
          Bayangkan Anda memiliki titik-titik data yang tersebar di grafik. Regresi linear membantu
          Anda menemukan garis yang paling merepresentasikan hubungan antara dua variabel.
        </p>
        <p className="step-description">
          Persamaan garisnya adalah:
        </p>
        <FormulaDisplay
          formula="y = mx + c"
          size="large"
        />
        <ul className="step-list">
          <li><strong>m</strong> (kemiringan/slope): Seberapa curam garisnya</li>
          <li><strong>c</strong> (intercept): Di mana garis memotong sumbu y</li>
        </ul>
        <p className="step-description">
          Tantangan kita: Temukan nilai <strong>m</strong> dan <strong>c</strong> yang membuat garis paling sesuai dengan data!
        </p>
      </>
    )
  },
  {
    number: 2,
    title: "Fungsi Biaya (MSE)",
    description: "Kita perlu cara untuk mengukur seberapa 'baik' garis kita. Mean Squared Error (MSE) memberi tahu kita rata-rata jarak kuadrat antara prediksi dan nilai aktual.",
    content: (
      <>
        <p className="step-description">
          Untuk setiap titik data, kita hitung errornya: selisih antara nilai y aktual
          dengan yang diprediksi oleh garis kita.
        </p>
        <FormulaDisplay
          formula="MSE = \frac{1}{n} \sum (y_i - \hat{y}_i)^2"
          explanation="Di mana n adalah jumlah titik data, yᵢ adalah nilai aktual, dan ŷᵢ adalah prediksi"
          size="large"
        />
        <p className="step-description" style={{ marginTop: 'var(--spacing-lg)' }}>
          Karena prediksi kita adalah <strong>ŷ = mx + c</strong>, formula ini bisa ditulis:
        </p>
        <FormulaDisplay
          formula="MSE = \frac{1}{n} \sum (y_i - (mx_i + c))^2"
          size="medium"
        />
        <p className="step-description" style={{ marginTop: 'var(--spacing-lg)' }}>
          <strong>Mengapa mengkuadratkan error?</strong>
        </p>
        <ul className="step-list">
          <li>Membuat semua error positif (tidak saling menghilangkan)</li>
          <li>Memberikan penalti lebih berat pada error yang lebih besar</li>
          <li>Membuat matematika lebih mudah untuk optimisasi (differentiable)</li>
        </ul>
        <div className="info-box info-box-blue">
          <strong>Insight:</strong> MSE lebih rendah = Fit lebih baik! Garis terbaik meminimalkan nilai ini.
        </div>
      </>
    )
  },
  {
    number: 3,
    title: "Metode Least Squares (Simple)",
    description: "Dengan menggunakan kalkulus, kita bisa langsung menghitung nilai terbaik untuk m dan c untuk regresi linear sederhana (2 variabel).",
    content: (
      <>
        <p className="step-description">
          Untuk regresi linear <strong>sederhana</strong> (satu variabel independen x),
          matematikawan telah menurunkan rumus langsung untuk parameter optimal:
        </p>

        <h3 className="formula-section-title">
          Kemiringan Optimal (m):
        </h3>
        <FormulaDisplay
          formula="m = \frac{n\sum x_i y_i - \sum x_i \sum y_i}{n\sum x_i^2 - \left(\sum x_i\right)^2}"
          explanation="Rumus ini menemukan kemiringan yang meminimalkan MSE"
          size="medium"
        />

        <h3 className="formula-section-title">
          Intercept Optimal (c):
        </h3>
        <FormulaDisplay
          formula="c = \frac{\sum y_i - m \sum x_i}{n} = \bar{y} - m\bar{x}"
          explanation="Hitung c setelah menemukan m, menggunakan rata-rata x dan y"
          size="medium"
        />

        <div className="info-box info-box-blue" style={{ marginTop: 'var(--spacing-lg)' }}>
          <strong>Cara Kerja:</strong> Rumus-rumus ini berasal dari mengambil turunan parsial MSE
          terhadap m dan c, lalu menyamakannya dengan nol (menemukan titik minimum).
          Ini adalah <strong>Metode Least Squares</strong>!
        </div>
      </>
    )
  },
  {
    number: 4,
    title: "Least Squares (Multilinear)",
    description: "Untuk regresi dengan banyak variabel independen, kita gunakan notasi matriks. Ini adalah bentuk umum yang bisa menangani berapa pun jumlah variabel!",
    content: (
      <>
        <p className="step-description">
          Ketika kita memiliki <strong>lebih dari satu variabel independen</strong>
          (misalnya: memprediksi harga rumah dari luas, jumlah kamar, dan lokasi),
          model menjadi:
        </p>
        <FormulaDisplay
          formula="y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p"
          explanation="Di mana p adalah jumlah variabel independen"
          size="medium"
        />

        <h3 className="formula-section-title">
          Notasi Matriks:
        </h3>
        <p className="step-description">
          Kita dapat menuliskan model dalam bentuk matriks yang lebih ringkas:
        </p>
        <FormulaDisplay
          formula="\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}"
          size="large"
        />
        <div className="matrix-explanation">
          <div className="matrix-item">
            <strong>y</strong> = vektor target (n × 1)
          </div>
          <div className="matrix-item">
            <strong>X</strong> = matriks fitur (n × (p+1)), dengan kolom 1 berisi angka 1
          </div>
          <div className="matrix-item">
            <strong>β</strong> = vektor koefisien ((p+1) × 1)
          </div>
          <div className="matrix-item">
            <strong>ε</strong> = vektor error (n × 1)
          </div>
        </div>

        <h3 className="formula-section-title">
          Solusi Optimal (Normal Equation):
        </h3>
        <FormulaDisplay
          formula="\hat{\boldsymbol{\beta}} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}"
          explanation="Rumus ini memberikan semua koefisien sekaligus dalam satu perhitungan!"
          size="large"
        />

        <div className="info-box info-box-blue" style={{ marginTop: 'var(--spacing-lg)' }}>
          <strong>Keuntungan Notasi Matriks:</strong>
          <ul className="step-list" style={{ marginTop: 'var(--spacing-sm)' }}>
            <li>Berlaku untuk <strong>berapa pun</strong> jumlah variabel</li>
            <li>Perhitungan lebih efisien dengan library seperti NumPy</li>
            <li>Mudah diimplementasikan dalam kode</li>
          </ul>
        </div>
      </>
    )
  },
  {
    number: 5,
    title: "Gradient Descent",
    description: "Cara lain untuk menemukan parameter optimal adalah gradient descent - algoritma iteratif yang 'berjalan menuruni bukit' untuk menemukan MSE minimum.",
    content: (
      <>
        <p className="step-description">
          Meskipun rumus langsung (Normal Equation) efektif, <strong>gradient descent</strong> adalah
          teknik optimisasi yang lebih umum dan skalabel, terutama untuk dataset besar.
        </p>

        <h3 className="formula-section-title">
          Cara Kerjanya:
        </h3>
        <ol className="step-list numbered">
          <li>Mulai dengan nilai acak untuk m dan c</li>
          <li>Hitung gradien (turunan) MSE terhadap setiap parameter</li>
          <li>Update parameter ke arah yang mengurangi MSE</li>
          <li>Ulangi sampai konvergen (MSE berhenti berkurang)</li>
        </ol>

        <h3 className="formula-section-title">
          Update Rules:
        </h3>
        <FormulaDisplay
          formula="m_{new} = m_{old} - \alpha \cdot \frac{\partial MSE}{\partial m}"
          explanation="α (alpha) adalah learning rate - seberapa besar setiap langkah"
          size="medium"
        />
        <FormulaDisplay
          formula="c_{new} = c_{old} - \alpha \cdot \frac{\partial MSE}{\partial c}"
          size="medium"
        />

        <h3 className="formula-section-title">
          Gradien MSE:
        </h3>
        <FormulaDisplay
          formula="\frac{\partial MSE}{\partial m} = \frac{-2}{n} \sum x_i(y_i - \hat{y}_i)"
          size="small"
        />
        <FormulaDisplay
          formula="\frac{\partial MSE}{\partial c} = \frac{-2}{n} \sum (y_i - \hat{y}_i)"
          size="small"
        />

        <div className="info-box info-box-blue" style={{ marginTop: 'var(--spacing-lg)' }}>
          <strong>Insight Kunci:</strong> Gradient descent sangat berguna untuk:
          <ul className="step-list" style={{ marginTop: 'var(--spacing-sm)' }}>
            <li>Dataset sangat besar (Normal Equation mahal secara komputasi)</li>
            <li>Model kompleks (neural networks) di mana rumus langsung tidak ada</li>
            <li>Optimisasi dengan regularisasi</li>
          </ul>
        </div>
      </>
    )
  },
  {
    number: 6,
    title: "Terapkan Fit Terbaik",
    description: "Sekarang setelah Anda memahami cara kerjanya, mari lihat solusi optimal beraksi!",
    content: (
      <>
        <p className="step-description">
          Kita telah menghitung parameter optimal menggunakan metode least squares.
          Klik tombol di bawah untuk menerapkannya ke visualisasi.
        </p>

        <div className="info-box info-box-blue" style={{ marginTop: 'var(--spacing-lg)' }}>
          <h3 className="formula-section-title" style={{ marginTop: 0 }}>
            Ringkasan Pembelajaran
          </h3>
          <ul className="step-list" style={{ marginTop: 'var(--spacing-sm)' }}>
            <li>Model regresi linear: <strong>y = mx + c</strong> (simple) atau <strong>y = Xβ</strong> (multi)</li>
            <li>Fungsi biaya: <strong>MSE</strong> mengukur kualitas fit</li>
            <li>Optimisasi: <strong>Least Squares</strong> (closed-form) atau <strong>Gradient Descent</strong> (iteratif)</li>
            <li>Hasil: Garis/hyperplane yang paling sesuai dengan data!</li>
          </ul>
        </div>

        <div className="comparison-table" style={{ marginTop: 'var(--spacing-lg)' }}>
          <h4 style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            Perbandingan Metode:
          </h4>
          <table className="method-table">
            <thead>
              <tr>
                <th>Aspek</th>
                <th>Least Squares</th>
                <th>Gradient Descent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kecepatan</td>
                <td>Cepat (small data)</td>
                <td>Lambat (iteratif)</td>
              </tr>
              <tr>
                <td>Skalabilitas</td>
                <td>O(n³) - tidak ideal</td>
                <td>O(n) - sangat baik</td>
              </tr>
              <tr>
                <td>Use Case</td>
                <td>Dataset kecil-menengah</td>
                <td>Dataset besar, Deep Learning</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="step-description" style={{ marginTop: 'var(--spacing-lg)' }}>
          Anda sekarang dapat kembali ke Mode Bebas untuk bereksperimen dengan nilai yang berbeda
          dan melihat bagaimana mereka dibandingkan dengan solusi optimal.
        </p>
      </>
    )
  }
];

export default function StepByStepGuide({ onApplyBestFit }) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="card step-guide">
      <div className="step-header">
        <div className="step-number">{step.number}</div>
        <div>
          <h2 className="step-title">{step.title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Langkah {step.number} dari {STEPS.length}
          </p>
        </div>
      </div>

      <div className="step-content">
        {step.content}
      </div>

      <div className="step-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="btn btn-secondary"
          style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
        >
          Sebelumnya
        </button>

        {currentStep === STEPS.length - 1 ? (
          <button
            onClick={onApplyBestFit}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            Terapkan Fit Terbaik
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            Selanjutnya
          </button>
        )}
      </div>

      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-xs)',
        marginTop: 'var(--spacing-md)',
        justifyContent: 'center'
      }}>
        {STEPS.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentStep(index)}
            style={{
              width: '40px',
              height: '4px',
              borderRadius: 'var(--radius-full)',
              background: index <= currentStep
                ? 'var(--color-accent-primary)'
                : 'var(--color-bg-secondary)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}
