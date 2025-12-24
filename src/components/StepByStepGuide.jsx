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
          Persamaan garisnya adalah: <strong>y = mx + c</strong>
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', marginLeft: '1.5rem' }}>
          <li><strong>m</strong> (kemiringan): Seberapa curam garisnya</li>
          <li><strong>c</strong> (intercept): Di mana garis memotong sumbu y</li>
        </ul>
        <p className="step-description">
          Tantangan kita: Temukan nilai m dan c yang membuat garis paling sesuai dengan data!
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
          formula="MSE = (1/n) × Σ(y_aktual - y_prediksi)²"
          variables={['y', 'n']}
          explanation="Di mana n adalah jumlah titik data, dan Σ berarti 'jumlah dari semua'"
        />
        <p className="step-description">
          <strong>Mengapa mengkuadratkan error?</strong>
        </p>
        <ul style={{ color: 'var(--color-text-secondary)', marginLeft: '1.5rem' }}>
          <li>Membuat semua error positif (tidak saling menghilangkan)</li>
          <li>Memberikan penalti lebih berat pada error yang lebih besar</li>
          <li>Membuat matematika lebih mudah untuk optimisasi</li>
        </ul>
        <p className="step-description">
          <strong>MSE lebih rendah = Fit lebih baik!</strong> Garis terbaik meminimalkan nilai ini.
        </p>
      </>
    )
  },
  {
    number: 3,
    title: "Menemukan Parameter Optimal",
    description: "Dengan menggunakan kalkulus dan metode least squares, kita bisa langsung menghitung nilai terbaik untuk m dan c!",
    content: (
      <>
        <p className="step-description">
          Daripada menebak, matematikawan telah menurunkan rumus untuk menemukan parameter optimal:
        </p>

        <h3 style={{ color: 'var(--color-accent-primary)', marginTop: 'var(--spacing-lg)' }}>
          Kemiringan Optimal (m):
        </h3>
        <FormulaDisplay
          formula="m = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)"
          variables={['m', 'n', 'x', 'y']}
          explanation="Rumus ini menemukan kemiringan yang meminimalkan MSE"
        />

        <h3 style={{ color: 'var(--color-accent-primary)', marginTop: 'var(--spacing-lg)' }}>
          Intercept Optimal (c):
        </h3>
        <FormulaDisplay
          formula="c = (∑y - m∑x) / n"
          variables={['c', 'm', 'x', 'y', 'n']}
          explanation="Hitung c setelah menemukan m menggunakan rumus di atas"
        />

        <p className="step-description">
          Rumus-rumus ini berasal dari mengambil turunan MSE dan menyamakannya dengan nol
          (menemukan titik minimum). Ini adalah <strong>Metode Least Squares</strong>!
        </p>
      </>
    )
  },
  {
    number: 4,
    title: "Gradient Descent (Alternatif)",
    description: "Cara lain untuk menemukan parameter optimal adalah gradient descent - algoritma iteratif yang 'berjalan menuruni bukit' untuk menemukan MSE minimum.",
    content: (
      <>
        <p className="step-description">
          Meskipun rumus di Langkah 3 memberi kita jawaban langsung, gradient descent adalah
          teknik optimisasi yang lebih umum yang bekerja bahkan ketika rumus langsung tidak ada.
        </p>

        <h3 style={{ color: 'var(--color-accent-primary)', marginTop: 'var(--spacing-lg)' }}>
          Cara kerjanya:
        </h3>
        <ol style={{ color: 'var(--color-text-secondary)', marginLeft: '1.5rem', lineHeight: '2' }}>
          <li>Mulai dengan nilai acak untuk m dan c</li>
          <li>Hitung gradien (kemiringan) MSE</li>
          <li>Ambil langkah kecil ke arah berlawanan</li>
          <li>Ulangi sampai MSE berhenti membaik</li>
        </ol>

        <FormulaDisplay
          formula="m_baru = m_lama - α × ∂MSE/∂m"
          variables={['m', 'α']}
          explanation="α (alpha) adalah learning rate - seberapa besar setiap langkah"
        />

        <FormulaDisplay
          formula="c_baru = c_lama - α × ∂MSE/∂c"
          variables={['c', 'α']}
          explanation="Perbarui m dan c di setiap iterasi"
        />

        <div className="info-box info-box-blue">
          <strong>Insight Kunci:</strong> Gradient descent sangat berguna untuk model kompleks
          (seperti neural networks) di mana rumus langsung tidak ada!
        </div>
      </>
    )
  },
  {
    number: 5,
    title: "Terapkan Fit Terbaik",
    description: "Sekarang setelah Anda memahami cara kerjanya, mari lihat solusi optimal beraksi!",
    content: (
      <>
        <p className="step-description">
          Kita telah menghitung parameter optimal menggunakan metode least squares.
          Klik tombol di bawah untuk menerapkannya ke visualisasi.
        </p>

        <div className="info-box info-box-blue" style={{ marginTop: 'var(--spacing-lg)' }}>
          <h3 style={{ color: 'var(--color-accent-primary)', marginBottom: 'var(--spacing-sm)' }}>
            Ringkasan
          </h3>
          <ul style={{ color: 'var(--color-text-secondary)', marginLeft: '1.5rem', lineHeight: '2' }}>
            <li>Kita mendefinisikan model kita: y = mx + c</li>
            <li>Kita memilih MSE sebagai fungsi biaya</li>
            <li>Kita menggunakan least squares untuk menemukan m dan c optimal</li>
            <li>Hasilnya adalah garis yang paling sesuai dengan data kita!</li>
          </ul>
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
            style={{
              width: '40px',
              height: '4px',
              borderRadius: 'var(--radius-full)',
              background: index <= currentStep
                ? 'var(--color-accent-primary)'
                : 'var(--color-bg-secondary)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
