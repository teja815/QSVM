// ---------- Utilities ----------
const ZERO_C = math.complex(0,0);
function c(re, im=0) { return math.complex(re, im); }
const cre = math.re, cim = math.im;

// ---------- Gate matrices (2x2) ----------
const SQRT1_2 = 1/Math.sqrt(2);
const GATES = {
  X: [[c(0,0), c(1,0)], [c(1,0), c(0,0)]],
  Y: [[c(0,0), c(0,-1)], [c(0,1), c(0,0)]],
  Z: [[c(1,0), c(0,0)], [c(0,0), c(-1,0)]],
  H: [[c(SQRT1_2,0), c(SQRT1_2,0)], [c(SQRT1_2,0), c(-SQRT1_2,0)]],
  S: [[c(1,0), c(0,0)], [c(0,0), c(0,1)]],
  Sdg: [[c(1,0), c(0,0)], [c(0,0), c(0,-1)]],
  T: [[c(1,0), c(0,0)], [c(0,0), math.exp(math.multiply(c(0,1), Math.PI/4))]],
  Tdg: [[c(1,0), c(0,0)], [c(0,0), math.exp(math.multiply(c(0,-1), Math.PI/4))]],
};

// ---------- Gate Descriptions for Tooltips ----------
const GATE_DESCRIPTIONS = {
  X: {
    name: "Pauli-X Gate (NOT Gate)",
    description: "Flips the qubit state: |0⟩ → |1⟩ and |1⟩ → |0⟩. Equivalent to a classical NOT gate. Rotates the Bloch sphere 180° around the X-axis.",
    matrix: "[[0, 1], [1, 0]]"
  },
  Y: {
    name: "Pauli-Y Gate",
    description: "Rotates the qubit 180° around the Y-axis of the Bloch sphere. Introduces a phase factor of i when flipping states.",
    matrix: "[[0, -i], [i, 0]]"
  },
  Z: {
    name: "Pauli-Z Gate (Phase Flip)",
    description: "Flips the phase of |1⟩ state: |0⟩ → |0⟩, |1⟩ → -|1⟩. Rotates 180° around the Z-axis. No effect on |0⟩ or |1⟩ probabilities.",
    matrix: "[[1, 0], [0, -1]]"
  },
  H: {
    name: "Hadamard Gate",
    description: "Creates superposition: |0⟩ → (|0⟩+|1⟩)/√2, |1⟩ → (|0⟩-|1⟩)/√2. Essential for quantum parallelism and many quantum algorithms.",
    matrix: "[[1/√2, 1/√2], [1/√2, -1/√2]]"
  },
  S: {
    name: "S Gate (Phase Gate, √Z)",
    description: "Applies a 90° phase rotation to |1⟩: |1⟩ → i|1⟩. Square root of Z gate. Used in many quantum algorithms including QFT.",
    matrix: "[[1, 0], [0, i]]"
  },
  Sdg: {
    name: "S† Gate (S-dagger)",
    description: "Inverse of S gate. Applies -90° phase to |1⟩: |1⟩ → -i|1⟩. Hermitian conjugate of the S gate.",
    matrix: "[[1, 0], [0, -i]]"
  },
  T: {
    name: "T Gate (π/8 Gate, √S)",
    description: "Applies 45° phase rotation to |1⟩. Fourth root of Z gate. Critical for universal quantum computation and magic state distillation.",
    matrix: "[[1, 0], [0, e^(iπ/4)]]"
  },
  Tdg: {
    name: "T† Gate (T-dagger)",
    description: "Inverse of T gate. Applies -45° phase to |1⟩. Hermitian conjugate of the T gate.",
    matrix: "[[1, 0], [0, e^(-iπ/4)]]"
  },
  Rx: {
    name: "Rx Gate (X-Rotation)",
    description: "Rotates qubit around X-axis by angle θ. Parameterized gate for continuous rotations. Used in variational quantum algorithms.",
    matrix: "[[cos(θ/2), -i·sin(θ/2)], [-i·sin(θ/2), cos(θ/2)]]"
  },
  Ry: {
    name: "Ry Gate (Y-Rotation)",
    description: "Rotates qubit around Y-axis by angle θ. Creates superpositions without phase differences. Common in state preparation.",
    matrix: "[[cos(θ/2), -sin(θ/2)], [sin(θ/2), cos(θ/2)]]"
  },
  Rz: {
    name: "Rz Gate (Z-Rotation)",
    description: "Rotates qubit around Z-axis by angle θ. Applies relative phase between |0⟩ and |1⟩. Equivalent to phase gate for specific angles.",
    matrix: "[[e^(-iθ/2), 0], [0, e^(iθ/2)]]"
  },
  Phase: {
    name: "Phase Gate (U1)",
    description: "Applies phase φ to |1⟩ state: |1⟩ → e^(iφ)|1⟩. Generalization of S and T gates. Global phase is ignored in quantum mechanics.",
    matrix: "[[1, 0], [0, e^(iφ)]]"
  },
  CNOT: {
    name: "CNOT Gate (Controlled-NOT)",
    description: "Two-qubit gate: flips target qubit if control is |1⟩. Creates entanglement. Essential for quantum computing universality.",
    matrix: "[[1,0,0,0], [0,1,0,0], [0,0,0,1], [0,0,1,0]]"
  },
  CZ: {
    name: "CZ Gate (Controlled-Z)",
    description: "Applies Z gate to target if control is |1⟩. Symmetric: control and target are interchangeable. Creates entanglement.",
    matrix: "[[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,-1]]"
  },
  SWAP: {
    name: "SWAP Gate",
    description: "Exchanges the states of two qubits: |01⟩ ↔ |10⟩. Can be decomposed into 3 CNOT gates. Useful for qubit routing.",
    matrix: "[[1,0,0,0], [0,0,1,0], [0,1,0,0], [0,0,0,1]]"
  },
  CCNOT: {
    name: "Toffoli Gate (CCNOT)",
    description: "Three-qubit gate: flips target if both controls are |1⟩. Universal for classical computation. Used in quantum error correction.",
    matrix: "8×8 matrix (flips target when c1=c2=1)"
  },
  MEASURE: {
    name: "Measurement",
    description: "Collapses qubit to |0⟩ or |1⟩ based on probability amplitudes. Irreversible operation. Result stored in classical register.",
    matrix: "Projection operators: P₀=|0⟩⟨0|, P₁=|1⟩⟨1|"
  }
};

// ---------- Keyword Descriptions for Beginners ----------
const KEYWORD_DESCRIPTIONS = {
  "numQ": {
    title: "Number of Qubits",
    description: "The total number of quantum bits in your circuit. Each qubit can be in state |0⟩, |1⟩, or a superposition. More qubits = exponentially more computational states (2^n basis states)."
  },
  "basisState": {
    title: "Initial Basis State",
    description: "The starting state of your quantum system before any gates are applied. Each qubit starts in either |0⟩ or |1⟩. The tensor product (⊗) combines individual qubit states into the full system state."
  },
  "gateType": {
    title: "Gate to Add",
    description: "Quantum gates are operations that transform qubit states. They're the quantum equivalent of logic gates in classical computing. Gates are unitary (reversible) except for measurement."
  },
  "targetQ": {
    title: "Target Qubit",
    description: "The qubit that the gate will act upon. For single-qubit gates, this is the only qubit affected. Qubit indexing starts from q0."
  },
  "controlQ": {
    title: "Control Qubit",
    description: "In controlled gates (like CNOT), the control qubit determines whether the operation is applied to the target. If control is |1⟩, the gate acts on target."
  },
  "angleDeg": {
    title: "Rotation Angle (Degrees)",
    description: "The angle of rotation for parameterized gates (Rx, Ry, Rz, Phase). 180° = π radians gives a full flip. 90° = π/2 creates equal superposition."
  },
  "swapA": {
    title: "First Swap Qubit",
    description: "One of the two qubits whose states will be exchanged by the SWAP gate."
  },
  "swapB": {
    title: "Second Swap Qubit", 
    description: "The other qubit in the SWAP operation. After SWAP, qubit A has qubit B's original state and vice versa."
  },
  "cc_c1": {
    title: "First Control (Toffoli)",
    description: "First control qubit for the Toffoli (CCNOT) gate. Both controls must be |1⟩ for the target to flip."
  },
  "cc_c2": {
    title: "Second Control (Toffoli)",
    description: "Second control qubit for the Toffoli gate. Works together with first control to determine if target flips."
  },
  "cc_t": {
    title: "Target (Toffoli)",
    description: "The target qubit that gets flipped (X gate applied) only when both control qubits are in state |1⟩."
  },
  "btnAddGate": {
    title: "Add Gate",
    description: "Click to add the selected quantum gate to your circuit. The gate will be applied to the specified qubit(s) when you run the simulation."
  },
  "btnRun": {
    title: "visualise",
    description: "Display the circuit diagram visually showing all quantum gates, qubit wires, and classical registers. This helps you understand the circuit structure before running it."
  },
  "cRun": {
    title: "Run Circuit ",
    description: "Execute the quantum circuit simulation. This applies all gates in sequence, calculates the final quantum state, generates measurement counts (1024 shots), and displays results including histogram, Bloch spheres, and Q-Sphere."
  },
  "btnUndo": {
    title: "Undo",
    description: "Remove the last gate added to the circuit. Useful for correcting mistakes or experimenting with different gate configurations."
  },
  "btnClearGates": {
    title: "Clear All Gates",
    description: "Remove all gates from the circuit and reset to the initial state. The qubit configuration remains unchanged."
  },
  "histogram": {
    title: "Measurement Histogram",
    description: "Shows the distribution of measurement outcomes from 1024 simulated shots. Each bar represents the count of times that particular basis state was measured."
  },
  "blochSpheres": {
    title: "Bloch Sphere Visualization",
    description: "3D representation of each qubit's state. Pure states lie on the surface; mixed states are inside. The z-axis represents |0⟩ (top) and |1⟩ (bottom)."
  },
  "qsphereDiv": {
    title: "Q-Sphere Visualization",
    description: "Multi-qubit state visualization on a sphere. Dot size shows probability amplitude; color indicates quantum phase. States are arranged by Hamming weight (number of 1s)."
  },
  "numQDiv": {
    title: "Number of Qubits Setting",
    description: "Configure how many quantum bits (qubits) your circuit will use. Each additional qubit doubles the computational state space (2^n total states)."
  },
  "basisStateDiv": {
    title: "Initial Basis State Setting",
    description: "Set the starting quantum state for all qubits. By default, all qubits start in |0⟩. You can select different initial states using the tensor product notation."
  },
  "targetQDiv": {
    title: "Target Qubit Selection",
    description: "Choose which qubit the current gate will operate on. For single-qubit gates, this is the only affected qubit."
  },
  "controlQDiv": {
    title: "Control Qubit Selection",
    description: "For controlled gates (CNOT, CZ), select the qubit that controls the operation. The gate only activates when this qubit is in state |1⟩."
  }
};

// Parameterized single-qubit gates
function Rx(theta){
  const th = theta/2;
  return [
    [c(Math.cos(th),0), c(0,-Math.sin(th))],
    [c(0,-Math.sin(th)), c(Math.cos(th),0)]
  ];
}
function Ry(theta){
  const th = theta/2;
  return [
    [c(Math.cos(th),0), c(-Math.sin(th),0)],
    [c(Math.sin(th),0), c(Math.cos(th),0)]
  ];
}
function Rz(theta){
  const th = theta/2;
  return [
    [math.exp(math.multiply(c(0,-1), th)), c(0,0)],
    [c(0,0), math.exp(math.multiply(c(0,1), th))]
  ];
}
function Phase(phi){
  return [[c(1,0), c(0,0)], [c(0,0), math.exp(math.multiply(c(0,1), phi))]];
}

// Helper functions
function getInitStates(initIndex, nQ) {
  const initStates = [];
  for (let i = nQ - 1; i >= 0; i--) {
    initStates.push((initIndex >> i) & 1);
  }
  return initStates;
}

function log2Safe(val) {
  return val > 0 ? Math.log(val) / Math.log(2) : 0;
}

function qubitEntropy(x, y, z) {
  const r = Math.sqrt(x * x + y * y + z * z);
  const lambda1 = (1 + r) / 2;
  const lambda2 = (1 - r) / 2;
  const S = -(lambda1 * log2Safe(lambda1) + lambda2 * log2Safe(lambda2));
  return S;
}

function roundVal(val, digits=3) {
  const num = Number(val.toFixed(digits));
  return Math.abs(num) < 1e-12 ? 0 : num;
}

function cleanFixed(val, digits = 3) {
  const num = Number(val);
  const rounded = Number(num.toFixed(digits));
  return rounded === 0 ? 0 : rounded;
}

// ---------- DOM elements ----------
const btnSet = document.getElementById('btnSet');
const afterSet = document.getElementById('afterSet');
const numQInput = document.getElementById('numQ');
const basisSelect = document.getElementById('basisState');

const gateType = document.getElementById('gateType');
const singleTargetDiv = document.getElementById('singleTargetDiv');
const targetQ = document.getElementById('targetQ');

const angleDiv = document.getElementById('angleDiv');
const angleDeg = document.getElementById('angleDeg');
const angleLabel = document.getElementById('angleLabel');

const cnotDiv = document.getElementById('cnotDiv');
const controlQ = document.getElementById('controlQ');
const targetQ2 = document.getElementById('targetQ2');

const swapDiv = document.getElementById('swapDiv');
const swapA = document.getElementById('swapA');
const swapB = document.getElementById('swapB');

const ccnotDiv = document.getElementById('ccnotDiv');
const cc_c1 = document.getElementById('cc_c1');
const cc_c2 = document.getElementById('cc_c2');
const cc_t = document.getElementById('cc_t');

const btnAddGate = document.getElementById('btnAddGate');
const btnUndo = document.getElementById('btnUndo');
const btnClearGates = document.getElementById('btnClearGates');
const gatesListDiv = document.getElementById('gatesList');
const btnRun = document.getElementById('btnRun');

const resultsDiv = document.getElementById('results');
const blochSpheresDiv = document.getElementById('blochSpheres');
const container = document.getElementById("quantumCircuit");
const customQubitContainer = document.getElementById('customQubitContainer');
const stateBarChart = document.getElementById('stateBarChart');
const qsphereDiv = document.getElementById('qsphereDiv');
  
// ---------- App state ----------
let nQ = 2;
let stateVec = [];
let gateSequence = [];
let lastData = null;
let histogramChart = null;
let targetQubit = null;
let firstQubit = false;
let initStates = [];
let currentSvgElement = null;

// ---------- Setup handlers ----------
if (btnSet) btnSet.addEventListener('click', onSet);
if (gateType) gateType.addEventListener('change', onGateTypeChange);
if (btnAddGate) btnAddGate.addEventListener('click', onAddGate);
if (btnUndo) btnUndo.addEventListener('click', onUndo);
if (btnClearGates) btnClearGates.addEventListener('click', onClearGates);
if (btnRun) btnRun.addEventListener('click', onRun);

// Initialize UI
onGateTypeChange();
initializeTooltips();
initializeGateDropdownTooltips();
initializeDivTooltips(); // Requirement 2: Initialize tooltips for divs

if (blochSpheresDiv) {
  blochSpheresDiv.innerHTML = "<div class='grid'><b><h2 style='text-align:center'>Qubit</h2></b> <p>The fundamental unit of quantum information, serving as the quantum equivalent of a classical computer's bit. A qubit can have states 0, 1, 0/1(superposition). </p></div>";
}

// ---------- Tooltip System - LABELS AND BUTTONS ----------
function initializeTooltips() {
  // Create tooltip element if it doesn't exist
  let tooltip = document.getElementById('keyword-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'keyword-tooltip';
    tooltip.className = 'keyword-tooltip';
    tooltip.innerHTML = '<div class="tooltip-title"></div><div class="tooltip-description"></div>';
    document.body.appendChild(tooltip);
  }

  // Add tooltips to labels
  document.querySelectorAll('label').forEach(label => {
    const forAttr = label.getAttribute('for');
    if (forAttr && KEYWORD_DESCRIPTIONS[forAttr]) {
      label.classList.add('tooltip-trigger');
      label.setAttribute('data-tooltip-key', forAttr);
      label.style.cursor = 'help';
      label.style.borderBottom = '1px dashed #888';
      label.style.display = 'inline-block';
      
      label.addEventListener('mouseenter', showKeywordTooltip);
      label.addEventListener('mouseleave', hideKeywordTooltip);
      label.addEventListener('mousemove', moveTooltip);
    }
  });

  // Add tooltips to buttons
  document.querySelectorAll('button[id]').forEach(button => {
    const buttonId = button.id;
    if (KEYWORD_DESCRIPTIONS[buttonId]) {
      button.classList.add('tooltip-trigger');
      button.setAttribute('data-tooltip-key', buttonId);
      
      button.addEventListener('mouseenter', showKeywordTooltip);
      button.addEventListener('mouseleave', hideKeywordTooltip);
      button.addEventListener('mousemove', moveTooltip);
    }
  });

  // Add tooltips to specific elements by ID
  ['histogram', 'blochSpheres', 'qsphereDiv'].forEach(id => {
    const el = document.getElementById(id);
    if (el && KEYWORD_DESCRIPTIONS[id]) {
      el.classList.add('tooltip-trigger');
      el.setAttribute('data-tooltip-key', id);
      
      el.addEventListener('mouseenter', showKeywordTooltip);
      el.addEventListener('mouseleave', hideKeywordTooltip);
      el.addEventListener('mousemove', moveTooltip);
    }
  });
}

// Requirement 2: Add tooltips to specific div containers
function initializeDivTooltips() {
  const divMappings = {
    'numQDiv': 'numQDiv',
    'basisStateDiv': 'basisStateDiv',
    'singleTargetDiv': 'targetQDiv',
    'cnotDiv': 'controlQDiv',
    'swapDiv': 'swapA',
    'ccnotDiv': 'cc_c1'
  };
  
  Object.keys(divMappings).forEach(divId => {
    const el = document.getElementById(divId);
    if (el && KEYWORD_DESCRIPTIONS[divMappings[divId]]) {
      el.classList.add('tooltip-trigger');
      el.setAttribute('data-tooltip-key', divMappings[divId]);
      el.style.cursor = 'help';
      el.style.position = 'relative';
      
      el.addEventListener('mouseenter', showKeywordTooltip);
      el.addEventListener('mouseleave', hideKeywordTooltip);
      el.addEventListener('mousemove', moveTooltip);
    }
  });
}

function showKeywordTooltip(e) {
  const key = e.currentTarget.getAttribute('data-tooltip-key');
  const info = KEYWORD_DESCRIPTIONS[key];
  if (!info) return;

  const tooltip = document.getElementById('keyword-tooltip');
  tooltip.querySelector('.tooltip-title').textContent = info.title;
  tooltip.querySelector('.tooltip-description').textContent = info.description;
  tooltip.style.display = 'block';
  moveTooltip(e);
}

function hideKeywordTooltip() {
  const tooltip = document.getElementById('keyword-tooltip');
  tooltip.style.display = 'none';
}

function moveTooltip(e) {
  const tooltip = document.getElementById('keyword-tooltip');
  const x = e.clientX + 15;
  const y = e.clientY + 15;
  
  // Keep tooltip in viewport
  const rect = tooltip.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - 20;
  const maxY = window.innerHeight - rect.height - 20;
  
  tooltip.style.left = Math.min(x, maxX) + 'px';
  tooltip.style.top = Math.min(y, maxY) + 'px';
}

// ---------- Gate Dropdown with Categories (Requirement 1) ----------
function initializeGateDropdownTooltips() {
  const gateSelect = document.getElementById('gateType');
  if (!gateSelect) return;

  // Create gate tooltip element
  let gateTooltip = document.getElementById('gate-tooltip');
  if (!gateTooltip) {
    gateTooltip = document.createElement('div');
    gateTooltip.id = 'gate-tooltip';
    gateTooltip.className = 'gate-tooltip';
    gateTooltip.innerHTML = `
      <div class="gate-tooltip-header"></div>
      <div class="gate-tooltip-description"></div>
      <div class="gate-tooltip-matrix"></div>
    `;
    document.body.appendChild(gateTooltip);
  }

  // Create custom dropdown with categories
  createCustomGateDropdown(gateSelect);
}

function createCustomGateDropdown(originalSelect) {
  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-gate-dropdown';
  
  // Create display element
  const display = document.createElement('div');
  display.className = 'gate-dropdown-display';
  display.textContent = originalSelect.options[originalSelect.selectedIndex]?.text || 'Select Gate';
  
  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'gate-dropdown-options';
  
  // Requirement 1: Define gate categories
  const categories = {
    'Single Qubit (Fixed)': ['X', 'Y', 'Z', 'H', 'S', 'Sdg', 'T', 'Tdg'],
    'Single Qubit (Parameterised)': ['Rx', 'Ry', 'Rz', 'Phase'],
    'Two Qubit': ['CNOT', 'CZ', 'SWAP'],
    'Three Qubit': ['CCNOT'],
    'Measurement': ['MEASURE']
  };
  
  // Create categorized options
  Object.entries(categories).forEach(([category, gates]) => {
    // Category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'gate-category-header';
    categoryHeader.textContent = category;
    optionsContainer.appendChild(categoryHeader);
    
    // Gate options in this category
    gates.forEach(gateValue => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'gate-dropdown-option';
      optionDiv.textContent = gateValue;
      optionDiv.setAttribute('data-value', gateValue);
      
      // Add hover events for tooltip
      optionDiv.addEventListener('mouseenter', (e) => showGateTooltip(e, gateValue));
      optionDiv.addEventListener('mouseleave', hideGateTooltip);
      optionDiv.addEventListener('mousemove', moveGateTooltip);
      
      // Click to select
      optionDiv.addEventListener('click', () => {
        originalSelect.value = gateValue;
        display.textContent = gateValue;
        optionsContainer.classList.remove('show');
        originalSelect.dispatchEvent(new Event('change'));
      });
      
      optionsContainer.appendChild(optionDiv);
    });
  });
  
  // Toggle dropdown
  display.addEventListener('click', () => {
    optionsContainer.classList.toggle('show');
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      optionsContainer.classList.remove('show');
    }
  });
  
  wrapper.appendChild(display);
  wrapper.appendChild(optionsContainer);
  
  // Insert after original select and hide original
  originalSelect.style.display = 'none';
  originalSelect.parentNode.insertBefore(wrapper, originalSelect.nextSibling);
  
  // Update display when original select changes programmatically
  const observer = new MutationObserver(() => {
    display.textContent = originalSelect.options[originalSelect.selectedIndex]?.text || 'Select Gate';
  });
  observer.observe(originalSelect, { attributes: true, childList: true });
}

function showGateTooltip(e, gateType) {
  const info = GATE_DESCRIPTIONS[gateType];
  if (!info) return;

  const tooltip = document.getElementById('gate-tooltip');
  tooltip.querySelector('.gate-tooltip-header').textContent = info.name;
  tooltip.querySelector('.gate-tooltip-description').textContent = info.description;
  tooltip.querySelector('.gate-tooltip-matrix').innerHTML = `<strong>Matrix:</strong> ${info.matrix}`;
  tooltip.style.display = 'block';
  moveGateTooltip(e);
}

function hideGateTooltip() {
  const tooltip = document.getElementById('gate-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

function moveGateTooltip(e) {
  const tooltip = document.getElementById('gate-tooltip');
  if (!tooltip) return;
  
  const x = e.clientX + 20;
  const y = e.clientY - 10;
  
  const rect = tooltip.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - 30;
  const maxY = window.innerHeight - rect.height - 20;
  
  tooltip.style.left = Math.min(x, maxX) + 'px';
  tooltip.style.top = Math.max(10, Math.min(y, maxY)) + 'px';
}

// ---------- QASM Generation (Requirement 4 - Fixed) ----------
function generateQASM(numQubits, gates, initialStates) {
  let qasm = "OPENQASM 2.0;\n";
  qasm += 'include "qelib1.inc";\n';
  qasm += `qreg q[${numQubits}];\n`;
  qasm += `creg c[${numQubits}];\n`;
  
  // Apply initial states (X gates for |1⟩ states)
  if (initialStates) {
    for (let i = 0; i < initialStates.length; i++) {
      if (initialStates[i] === 1) {
        qasm += `x q[${i}];\n`;
      }
    }
  }
  
  // Apply gates
  for (const gate of gates) {
    const type = gate.type;
    const params = gate.params || [];
    const angle = gate.angle;
    
    switch(type) {
      case 'X':
        qasm += `x q[${params[0]}];\n`;
        break;
      case 'Y':
        qasm += `y q[${params[0]}];\n`;
        break;
      case 'Z':
        qasm += `z q[${params[0]}];\n`;
        break;
      case 'H':
        qasm += `h q[${params[0]}];\n`;
        break;
      case 'S':
        qasm += `s q[${params[0]}];\n`;
        break;
      case 'Sdg':
        qasm += `sdg q[${params[0]}];\n`;
        break;
      case 'T':
        qasm += `t q[${params[0]}];\n`;
        break;
      case 'Tdg':
        qasm += `tdg q[${params[0]}];\n`;
        break;
      case 'Rx':
        qasm += `rx(${angle !== undefined ? angle.toFixed(6) : 0}) q[${params[0]}];\n`;
        break;
      case 'Ry':
        qasm += `ry(${angle !== undefined ? angle.toFixed(6) : 0}) q[${params[0]}];\n`;
        break;
      case 'Rz':
        qasm += `rz(${angle !== undefined ? angle.toFixed(6) : 0}) q[${params[0]}];\n`;
        break;
      case 'Phase':
        qasm += `u1(${angle !== undefined ? angle.toFixed(6) : 0}) q[${params[0]}];\n`;
        break;
      case 'CNOT':
        qasm += `cx q[${params[0]}],q[${params[1]}];\n`;
        break;
      case 'CZ':
        qasm += `cz q[${params[0]}],q[${params[1]}];\n`;
        break;
      case 'SWAP':
        qasm += `swap q[${params[0]}],q[${params[1]}];\n`;
        break;
      case 'CCNOT':
        qasm += `ccx q[${params[0]}],q[${params[1]}],q[${params[2]}];\n`;
        break;
      case 'MEASURE':
        // Measurement handled at the end
        break;
    }
  }
  
  // Add measurements at the end
  for (let i = 0; i < numQubits; i++) {
    qasm += `measure q[${i}] -> c[${i}];\n`;
  }
  
  return qasm;
}

// ---------- Display Backend Results (Requirement 4 - Fixed) ----------
function displayBackendResults(counts, qasm) {
  // Create or get backend results div
  let backendResultsDiv = document.getElementById('backendResults');
  if (!backendResultsDiv) {
    backendResultsDiv = document.createElement('div');
    backendResultsDiv.id = 'backendResults';
    backendResultsDiv.className = 'backend-results';
    if (resultsDiv) {
      resultsDiv.insertBefore(backendResultsDiv, resultsDiv.firstChild);
    }
  }
  
  let html = "<div class='result-block'><h3>💾 Backend Results</h3>";
  html += "<div class='backend-content'>";
  html += "<div class='backend-section'><strong>Backend Counts:</strong><br>";
  html += "<pre>" + JSON.stringify(counts, null, 2) + "</pre></div>";
  html += "<div class='backend-section'><strong>QASM:</strong><br>";
  html += "<pre>" + qasm.replace(/</g, '&lt;').replace(/>/g, '&gt;') + "</pre></div>";
  html += "</div></div>";
  
  backendResultsDiv.innerHTML = html;
  backendResultsDiv.style.display = 'block';

}

// ---------- Performance optimization for large qubits (Requirement 5) ----------
function initState(n) {
  const dim = 1 << n;
  
  // Performance check - warn for large qubit counts
  if (n > 10) {
    console.warn(`Large qubit count (${n}) may cause performance issues.`);
  }
  
  stateVec = new Array(dim);
  for (let i = 0; i < dim; i++) {
    stateVec[i] = c(0, 0);
  }
  
  // Get initial state from basis selector
  const basisValue = basisSelect ? basisSelect.value : '0'.repeat(n);
  const initIndex = parseInt(basisValue, 2) || 0;
  stateVec[initIndex] = c(1, 0);
  
  initStates = getInitStates(initIndex, n);
}

// ---------- Circuit Diagram Copy/Download Functions ----------
function addCircuitControls() {
  const existingControls = document.getElementById('circuit-controls');
  if (existingControls) existingControls.remove();
  
  const controls = document.createElement('div');
  controls.id = 'circuit-controls';
  controls.className = 'circuit-controls';
  controls.innerHTML = `
    <button onclick="copyCircuitToClipboard()" title="Copy circuit as image">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      Copy
    </button>
    <button onclick="downloadCircuitSVG()" title="Download as SVG">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7,10 12,15 17,10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      SVG
    </button>
    <button onclick="downloadCircuitPNG()" title="Download as PNG">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7,10 12,15 17,10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      PNG
    </button>
  `;
  
  if (container) {
    container.insertBefore(controls, container.firstChild.nextSibling);
  }
}

function copyCircuitToClipboard() {
  const svg = container.querySelector('svg');
  if (!svg) {
    showNotification('No circuit to copy!', 'error');
    return;
  }
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  
  img.onload = function() {
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(function(blob) {
      navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]).then(() => {
        showNotification('Circuit copied to clipboard!', 'success');
      }).catch(() => {
        showNotification('Failed to copy circuit', 'error');
      });
    });
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

function downloadCircuitSVG() {
  const svg = container.querySelector('svg');
  if (!svg) {
    showNotification('No circuit to download!', 'error');
    return;
  }
  
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quantum_circuit.svg';
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('SVG downloaded!', 'success');
}

function downloadCircuitPNG() {
  const svg = container.querySelector('svg');
  if (!svg) {
    showNotification('No circuit to download!', 'error');
    return;
  }
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  
  img.onload = function() {
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'quantum_circuit.png';
    a.click();
    
    showNotification('PNG downloaded!', 'success');
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

function showNotification(message, type = 'info') {
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2500);
}

// ---------- Dynamic Result Description Generator ----------
function generateDynamicDescription(stateVec, gateSequence, reducedList) {
  const n = Math.log2(stateVec.length);
  let description = "";
  
  // Analyze the circuit
  const gateCount = gateSequence.length;
  const gateTypes = [...new Set(gateSequence.map(g => g.type))];
  const hasEntanglingGates = gateSequence.some(g => ['CNOT', 'CZ', 'SWAP', 'CCNOT'].includes(g.type));
  const hasMeasurement = gateSequence.some(g => g.type === 'MEASURE');
  
  // Calculate state properties
  const probs = stateVec.map(v => math.abs(v) ** 2);
  const nonZeroStates = probs.filter(p => p > 1e-10).length;
  const maxProb = Math.max(...probs);
  const maxProbIndex = probs.indexOf(maxProb);
  const shannonEntropy = -probs.reduce((sum, p) => p > 0 ? sum + p * Math.log2(p) : sum, 0);
  
  // Check for special states
  const isUniformSuperposition = probs.every(p => Math.abs(p - 1/stateVec.length) < 0.01);
  const isBasisState = nonZeroStates === 1;
  const isBellState = n === 2 && nonZeroStates === 2 && probs.filter(p => Math.abs(p - 0.5) < 0.01).length === 2;
  const isGHZState = n >= 2 && nonZeroStates === 2 && 
    Math.abs(probs[0] - 0.5) < 0.01 && Math.abs(probs[probs.length-1] - 0.5) < 0.01;
  
  // Generate description
  description += `<div class="dynamic-description">`;
  description += `<h3>📊 Circuit Analysis & Results</h3>`;
  
  // Circuit summary
  description += `<div class="desc-section">`;
  description += `<h4>🔧 Circuit Overview</h4>`;
  description += `<p>Your ${n}-qubit circuit contains <strong>${gateCount} gate${gateCount !== 1 ? 's' : ''}</strong>`;
  if (gateTypes.length > 0) {
    description += ` (${gateTypes.join(', ')})`;
  }
  description += `.</p>`;
  
  if (hasEntanglingGates) {
    description += `<p>⚡ <strong>Entangling gates detected!</strong> Your circuit can create quantum entanglement between qubits.</p>`;
  }
  if (hasMeasurement) {
    description += `<p>📏 <strong>Measurement present:</strong> The circuit includes quantum measurement, collapsing superposition to classical outcomes.</p>`;
  }
  description += `</div>`;
  
  // State analysis
  description += `<div class="desc-section">`;
  description += `<h4>🌌 Final State Analysis</h4>`;
  
  if (isBasisState) {
    const basisStr = maxProbIndex.toString(2).padStart(n, '0');
    description += `<p>✨ The system is in a <strong>pure basis state |${basisStr}⟩</strong> with 100% probability.</p>`;
    description += `<p>This means each qubit has a definite classical value with no quantum superposition.</p>`;
  } else if (isUniformSuperposition) {
    description += `<p>🌈 The system is in a <strong>uniform superposition</strong> across all ${stateVec.length} basis states!</p>`;
    description += `<p>Each measurement outcome is equally likely (${(100/stateVec.length).toFixed(2)}% each). This is often the starting point for quantum algorithms like Grover's search.</p>`;
  } else if (isBellState) {
    description += `<p>🔗 <strong>Bell State Detected!</strong> Your qubits are maximally entangled.</p>`;
    description += `<p>Bell states are fundamental resources for quantum teleportation and quantum cryptography. Measuring one qubit instantly determines the other's state.</p>`;
  } else if (isGHZState) {
    description += `<p>🎯 <strong>GHZ-like State Detected!</strong> This is a multipartite entangled state.</p>`;
    description += `<p>GHZ states demonstrate quantum correlations that cannot be explained by classical physics and are used in quantum error correction.</p>`;
  } else {
    description += `<p>The system is in a <strong>superposition of ${nonZeroStates} basis states</strong>.</p>`;
    description += `<p>Most likely outcome: <strong>|${maxProbIndex.toString(2).padStart(n, '0')}⟩</strong> with ${(maxProb * 100).toFixed(2)}% probability.</p>`;
  }
  
  description += `<p>📈 <strong>Shannon Entropy:</strong> ${shannonEntropy.toFixed(4)} bits (measures uncertainty in measurement outcomes)</p>`;
  description += `</div>`;
  
  // Per-qubit analysis
  description += `<div class="desc-section">`;
  description += `<h4>🎱 Individual Qubit States</h4>`;
  
  for (let q = 0; q < reducedList.length; q++) {
    const bloc = densityToBloch(reducedList[q]);
    const r = Math.sqrt(bloc.x**2 + bloc.y**2 + bloc.z**2);
    const purity = (1 + r*r) / 2;
    const entropy = qubitEntropy(bloc.x, bloc.y, bloc.z);
    
    const p0 = reducedList[q][0][0].re;
    const p1 = reducedList[q][1][1].re;
    
    let qubitState = "";
    if (r > 0.99) {
      qubitState = "Pure state (no entanglement with other qubits)";
    } else if (r < 0.01) {
      qubitState = "Maximally mixed (maximally entangled)";
    } else {
      qubitState = `Partially mixed (partially entangled, r=${r.toFixed(3)})`;
    }
    
    description += `<div class="qubit-analysis">`;
    description += `<strong>Qubit ${q}:</strong> ${qubitState}`;
    description += `<ul>`;
    description += `<li>Bloch vector: (${bloc.x.toFixed(3)}, ${bloc.y.toFixed(3)}, ${bloc.z.toFixed(3)})</li>`;
    description += `<li>|0⟩ probability: ${(p0 * 100).toFixed(2)}%, |1⟩ probability: ${(p1 * 100).toFixed(2)}%</li>`;
    description += `<li>Purity: ${purity.toFixed(4)}, Entropy: ${entropy.toFixed(4)}</li>`;
    description += `</ul></div>`;
  }
  description += `</div>`;
  
  // Educational tips
  description += `<div class="desc-section tips">`;
  description += `<h4>💡 Understanding Your Results</h4>`;
  description += `<ul>`;
  description += `<li><strong>Bloch Sphere:</strong> Represents single-qubit states. Pure states lie on the surface (r=1), mixed states inside.</li>`;
  description += `<li><strong>Entropy:</strong> 0 = pure state (no uncertainty), 1 = maximally mixed (maximum uncertainty).</li>`;
  description += `<li><strong>Purity:</strong> 1 = pure state, 0.5 = maximally mixed for a single qubit.</li>`;
  if (hasEntanglingGates) {
    description += `<li><strong>Entanglement:</strong> When qubits are entangled, individual Bloch spheres show mixed states even if the total system is pure.</li>`;
  }
  description += `</ul></div>`;
  
  description += `</div>`;
  
  return description;
}

// ---------- Functions ----------
function drawHistogram(counts) {
  const histogramCanvas = document.getElementById('histogram');
  if (!histogramCanvas) {
    console.error('Canvas element with id "histogram" not found.');
    return;
  }
  const ctx = histogramCanvas.getContext('2d', { willReadFrequently: true });

  let labels = [];
  let values = [];
  if (!counts) counts = {};
  if (Array.isArray(counts)) {
    values = counts.slice();
    const n = Math.log2(values.length) || 1;
    labels = values.map((_, i) => i.toString(2).padStart(n, '0'));
  } else if (typeof counts === 'object') {
    labels = Object.keys(counts);
    values = labels.map(k => counts[k]);
  }

  const isDark = document.body.classList.contains('dark-mode');
  const backgroundColor = isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(54, 162, 235, 0.7)';
  const borderColor = isDark ? 'rgba(59, 130, 246, 1)' : 'rgba(54, 162, 235, 1)';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  if (histogramChart) {
    histogramChart.data.labels = labels;
    histogramChart.data.datasets[0].data = values;
    histogramChart.data.datasets[0].backgroundColor = backgroundColor;
    histogramChart.data.datasets[0].borderColor = borderColor;
    histogramChart.options.scales.x.ticks.color = textColor;
    histogramChart.options.scales.y.ticks.color = textColor;
    histogramChart.options.scales.x.title.color = textColor;
    histogramChart.options.scales.y.title.color = textColor;
    histogramChart.options.scales.x.grid.color = gridColor;
    histogramChart.options.scales.y.grid.color = gridColor;
    histogramChart.update();
    return;
  }

  histogramChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Measurement Counts',
        data: values,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: 'Bitstring Outcome', color: textColor },
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Counts', color: textColor },
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      },
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      }
    }
  });
}

// Requirement 5: Performance fix for large qubit counts
function onSet(){
  nQ = parseInt(numQInput.value) || 2;
  
  // Performance warning for large qubit counts
  if (nQ > 10) {
    const warningMsg = `Warning: ${nQ} qubits will create ${Math.pow(2, nQ)} states.\nThis may cause performance issues in your browser.\n\nDo you want to continue?`;
    if (!confirm(warningMsg)) {
      numQInput.value = 5;
      nQ = 5;
    }
  }
  
  if ((nQ >=1 && nQ <=15)) { 
    populateBasis(nQ);
    populateQubitSelectors(nQ);
    const initIndex = 0;
    initStates = getInitStates(initIndex, nQ);
    console.log("👉 Default initial state:", initStates);
    if (afterSet) afterSet.classList.remove('hidden');
    gateSequence = [];
    renderGateList();
    if (resultsDiv) resultsDiv.innerHTML = "<div class='small'>Initial state set. Add gates and click Run.</div>";
    if(!firstQubit){
      if (blochSpheresDiv) blochSpheresDiv.innerHTML = "<div class='grid'><p>Tensor products (&#8855;) are essential for describing subsystems composed of multiple quantum subsystems, where the state of the total system is given by the tensor product of the states of the individual subsystems</p></div>";
      firstQubit = true;
    }
    if (blochSpheresDiv) blochSpheresDiv.innerHTML = "";
    if (resultsDiv) resultsDiv.innerHTML = "";
    if (container) container.innerHTML = "<h2>Circuit Diagram</h2>";
    if (customQubitContainer) customQubitContainer.classList.add("hidden");
    if (btnRun) btnRun.classList.remove("hidden");
    if (stateBarChart) stateBarChart.classList.add("hidden");
  } else {
    // For very large qubit counts, limit to 15 for browser performance
    if (nQ > 15) {
      alert("Maximum 15 qubits supported for browser simulation due to performance constraints.");
      numQInput.value = 15;
      nQ = 15;
      onSet(); // Recursively call with corrected value
      return;
    }
    
    populateBasis(nQ);
    populateQubitSelectors(nQ);
    const initIndex = 0;
    initStates = getInitStates(initIndex, nQ);
    console.log("👉 Default initial state:", initStates);
    if (afterSet) afterSet.classList.remove('hidden');
    gateSequence = [];
    renderGateList();
    if (resultsDiv) resultsDiv.innerHTML = "<div class='small'>Initial state set. Add gates and click Run.</div>";
    if(!firstQubit){
      if (blochSpheresDiv) blochSpheresDiv.innerHTML = "<div class='grid'><p>Tensor products (&#8855;) are essential for describing subsystems composed of multiple quantum subsystems, where the state of the total system is given by the tensor product of the states of the individual subsystems</p></div>";
      firstQubit = true;
    }
    if (blochSpheresDiv) blochSpheresDiv.innerHTML = "";
    if (resultsDiv) resultsDiv.innerHTML = "";
    if (container) container.innerHTML = "<h2>Circuit Diagram</h2>";

    if (customQubitContainer) customQubitContainer.classList.remove("hidden");
    if (btnRun) btnRun.classList.add("hidden");
    const qubitSelect = document.getElementById("qubitSelect");
    if (qubitSelect) {
      qubitSelect.innerHTML = "";
      for (let i = 0; i < nQ; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = "q" + i;
        if(i===0){
          opt.selected = true;
        }
        qubitSelect.appendChild(opt);
      }
    }
  }
}

// Requirement 5: Optimize basis population for large qubit counts
function populateBasis(n){
  if (!basisSelect) return;
  basisSelect.innerHTML = "";
  
  // Limit options for large qubit counts
  const maxOptions = Math.min(1 << n, 256); // Max 256 options
  
  for (let i = 0; i < maxOptions; i++){
    const opt = document.createElement('option');
    opt.value = i.toString(2).padStart(n, '0');
    opt.innerHTML = opt.value.split('').map(bit => `|${bit}⟩ `).join(' &#8855; ');
    basisSelect.appendChild(opt);
  }
  
  if (maxOptions < (1 << n)) {
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.textContent = `... and ${(1 << n) - maxOptions} more states`;
    basisSelect.appendChild(opt);
  }
  
  basisSelect.value = '0'.repeat(n);
}

function populateQubitSelectors(n){
  const sels = [targetQ, controlQ, targetQ2, swapA, swapB, cc_c1, cc_c2, cc_t];
  sels.forEach(s => {
    if (s) {
      s.innerHTML = '';
      for (let i=0;i<n;i++){
        const opt = document.createElement('option');
        opt.value = i;
        opt.text = 'q' + i;
        s.appendChild(opt);
      }
    }
  });
}

function initState(nQ){
  const dim = 1<<nQ;
  const initIndex = parseInt(basisSelect.value || "0", 2);
  stateVec = Array(dim).fill(0).map(()=>c(0,0));
  stateVec[initIndex] = c(1,0);
  initStates = getInitStates(initIndex,nQ);
}

function plotQSphere(divId, stateVec) {
  const colors = getPlotColors();
  const nQ = Math.log2(stateVec.length);
  const spikeTraces = [];
  const tipTraces = [];
  const latitudeTraces = [];
  const labelX = [];
  const labelY = [];
  const labelZ = [];
  const labelText = [];

  const coords = [];
  const phases = [];
  const probs = [];

  for (let i = 0; i < stateVec.length; i++) {
    const amp = stateVec[i];
    const re = amp.re, im = amp.im;
    const prob = re*re + im*im;
    const phase = Math.atan2(im, re);
    const weightStr = i.toString(2).padStart(nQ,'0');

    const hamming = weightStr.split('').filter(q => q==='1').length;
    const theta = (hamming / nQ) * Math.PI;
    const phi = 2 * Math.PI * i / stateVec.length;

    const r = 1.0;
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);

    coords.push([x, y, z]);
    phases.push(phase);
    probs.push(prob);

    labelX.push(x);
    labelY.push(y);
    labelZ.push(z);
    labelText.push(`|${weightStr}⟩`);

    spikeTraces.push({
      type:"scatter3d",
      mode:"lines",
      x:[0, x], y:[0, y], z:[0, z],
      line:{color:`hsl(${(phase*180/Math.PI+360)%360},80%,50%)`, width:1 + 8*prob},
      opacity:0.8,
      hoverinfo:"skip",
      showlegend : false
    });

    tipTraces.push({
      type: "scatter3d",
      mode: "markers",
      x: [x], y: [y], z: [z],
      marker: {size: 5 + 20*prob, color:`hsl(${(phase*180/Math.PI+360)%360},80%,40%)`},
      text: `|${weightStr}⟩<br>amp=${re.toFixed(2)} + ${im.toFixed(2)}i<br>P=${prob.toFixed(2)}<br>phase=${phase.toFixed(2)}`,
      hoverinfo: "text",
      showlegend : false
    });
  }
  
  const SPHERE_POINTS = 60;
  for (let k = 0; k <= nQ; k++) {
    const theta = (k / nQ) * Math.PI;
    const latX = [], latY = [], latZ = [];
    for (let p = 0; p <= SPHERE_POINTS; p++) {
      const phi = (p / SPHERE_POINTS) * 2 * Math.PI;
      latX.push(Math.sin(theta)*Math.cos(phi));
      latY.push(Math.sin(theta)*Math.sin(phi));
      latZ.push(Math.cos(theta));
    }
    latitudeTraces.push({
      type:"scatter3d",
      mode:"lines",
      x:latX, y:latY, z:latZ,
      line:{color:"gray", width:1},
      opacity:0.2,
      hoverinfo:"skip",
      showlegend:false
    });
  }

  const U = 30, V = 30;
  const xs = [], ys = [], zs = [];
  for (let i = 0; i <= U; i++) {
    const theta = Math.PI * i / U;
    const rowX = [], rowY = [], rowZ = [];
    for (let j = 0; j <= V; j++) {
      const phi = 2*Math.PI*j/V;
      rowX.push(Math.sin(theta)*Math.cos(phi));
      rowY.push(Math.sin(theta)*Math.sin(phi));
      rowZ.push(Math.cos(theta));
    }
    xs.push(rowX); ys.push(rowY); zs.push(rowZ);
  }

  const sphereSurface = {
    type:'surface', x:xs, y:ys, z:zs,
    opacity:0.2,
    colorscale:[[0,'rgba(228,246,253,0.87)'], [1,'rgba(248,200,244,0.5)']],
    showscale:false,
    contours: {
      x: { show: true, color: "#5a56568a", width: 20 },
      y: { show: true, color: "#5a565680", width: 20},
      z: { show: true, color: "#5a565685", width:20 }
    },
    hoverinfo:'skip',
    showlegend:false
  };
  
  // Update label traces text color using theme colors
  const labelTracesWithColors = {
    type:"scatter3d",
    mode:"text",
    x:labelX, y:labelY, z:labelZ,
    text:labelText,
    textposition:"top center",
    textfont:{size: 12, color: colors.text},
    hoverinfo:"skip",
    showlegend:false
  };
  
  const layout = {
    title: {
      text: "Q-Sphere<br><span style='font-size:12px'>size(Dot) → probability | color(Dot) → Phase</span>",
      font: { color: colors.text, size: 16 }
    },
    margin:{l:0,r:0,b:0,t:60},
    scene:{
      aspectmode:'cube',
      xaxis:{range:[-1.3,1.3],showgrid:false,zeroline:false,showticklabels:false,visible:false},
      yaxis:{range:[-1.3,1.3],showgrid:false,zeroline:false,showticklabels:false,visible:false},
      zaxis:{range:[-1.3,1.3],showgrid:false,zeroline:false,showticklabels:false,visible:false},
      camera:{eye:{x:0.8,y:0.8,z:0.8}},
      bgcolor: colors.scene
    },
    paper_bgcolor: colors.paper,
    plot_bgcolor: colors.plot
  };
  
  const data = [...spikeTraces, ...tipTraces, ...latitudeTraces, sphereSurface, labelTracesWithColors];
  Plotly.newPlot(divId, data, layout, {responsive: true});
}

function onGateTypeChange(){
  if (!gateType) return;
  const type = gateType.value;
  
  // hide all specific input groups first
  if (singleTargetDiv) singleTargetDiv.classList.add('hidden');
  if (cnotDiv) cnotDiv.classList.add('hidden');
  if (swapDiv) swapDiv.classList.add('hidden');
  if (ccnotDiv) ccnotDiv.classList.add('hidden');
  if (angleDiv) angleDiv.classList.add('hidden');

  // also hide individual selects and their preceding labels as a defensive fallback
  const idsToHide = ['targetQ','controlQ','targetQ2','swapA','swapB','cc_c1','cc_c2','cc_t'];
  idsToHide.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
    // hide label nodes associated with this control (previous sibling label)
    const label = el ? el.previousElementSibling : null;
    if (label && label.tagName === 'LABEL') label.style.display = 'none';
  });

  if (['X','Y','Z','H','S','Sdg','T','Tdg','Rx','Ry','Rz','Phase','MEASURE'].includes(type)){
  if (singleTargetDiv) singleTargetDiv.classList.remove('hidden');
  const el = document.getElementById('targetQ'); if (el) { el.style.display = ''; const lbl = el.previousElementSibling; if (lbl && lbl.tagName==='LABEL') lbl.style.display = ''; }
  }
  if (['Rx','Ry','Rz','Phase'].includes(type)){
    if (angleDiv) angleDiv.classList.remove('hidden');
    angleLabel.textContent = (type==='Phase') ? 'φ (degrees):' : 'θ (degrees):';
  }
  if (type === 'CNOT' || type === 'CZ'){
  if (cnotDiv) cnotDiv.classList.remove('hidden');
  const cEl = document.getElementById('controlQ'); if (cEl) { cEl.style.display = ''; const lbl = cEl.previousElementSibling; if (lbl && lbl.tagName==='LABEL') lbl.style.display = ''; }
  const t2El = document.getElementById('targetQ2'); if (t2El) { t2El.style.display = ''; const lbl2 = t2El.previousElementSibling; if (lbl2 && lbl2.tagName==='LABEL') lbl2.style.display = ''; }
  }
  if (type === 'SWAP'){
  if (swapDiv) swapDiv.classList.remove('hidden');
  const aEl = document.getElementById('swapA'); if (aEl) { aEl.style.display = ''; const lblA = aEl.previousElementSibling; if (lblA && lblA.tagName==='LABEL') lblA.style.display = ''; }
  const bEl = document.getElementById('swapB'); if (bEl) { bEl.style.display = ''; const lblB = bEl.previousElementSibling; if (lblB && lblB.tagName==='LABEL') lblB.style.display = ''; }
  }
  if (type === 'CCNOT'){
  if (ccnotDiv) ccnotDiv.classList.remove('hidden');
  const c1El = document.getElementById('cc_c1'); if (c1El) { c1El.style.display = ''; const l1 = c1El.previousElementSibling; if (l1 && l1.tagName==='LABEL') l1.style.display = ''; }
  const c2El = document.getElementById('cc_c2'); if (c2El) { c2El.style.display = ''; const l2 = c2El.previousElementSibling; if (l2 && l2.tagName==='LABEL') l2.style.display = ''; }
  const tEl = document.getElementById('cc_t'); if (tEl) { tEl.style.display = ''; const lt = tEl.previousElementSibling; if (lt && lt.tagName==='LABEL') lt.style.display = ''; }
  }
}

function onAddGate(){
  if (!gateType) return;
  const type = gateType.value;
  let gate = { type, params: [] };

  if (['X','Y','Z','H','S','Sdg','T','Tdg','Rx','Ry','Rz','Phase','MEASURE'].includes(type)){
    const t = parseInt(targetQ.value);
    gate.params = [t];
    if (['Rx','Ry','Rz','Phase'].includes(type)){
      gate.angle = (parseFloat(angleDeg.value) || 0) * Math.PI/180;
    }
  } else if (type === 'CNOT' || type === 'CZ'){
    const c = parseInt(controlQ.value), t = parseInt(targetQ2.value);
    if (c === t) { alert("Control and target must be different"); return; }
    gate.params = [c, t];
  } else if (type === 'SWAP'){
    const a = parseInt(swapA.value), b = parseInt(swapB.value);
    if (a === b) { alert("Choose two different qubits"); return; }
    gate.params = [a, b];
  } else if (type === 'CCNOT'){
    const c1 = parseInt(cc_c1.value), c2 = parseInt(cc_c2.value), t = parseInt(cc_t.value);
    const set = new Set([c1,c2,t]);
    if (set.size < 3) { alert("Controls and target must be all different"); return; }
    if (nQ < 3) { alert("CCNOT needs at least 3 qubits"); return; }
    gate.params = [c1, c2, t];
  }

  gateSequence.push(gate);
  renderGateList();
  addGate(gate);
}

function addGate(gate) {
  renderCircuit(nQ, gateSequence);
}

function renderCircuit(numQubits, gates) {
  if (!container) return;
  
  const numClassical = numQubits;
  container.innerHTML = "<h2>Circuit Diagram</h2>";

  // Add circuit controls (copy/download buttons)
  addCircuitControls();

  // Create scrollable wrapper
  const scrollWrapper = document.createElement('div');
  scrollWrapper.className = 'circuit-scroll-wrapper';

  const width = Math.max(400, 120 * (gates.length + 2));
  const qheight = 60;
  const cHeight = 40;
  const height = numQubits * qheight + numClassical * cHeight + 80;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("class", "circuit-svg");

  // Check dark mode for SVG colors
  const isDark = document.body.classList.contains('dark-mode');
  const bgColor = isDark ? '#1e293b' : '#fafafa';
  const wireColor = isDark ? '#94a3b8' : '#333';
  const textColor = isDark ? '#e2e8f0' : '#333';
  const classicalWireColor = isDark ? '#60a5fa' : '#0066cc';

  // Background
  const bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("width", "100%");
  bg.setAttribute("height", "100%");
  bg.setAttribute("fill", bgColor);
  svg.appendChild(bg);

  // Draw quantum wires
  for (let q = 0; q < numQubits; q++) {
    const y = 40 + q * qheight;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", 50);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width - 20);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", wireColor);
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);

    // Initial state indicator
    const initState = document.createElementNS(svgNS, "text");
    initState.setAttribute("x", 10);
    initState.setAttribute("y", y + 5);
    initState.setAttribute("font-family", "monospace");
    initState.setAttribute("font-size", "14");
    initState.setAttribute("fill", textColor);
    initState.textContent = `q${q}: |0⟩`;
    svg.appendChild(initState);
  }
  
  const startY = numQubits * qheight + 60;
  
  // Draw classical registers
  for (let c = 0; c < numClassical; c++) {
    const y = startY + c * cHeight;
    
    // Double line for classical wire
    const line1 = document.createElementNS(svgNS, "line");
    line1.setAttribute("x1", 50);
    line1.setAttribute("y1", y - 2);
    line1.setAttribute("x2", width - 20);
    line1.setAttribute("y2", y - 2);
    line1.setAttribute("stroke", classicalWireColor);
    line1.setAttribute("stroke-width", "1.5");
    svg.appendChild(line1);

    const line2 = document.createElementNS(svgNS, "line");
    line2.setAttribute("x1", 50);
    line2.setAttribute("y1", y + 2);
    line2.setAttribute("x2", width - 20);
    line2.setAttribute("y2", y + 2);
    line2.setAttribute("stroke", classicalWireColor);
    line2.setAttribute("stroke-width", "1.5");
    svg.appendChild(line2);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", 10);
    text.setAttribute("y", y + 5);
    text.setAttribute("font-family", "monospace");
    text.setAttribute("font-size", "12");
    text.setAttribute("fill", classicalWireColor);
    text.textContent = `c${c}`;
    svg.appendChild(text);
  }

  // Draw gates
  gates.forEach((g, i) => {
    const x = 120 + i * 110;

    // Single-qubit gates
    if (["X", "Y", "Z", "H", "S", "T", "Sdg", "Tdg", "Rx", "Ry", "Rz", "Phase"].includes(g.type)) {
      const y = 40 + g.params[0] * qheight;

      // Gate background with gradient effect
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", x - 25);
      rect.setAttribute("y", y - 25);
      rect.setAttribute("width", 50);
      rect.setAttribute("height", 50);
      rect.setAttribute("rx", "5");
      rect.setAttribute("ry", "5");
      rect.setAttribute("fill", getGateColor(g.type));
      rect.setAttribute("stroke", "#333");
      rect.setAttribute("stroke-width", "2");
      svg.appendChild(rect);

      const label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", x);
      label.setAttribute("y", y + 5);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "16");
      label.setAttribute("font-weight", "bold");
      label.setAttribute("font-family", "monospace");
      label.setAttribute("fill", "#000");
      
      if (["Rx", "Ry", "Rz", "Phase"].includes(g.type)) {
        const angleDeg = g.angle ? (g.angle * 180 / Math.PI).toFixed(0) : "";
        label.textContent = g.type;
        label.setAttribute("y", y);
        
        const angleText = document.createElementNS(svgNS, "text");
        angleText.setAttribute("x", x);
        angleText.setAttribute("y", y + 15);
        angleText.setAttribute("text-anchor", "middle");
        angleText.setAttribute("font-size", "10");
        angleText.setAttribute("font-family", "monospace");
        angleText.textContent = `${angleDeg}°`;
        svg.appendChild(angleText);
      } else {
        label.textContent = g.type;
      }
      svg.appendChild(label);
    }

    // CNOT
    if (g.type === "CNOT") {
      const c = g.params[0];
      const t = g.params[1];
      const yc = 40 + c * qheight;
      const yt = 40 + t * qheight;

      // Vertical line
      const lineV = document.createElementNS(svgNS, "line");
      lineV.setAttribute("x1", x);
      lineV.setAttribute("y1", Math.min(yc, yt));
      lineV.setAttribute("x2", x);
      lineV.setAttribute("y2", Math.max(yc, yt));
      lineV.setAttribute("stroke", "#333");
      lineV.setAttribute("stroke-width", "2");
      svg.appendChild(lineV);

      // Control dot
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", yc);
      dot.setAttribute("r", 8);
      dot.setAttribute("fill", "#333");
      svg.appendChild(dot);

      // Target (⊕)
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", yt);
      circle.setAttribute("r", 18);
      circle.setAttribute("stroke", "#333");
      circle.setAttribute("stroke-width", "2");
      circle.setAttribute("fill", "#e8f4ea");
      svg.appendChild(circle);

      const lineH = document.createElementNS(svgNS, "line");
      lineH.setAttribute("x1", x - 12);
      lineH.setAttribute("y1", yt);
      lineH.setAttribute("x2", x + 12);
      lineH.setAttribute("y2", yt);
      lineH.setAttribute("stroke", "#333");
      lineH.setAttribute("stroke-width", "2");
      svg.appendChild(lineH);

      const lineV2 = document.createElementNS(svgNS, "line");
      lineV2.setAttribute("x1", x);
      lineV2.setAttribute("y1", yt - 12);
      lineV2.setAttribute("x2", x);
      lineV2.setAttribute("y2", yt + 12);
      lineV2.setAttribute("stroke", "#333");
      lineV2.setAttribute("stroke-width", "2");
      svg.appendChild(lineV2);
    }
    
    // CZ
    if (g.type === "CZ") {
      const c = g.params[0];
      const t = g.params[1];
      const yc = 40 + c * qheight;
      const yt = 40 + t * qheight;

      const lineV = document.createElementNS(svgNS, "line");
      lineV.setAttribute("x1", x);
      lineV.setAttribute("y1", Math.min(yc, yt));
      lineV.setAttribute("x2", x);
      lineV.setAttribute("y2", Math.max(yc, yt));
      lineV.setAttribute("stroke", "#333");
      lineV.setAttribute("stroke-width", "2");
      svg.appendChild(lineV);

      [yc, yt].forEach(y => {
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);
        dot.setAttribute("r", 8);
        dot.setAttribute("fill", "#333");
        svg.appendChild(dot);
      });
    }

    // SWAP
    if (g.type === "SWAP") {
      const a = g.params[0];
      const b = g.params[1];
      const ya = 40 + a * qheight;
      const yb = 40 + b * qheight;

      const lineV = document.createElementNS(svgNS, "line");
      lineV.setAttribute("x1", x);
      lineV.setAttribute("y1", Math.min(ya, yb));
      lineV.setAttribute("x2", x);
      lineV.setAttribute("y2", Math.max(ya, yb));
      lineV.setAttribute("stroke", "#333");
      lineV.setAttribute("stroke-width", "2");
      svg.appendChild(lineV);

      [ya, yb].forEach(y => {
        const line1 = document.createElementNS(svgNS, "line");
        line1.setAttribute("x1", x - 12);
        line1.setAttribute("y1", y - 12);
        line1.setAttribute("x2", x + 12);
        line1.setAttribute("y2", y + 12);
        line1.setAttribute("stroke", "#0066cc");
        line1.setAttribute("stroke-width", "3");
        svg.appendChild(line1);

        const line2 = document.createElementNS(svgNS, "line");
        line2.setAttribute("x1", x - 12);
        line2.setAttribute("y1", y + 12);
        line2.setAttribute("x2", x + 12);
        line2.setAttribute("y2", y - 12);
        line2.setAttribute("stroke", "#0066cc");
        line2.setAttribute("stroke-width", "3");
        svg.appendChild(line2);
      });
    }

    // CCNOT (Toffoli)
    if (g.type === "CCNOT") {
      const c1 = g.params[0];
      const c2 = g.params[1];
      const t = g.params[2];
      const y1 = 40 + c1 * qheight;
      const y2 = 40 + c2 * qheight;
      const yt = 40 + t * qheight;

      const minY = Math.min(y1, y2, yt);
      const maxY = Math.max(y1, y2, yt);

      const lineV = document.createElementNS(svgNS, "line");
      lineV.setAttribute("x1", x);
      lineV.setAttribute("y1", minY);
      lineV.setAttribute("x2", x);
      lineV.setAttribute("y2", maxY);
      lineV.setAttribute("stroke", "#333");
      lineV.setAttribute("stroke-width", "2");
      svg.appendChild(lineV);

      [y1, y2].forEach(yc => {
        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", yc);
        dot.setAttribute("r", 8);
        dot.setAttribute("fill", "#333");
        svg.appendChild(dot);
      });

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", yt);
      circle.setAttribute("r", 18);
      circle.setAttribute("stroke", "#333");
      circle.setAttribute("stroke-width", "2");
      circle.setAttribute("fill", "#ffe8e8");
      svg.appendChild(circle);

      const lineH = document.createElementNS(svgNS, "line");
      lineH.setAttribute("x1", x - 12);
      lineH.setAttribute("y1", yt);
      lineH.setAttribute("x2", x + 12);
      lineH.setAttribute("y2", yt);
      lineH.setAttribute("stroke", "#333");
      lineH.setAttribute("stroke-width", "2");
      svg.appendChild(lineH);

      const lineV2 = document.createElementNS(svgNS, "line");
      lineV2.setAttribute("x1", x);
      lineV2.setAttribute("y1", yt - 12);
      lineV2.setAttribute("x2", x);
      lineV2.setAttribute("y2", yt + 12);
      lineV2.setAttribute("stroke", "#333");
      lineV2.setAttribute("stroke-width", "2");
      svg.appendChild(lineV2);
    }
    
    // MEASURE
    if (g.type === "MEASURE") {
      const q = g.params[0];
      const yq = 40 + q * qheight;
      const yc = startY + q * cHeight;

      // Measurement box
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", x - 22);
      rect.setAttribute("y", yq - 22);
      rect.setAttribute("width", 44);
      rect.setAttribute("height", 44);
      rect.setAttribute("rx", "5");
      rect.setAttribute("fill", "#fff3cd");
      rect.setAttribute("stroke", "#333");
      rect.setAttribute("stroke-width", "2");
      svg.appendChild(rect);

      // Meter arc
      const arc = document.createElementNS(svgNS, "path");
      arc.setAttribute("d", `M ${x-12} ${yq+8} A 12 12 0 0 1 ${x+12} ${yq+8}`);
      arc.setAttribute("stroke", "#333");
      arc.setAttribute("stroke-width", "2");
      arc.setAttribute("fill", "none");
      svg.appendChild(arc);

      // Meter needle
      const needle = document.createElementNS(svgNS, "line");
      needle.setAttribute("x1", x);
      needle.setAttribute("y1", yq + 8);
      needle.setAttribute("x2", x + 8);
      needle.setAttribute("y2", yq - 8);
      needle.setAttribute("stroke", "#333");
      needle.setAttribute("stroke-width", "2");
      svg.appendChild(needle);

      // Connection to classical wire
      const classicalLine = document.createElementNS(svgNS, "line");
      classicalLine.setAttribute("x1", x);
      classicalLine.setAttribute("y1", yq + 22);
      classicalLine.setAttribute("x2", x);
      classicalLine.setAttribute("y2", yc);
      classicalLine.setAttribute("stroke", "#0066cc");
      classicalLine.setAttribute("stroke-dasharray", "4");
      classicalLine.setAttribute("stroke-width", "2");
      svg.appendChild(classicalLine);

      // Arrow head
      const arrow = document.createElementNS(svgNS, "polygon");
      arrow.setAttribute("points", `${x},${yc} ${x-5},${yc-10} ${x+5},${yc-10}`);
      arrow.setAttribute("fill", "#0066cc");
      svg.appendChild(arrow);
    }
    
    // Draw identity gates for unaffected qubits
    for (let q = 0; q < numQubits; q++) {
      let isTarget = false;
      if (["X","Y","Z","H","S","T","Sdg","Tdg","Rx","Ry","Rz","Phase","MEASURE"].includes(g.type)) {
        isTarget = (q === g.params[0]);
      } else if (["CNOT", "CZ"].includes(g.type)) {
        isTarget = (q === g.params[0] || q === g.params[1]);
      } else if (g.type === "CCNOT") {
        isTarget = (q === g.params[0] || q === g.params[1] || q === g.params[2]);
      } else if (g.type === "SWAP"){
        isTarget = (q === g.params[0] || q === g.params[1]);
      }
      
      if (!isTarget) {
        const y = 40 + q * qheight;
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", x - 12);
        rect.setAttribute("y", y - 12);
        rect.setAttribute("width", 24);
        rect.setAttribute("height", 24);
        rect.setAttribute("rx", "3");
        rect.setAttribute("fill", "#f5f5f5");
        rect.setAttribute("stroke", "#ccc");
        rect.setAttribute("stroke-width", "1");
        svg.appendChild(rect);

        const label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y + 5);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "12");
        label.setAttribute("font-family", "monospace");
        label.setAttribute("fill", "#999");
        label.textContent = "I";
        svg.appendChild(label);
      }
    }
  });

  scrollWrapper.appendChild(svg);
  container.appendChild(scrollWrapper);
  currentSvgElement = svg;
}

function getGateColor(gateType) {
  const colors = {
    X: "#ffcccb",
    Y: "#c8e6c9",
    Z: "#bbdefb",
    H: "#fff9c4",
    S: "#e1bee7",
    Sdg: "#d1c4e9",
    T: "#b2dfdb",
    Tdg: "#b2ebf2",
    Rx: "#ffccbc",
    Ry: "#dcedc8",
    Rz: "#b3e5fc",
    Phase: "#f8bbd9"
  };
  return colors[gateType] || "#e0e0e0";
}

function onUndo(){
  gateSequence.pop();
  renderGateList();
  if (container) container.innerHTML = "<h2>Circuit Diagram</h2>";
  if (blochSpheresDiv) blochSpheresDiv.innerHTML = "";
  if (resultsDiv) resultsDiv.innerHTML = "";
  renderCircuit(nQ, gateSequence);
}

function onClearGates(){
  gateSequence = [];
  renderGateList();
  if (container) container.innerHTML = "<h2>Circuit Diagram</h2>";
  if (blochSpheresDiv) blochSpheresDiv.innerHTML = "";
  if (resultsDiv) resultsDiv.innerHTML = "";
}

function renderGateList(){
  if (!gatesListDiv) return;
  gatesListDiv.innerHTML = "";
  if (gateSequence.length === 0){
    gatesListDiv.innerHTML = "<div class='small'>No gates added yet.</div>";
    return;
  }
  
  gateSequence.forEach((g,i)=>{
    const d = document.createElement('div');
    d.className = "gate-item";

    const left = document.createElement('div');
    left.className = 'gate-left';
    let desc = `${i+1}. ${g.type}`;
    if (g.params?.length){
      desc += ` (${g.params.map(p => 'q'+p).join(', ')})`;
    }
    if (g.angle !== undefined){
      const deg = (g.angle*180/Math.PI).toFixed(1);
      desc += ` @ ${deg}°`;
    }
    left.textContent = desc;

    const right = document.createElement('div');
    right.className = 'gate-right';

    const up = document.createElement('button');
    up.textContent = '↑';
    up.title = 'Move up';
    up.onclick = ()=>{
      if(i>0){
        [gateSequence[i-1],gateSequence[i]]=[gateSequence[i],gateSequence[i-1]];
        renderGateList();
        if (container) container.innerHTML = "<h2>Circuit Diagram</h2>";
        renderCircuit(nQ,gateSequence);
        if (blochSpheresDiv) blochSpheresDiv.innerHTML = "";
        if (resultsDiv) resultsDiv.innerHTML = "";
      }
    };

    const down = document.createElement('button');
    down.textContent = '↓';
    down.title = 'Move down';
    down.onclick = ()=>{
      if(i<gateSequence.length-1){
        [gateSequence[i+1],gateSequence[i]]=[gateSequence[i],gateSequence[i+1]];
        renderGateList();
        if (container) container.innerHTML = "<h2>Circuit Diagram</h2>";
        renderCircuit(nQ,gateSequence);
        if (blochSpheresDiv) blochSpheresDiv.innerHTML = "";
        if (resultsDiv) resultsDiv.innerHTML = "";
      }
    };

    const rm = document.createElement('button');
    rm.textContent = '✕';
    rm.title = 'Remove gate';
    rm.className = 'rm';
    rm.onclick = ()=>{
      gateSequence.splice(i,1);
      renderGateList();
      if (container) container.innerHTML = "<h2>Circuit Diagram</h2>";
      renderCircuit(nQ,gateSequence);
      if (blochSpheresDiv) blochSpheresDiv.innerHTML = "";
      if (resultsDiv) resultsDiv.innerHTML = "";
    };

    right.appendChild(up);
    right.appendChild(down);
    right.appendChild(rm);

    d.appendChild(left);
    d.appendChild(right);
    gatesListDiv.appendChild(d);
  });
}

// ---------- Quantum ops ----------
function applySingleQubitGate(psi, n, target, U){
  const dim = psi.length;
  const out = Array(dim).fill(0).map(()=>c(0,0));
  for (let i=0;i<dim;i++){
    const bin = i.toString(2).padStart(n, '0');
    const bit = parseInt(bin[target]);
    for (let j=0;j<2;j++){
      const newBin = bin.substring(0,target) + j.toString() + bin.substring(target+1);
      const idx = parseInt(newBin, 2);
      const coeff = U[j][bit];
      out[idx] = math.add(out[idx], math.multiply(coeff, psi[i]));
    }
  }
  return out;
}

function applyCNOT(psi, n, control, target){
  const dim = psi.length;
  const out = Array(dim).fill(0).map(()=>c(0,0));
  for (let i=0;i<dim;i++){
    const bin = i.toString(2).padStart(n, '0');
    if (bin[control] === '1'){
      const flippedBit = bin[target] === '1' ? '0' : '1';
      const newBin = bin.substring(0,target) + flippedBit + bin.substring(target+1);
      const idx = parseInt(newBin, 2);
      out[idx] = math.add(out[idx], psi[i]);
    } else {
      out[i] = math.add(out[i], psi[i]);
    }
  }
  return out;
}

function applyCZ(psi, n, control, target){
  const dim = psi.length;
  const out = Array(dim).fill(0).map(()=>c(0,0));
  for (let i=0;i<dim;i++){
    const bin = i.toString(2).padStart(n, '0');
    const phase = (bin[control]==='1' && bin[target]==='1') ? c(-1,0) : c(1,0);
    out[i] = math.add(out[i], math.multiply(phase, psi[i]));
  }
  return out;
}

function applySWAP(psi, n, a, b){
  if (a===b) return psi.slice();
  const dim = psi.length;
  const out = Array(dim).fill(0).map(()=>c(0,0));
  for (let i=0;i<dim;i++){
    const bin = i.toString(2).padStart(n, '0');
    if (bin[a] === bin[b]){
      out[i] = math.add(out[i], psi[i]);
    } else {
      const swapped = bin.substring(0, Math.min(a,b))
        + (a<b ? bin[b] : bin[a])
        + bin.substring(Math.min(a,b)+1, Math.max(a,b))
        + (a<b ? bin[a] : bin[b])
        + bin.substring(Math.max(a,b)+1);
      const idx = parseInt(swapped, 2);
      out[idx] = math.add(out[idx], psi[i]);
    }
  }
  return out;
}

function applyCCNOT(psi, n, c1, c2, t){
  const dim = psi.length;
  const out = Array(dim).fill(0).map(()=>c(0,0));
  for (let i=0;i<dim;i++){
    const bin = i.toString(2).padStart(n, '0');
    if (bin[c1]==='1' && bin[c2]==='1'){
      const flippedBit = bin[t] === '1' ? '0' : '1';
      const newBin = bin.substring(0,t) + flippedBit + bin.substring(t+1);
      const idx = parseInt(newBin, 2);
      out[idx] = math.add(out[idx], psi[i]);
    } else {
      out[i] = math.add(out[i], psi[i]);
    }
  }
  return out;
}

// ---------- Density matrix & Bloch sphere ----------
function outerProduct(psi){
  const dim = psi.length;
  const rho = Array(dim).fill(0).map(()=>Array(dim).fill(0).map(()=>c(0,0)));
  for (let i=0;i<dim;i++){
    for (let j=0;j<dim;j++){
      rho[i][j] = math.multiply(psi[i], math.conj(psi[j]));
    }
  }
  return rho;
}

function partialTrace(rho, n, target){
  const dim = rho.length;
  let red = [[c(0,0), c(0,0)], [c(0,0), c(0,0)]];
  for (let i=0;i<dim;i++){
    for (let j=0;j<dim;j++){
      const ib = i.toString(2).padStart(n,'0');
      const jb = j.toString(2).padStart(n,'0');
      let equalOther = true;
      for (let k=0;k<n;k++){
        if (k!==target && ib[k]!==jb[k]) {
          equalOther=false;
          break;
        }
      }
      if (equalOther){
        const a = parseInt(ib[target]);
        const b = parseInt(jb[target]);
        red[a][b] = math.add(red[a][b], rho[i][j]);
      }
    }
  }
  const trace = math.add(red[0][0], red[1][1]);
  return [
    [math.divide(red[0][0], trace), math.divide(red[0][1], trace)],
    [math.divide(red[1][0], trace), math.divide(red[1][1], trace)]
  ];
}

function densityToBloch(red){
  const rho01 = red[0][1];
  const x = 2 * cre(rho01);
  const y = -2 * cim(rho01);
  const z = cre(red[0][0]) - cre(red[1][1]);
  return {x:x, y:y, z:z};
}

function measureQubit(psi, n, target) {
  const dim = psi.length;
  let p0 = 0;

  for (let i = 0; i < dim; i++) {
    const bin = i.toString(2).padStart(n, '0');
    if (bin[target] === '0') {
      p0 += math.abs(psi[i]) ** 2;
    }
  }

  const r = Math.random();
  const outcome = (r < p0) ? 0 : 1;

  const newPsi = psi.map((amp, i) => {
    const bin = i.toString(2).padStart(n, '0');
    return (parseInt(bin[target]) === outcome) ? amp : c(0,0);
  });

  const norm = Math.sqrt(newPsi.reduce((sum, amp) => sum + math.abs(amp)**2, 0));
  for (let i = 0; i < dim; i++) {
    newPsi[i] = math.divide(newPsi[i], norm);
  }

  return { outcome, newPsi };
}

// ---------- Display formatting ----------
function toComplex(c) {
  if (c && typeof c === "object" && "real" in c && "imag" in c) {
    return math.complex(c.real, c.imag);
  }
  return c;
}

function formatComplexMatrix(mat) {
  let latex = "\\begin{bmatrix}\n";
  latex += mat.map(
    row => row.map(c => {
      const cc = toComplex(c);
      return `${cc.re.toFixed(3)}${cc.im >= 0 ? '+' : ''}${cc.im.toFixed(3)}i`;
    }).join(" & ")
  ).join(" \\\\\n");
  latex += "\n\\end{bmatrix}";
  return latex;  
}

function formatMatrixHTML(mat, threshold = 1e-6) {
  if (!mat || !Array.isArray(mat)) {
    return "<i>Invalid matrix</i>";
  }

  return `<table class="matrix-table"><tbody>` +
    mat.map(row => 
      `<tr>` + row.map(c => {
        const cc = toComplex(c);
        let val = (Math.hypot(cc.re, cc.im) < threshold)
          ? "0"
          : `${cc.re.toFixed(2)}${cc.im >= 0 ? '+' : ''}${cc.im.toFixed(2)}i`;
        return `<td>${val}</td>`;
      }).join('') + `</tr>`
    ).join('') +
  `</tbody></table>`;
}

function formatComplex(entry, digits = 3) {
  const re = Number(entry.re).toFixed(digits);
  const im = Number(entry.im).toFixed(digits);
  return `${re}${im >= 0 ? " + " : " - "}${Math.abs(im)}i`;
}

function formatReal(entry, digits = 3) {
  return Number(entry.re).toFixed(digits);
}

// ---------- Advanced State Analysis ----------
function generateStateAnalysis(stateVec, reducedList) {
  const n = Math.log2(stateVec.length);
  let analysis = "<div class='advanced-analysis'>";
  
  analysis += "<h3>🔬 Quantum State Analysis</h3>";
  
  const maxCoeff = Math.max(...stateVec.map(v => math.abs(v)));
  const minCoeff = Math.min(...stateVec.map(v => math.abs(v)));
  const avgCoeff = stateVec.reduce((sum, v) => sum + math.abs(v), 0) / stateVec.length;
  
  analysis += `<p><strong>State Complexity:</strong> ${n}-qubit system with ${stateVec.length} basis states</p>`;
  analysis += `<p><strong>Amplitude Range:</strong> Max = ${maxCoeff.toFixed(4)}, Min = ${minCoeff.toFixed(4)}, Avg = ${avgCoeff.toFixed(4)}</p>`;
  
  analysis += "<h4>📊 Qubit Entropy Analysis</h4>";
  analysis += "<table class='entropy-table'>";
  analysis += "<tr><th>Qubit</th><th>Von Neumann Entropy</th><th>Purity</th><th>Mixedness</th><th>State Type</th></tr>";
  
  for (let q = 0; q < reducedList.length; q++) {
    const bloc = densityToBloch(reducedList[q]);
    const x = bloc.x, y = bloc.y, z = bloc.z;
    const entropy = qubitEntropy(x, y, z);
    const purity = (1 + x*x + y*y + z*z) / 2;
    const mixedness = 1 - purity;
    
    let stateType = "Pure";
    let stateClass = "pure";
    if (mixedness > 0.7) { stateType = "Highly Mixed"; stateClass = "highly-mixed"; }
    else if (mixedness > 0.3) { stateType = "Mixed"; stateClass = "mixed"; }
    else if (mixedness > 0.1) { stateType = "Slightly Mixed"; stateClass = "slightly-mixed"; }
    
    analysis += `<tr>
      <td>q${q}</td>
      <td>${entropy.toFixed(4)}</td>
      <td>${purity.toFixed(4)}</td>
      <td>${mixedness.toFixed(4)}</td>
      <td class="${stateClass}">${stateType}</td>
    </tr>`;
  }
  analysis += "</table>";
  
  const isProductState = reducedList.every(rho => {
    const bloc = densityToBloch(rho);
    const r = Math.sqrt(bloc.x*bloc.x + bloc.y*bloc.y + bloc.z*bloc.z);
    return r > 0.95;
  });
  
  const probs = stateVec.map(v => math.abs(v) ** 2);
  const hasMaximalEntanglement = probs.some(p => Math.abs(p - 0.5) < 0.01) && 
    probs.filter(p => p > 0.01).length === 2;
  
  analysis += "<h4>🔗 System Properties</h4>";
  analysis += `<p><strong>State Type:</strong> <span class="${isProductState ? 'product-state' : 'entangled-state'}">${isProductState ? 'Product State (separable)' : 'Entangled State'}</span></p>`;
  analysis += `<p><strong>Entanglement:</strong> ${hasMaximalEntanglement ? '⚡ Possible maximal entanglement detected' : 'Partial or no maximal entanglement'}</p>`;
  
  analysis += "<h4>📈 Measurement Statistics</h4>";
  const maxProb = Math.max(...probs);
  const minNonZeroProb = Math.min(...probs.filter(p => p > 1e-10));
  const entropyShannon = -probs.reduce((sum, p) => p > 0 ? sum + p * Math.log2(p) : sum, 0);
  
  analysis += `<p><strong>Max Probability:</strong> ${(maxProb * 100).toFixed(2)}%</p>`;
  analysis += `<p><strong>Min Non-zero Probability:</strong> ${(minNonZeroProb * 100).toFixed(2)}%</p>`;
  analysis += `<p><strong>Shannon Entropy:</strong> ${entropyShannon.toFixed(4)} bits</p>`;
  
  analysis += "</div>";
  return analysis;
}

function drawStateBarGraph(stateVec) {
  const canvas = document.getElementById("stateBarChart");
  if (!canvas) return;
  
  canvas.classList.remove("hidden");
  
  const probs = stateVec.map(a => a.re * a.re + a.im * a.im);
  const labels = probs.map((_, i) => '|' + i.toString(2).padStart(Math.log2(probs.length) || 1, "0") + '⟩');

  const ctx = canvas.getContext("2d");
  
  const isDark = document.body.classList.contains('dark-mode');
  const bgColor = isDark ? 'rgba(99, 102, 241, 0.7)' : 'rgba(54, 162, 235, 0.7)';
  const borderColor = isDark ? 'rgba(99, 102, 241, 1)' : 'rgba(54, 162, 235, 1)';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  
  if (window.stateChart) {
    window.stateChart.data.labels = labels;
    window.stateChart.data.datasets[0].data = probs;
    window.stateChart.data.datasets[0].backgroundColor = bgColor;
    window.stateChart.data.datasets[0].borderColor = borderColor;
    window.stateChart.update();
    return;
  }

  window.stateChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Probability",
        data: probs,
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'State Probability Distribution',
          font: { size: 16 },
          color: textColor
        },
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          title: { display: true, text: 'Probability', color: textColor },
          ticks: { color: textColor }
        },
        x: {
          title: { display: true, text: 'Basis State', color: textColor },
          ticks: { color: textColor }
        }
      }
    }
  });
}

function displayResults(psi, rho, reducedList){
  drawStateBarGraph(stateVec);

  if (!resultsDiv) return;
  resultsDiv.innerHTML = '';
  const dim = psi.length;
  
  // Dynamic description section
  let s = generateDynamicDescription(psi, gateSequence, reducedList);
  
  // State vector
  s += "<div class='result-block'><h3>📋 Final State Vector</h3>";
  s += "<div class='state-vector-container'>";
  
  let nonZeroCount = 0;
  for (let i = 0; i < dim; i++) {
    const mag = Math.hypot(cre(psi[i]), cim(psi[i]));
    if (mag > 1e-9) {
      nonZeroCount++;
      const prob = mag * mag;
      const amp = `${cre(psi[i]).toFixed(4)}${cim(psi[i]) >= 0 ? '+' : ''}${cim(psi[i]).toFixed(4)}i`;
      s += `<div class="state-entry">
        <span class="state-label">|${i.toString(2).padStart(nQ,'0')}⟩</span>
        <span class="state-amp">${amp}</span>
        <span class="state-prob">P = ${(prob*100).toFixed(2)}%</span>
        <div class="prob-bar" style="width: ${prob*100}%"></div>
      </div>`;
    }
  }
  
  s += `</div><p class="state-summary"><strong>Non-zero components:</strong> ${nonZeroCount}/${dim}</p>`;
  s += "</div>";
  
  // Full density matrix
  s += "<div class='result-block'><h3>🔲 Full Density Matrix ρ</h3>";
  s += `<p>Dimension: ${rho.length}×${rho[0].length} | Trace: ${math.re(math.trace(rho)).toFixed(6)}</p>`;
  
  if(rho.length <= 4) {
    s += `<div class="matrix-container">$$${formatComplexMatrix(rho)}$$</div>`;
  } else {
    s += `<div class="matrix-container">${formatMatrixHTML(rho)}</div>`;
  }
  s += "</div>";

  // Advanced analysis
  s += "<div class='result-block'>";
  s += generateStateAnalysis(psi, reducedList);
  s += "</div>";

  // Reduced density matrices
  s += "<div class='result-block'><h3>🎯 Reduced Density Matrices</h3>";
  s += "<div class='reduced-matrices-grid'>";
  
  for (let q=0; q<reducedList.length; q++){
    const mat = reducedList[q];
    const bloc = densityToBloch(mat);
    const purity = (1 + bloc.x*bloc.x + bloc.y*bloc.y + bloc.z*bloc.z) / 2;
    const entropy = qubitEntropy(bloc.x, bloc.y, bloc.z);
    
    s += `<div class="reduced-matrix-card">
      <h4>Qubit ${q}</h4>
      <div class="qubit-properties">
        <p><strong>Bloch:</strong> (${bloc.x.toFixed(3)}, ${bloc.y.toFixed(3)}, ${bloc.z.toFixed(3)})</p>
        <p><strong>|r|:</strong> ${Math.sqrt(bloc.x**2 + bloc.y**2 + bloc.z**2).toFixed(4)}</p>
        <p><strong>Purity:</strong> ${purity.toFixed(4)}</p>
        <p><strong>Entropy:</strong> ${entropy.toFixed(4)}</p>
        <p><strong>P(|0⟩):</strong> ${(mat[0][0].re * 100).toFixed(2)}%</p>
        <p><strong>P(|1⟩):</strong> ${(mat[1][1].re * 100).toFixed(2)}%</p>
      </div>
      <div class="mini-matrix">$$${formatComplexMatrix(mat)}$$</div>
    </div>`;
  }
  s += "</div></div>";

  resultsDiv.innerHTML = s;
  if(window.MathJax){
    MathJax.typesetPromise();
  }
}

function drawAllBloch(reducedList) {
  if (!blochSpheresDiv) return;
  blochSpheresDiv.innerHTML = '';
  
  // Add title
  const title = document.createElement('h2');
  title.className = 'bloch-section-title';
  title.textContent = '🌐 Bloch Sphere Representations';
  blochSpheresDiv.appendChild(title);

  const blochGrid = document.createElement('div');
  blochGrid.className = 'bloch-grid';
  blochSpheresDiv.appendChild(blochGrid);

  for (let q = 0; q < reducedList.length; q++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'bloch-wrapper';

    const block = document.createElement('div');
    block.id = 'bloch_' + q;
    block.className = 'bloch-canvas';
    wrapper.appendChild(block);
    
    const props = document.createElement('div');
    props.className = 'bloch-properties';
    const bloc = densityToBloch(reducedList[q]);
    const r = Math.sqrt(bloc.x**2 + bloc.y**2 + bloc.z**2);
    const theta = Math.acos(bloc.z / (r || 1)) * 180 / Math.PI;
    const phi = Math.atan2(bloc.y, bloc.x) * 180 / Math.PI;
    const entropy = qubitEntropy(bloc.x, bloc.y, bloc.z);
    const purity = (1 + r*r) / 2;
    
    let stateDescription = "Mixed State";
    if (r > 0.99) stateDescription = "Pure State";
    else if (r < 0.01) stateDescription = "Maximally Mixed";
    
    props.innerHTML = `
      <h3>Qubit ${q}</h3>
      <div class="bloch-info">
        <div class="info-row"><span class="label">State:</span> <span class="value ${stateDescription.toLowerCase().replace(' ', '-')}">${stateDescription}</span></div>
        <div class="info-row"><span class="label">Bloch Vector:</span></div>
        <div class="vector-coords">
          <span>x: ${bloc.x.toFixed(4)}</span>
          <span>y: ${bloc.y.toFixed(4)}</span>
          <span>z: ${bloc.z.toFixed(4)}</span>
        </div>
        <div class="info-row"><span class="label">|r|:</span> <span class="value">${r.toFixed(4)}</span></div>
        <div class="info-row"><span class="label">θ (polar):</span> <span class="value">${theta.toFixed(2)}°</span></div>
        <div class="info-row"><span class="label">φ (azimuth):</span> <span class="value">${phi.toFixed(2)}°</span></div>
        <div class="info-row"><span class="label">Entropy:</span> <span class="value">${entropy.toFixed(4)}</span></div>
        <div class="info-row"><span class="label">Purity:</span> <span class="value">${purity.toFixed(4)}</span></div>
        <div class="info-row"><span class="label">P(|0⟩):</span> <span class="value">${(reducedList[q][0][0].re * 100).toFixed(2)}%</span></div>
        <div class="info-row"><span class="label">P(|1⟩):</span> <span class="value">${(reducedList[q][1][1].re * 100).toFixed(2)}%</span></div>
      </div>
    `;
    wrapper.appendChild(props);

    // Append to DOM first before plotting
    blochGrid.appendChild(wrapper);

    // Now plot the Bloch sphere (element is in DOM)
    if(r < 1e-6){
      plotBloch(block.id, {x:0,y:0,z:0}, q);
    } else {
      plotBloch(block.id, bloc, q);
    }
  }
}

function plotBloch(containerId, bloch, q) {
  const colors = getPlotColors();
  const U = 30, V = 30;
  let xs = [], ys = [], zs = [];

  for (let i = 0; i <= U; i++) {
    const rowx = [], rowy = [], rowz = [];
    const theta = Math.PI * i / U;
    for (let j = 0; j <= V; j++) {
      const phi = 2 * Math.PI * j / V;
      rowx.push(Math.sin(theta) * Math.cos(phi));
      rowy.push(Math.sin(theta) * Math.sin(phi));
      rowz.push(Math.cos(theta));
    }
    xs.push(rowx); ys.push(rowy); zs.push(rowz);
  }

  const sphere = {
    type: 'surface',
    x: xs, y: ys, z: zs,
    opacity: 0.25,
    colorscale: [[0, 'rgba(200, 220, 255, 0.8)'], [1, 'rgba(255, 200, 220, 0.8)']],
    showscale: false,
    contours: {
      x: { show: true, color: "rgba(100,100,100,0.3)", width: 1 },
      y: { show: true, color: "rgba(100,100,100,0.3)", width: 1 },
      z: { show: true, color: "rgba(100,100,100,0.3)", width: 1 }
    },
    hoverinfo: 'skip'
  };

  const axes = [
    { type: 'scatter3d', mode: 'lines', x: [-1.2, 1.2], y: [0, 0], z: [0, 0], line: { width: 3, color: '#e74c3c' }, name: "X", showlegend: false },
    { type: 'scatter3d', mode: 'lines', x: [0, 0], y: [-1.2, 1.2], z: [0, 0], line: { width: 3, color: '#27ae60' }, name: "Y", showlegend: false },
    { type: 'scatter3d', mode: 'lines', x: [0, 0], y: [0, 0], z: [-1.2, 1.2], line: { width: 3, color: '#3498db' }, name: "Z", showlegend: false }
  ];

  // Use theme colors
  const labelColor = colors.text;

  const labels = {
    type: 'scatter3d',
    mode: 'text',
    x: [0, 0, 1.4, -1.4, 0, 0],
    y: [0, 0, 0, 0, 1.4, -1.4],
    z: [1.4, -1.4, 0, 0, 0, 0],
    text: ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|+i⟩', '|-i⟩'],
    textfont: { size: 14, color: labelColor, family: 'Arial' },
    textposition: 'middle center',
    hoverinfo: 'skip',
    showlegend: false
  };

  let traces = [sphere, ...axes, labels];
  const vx = bloch.x, vy = bloch.y, vz = bloch.z;
  const r = Math.sqrt(vx*vx + vy*vy + vz*vz);
  
  if(r < 1e-6){
    // Mixed state - show as point at center
    traces.push({
      type: 'scatter3d',
      mode: 'markers',
      x: [0], y: [0], z: [0],
      marker: { size: 10, color: '#9b59b6', symbol: 'circle' },
      name: 'Mixed State',
      hoverinfo: 'text',
      text: 'Maximally Mixed State',
      showlegend: false
    });
  } else {
    // Pure or partially mixed state - show vector
    const stateVector = {
      type: 'scatter3d',
      mode: 'lines',
      x: [0, vx], y: [0, vy], z: [0, vz],
      line: { width: 8, color: '#e74c3c' },
      hoverinfo: 'skip',
      name: "State Vector",
      showlegend: false
    };
    
    const arrowHead = {
      type: 'cone',
      x: [vx], y: [vy], z: [vz],
      u: [vx * 0.3], v: [vy * 0.3], w: [vz * 0.3],
      sizemode: 'absolute',
      sizeref: 0.15,
      anchor: 'tip',
      colorscale: [[0, '#c0392b'], [1, '#e74c3c']],
      showscale: false,
      hoverinfo: 'text',
      text: `State: (${vx.toFixed(3)}, ${vy.toFixed(3)}, ${vz.toFixed(3)})`
    };
    
    // Add state point
    const statePoint = {
      type: 'scatter3d',
      mode: 'markers',
      x: [vx], y: [vy], z: [vz],
      marker: { size: 8, color: '#e74c3c' },
      hoverinfo: 'text',
      text: `(${vx.toFixed(3)}, ${vy.toFixed(3)}, ${vz.toFixed(3)})`,
      showlegend: false
    };
    
    traces.push(stateVector, arrowHead, statePoint);
  }
  
  // Use theme colors for Bloch sphere layout
  const isDark = document.body.classList.contains('dark-mode') || document.body.classList.contains('dark');
  const bgColor = 'transparent';
  const titleColor = isDark ? '#60a5fa' : '#1e40af';
  
  const layout = {
    title: {
      text: `Qubit ${q}`,
      font: { size: 16, color: titleColor }
    },
    margin: { l: 0, r: 0, b: 0, t: 40 },
    scene: {
      aspectmode: 'cube',
      xaxis: { range: [-1.5, 1.5], showgrid: false, zeroline: false, showticklabels: false, visible: false },
      yaxis: { range: [-1.5, 1.5], showgrid: false, zeroline: false, showticklabels: false, visible: false },
      zaxis: { range: [-1.5, 1.5], showgrid: false, zeroline: false, showticklabels: false, visible: false },
      camera: { eye: { x: 1.2, y: 1.2, z: 0.8 } },
      bgcolor: bgColor
    },
    paper_bgcolor: bgColor,
    plot_bgcolor: bgColor
  };
  
  Plotly.newPlot(containerId, traces, layout, { displayModeBar: false, responsive: true });
}

// ---------- Simulate Measurement Counts ----------
function simulateCounts(psi, shots = 1024) {
  const probs = psi.map(amp => amp.re * amp.re + amp.im * amp.im);
  const n = Math.log2(psi.length);
  const counts = {};
  
  for (let i = 0; i < shots; i++) {
    let rand = Math.random();
    let cumProb = 0;
    for (let j = 0; j < probs.length; j++) {
      cumProb += probs[j];
      if (rand < cumProb) {
        const bitstring = j.toString(2).padStart(n, '0');
        counts[bitstring] = (counts[bitstring] || 0) + 1;
        break;
      }
    }
  }
  
  return counts;
}

// ---------- Run simulation (Fixed for Requirement 4 & 5) ----------
function onRun(){
  // Performance check (Requirement 5)
  if (nQ > 12) {
    showNotification('Maximum 12 qubits supported for simulation to prevent browser unresponsiveness', 'error');
    return;
  }
  
  initState(nQ);
  
  // Use setTimeout to prevent UI blocking
  setTimeout(() => {
    let psi = stateVec.slice();
    let measurementResults = {};
    
    // Apply gates with performance optimization
    for (const g of gateSequence){
      if (g.type in GATES){
        psi = applySingleQubitGate(psi, nQ, g.params[0], GATES[g.type]);
      } else if(g.type === 'MEASURE'){
        const target = g.params[0];
        const { outcome, newPsi } = measureQubit(psi, nQ, target);
        psi = newPsi;
        measurementResults[`q${target}`] = outcome;
      } else if (g.type === 'Rx'){
        psi = applySingleQubitGate(psi, nQ, g.params[0], Rx(g.angle));
      } else if (g.type === 'Ry'){
        psi = applySingleQubitGate(psi, nQ, g.params[0], Ry(g.angle));
      } else if (g.type === 'Rz'){
        psi = applySingleQubitGate(psi, nQ, g.params[0], Rz(g.angle));
      } else if (g.type === 'Phase'){
        psi = applySingleQubitGate(psi, nQ, g.params[0], Phase(g.angle));
      } else if (g.type === 'CNOT'){
        psi = applyCNOT(psi, nQ, g.params[0], g.params[1]);
      } else if (g.type === 'CZ'){
        psi = applyCZ(psi, nQ, g.params[0], g.params[1]);
      } else if (g.type === 'SWAP'){
        psi = applySWAP(psi, nQ, g.params[0], g.params[1]);
      } else if (g.type === 'CCNOT'){
        psi = applyCCNOT(psi, nQ, g.params[0], g.params[1], g.params[2]);
      }
    }

    stateVec = psi;
    
    // Generate simulated measurement counts (1024 shots)
    const counts = simulateCounts(psi, 1024);
    
    // Generate QASM (Requirement 4 - Fixed)
    const qasm = generateQASM(nQ, gateSequence, initStates);
    
    // Display backend results (Requirement 4 - Fixed)
    displayBackendResults(counts, qasm);
    
    // Draw histogram with counts
    drawHistogram(counts);
    
    // Only compute density matrices for smaller systems (Requirement 5)
    if (nQ <= 8) {
      const rho = outerProduct(psi);
      const reducedList = [];
      for (let q=0; q<nQ; q++){
        reducedList.push(partialTrace(rho, nQ, q));
      }
      
      // Display results
      displayResults(psi, rho, reducedList);
      
      // Draw individual Bloch spheres
      drawAllBloch(reducedList);
      
      // Draw QSphere (only for smaller systems)
      if (nQ <= 6) {
        drawQSphere(psi);
      }
    } else {
      // For larger systems, show simplified results
      if (resultsDiv) {
        resultsDiv.innerHTML = `
          <div class="result-block">
            <h3>📊 Simulation Results (${nQ} qubits)</h3>
            <p>Large qubit count detected (${nQ} qubits, ${Math.pow(2, nQ)} states).</p>
            <p>Showing simplified results for performance reasons.</p>
            <p>Measurement histogram is available below.</p>
          </div>
        `;
      }
      if (blochSpheresDiv) {
        blochSpheresDiv.innerHTML = '<p>Bloch sphere visualization disabled for >8 qubits for performance reasons.</p>';
      }
    }
    
    // Show measurement results if any
    if (Object.keys(measurementResults).length > 0) {
      showNotification(`Measurements: ${Object.entries(measurementResults).map(([q,v]) => `${q}=${v}`).join(', ')}`, 'info');
    }
    
    // Log counts to console for debugging
    console.log('Simulation counts (1024 shots):', counts);
    console.log('Generated QASM:', qasm);
    
    showNotification('Simulation complete! See histogram for measurement counts.', 'success');
  }, 50); // Small delay to prevent UI blocking
}

// ---------- Theme Helper Function ----------
function getPlotColors() {
  const isDark = document.body.classList.contains('dark-mode') || document.body.classList.contains('dark');
  return isDark
    ? { paper: '#1e293b', plot: '#1e293b', scene: '#1e293b', text: '#e2e8f0' }
    : { paper: 'rgb(246, 246, 248)', plot: 'rgb(247, 247, 247)', scene: 'rgb(249, 249, 250)', text: '#333333' };
}

// ---------- Refresh Plot Backgrounds on Theme Change ----------
function refreshPlotBackgrounds() {
  const colors = getPlotColors();
  
  // Refresh Q-sphere
  const qDiv = document.getElementById('qsphereDiv') || document.getElementById('qsphere');
  if (qDiv && qDiv.data) {
    try {
      Plotly.relayout(qDiv, {
        paper_bgcolor: colors.paper,
        plot_bgcolor: colors.plot,
        'scene.bgcolor': colors.scene
      });
    } catch(e) { console.log('QSphere relayout skipped:', e); }
  }
  
  // Refresh Bloch spheres
  document.querySelectorAll('.bloch-canvas').forEach((el) => {
    try {
      Plotly.relayout(el, {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        'scene.bgcolor': 'transparent'
      });
    } catch(e) { /* skip */ }
  });
}

// ---------- QSphere Display Function ----------
function drawQSphere(psi) {
  // Try to find existing qsphere containers - check both possible IDs
  let qsphereContainer = document.getElementById('qsphereDiv') || document.getElementById('qsphere');
  let containerId = 'qsphereDiv';
  
  // If qsphereDiv exists, use it and make it visible
  if (qsphereDiv) {
    qsphereDiv.classList.remove('hidden');
    qsphereDiv.innerHTML = '';
    qsphereDiv.style.minHeight = '500px';
    containerId = 'qsphereDiv';
    plotQSphere('qsphereDiv', psi);
    return;
  }
  
  // Fallback: create new container if neither exists
  if (!qsphereContainer) {
    const resultsSection = document.getElementById('results');
    const blochSection = document.getElementById('blochSpheres');
    const insertionPoint = blochSection || resultsSection;
    
    if (insertionPoint && insertionPoint.parentNode) {
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'qsphere-wrapper';
      wrapper.style.cssText = 'margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; border: 1px solid #e2e8f0;';
      
      // Add title
      const title = document.createElement('h2');
      title.className = 'qsphere-title';
      title.textContent = '🌐 Q-Sphere Visualization';
      title.style.cssText = 'text-align: center; margin-bottom: 15px; color: #1e40af;';
      wrapper.appendChild(title);
      
      // Create container div
      qsphereContainer = document.createElement('div');
      qsphereContainer.id = 'qsphereDiv';
      qsphereContainer.className = 'qsphere-container';
      qsphereContainer.style.cssText = 'min-height: 500px; border-radius: 12px; background: #ffffff;';
      wrapper.appendChild(qsphereContainer);
      
      // Insert after blochSpheres or before results
      if (blochSection && blochSection.parentNode) {
        blochSection.parentNode.insertBefore(wrapper, blochSection.nextSibling);
      } else if (resultsSection && resultsSection.parentNode) {
        resultsSection.parentNode.insertBefore(wrapper, resultsSection);
      }
      
      containerId = 'qsphereDiv';
    }
  } else {
    // Container exists, just clear and use it
    containerId = qsphereContainer.id;
    qsphereContainer.innerHTML = '';
    qsphereContainer.style.minHeight = '500px';
  }
  
  if (qsphereContainer || document.getElementById(containerId)) {
    plotQSphere(containerId, psi);
  }
}

// ---------- CSS Injection for Tooltips and Controls ----------
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Tooltip Styles - Only on specific elements */
    .keyword-tooltip, .gate-tooltip {
      position: fixed;
      background: rgba(30, 30, 40, 0.98);
      color: #fff;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      max-width: 320px;
      z-index: 10000;
      pointer-events: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.15);
      display: none;
    }
    
    .tooltip-title, .gate-tooltip-header {
      font-weight: bold;
      font-size: 14px;
      color: #60a5fa;
      margin-bottom: 6px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 6px;
    }
    
    .tooltip-description, .gate-tooltip-description {
      line-height: 1.5;
      color: #e2e8f0;
    }
    
    .gate-tooltip-matrix {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.1);
      font-family: monospace;
      font-size: 11px;
      color: #a5b4fc;
    }
    
    /* Restrict tooltip triggers to specific elements only */
    .tooltip-trigger {
      cursor: help;
      display: inline-block;
    }
    
    label.tooltip-trigger {
      border-bottom: 1px dashed #666;
      cursor: help;
    }
    
    button.tooltip-trigger,
    .btn.tooltip-trigger {
      cursor: pointer;
    }
    
    /* Custom Gate Dropdown with Categories (Requirement 1) */
    .custom-gate-dropdown {
      position: relative;
      display: inline-block;
      width: 100%;
    }
    
    .gate-dropdown-display {
      padding: 10px 14px;
      border: 2px solid #fff;
      border-radius: 6px;
      background: #ffffffff;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      color: #1e293b;
    }
    

    .gate-dropdown-display:hover {
      border-color: #3b82f6;
      background: #f8fafc;
    }
    
    .gate-dropdown-options {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      border: 2px solid #cbd5e1;
      border-radius: 6px;
      margin-top: 4px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    
    .gate-dropdown-options.show {
      display: block;
    }
    
    .gate-category-header {
      padding: 8px 14px;
      background: linear-gradient(135deg, #0f82f5ff, #0870f8ff);
      color: #334155;
      font-weight: bold;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #cbd5e1;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    
    .gate-dropdown-option {
      padding: 10px 14px;
      cursor: pointer;
      transition: background 0.15s;
      color: #1e293b;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .gate-dropdown-option:last-child {
      border-bottom: none;
    }
    
    .gate-dropdown-option:hover {
      background: #f0f7ff;
    }
    
    /* Backend Results Styles (Requirement 4) */
    .backend-results {
      margin: 20px 0;
      display: none;
    }
    
    .backend-content {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .backend-section {
      flex: 1;
      min-width: 300px;
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .backend-section pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      background: #fff;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
    }
    
    /* Circuit Controls */
    .circuit-controls {
      display: flex;
      gap: 8px;
      margin: 10px 0;
      padding: 10px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .dark-mode .circuit-controls {
     background: #291f3fff;
     border: 1px solid #144d97ff;
    }
    .circuit-controls button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border: 1px solid #0e56adff;
      border-radius: 6px;
      background: #348aecff;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }
    
    
    }
    
    .circuit-controls button svg {
      width: 16px;
      height: 16px;
    }
    
    /* Circuit Scroll Wrapper */
    .circuit-scroll-wrapper {
      overflow-x: auto;
      overflow-y: hidden;
      padding: 10px 0;
      margin: 10px 0;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fafafa;
    }
    .dark-mode  .circuit-scroll-wrapper {
     border: 1px solid #01142cff;
      border-radius: 8px;
      background: #01142cff;
    }

    .circuit-scroll-wrapper::-webkit-scrollbar {
      height: 10px;
    }
    
    .circuit-scroll-wrapper::-webkit-scrollbar-track {
      background: #f9f4f1ff;
      border-radius: 5px;
    }
    
    .circuit-scroll-wrapper::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 5px;
    }
    
    .circuit-scroll-wrapper::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
    
    /* Notification */
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 14px 24px;
      border-radius: 8px;
      color: #fff;
      font-weight: 500;
      z-index: 10001;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification.success {
      background: linear-gradient(135deg, #10b981, #059669);
    }
    
    .notification.error {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    
    .notification.info {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
    
    .notification.warning {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }
    
    /* Dynamic Description Styles */
    .dynamic-description {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
    }
    
    .dynamic-description h3 {
      color: #1e40af;
      margin-bottom: 15px;
      font-size: 1.3em;
    }
    
    .dynamic-description h4 {
      color: #3730a3;
      margin: 15px 0 10px;
      font-size: 1.1em;
    }
   /* Dynamic Description Styles */
.dynamic-description {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.dark-mode .dynamic-description {
  background: linear-gradient(135deg, #050224ff, #0d214dff);
  border-color: #0a023aff;
}

.dynamic-description h3 {
  color: #1e40af;
  margin-bottom: 15px;
  font-size: 1.3em;
}

.dark-mode .dynamic-description h3 {
  color: #d6bcfa;
}

.dynamic-description h4 {
  color: #3730a3;
  margin: 15px 0 10px;
  font-size: 1.1em;
}

.dark-mode .dynamic-description h4 {
  color: #b794f4;
}

/* Light Mode (default) */
.desc-section {
  background: #ece7e7ff;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  border-left: 4px solid #3b82f6;
}

.desc-section.tips {
  border-left-color: #f59e0b;
  background: #ffebf8ff;
}

/* Dark Mode (grape theme) */
.dark-mode .desc-section {
  background: rgba(2, 23, 66, 0.8);
  border-left: 4px solid #2b05ffff;
  color: #fff;
}

.dark-mode .desc-section.tips {
  border-left-color: #d6bcfa;
  background: rgba(159, 122, 234, 0.15);
}
    
    .qubit-analysis {
      background: #fff;
      padding: 10px 15px;
      border-radius: 6px;
      margin: 8px 0;
    }
     .dark-mode .qubit-analysis {
      background: #14023dff;
      padding: 10px 15px;
      border-radius: 6px;
      margin: 8px 0;
    }
    
    .qubit-analysis ul {
      margin: 5px 0 0 20px;
      font-size: 0.9em;
    }
    
    /* Bloch Sphere Section */
    .bloch-section-title {
      text-align: center;
      color: #1e40af;
      margin-bottom: 20px;
    }
    
    .bloch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }
    
    .bloch-wrapper {
      display: flex;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
     .dark-mode .bloch-wrapper {
      background: #251e8bff;
    }
    
    .bloch-canvas {
      flex: 1;
      min-height: 350px;
    }
    
    .bloch-properties {
      width: 200px;
      padding: 15px;
      background: #f8fafc;
      border-left: 1px solid #e2e8f0;
    }
    .dark-mode  .bloch-properties {
    background: #04294eff;
    }  
    
    .bloch-properties h3 {
      color: #1e40af;
      margin-bottom: 15px;
      font-size: 1.1em;
    }
    
    .bloch-info {
      font-size: 0.85em;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .info-row .label {
      color: #64748b;
    }
    
    .info-row .value {
      font-weight: 600;
      color: #1e293b;
    }
    
    .vector-coords {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 5px 0 5px 10px;
      font-family: monospace;
      font-size: 0.9em;
    }
    
    .pure-state { color: #059669; }
    .mixed-state { color: #d97706; }
    .maximally-mixed { color: #dc2626; }
    
   /* Results Styles */
.result-block {
  background: var(--result-block-bg, #f6f6f8);
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: var(--result-block-shadow, 0 2px 8px rgba(0,0,0,0.06));
  border: 1px solid var(--result-block-border, #e2e8f0);
  color: var(--text-primary, #1e293b);
}

/* Dark mode styles that will override the variables */
.dark-mode {
  --result-block-bg: #17243aff;
  --result-block-border: #475569;
  --result-block-shadow: 0 2px 8px rgba(0,0,0,0.2);
  --text-primary: #e2e8f0;
}
    
    .result-block h3 {
      color: #1e40af;
      margin-bottom: 15px;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 8px;
    }
    
    .state-vector-container {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .state-entry {
      display: grid;
      grid-template-columns: 80px 180px 100px 1fr;
      align-items: center;
      padding: 8px 12px;
      margin: 4px 0;
      background: #f8fafc;
      border-radius: 6px;
      position: relative;
    }
    
    .state-label {
      font-family: monospace;
      font-weight: bold;
      color: #1e40af;
    }
    
    .state-amp {
      font-family: monospace;
      font-size: 0.9em;
    }
    
    .state-prob {
      font-weight: 600;
      color: #059669;
    }
    
    .prob-bar {
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 2px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    
    .matrix-container {
      overflow-x: auto;
      padding: 10px;
    }
    
    .matrix-table {
      border-collapse: collapse;
      font-family: monospace;
      font-size: 0.85em;
    }
    
    .matrix-table td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: center;
      min-width: 100px;
    }
    
    .entropy-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    
    .entropy-table th, .entropy-table td {
      border: 1px solid #e2e8f0;
      padding: 10px;
      text-align: center;
    }
    
    .entropy-table th {
      background: #f1f5f9;
      color: #1e40af;
    }
      .dark-mode .entropy-table th {
      background: #0f2953ff;
      color: #1e40af;
    } 
    
    .entropy-table .pure { color: #059669; font-weight: bold; }
    .entropy-table .slightly-mixed { color: #84cc16; }
    .entropy-table .mixed { color: #f59e0b; }
    .entropy-table .highly-mixed { color: #ef4444; font-weight: bold; }
    
    .reduced-matrices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;
    }
    
    .reduced-matrix-card {
      background: #f8fafc;
      border-radius: 8px;
      padding: 15px;
      border: 1px solid #e2e8f0;
    }
     .dark-mode .reduced-matrix-card {
      background: #0f2e4dff;
      border-radius: 8px;
      padding: 15px;
      border: 1px solid #e2e8f0;
    }
    
    .reduced-matrix-card h4 {
      color: #1e40af;
      margin-bottom: 10px;
    }
    
    .qubit-properties {
      font-size: 0.9em;
      margin-bottom: 10px;
    }
    
    .qubit-properties p {
      margin: 4px 0;
    }
    
    .mini-matrix {
      overflow-x: auto;
      font-size: 0.85em;
    }
    
    .product-state { color: #059669; font-weight: bold; }
    .entangled-state { color: #dc2626; font-weight: bold; }
    
    /* Gate List Styles - IMPROVED */
    .gate-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f8fafc, #fff);
      border-radius: 8px;
      margin: 8px 0;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      transition: all 0.2s;
    }
    
    .gate-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.1);
    }
    
    .gate-left {
      font-family: 'Monaco', 'Consolas', monospace;
      font-weight: 600;
      color: #1e293b;
      font-size: 0.95em;
    }
    
    .gate-right {
      display: flex;
      gap: 8px;
    }
    
    .gate-right button {
      width: 32px;
      height: 32px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      background: #fff;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
    }
    
    .gate-right button:hover {
      background: #3b82f6;
      color: #fff;
      border-color: #3b82f6;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }
    
    .gate-right button.rm {
      color: #ef4444;
      border-color: #fecaca;
    }
    
    .gate-right button.rm:hover {
      background: #ef4444;
      color: #fff;
      border-color: #ef4444;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }
    
    /* Dark Mode Support for Gate Dropdown */
    .dark-mode .gate-dropdown-display {
      background: #1e293b;
      border-color: #475569;
      color: #f1f5f9;
    }
    
    .dark-mode .gate-dropdown-display:hover {
      background: #334155;
      border-color: #60a5fa;
    }
    
    .dark-mode .gate-dropdown-options {
      background: #1e293b;
      border-color: #475569;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    
    .dark-mode .gate-category-header {
      background: linear-gradient(135deg, #334155, #1e293b);
      color: #cbd5e1;
      border-bottom-color: #475569;
    }
    
    .dark-mode .gate-dropdown-option {
      color: #e2e8f0;
      border-bottom-color: #334155;
    }
    
    .dark-mode .gate-dropdown-option:hover {
      background: #3b82f6;
      color: #fff;
    }
    
    /* Dark Mode for Backend Results */
    .dark-mode .backend-section {
      background: #1e293b;
      border-color: #475569;
    }
    
    .dark-mode .backend-section pre {
      background: #0f172a;
      color: #e2e8f0;
      border-color: #475569;
    }
    
    /* QSphere Wrapper and Container Styles */
    .qsphere-wrapper {
      margin: 20px 0;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
    
    .qsphere-title {
      color: #1e40af;
      font-size: 1.4em;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .qsphere-container {
      min-height: 500px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }
    
    #qsphere {
      min-height: 500px;
      background: #ffffff;
      border-radius: 12px;
    }
    
    /* QSphere Dark Mode */
    .dark-mode .qsphere-wrapper {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border-color: #475569;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }
    
    .dark-mode .qsphere-title {
      color: #60a5fa;
    }
    
    .dark-mode .qsphere-container {
      background: #0f172a;
      border-color: #475569;
    }
    
    .dark-mode #qsphere {
      background: #0f172a;
      border-color: #475569;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .bloch-grid {
        grid-template-columns: 1fr;
      }
      
      .bloch-wrapper {
        flex-direction: column;
      }
      
      .bloch-properties {
        width: 100%;
        border-left: none;
        border-top: 1px solid #e2e8f0;
      }
      
      .backend-content {
        flex-direction: column;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize styles on load
injectStyles();

// Export functions for global access
window.copyCircuitToClipboard = copyCircuitToClipboard;
window.downloadCircuitSVG = downloadCircuitSVG;
window.downloadCircuitPNG = downloadCircuitPNG;
window.refreshPlotBackgrounds = refreshPlotBackgrounds;
window.getPlotColors = getPlotColors;