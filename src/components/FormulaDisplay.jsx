import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * FormulaDisplay - Renders mathematical formulas using KaTeX
 * 
 * @param {string} formula - LaTeX formula string
 * @param {string} explanation - Optional explanation text below the formula
 * @param {boolean} displayMode - If true, renders in display mode (centered, larger). Default: true
 * @param {string} size - Formula size: 'small', 'medium', 'large'. Default: 'medium'
 */
export default function FormulaDisplay({
  formula,
  explanation,
  displayMode = true,
  size = 'medium'
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && formula) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode: displayMode,
          throwOnError: false,
          trust: true,
          strict: false,
          output: 'html'
        });
      } catch (err) {
        console.error('KaTeX render error:', err);
        containerRef.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);

  const sizeClass = {
    'small': 'formula-small',
    'medium': 'formula-medium',
    'large': 'formula-large'
  }[size] || 'formula-medium';

  return (
    <div className="formula-container">
      <div
        ref={containerRef}
        className={`formula ${sizeClass}`}
      />
      {explanation && (
        <div className="formula-explanation">
          {explanation}
        </div>
      )}
    </div>
  );
}
