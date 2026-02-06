// quantumWorker.js
// Web Worker for quantum circuit simulation (background thread)
// Uses math.js for complex numbers
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.min.js');

function c(re, im=0) { return { re, im }; }

// Gate matrices (2x2)
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

function simulate(payload) {
  const { numQubits, gates, initialStates } = payload;
  try {
    // Sparse state vector for >12 qubits
    let psi;
    if (numQubits > 12) {
      psi = {};
      const initIndex = parseInt(initialStates.join(''), 2);
      psi[initIndex] = c(1,0);
    } else {
      const dim = 1 << numQubits;
      psi = Array(dim).fill(0).map(()=>c(0,0));
      const initIndex = parseInt(initialStates.join(''), 2);
      psi[initIndex] = c(1,0);
    }
    for (const g of gates) {
      if (g.type in GATES) {
        psi = applySingleQubitGate(psi, numQubits, g.params[0], GATES[g.type]);
      } else if (g.type === 'Rx') {
        psi = applySingleQubitGate(psi, numQubits, g.params[0], Rx(g.angle));
      } else if (g.type === 'Ry') {
        psi = applySingleQubitGate(psi, numQubits, g.params[0], Ry(g.angle));
      } else if (g.type === 'Rz') {
        psi = applySingleQubitGate(psi, numQubits, g.params[0], Rz(g.angle));
      } else if (g.type === 'Phase') {
        psi = applySingleQubitGate(psi, numQubits, g.params[0], Phase(g.angle));
      } else if (g.type === 'CNOT') {
        psi = applyCNOT(psi, numQubits, g.params[0], g.params[1]);
      } else if (g.type === 'CZ') {
        psi = applyCZ(psi, numQubits, g.params[0], g.params[1]);
      } else if (g.type === 'SWAP') {
        psi = applySWAP(psi, numQubits, g.params[0], g.params[1]);
      } else if (g.type === 'CCNOT') {
        psi = applyCCNOT(psi, numQubits, g.params[0], g.params[1], g.params[2]);
      }
      // TODO: Add progress reporting for long circuits
    }
    // Convert state vector to transferable format
    let stateVector;
    if (Array.isArray(psi)) {
      stateVector = psi.map(a => ({ re: a.re, im: a.im }));
    } else {
      // Sparse: convert to array
      const dim = 1 << numQubits;
      stateVector = Array(dim).fill(0).map((_, i) => psi[i] || c(0,0));
    }
    // Measurement counts (simple, not sampling)
    let counts = {};
    let labels = [];
    for (let i = 0; i < stateVector.length; i++) {
      const prob = stateVector[i].re * stateVector[i].re + stateVector[i].im * stateVector[i].im;
      if (prob > 1e-6) {
        const label = i.toString(2).padStart(numQubits, '0');
        counts[label] = Math.round(prob * 1000);
        labels.push(label);
      }
    }
    return { stateVector, counts, labels };
  } catch (err) {
    return { error: err.message };
  }
}

self.onmessage = function(e) {
  const payload = e.data;
  const result = simulate(payload);
  self.postMessage(result);
};
