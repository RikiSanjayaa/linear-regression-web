import { useState, useMemo, useEffect } from 'react';
import LinearRegressionChart from './components/LinearRegressionChart';
import ParameterControls from './components/ParameterControls';
import StepByStepGuide from './components/StepByStepGuide';
import {
  generateHeightWeightData,
  calculateMSE,
  calculateOptimalParameters,
} from './utils/dataGenerator';
import './index.css';

function App() {
  // Theme state
  const [theme, setTheme] = useState('light');

  // State for number of data points
  const [dataPointsCount, setDataPointsCount] = useState(20);

  // Key to trigger data regeneration
  const [regenerateKey, setRegenerateKey] = useState(0);

  // Generate data with useMemo so it regenerates when count or key changes
  const data = useMemo(() => generateHeightWeightData(dataPointsCount), [dataPointsCount, regenerateKey]);

  // Calculate optimal parameters based on current data
  const optimalParams = useMemo(() => calculateOptimalParameters(data), [data]);

  // State for current parameters - start with m=0, c=0 for practice
  const [m, setM] = useState(0);
  const [c, setC] = useState(0);

  // State for prediction value (on the x-axis)
  const [predictionX, setPredictionX] = useState(0);

  // State for mode (Free Play vs Learn)
  const [mode, setMode] = useState('play'); // 'play' or 'learn'

  // Calculate current MSE
  const mse = useMemo(() => calculateMSE(data, m, c), [data, m, c]);

  // State for visibility toggles
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Reset to optimal parameters
  const handleReset = () => {
    setM(optimalParams.m);
    setC(optimalParams.c);
  };

  // Regenerate dataset
  const handleRegenerateData = () => {
    setRegenerateKey(prev => prev + 1);
    // Reset parameters to 0 when new data is generated
    setM(0);
    setC(0);
  };

  // Automatically regenerate when count changes
  useEffect(() => {
    handleRegenerateData();
  }, [dataPointsCount]);

  // Apply best fit (from guide)
  const handleApplyBestFit = () => {
    setM(optimalParams.m);
    setC(optimalParams.c);
    setMode('play'); // Switch back to play mode to see the result
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div></div>
        <div className="header-content">
          <h1 className="app-title">Belajar Linear Regression</h1>
          <p className="app-subtitle">
            Pahami cara kerja regresi linear dengan mengatur parameter
          </p>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
        >
          {theme === 'light' ? (
            // Moon icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            // Sun icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </header>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-button ${mode === 'play' ? 'active' : ''}`}
          onClick={() => setMode('play')}
        >
          Mode Bebas
        </button>
        <button
          className={`mode-button ${mode === 'learn' ? 'active' : ''}`}
          onClick={() => setMode('learn')}
        >
          Mode Belajar
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Step Guide for Learn Mode - Stays at top/sidebar */}
        {mode === 'learn' && (
          <div className="sidebar">
            <StepByStepGuide onApplyBestFit={handleApplyBestFit} />
          </div>
        )}

        {/* Visualization Area with Overlays */}
        <div className="visualization-area">
          <div className="visualization-header">
            <h2 className="card-title">
              {mode === 'play' ? 'Visualisasi' : 'Pratinjau Langsung'}
            </h2>
          </div>

          <div className="chart-view-stage">
            <div className="chart-scroll-wrapper">
              <div className="chart-container">
                <LinearRegressionChart
                  data={data}
                  m={m}
                  c={c}
                  theme={theme}
                  predictionX={predictionX}
                  onPredictionXChange={setPredictionX}
                />
              </div>
            </div>

            {/* Overlays stay inside chart-view-stage to remain locked to the chart area */}
            {mode === 'play' && (
              <>
                <div className={`overlay-controls ${!showControls ? 'minimized' : ''}`}>
                  <div className="card-compact">
                    {showControls ? (
                      <>
                        <button
                          className="btn-close"
                          onClick={() => setShowControls(false)}
                          aria-label="Tutup Kontrol"
                        >
                          &times;
                        </button>
                        <ParameterControls
                          m={m}
                          c={c}
                          predictionX={predictionX}
                          dataPointsCount={dataPointsCount}
                          onMChange={setM}
                          onCChange={setC}
                          onPredictionXChange={setPredictionX}
                          onDataPointsChange={setDataPointsCount}
                          onReset={handleReset}
                          onRegenerateData={handleRegenerateData}
                        />
                      </>
                    ) : (
                      <div className="minimized-label" onClick={() => setShowControls(true)}>
                        Kontrol
                      </div>
                    )}
                  </div>
                </div>

                <div className={`overlay-info ${!showInfo ? 'minimized' : ''}`}>
                  <div className="card-compact">
                    {showInfo ? (
                      <>
                        <button
                          className="btn-close"
                          onClick={() => setShowInfo(false)}
                          aria-label="Tutup Statistik"
                        >
                          &times;
                        </button>
                        <div className="mb-sm">
                          <div className="mse-label">Persamaan</div>
                          <div className="equation-text">
                            y = <span className="equation-variable">{m.toFixed(2)}</span>x
                            {c >= 0 ? ' + ' : ' - '}
                            <span className="equation-variable">{Math.abs(c).toFixed(2)}</span>
                          </div>
                        </div>

                        <div>
                          <div className="mse-label">Mean Squared Error</div>
                          <div className="mse-value">{mse.toFixed(2)}</div>
                          <div className="mse-optimal">
                            Optimal: {calculateMSE(data, optimalParams.m, optimalParams.c).toFixed(2)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="minimized-label" onClick={() => setShowInfo(true)}>
                        Statistik
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Overlay for Learn Mode */}
            {mode === 'learn' && (
              <div className="overlay-info">
                <div className="card-compact">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <div className="mse-label">Garis Aktual</div>
                      <div className="equation-text" style={{ fontSize: '1rem' }}>
                        y = {m.toFixed(2)}x {c >= 0 ? '+' : '-'} {Math.abs(c).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="mse-label">MSE (Aktual / Optimal)</div>
                      <div className="mse-value" style={{ fontSize: '1.25rem' }}>
                        {mse.toFixed(2)} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>/ {calculateMSE(data, optimalParams.m, optimalParams.c).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-md)',
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem'
      }}>
        <p>
          Tips: Mulai dengan <strong>Mode Bebas</strong> untuk bereksperimen, lalu pindah ke <strong>Mode Belajar</strong> untuk memahami matematikanya!
        </p>
      </footer>
    </div>
  );
}

export default App;
