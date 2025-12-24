import { useEffect, useRef, useState } from 'react';
import { calculatePointError } from '../utils/dataGenerator';

export default function LinearRegressionChart({
  data,
  m,
  c,
  theme,
  predictionX,
  onPredictionXChange
}) {
  const canvasRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDraggingPrediction, setIsDraggingPrediction] = useState(false);
  const [isHoveringPrediction, setIsHoveringPrediction] = useState(false);

  // Update dimensions when container resizes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(canvas.parentElement);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Theme-aware colors
    const colors = theme === 'dark' ? {
      grid: '#404040',
      axis: '#64748b',
      text: '#d1d5db',
      line: '#2563eb',
      point: '#2563eb',
      pointInner: '#ffffff',
      errorLine: '#ef4444',
      errorLineHover: '#dc2626',
      predictionDot: '#10b981'
    } : {
      grid: '#e5e7eb',
      axis: '#64748b',
      text: '#4b5563',
      line: '#2563eb',
      point: '#2563eb',
      pointInner: '#ffffff',
      errorLine: '#f87171',
      errorLineHover: '#dc2626',
      predictionDot: '#10b981'
    };

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Chart dimensions - centered coordinate system
    // Using window.innerWidth to detect mobile regardless of canvas zoom width
    const padding = window.innerWidth < 768 ? 30 : 60;
    const chartWidth = dimensions.width - 2 * padding;
    const chartHeight = dimensions.height - 2 * padding;

    // Fixed range for centered coordinate system
    const xMin = -10;
    const xMax = 10;
    const yMin = -10;
    const yMax = 10;

    // Scale functions - (0,0) will be at center
    const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
    const scaleY = (y) => dimensions.height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;

    // Draw grid lines first (behind axes)
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical grid lines
    for (let x = xMin; x <= xMax; x += 2) {
      if (x === 0) continue;
      ctx.beginPath();
      ctx.moveTo(scaleX(x), padding);
      ctx.lineTo(scaleX(x), dimensions.height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = yMin; y <= yMax; y += 2) {
      if (y === 0) continue;
      ctx.beginPath();
      ctx.moveTo(padding, scaleY(y));
      ctx.lineTo(dimensions.width - padding, scaleY(y));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw main axes (thicker, through origin)
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 2;

    // X-axis (y=0)
    ctx.beginPath();
    ctx.moveTo(padding, scaleY(0));
    ctx.lineTo(dimensions.width - padding, scaleY(0));
    ctx.stroke();

    // Y-axis (x=0)
    ctx.beginPath();
    ctx.moveTo(scaleX(0), padding);
    ctx.lineTo(scaleX(0), dimensions.height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = colors.text;
    const labelFontSize = dimensions.width < 500 ? '11px' : '13px';
    ctx.font = `${labelFontSize} Inter, sans-serif`;
    ctx.textAlign = 'center';

    // X-axis labels (every 2 units)
    for (let x = xMin; x <= xMax; x += 2) {
      if (x === 0) continue;
      const screenX = scaleX(x);
      ctx.fillText(x.toString(), screenX, scaleY(0) + (dimensions.width < 500 ? 15 : 20));
    }

    // Y-axis labels (every 2 units)
    ctx.textAlign = 'right';
    for (let y = yMin; y <= yMax; y += 2) {
      if (y === 0) continue;
      const screenY = scaleY(y);
      ctx.fillText(y.toString(), scaleX(0) - (dimensions.width < 500 ? 6 : 10), screenY + 4);
    }

    // Draw origin label
    ctx.fillStyle = colors.text;
    ctx.font = `bold ${labelFontSize} Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText('(0,0)', scaleX(0) - (dimensions.width < 500 ? 6 : 10), scaleY(0) - (dimensions.width < 500 ? 6 : 10));

    // Axis titles
    ctx.fillStyle = colors.text;
    const titleFontSize = dimensions.width < 500 ? '14px' : '16px';
    ctx.font = `bold ${titleFontSize} Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('x', dimensions.width - padding + (dimensions.width < 500 ? 20 : 30), scaleY(0) + 5);

    ctx.save();
    ctx.translate(scaleX(0) - (dimensions.width < 500 ? 20 : 30), padding - 10);
    ctx.fillText('y', 0, 0);
    ctx.restore();

    // Draw regression line (full range from edge to edge)
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 3;

    const x1 = xMin;
    const y1 = m * x1 + c;
    const x2 = xMax;
    const y2 = m * x2 + c;

    ctx.beginPath();
    ctx.moveTo(scaleX(x1), scaleY(y1));
    ctx.lineTo(scaleX(x2), scaleY(y2));
    ctx.stroke();

    // Draw error lines (dashed lines from points to regression line)
    data.forEach(point => {
      const pointX = scaleX(point.x);
      const pointY = scaleY(point.y);
      const predictedY = m * point.x + c;
      const regressionY = scaleY(predictedY);

      const isHovered = hoveredPoint?.id === point.id;

      // Draw dashed error line
      ctx.strokeStyle = isHovered ? colors.errorLineHover : colors.errorLine;
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.setLineDash([4, 4]);
      ctx.globalAlpha = isHovered ? 1 : 0.4;

      ctx.beginPath();
      ctx.moveTo(pointX, pointY);
      ctx.lineTo(pointX, regressionY);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    });

    // Draw data points
    data.forEach(point => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      const isHovered = hoveredPoint?.id === point.id;

      // Outer circle
      ctx.fillStyle = colors.point;
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();

      // Inner point
      ctx.fillStyle = colors.pointInner;
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Highlight ring on hover
      if (isHovered) {
        ctx.strokeStyle = colors.point;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw Prediction Dot (Draggable)
    const predX = scaleX(predictionX);
    const predY = scaleY(m * predictionX + c);
    const isActive = isDraggingPrediction || isHoveringPrediction;

    // Pulse effect when active
    if (isActive) {
      ctx.fillStyle = colors.predictionDot;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(predX, predY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = colors.predictionDot;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(predX, predY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Label for prediction point
    ctx.fillStyle = colors.predictionDot;
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('', predX, predY - 20);

  }, [data, m, c, theme, hoveredPoint, dimensions, predictionX, isDraggingPrediction, isHoveringPrediction]);

  // Shared coordinate calculation for mouse and touch
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, clientX: 0, clientY: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      clientX,
      clientY
    };
  };

  const handlePointerUpdate = (e, forceDragging = false) => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const { x: mouseX, y: mouseY, clientX, clientY } = getCanvasCoords(e);
    setMousePos({ x: clientX, y: clientY });

    const padding = window.innerWidth < 768 ? 30 : 60;
    const chartWidth = dimensions.width - 2 * padding;
    const chartHeight = dimensions.height - 2 * padding;

    const xMin = -10;
    const xMax = 10;
    const yMin = -10;
    const yMax = 10;

    const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth;
    const scaleY = (y) => dimensions.height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight;
    const unscaleX = (sx) => ((sx - padding) / chartWidth) * (xMax - xMin) + xMin;

    if (isDraggingPrediction || forceDragging) {
      const newX = Math.max(xMin, Math.min(xMax, unscaleX(mouseX)));
      onPredictionXChange(newX);
      if (e.cancelable) e.preventDefault();
      return true;
    }

    // Check if near prediction dot
    const predPX = scaleX(predictionX);
    const predPY = scaleY(m * predictionX + c);
    const distToPred = Math.sqrt((mouseX - predPX) ** 2 + (mouseY - predPY) ** 2);
    const nearPrediction = distToPred < 25; // Larger hit area for touch

    setIsHoveringPrediction(nearPrediction);

    // Check if near data points
    let foundPoint = null;
    const hoverRadius = 20;

    for (const point of data) {
      const px = scaleX(point.x);
      const py = scaleY(point.y);
      const distance = Math.sqrt((mouseX - px) ** 2 + (mouseY - py) ** 2);

      if (distance <= hoverRadius) {
        foundPoint = point;
        break;
      }
    }

    setHoveredPoint(foundPoint);
    return nearPrediction;
  };

  const handleMouseMove = (e) => {
    handlePointerUpdate(e);
  };

  const handleMouseDown = () => {
    if (isHoveringPrediction) {
      setIsDraggingPrediction(true);
    }
  };

  const handleTouchStart = (e) => {
    const isNear = handlePointerUpdate(e);
    if (isNear) {
      setIsDraggingPrediction(true);
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchMove = (e) => {
    if (isDraggingPrediction) {
      handlePointerUpdate(e);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingPrediction(false);
  };

  const handleTouchEnd = () => {
    setIsDraggingPrediction(false);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setIsDraggingPrediction(false);
    setIsHoveringPrediction(false);
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <canvas
        ref={canvasRef}
        id="regressionChart"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDraggingPrediction ? 'grabbing' : (isHoveringPrediction ? 'grab' : (hoveredPoint ? 'pointer' : 'default')),
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: isDraggingPrediction ? 'none' : 'auto'
        }}
      />

      {/* Persistent Tooltip for Prediction Dot while dragging or hovering */}
      {(isDraggingPrediction || isHoveringPrediction) && (
        <div
          style={{
            position: 'fixed',
            left: mousePos.x + 15,
            top: mousePos.y - 10,
            background: 'var(--color-bg-card)',
            border: '2px solid #10b981',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.875rem'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#10b981' }}>
            Titik Prediksi
          </div>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            x: {predictionX.toFixed(2)}
          </div>
          <div style={{ color: 'var(--color-text-primary)', fontWeight: '700' }}>
            y (Hasil): {(m * predictionX + c).toFixed(2)}
          </div>
        </div>
      )}

      {/* Tooltip for hovered data point */}
      {hoveredPoint && !isDraggingPrediction && (
        <div
          style={{
            position: 'fixed',
            left: mousePos.x + 15,
            top: mousePos.y - 10,
            background: 'var(--color-bg-card)',
            border: '2px solid var(--color-accent-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.875rem'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>
            Titik Data #{hoveredPoint.id + 1}
          </div>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            x: {hoveredPoint.x.toFixed(2)}, y: {hoveredPoint.y.toFixed(2)}
          </div>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            Prediksi: {(m * hoveredPoint.x + c).toFixed(2)}
          </div>
          <div style={{
            color: 'var(--color-accent-primary)',
            fontWeight: '700',
            marginTop: '0.25rem',
            fontFamily: 'var(--font-mono)'
          }}>
            Error: {Math.abs(calculatePointError(hoveredPoint, m, c)).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
