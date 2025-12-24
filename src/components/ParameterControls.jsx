export default function ParameterControls({
  m,
  c,
  predictionX,
  dataPointsCount,
  onMChange,
  onCChange,
  onPredictionXChange,
  onDataPointsChange,
  onReset,
  onRegenerateData
}) {
  return (
    <>
      <div className="mse-label" style={{ marginBottom: 'var(--spacing-md)' }}>
        Parameter Kontrol
      </div>

      <div className="parameter-control">
        <div className="parameter-label">
          <span>Kemiringan (m)</span>
          <span className="parameter-value">{m.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.05"
          value={m}
          onChange={(e) => onMChange(parseFloat(e.target.value))}
          className="slider"
        />
      </div>

      <div className="parameter-control">
        <div className="parameter-label">
          <span>Intercept (c)</span>
          <span className="parameter-value">{c.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.1"
          value={c}
          onChange={(e) => onCChange(parseFloat(e.target.value))}
          className="slider"
        />
      </div>

      <div className="parameter-control" style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
        <div className="parameter-label">
          <span>Titik Prediksi (x)</span>
          <input
            type="number"
            value={predictionX.toFixed(2)}
            onChange={(e) => onPredictionXChange(Math.max(-10, Math.min(10, parseFloat(e.target.value) || 0)))}
            style={{
              width: '70px',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              padding: '2px 5px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.1"
          value={predictionX}
          onChange={(e) => onPredictionXChange(parseFloat(e.target.value))}
          className="slider"
          style={{ accentColor: '#10b981' }}
        />
      </div>

      <div className="parameter-control" style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
        <div className="parameter-label">
          <span>Jumlah Data</span>
          <input
            type="number"
            value={dataPointsCount}
            onChange={(e) => onDataPointsChange(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
            style={{
              width: '70px',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              padding: '2px 5px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <input
          type="range"
          min="5"
          max="100"
          step="1"
          value={dataPointsCount}
          onChange={(e) => onDataPointsChange(parseInt(e.target.value))}
          className="slider"
          style={{ accentColor: 'var(--color-primary)' }}
        />
      </div>

      <button
        onClick={onReset}
        className="btn btn-secondary btn-full-width mt-lg"
      >
        Reset ke Nilai Terbaik
      </button>

      <button
        onClick={onRegenerateData}
        className="btn btn-primary btn-full-width"
        style={{ marginTop: 'var(--spacing-sm)' }}
      >
        Acak Data Baru
      </button>
    </>
  );
}
