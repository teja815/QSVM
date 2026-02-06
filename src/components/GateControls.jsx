 // components/GateControls.jsx
import React, { useState } from 'react';

const GateControls = ({ nQ, onAddGate }) => {
  const [gateType, setGateType] = useState('X');
  const [targetQubit, setTargetQubit] = useState(0);
  const [controlQubit, setControlQubit] = useState(1);
  const [angle, setAngle] = useState(90);

  const handleAddGate = () => {
    const gate = {
      type: gateType,
      params: [targetQubit]
    };

    if (['Rx', 'Ry', 'Rz', 'Phase'].includes(gateType)) {
      gate.angle = (angle * Math.PI) / 180;
    }

    if (gateType === 'CNOT' || gateType === 'CZ') {
      gate.params = [controlQubit, targetQubit];
    }

    if (gateType === 'SWAP') {
      gate.params = [controlQubit, targetQubit];
    }

    if (gateType === 'CCNOT') {
      // Add Toffoli logic
    }

    onAddGate(gate);
  };

  return (
    <div className="gate-controls">
      <div className="control-group">
        <label>Gate to add:</label>
        <select value={gateType} onChange={(e) => setGateType(e.target.value)}>
          <optgroup label="Single-qubit (fixed)">
            <option value="X">X (Pauli-X)</option>
            <option value="Y">Y (Pauli-Y)</option>
            <option value="Z">Z (Pauli-Z)</option>
            <option value="H">H (Hadamard)</option>
            <option value="S">S</option>
            <option value="Sdg">S†</option>
            <option value="T">T</option>
            <option value="Tdg">T†</option>
          </optgroup>
          <optgroup label="Single-qubit (parameterized)">
            <option value="Rx">Rx(θ)</option>
            <option value="Ry">Ry(θ)</option>
            <option value="Rz">Rz(θ)</option>
            <option value="Phase">Phase(φ)</option>
          </optgroup>
          <optgroup label="Two-qubit">
            <option value="CNOT">CNOT (control,target)</option>
            <option value="CZ">CZ (control,target)</option>
            <option value="SWAP">SWAP (a,b)</option>
          </optgroup>
          {/* Add other gate groups */}
        </select>
      </div>

      <div className="control-group">
        <label>Target qubit:</label>
        <select value={targetQubit} onChange={(e) => setTargetQubit(parseInt(e.target.value))}>
          {Array.from({ length: nQ }, (_, i) => (
            <option key={i} value={i}>q{i}</option>
          ))}
        </select>
      </div>

      {(gateType === 'CNOT' || gateType === 'CZ') && (
        <div className="control-group">
          <label>Control qubit:</label>
          <select value={controlQubit} onChange={(e) => setControlQubit(parseInt(e.target.value))}>
            {Array.from({ length: nQ }, (_, i) => (
              <option key={i} value={i}>q{i}</option>
            ))}
          </select>
        </div>
      )}

      {['Rx', 'Ry', 'Rz', 'Phase'].includes(gateType) && (
        <div className="control-group">
          <label>Angle (degrees):</label>
          <input 
            type="number" 
            value={angle} 
            onChange={(e) => setAngle(parseFloat(e.target.value))}
            step="1"
          />
        </div>
      )}

      <button onClick={handleAddGate} className="add-gate-button">
        Add Gate
      </button>
    </div>
  );
};

export default GateControls;