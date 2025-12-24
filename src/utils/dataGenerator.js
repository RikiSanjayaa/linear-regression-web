// Generate sample data in a centered coordinate system for educational purposes
export function generateHeightWeightData(numPoints = 20) {
  const data = [];

  // Create data points in a -10 to +10 range with a linear relationship
  // Using y ≈ 0.8x + 2 with MORE variation for better visualization
  const trueM = 0.8;
  const trueC = 2;

  for (let i = 0; i < numPoints; i++) {
    // Spread points across the range more randomly
    const x = -8 + Math.random() * 16; // Range: -8 to +8
    // Add more realistic variation (increased scatter)
    const baseY = trueM * x + trueC;
    const y = baseY + (Math.random() - 0.5) * 5; // Increased noise from 3 to 5

    data.push({
      x,
      y,
      id: i // Add ID for tracking in hover
    });
  }

  return data.sort((a, b) => a.x - b.x);
}

// Calculate Mean Squared Error for a given line
export function calculateMSE(data, m, c) {
  let sumSquaredError = 0;

  for (const point of data) {
    const predictedY = m * point.x + c;
    const error = point.y - predictedY;
    sumSquaredError += error * error;
  }

  return sumSquaredError / data.length;
}

// Calculate error for a single point
export function calculatePointError(point, m, c) {
  const predictedY = m * point.x + c;
  return point.y - predictedY;
}

// Calculate optimal slope and intercept using least squares method
export function calculateOptimalParameters(data) {
  const n = data.length;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXSquared = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXSquared += point.x * point.x;
  }

  // Calculate slope: m = (n∑xy - ∑x∑y) / (n∑x² - (∑x)²)
  const m = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX * sumX);

  // Calculate intercept: c = (∑y - m∑x) / n
  const c = (sumY - m * sumX) / n;

  return { m, c };
}

// Simulate gradient descent steps for educational animation
export function* gradientDescentSteps(data, learningRate = 0.0001, iterations = 100) {
  let m = 0; // Start with random values
  let c = 0;
  const n = data.length;

  for (let iter = 0; iter < iterations; iter++) {
    // Calculate gradients
    let gradM = 0;
    let gradC = 0;

    for (const point of data) {
      const prediction = m * point.x + c;
      const error = prediction - point.y;

      gradM += (2 / n) * error * point.x;
      gradC += (2 / n) * error;
    }

    // Update parameters
    m = m - learningRate * gradM;
    c = c - learningRate * gradC;

    const mse = calculateMSE(data, m, c);

    // Yield current state every few iterations
    if (iter % 5 === 0 || iter === iterations - 1) {
      yield { m, c, mse, iteration: iter };
    }
  }
}

// Get default initial parameters (reasonable starting point)
export function getDefaultParameters() {
  return {
    m: 0.5,
    c: -10
  };
}
