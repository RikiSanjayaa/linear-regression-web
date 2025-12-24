export default function FormulaDisplay({ formula, variables, explanation }) {
  // Render formula with syntax highlighting
  const renderFormula = () => {
    if (!formula) return null;

    // Split formula into parts and highlight variables
    const parts = formula.split(/(\b[a-z]\b|[+\-*/=()²∑])/gi);

    return parts.map((part, index) => {
      if (variables && variables.includes(part)) {
        return <span key={index} className="formula-var">{part}</span>;
      } else if ('[+-*/=]'.includes(part)) {
        return <span key={index} className="formula-operator">{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="formula-container">
      <div className="formula">
        {renderFormula()}
      </div>
      {explanation && (
        <div className="formula-explanation">
          {explanation}
        </div>
      )}
    </div>
  );
}
