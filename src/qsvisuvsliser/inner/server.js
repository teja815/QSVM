// Quantum Circuit Simulator Server
// Serves static files for the Quantum Circuit Simulator & Bloch Sphere Visualizer

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '64kb' }));

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Quantum Circuit Simulator',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health - Health check',
      '/ - Main application',
      '/run - Qiskit backend simulation (external)'
    ],
    features: [
      'Multi-qubit circuit simulation',
      'Real-time Bloch sphere visualization',
      'Quantum state tomography',
      'Density matrix computation',
      'Entanglement analysis',
      'Dark/Light mode toggle'
    ]
  });
});

// Application info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Quantum Circuit Simulator & Bloch Sphere Visualizer',
    description: 'Interactive platform for quantum computing education and experimentation',
    author: 'Quantum Simulator Team',
    repository: 'https://github.com/quantum-simulator',
    technologies: [
      'Qiskit (Backend simulation)',
      'Plotly.js (3D Visualization)',
      'Chart.js (Data visualization)',
      'Math.js (Complex number arithmetic)',
      'FastAPI (Python backend)'
    ],
    capabilities: {
      max_qubits: 12,
      supported_gates: ['X', 'Y', 'Z', 'H', 'S', 'T', 'CNOT', 'CZ', 'SWAP', 'CCNOT', 'Rx', 'Ry', 'Rz', 'Phase'],
      visualization: ['Bloch spheres', 'Q-sphere', 'Histograms', 'Circuit diagrams'],
      analysis: ['State vectors', 'Density matrices', 'Entropy', 'Purity', 'Measurement statistics']
    }
  });
});

// Static file routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});

app.get('/quantumWorker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'quantumWorker.js'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    available_endpoints: ['/api/health', '/api/info']
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           QUANTUM CIRCUIT SIMULATOR SERVER                  ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  Server running on: http://localhost:${PORT}                    ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}                      ║`);
  console.log('║                                                              ║');
  console.log('║  Features:                                                    ║');
  console.log('║  • Multi-qubit quantum circuit simulation                    ║');
  console.log('║  • Real-time Bloch sphere visualization                      ║');
  console.log('║  • Quantum state tomography                                  ║');
  console.log('║  • Entanglement and purity analysis                          ║');
  console.log('║  • Interactive 3D visualizations                             ║');
  console.log('║                                                              ║');
  console.log('║  API Endpoints:                                              ║');
  console.log('║  • GET  /api/health - Health check                          ║');
  console.log('║  • GET  /api/info - Application information                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('\nPress Ctrl+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down Quantum Simulator server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nTerminating Quantum Simulator server...');
  process.exit(0);
});