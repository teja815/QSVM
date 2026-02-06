 // components/Visualizations.jsx
import React, { useEffect, useRef } from 'react';
import * as Plotly from 'plotly.js-dist';

const Visualizations = ({ stateVec, reducedList, theme }) => {
  const qSphereRef = useRef(null);
  const blochSpheresRef = useRef([]);

  useEffect(() => {
    if (stateVec.length > 0 && qSphereRef.current) {
      plotQSphere(stateVec);
    }
  }, [stateVec]);

  useEffect(() => {
    if (reducedList.length > 0) {
      drawAllBloch(reducedList);
    }
  }, [reducedList]);

  const plotQSphere = (stateVec) => {
    // Implementation from original script.js
    // Plot Q-Sphere visualization
  };

  const drawAllBloch = (reducedList) => {
    // Implementation from original script.js
    // Draw Bloch spheres for each qubit
  };

  const plotBloch = (containerId, bloch, q) => {
    // Implementation from original script.js
    // Plot individual Bloch sphere
  };

  const getPlotColors = () => {
    return theme === 'dark'
      ? { paper: '#8ca3d3', plot: '#8ca3d3', scene: '#8ca3d3' }
      : { paper: 'rgb(246, 246, 248)', plot: 'rgb(247, 247, 247)', scene: 'rgb(249, 249, 250)' };
  };

  return (
    <div className="visualizations">
      <div ref={qSphereRef} id="qsphereDiv" style={{ width: '600px', height: '600px' }}></div>
      
      <div className="bloch-spheres">
        {reducedList.map((_, index) => (
          <div key={index} ref={el => blochSpheresRef.current[index] = el}></div>
        ))}
      </div>
    </div>
  );
};

export default Visualizations;