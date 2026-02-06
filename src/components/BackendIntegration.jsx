// components/BackendIntegration.jsx
import React, { useState } from 'react';

const BackendIntegration = ({ nQ, gateSequence, initStates }) => {
  const [backendResults, setBackendResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runOnBackend = async () => {
    setLoading(true);
    try {
      const payload = {
        numQubits: nQ,
        gates: gateSequence,
        initialStates: initStates,
      };

      const response = await fetch("https://qsv-3xax.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setBackendResults(data);
    } catch (error) {
      console.error("Backend error:", error);
      setBackendResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backend-integration">
      <button onClick={runOnBackend} disabled={loading}>
        {loading ? 'Running...' : 'Run on Backend'}
      </button>
      
      {backendResults && (
        <div className="backend-results">
          <h3>Backend Results</h3>
          <pre>{JSON.stringify(backendResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BackendIntegration;