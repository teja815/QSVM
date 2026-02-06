 // components/CustomGates.jsx
import React, { useState } from 'react';

const CustomGates = ({ nQ, onAddCustomGate }) => {
  const [customGateType, setCustomGateType] = useState('CUSTOM_MATRIX');
  const [gateName, setGateName] = useState('');
  const [matrix, setMatrix] = useState([]);
  const [matrixSize, setMatrixSize] = useState(2);

  const setupMatrixInput = () => {
    const newMatrix = [];
    for (let i = 0; i < matrixSize; i++) {
      newMatrix[i] = [];
      for (let j = 0; j < matrixSize; j++) {
        newMatrix[i][j] = i === j ? '1' : '0';
      }
    }
    setMatrix(newMatrix);
  };

  const validateAndAddMatrix = () => {
    // Validate matrix
    const parsedMatrix = matrix.map(row =>
      row.map(cell => {
        try {
          return parseComplex(cell);
        } catch (e) {
          return c(0, 0);
        }
      })
    );

    // Check unitarity
    if (isUnitary(parsedMatrix)) {
      onAddCustomGate({
        type: 'CUSTOM',
        customType: 'CUSTOM_MATRIX',
        name: gateName,
        matrix: parsedMatrix,
        size: matrixSize
      });
      alert(`Custom gate "${gateName}" created successfully!`);
    } else {
      alert('Matrix is not unitary. Please check your input.');
    }
  };

  // Helper functions from original script.js
  const parseComplex = (str) => {
    // Parse complex number string
    // Implementation from original script.js
  };

  const isUnitary = (matrix) => {
    // Check if matrix is unitary
    // Implementation from original script.js
  };

  return (
    <div className="custom-gates">
      <h3>Custom Gates</h3>
      
      <select value={customGateType} onChange={(e) => setCustomGateType(e.target.value)}>
        <option value="CUSTOM_MATRIX">Custom Matrix Gate</option>
        <option value="CUSTOM_CIRCUIT">Custom Circuit Gate</option>
        <option value="CUSTOM_CONTROL">Custom Control Gate</option>
      </select>

      {customGateType === 'CUSTOM_MATRIX' && (
        <div className="custom-matrix-form">
          <input
            type="text"
            placeholder="Gate Name"
            value={gateName}
            onChange={(e) => setGateName(e.target.value)}
          />
          
          <select value={matrixSize} onChange={(e) => {
            setMatrixSize(parseInt(e.target.value));
            setupMatrixInput();
          }}>
            <option value="2">2x2 (1 qubit)</option>
            <option value="4">4x4 (2 qubits)</option>
            <option value="8">8x8 (3 qubits)</option>
          </select>

          <div className="matrix-input">
            {matrix.map((row, i) => (
              <div key={i} className="matrix-row">
                {row.map((cell, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const newMatrix = [...matrix];
                      newMatrix[i][j] = e.target.value;
                      setMatrix(newMatrix);
                    }}
                    placeholder={i === j ? '1' : '0'}
                  />
                ))}
              </div>
            ))}
          </div>

          <button onClick={validateAndAddMatrix}>Validate & Add Gate</button>
        </div>
      )}

      {/* Add forms for other custom gate types */}
    </div>
  );
};

export default CustomGates;