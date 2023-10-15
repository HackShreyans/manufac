// Import the 'data' array from the data file


// Define a function to calculate "Gamma" for each data point
function calculateGamma(data) {
  data.forEach(point => {
    const { Ash, Hue, Magnesium } = point;
    const gamma = (Ash * Hue) / Magnesium;
    point.Gamma = gamma;
  });
}

// Define a function to calculate class-wise mean, median, and mode of "Gamma"
function calculateClassStatistics(data) {
  const classStats = {};

  data.forEach(point => {
    const alcoholClass = point.Alcohol;
    if (!classStats[alcoholClass]) {
      classStats[alcoholClass] = [];
    }
    classStats[alcoholClass].push(point.Gamma);
  });

  for (const alcoholClass in classStats) {
    const gammaValues = classStats[alcoholClass];

    // Calculate the mean
    const mean = gammaValues.reduce((acc, val) => acc + val, 0) / gammaValues.length;

    // Calculate the median
    gammaValues.sort((a, b) => a - b);
    const middle = Math.floor(gammaValues.length / 2);
    const median = gammaValues.length % 2 === 0
      ? (gammaValues[middle - 1] + gammaValues[middle]) / 2
      : gammaValues[middle];

    // Calculate the mode
    const mode = gammaValues.reduce((acc, val) => {
      if (!acc[val]) {
        acc[val] = 0;
      }
      acc[val]++;
      return acc;
    }, {});

    const modeArray = Object.keys(mode).filter(key => mode[key] === Math.max(...Object.values(mode))).map(Number);

    console.log(`Class ${alcoholClass} - Mean: ${mean}, Median: ${median}, Mode: ${modeArray}`);
  }
}

// Calculate Gamma values for each data point
// calculateGamma(data);

// Calculate class-wise statistics for "Gamma"
// calculateClassStatistics(data);

// Export the necessary functions if needed
export { calculateGamma, calculateClassStatistics };
