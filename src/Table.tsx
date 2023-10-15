import React, { useEffect, useState } from 'react';
import { datacal } from './data';

const Tables: React.FC = () => {
  const [classWiseStatistics, setClassWiseStatistics] = useState<{ [key: string]: { [key: string]: { mean: number; median: number; mode: number[] } } } | null>(null);

  useEffect(() => {
    if (datacal) {
      const stats = calculateClassWiseStatistics(datacal);
      setClassWiseStatistics(stats);
    } else {
      setClassWiseStatistics(null);
    }
  }, []);

  const calculateMean = (values: number[]): number => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  const calculateMedian = (values: number[]): number => {
    values.sort((a, b) => a - b);
    const middle = Math.floor(values.length / 2);
    if (values.length % 2 === 0) {
      return (values[middle - 1] + values[middle]) / 2;
    }
    return values[middle];
  };

  const calculateMode = (values: number[]): number[] => {
    const valueCount: { [key: number]: number } = {};
    let maxCount = 0;
    let modes: number[] = [];

    values.forEach((value) => {
      if (valueCount[value] === undefined) {
        valueCount[value] = 1;
      } else {
        valueCount[value]++;
      }

      if (valueCount[value] > maxCount) {
        maxCount = valueCount[value];
        modes = [value];
      } else if (valueCount[value] === maxCount) {
        modes.push(value);
      }
    });

    return modes;
  };

  const calculateClassWiseStatistics = (data: any) => {
    const classStats: { [key: string]: { [key: string]: number[] } } = {};

    data.forEach((dataPoint: any) => {
      const alcoholClass = dataPoint['Alcohol'].toString(); // Adjust this based on your data structure
      for (const property in dataPoint) {
        if (property !== 'Alcohol') {
          const propertyValue = parseFloat(dataPoint[property]);

          if (!classStats[alcoholClass]) {
            classStats[alcoholClass] = {};
          }

          if (!classStats[alcoholClass][property]) {
            classStats[alcoholClass][property] = [];
          }

          classStats[alcoholClass][property].push(propertyValue);
        }
      }
    });

    const classStatistics: { [key: string]: { [key: string]: { mean: number; median: number; mode: number[] } } } = {};
    for (const alcoholClass in classStats) {
      if (classStats.hasOwnProperty(alcoholClass)) {
        classStatistics[alcoholClass] = {};
        for (const property in classStats[alcoholClass]) {
          if (classStats[alcoholClass].hasOwnProperty(property)) {
            const values = classStats[alcoholClass][property];
            classStatistics[alcoholClass][property] = {
              mean: calculateMean(values),
              median: calculateMedian(values),
              mode: calculateMode(values),
            };
          }
        }
      }
    }

    return classStatistics;
  };

  return (
    <>
     <h2>Class-Wise Statistics for All Properties</h2>
    <div style={{display: 'flex', alignItems:'center',justifyContent: 'center'}}>
     
      {classWiseStatistics !== null ? (
        <table style={{borderCollapse: 'collapse', width: '80%', border: '1px solid black'}}>
          <thead>
            <tr>
              <th style={{border: '1px solid black', padding: '8px'}}>Class</th>
              <th style={{border: '1px solid black', padding: '8px'}}>Measure</th>
              <th style={{border: '1px solid black', padding: '8px'}}>Flavanoids Mean</th>
              <th style={{border: '1px solid black', padding: '8px'}}>Flavanoids Median</th>
              <th style={{border: '1px solid black', padding: '8px'}}>Flavanoids Mode</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(classWiseStatistics).map((alcoholClass) =>
              Object.keys(classWiseStatistics[alcoholClass]).map((property) => (
                <tr key={alcoholClass + property}>
                  <td style={{border: '1px solid black', padding: '8px'}}>{alcoholClass}</td>
                  <td style={{border: '1px solid black', padding: '8px'}}>{property}</td>
                  <td style={{border: '1px solid black', padding: '8px'}}>{classWiseStatistics[alcoholClass][property].mean.toFixed(2)}</td>
                  <td style={{border: '1px solid black', padding: '8px'}}>{classWiseStatistics[alcoholClass][property].median.toFixed(2)}</td>
                  <td style={{border: '1px solid black', padding: '8px'}}>{classWiseStatistics[alcoholClass][property].mode.join(', ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>Loading or no data available.</p>
      )}
    </div>
    </>
  );
};

export default Tables;
