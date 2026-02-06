// Short descriptions for each gate to drive hover/help text
const GATE_DESCRIPTIONS = {
  X: "X (Pauli-X): quantum NOT gate, flips |0⟩ and |1⟩.",
  Y: "Y (Pauli-Y): rotation combining bit and phase flip.",
  Z: "Z (Pauli-Z): phase flip, maps |1⟩ → -|1⟩.",
  H: "H (Hadamard): creates superposition, turning |0⟩ into (|0⟩+|1⟩)/√2.",
  S: "S gate: phase gate with phase π/2 on |1⟩.",
  Sdg: "S† gate: inverse of S, phase -π/2 on |1⟩.",
  T: "T gate: π/4 phase on |1⟩, useful for precise rotations.",
  Tdg: "T† gate: inverse of T, phase -π/4 on |1⟩.",
  MEASURE: "Measure: collapses the chosen qubit to classical 0 or 1.",
  Rx: "Rx(θ): rotation around the X-axis of the Bloch sphere by angle θ.",
  Ry: "Ry(θ): rotation around the Y-axis of the Bloch sphere by angle θ.",
  Rz: "Rz(θ): rotation around the Z-axis of the Bloch sphere by angle θ.",
  Phase: "Phase(φ): adds a controllable phase φ to the |1⟩ component.",
  CNOT: "CNOT: flips the target qubit if the control qubit is |1⟩.",
  CZ: "CZ: adds a -1 phase when both control and target are |1⟩.",
  SWAP: "SWAP: exchanges the states of two qubits.",
  CCNOT: "CCNOT / Toffoli: flips target only when both controls are |1⟩.",
  CUSTOM_MATRIX: "Custom Matrix: apply your own user-defined unitary.",
  CUSTOM_CIRCUIT: "Custom Circuit: reuse a small circuit as a single gate.",
  CUSTOM_CONTROL:
    "Custom Control: make your own controlled version of a base gate.",
};

const cre = math.re,
  cim = math.im;

// ---------- DOM elements ----------
const btnSet = document.getElementById("btnSet");
const afterSet = document.getElementById("afterSet");
const numQInput = document.getElementById("numQ");
const basisSelect = document.getElementById("basisState");
const basisInputWrap = document.getElementById("basisInputWrap");
const basisInput = document.getElementById("basisInput");

const gateType = document.getElementById("gateType");
const gateHelp = document.getElementById("gateHelp");
const singleTargetDiv = document.getElementById("singleTargetDiv");
const targetQ = document.getElementById("targetQ");

const angleDiv = document.getElementById("angleDiv");
const angleDeg = document.getElementById("angleDeg");
const angleLabel = document.getElementById("angleLabel");

const cnotDiv = document.getElementById("cnotDiv");
const controlQ = document.getElementById("controlQ");
const targetQ2 = document.getElementById("targetQ2");

const swapDiv = document.getElementById("swapDiv");
const swapA = document.getElementById("swapA");
const swapB = document.getElementById("swapB");

const ccnotDiv = document.getElementById("ccnotDiv");
const cc_c1 = document.getElementById("cc_c1");
const cc_c2 = document.getElementById("cc_c2");
const cc_t = document.getElementById("cc_t");

// Custom gate elements
const customMatrixDiv = document.getElementById("customMatrixDiv");
const customCircuitDiv = document.getElementById("customCircuitDiv");
const customControlDiv = document.getElementById("customControlDiv");
const matrixSize = document.getElementById("matrixSize");
const matrixInput = document.getElementById("matrixInput");
const validateMatrix = document.getElementById("validateMatrix");
const matrixValidation = document.getElementById("matrixValidation");
const customGateName = document.getElementById("customGateName");
const circuitGateName = document.getElementById("circuitGateName");
const circuitQubits = document.getElementById("circuitQubits");
const circuitGatesList = document.getElementById("circuitGatesList");
const addCircuitGate = document.getElementById("addCircuitGate");
const validateCircuit = document.getElementById("validateCircuit");
const circuitValidation = document.getElementById("circuitValidation");
const controlGateName = document.getElementById("controlGateName");
const baseGate = document.getElementById("baseGate");
const controlAngleDiv = document.getElementById("controlAngleDiv");
const controlAngle = document.getElementById("controlAngle");
const controlQubitsList = document.getElementById("controlQubitsList");
const controlTarget = document.getElementById("controlTarget");
const controlTarget1 = document.getElementById("controlTarget1");

const validateControl = document.getElementById("validateControl");
const controlValidation = document.getElementById("controlValidation");
const customGatesModal = document.getElementById("customGatesModal");
const closeModal = document.getElementById("closeModal");
const customGatesList = document.getElementById("customGatesList");
const createNewGate = document.getElementById("createNewGate");

const btnAddGate = document.getElementById("btnAddGate");
const btnUndo = document.getElementById("btnUndo");
const btnClearGates = document.getElementById("btnClearGates");
const gatesListDiv = document.getElementById("gatesList");
const btnRun = document.getElementById("btnRun");
const runCircuitBtn = document.getElementById("cRun");
const loadingSpinner = document.getElementById("loading");
const themeToggleBtn = document.getElementById("themeToggle");

const resultsDiv = document.getElementById("results");
const blochSpheresDiv = document.getElementById("blochSpheres");
const container = document.getElementById("quantumCircuit");
runCircuitBtn.addEventListener("click", backendRunCore);
// Helper to update the small help text and native tooltip for the selected gate
function updateGateHelp(type) {
  if (!gateType) return;
  const desc = GATE_DESCRIPTIONS[type] || "";
  gateType.title = desc || "Choose a quantum gate to add to the circuit.";
  if (gateHelp) {
    gateHelp.textContent = desc ? `Selected gate: ${desc}` : "";
  }
}

// ---------- App state ----------
let nQ = 2;
let stateVec = []; // array of math.complex
let gateSequence = []; // each gate object: {type, params, angle?}
let lastData = null;
let customGates = {}; // Store custom gates: {name: {type, matrix, circuit, controls, etc.}}
let currentCustomGate = {
  type: "CUSTOM_CIRCUIT",
  name: "",
  qubits: nQ,
  gates: [],
}; // Currently being created custom gate
// ---------- Setup handlers ----------
btnSet.addEventListener("click", onSet);
gateType.addEventListener("change", onGateTypeChange);
btnAddGate.addEventListener("click", onAddGate);
btnUndo.addEventListener("click", onUndo);
btnClearGates.addEventListener("click", onClearGates);
btnRun.addEventListener("click", onRun);
// theme toggle
if (themeToggleBtn) {
  initThemeFromStorage();
  themeToggleBtn.addEventListener("click", toggleTheme);
}

// initialize UI
onGateTypeChange();

// Ensure custom gate panels are hidden on page load
customMatrixDiv.classList.add("hidden");
customCircuitDiv.classList.add("hidden");
customControlDiv.classList.add("hidden");
let histogramChart = null;
let targetQubit = null;
let isRunningBackend = false;
// Clear visuals on any input/select change
function clearVisuals() {
  if (isRunningBackend) return; // ⛔ prevent duplicate clears

  const qDiv = document.getElementById("qsphereDiv");
  if (qDiv) {
    qDiv.innerHTML = "";
    qDiv.classList.add("hidden");
  }

  blochSpheresDiv.innerHTML = "";
  resultsDiv.innerHTML = "";

  // Clear circuit images
  container.querySelectorAll("img").forEach((img) => img.remove());
}

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "SELECT")) {
    clearVisuals();
  }
});
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "SELECT")) {
    clearVisuals();
  }
});
// ---------- Functions ----------
blochSpheresDiv.innerHTML =
  "<div class = grid > <b><h2 style= text-align:'centre'>Qubit</h2></b> <p>The fundemental unit of quantum information, serving as the quantum equvivalent of a classical computer's bit. A qubit can have states 0, 1, 0/1(superposition). </p></div>";

let firstQubit = false;
function onSet() {
  nQ = parseInt(numQInput.value);
  // Switch input UI: dropdown for <=10, text input for >10
  if (nQ > 10) {
    basisSelect.classList.add("hidden");
    basisInputWrap.classList.remove("hidden");
  } else {
    basisInputWrap.classList.add("hidden");
    basisSelect.classList.remove("hidden");
  }
  if (nQ >= 1 && nQ <= 5) {
    populateBasis(nQ);
    populateQubitSelectors(nQ);
    const initIndex = 0;
    initStates = getInitStates(initIndex, nQ);
    console.log("👉 Default initial state:", initStates);
    afterSet.classList.remove("hidden");
    gateSequence = [];
    renderGateList();
    resultsDiv.innerHTML =
      "<div class='small'>Initial state set. Add gates and click Run.</div>";
    if (!firstQubit) {
      blochSpheresDiv.innerHTML =
        "<div class = grid ><p>Tensor  products (&#8855;) are essential for describing subsystems composed of multiple quantum subsystems, where the state of the total system is given by the tensor product of the states of the individual subsystems </p></div>";
      firstQubit = true;
    }
    blochSpheresDiv.innerHTML = "";
    resultsDiv.innerHTLML = "";
    container.innerHTML = "<h2>Circuit Diagram </h2>";
    customQubitContainer.classList.add("hidden");
    btnRun.classList.remove("hidden");
    stateBarChart.classList.add("hidden");
  } else {
    populateBasis(nQ);
    populateQubitSelectors(nQ);
    const initIndex = 0;
    initStates = getInitStates(initIndex, nQ);
    console.log("👉 Default initial state:", initStates);
    afterSet.classList.remove("hidden");
    gateSequence = [];
    renderGateList();
    resultsDiv.innerHTML =
      "<div class='small'>Initial state set. Add gates and click Run.</div>";
    if (!firstQubit) {
      blochSpheresDiv.innerHTML =
        "<div class = grid ><p>Tensor  products (&#8855;) are essential for describing subsystems composed of multiple quantum subsystems, where the state of the total system is given by the tensor product of the states of the individual subsystems </p></div>";
      firstQubit = true;
    }
    blochSpheresDiv.innerHTML = "";
    resultsDiv.innerHTLML = "";
    container.innerHTML = "<h2>Circuit Diagram </h2>";

    customQubitContainer.classList.remove("hidden");
    btnRun.classList.add("hidden");
    const qubitSelect = document.getElementById("qubitSelect");
    qubitSelect.innerHTML = "";
    for (let i = 0; i < nQ; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = "q" + i;
      if (i === 0) {
        opt.selected = true;
      }
      qubitSelect.appendChild(opt);
    }
  }
}
function populateBasis(n) {
  if (n > 10) return; // skip generating huge dropdown
  basisSelect.innerHTML = "";
  for (let i = 0; i < 1 << n; i++) {
    const opt = document.createElement("option");
    opt.value = i.toString(2).padStart(n, "0");
    // separate each qubit with | >
    opt.innerHTML = opt.value
      .split("")
      .map((bit) => `|${bit}⟩ `)
      .join(" &#8855; ");
    basisSelect.appendChild(opt);
  }
  // default to |0⟩|0⟩...|0⟩
  basisSelect.value = "0".repeat(n);
}

function populateQubitSelectors(n) {
  const sels = [
    targetQ,
    controlQ,
    controlTarget,
    controlTarget1,
    targetQ2,
    swapA,
    swapB,
    cc_c1,
    cc_c2,
    cc_t,
  ];
  sels.forEach((s) => (s.innerHTML = ""));
  for (let i = 0; i < n; i++) {
    const opt = (id) => {
      const o = document.createElement("option");
      o.value = i;
      o.text = "q" + i;
      return o;
    };
    sels.forEach((s) => s.appendChild(opt()));
  }
}
let initStates = [];
function initState(nQ) {
  const dim = 1 << nQ;
  let initIndex = 0;
  if (nQ > 10) {
    const raw = (basisInput.value || "").trim();
    const valid = raw && raw.length === nQ && /^[01]+$/.test(raw);
    if (!valid) {
      alert(`Please enter a ${nQ}-bit binary string (0/1).`);
      initIndex = 0;
      basisInput.value = "0".repeat(nQ);
    } else {
      initIndex = parseInt(raw, 2);
    }
  } else {
    initIndex = parseInt(basisSelect.value || "0", 2);
  }
  stateVec = Array(dim)
    .fill(0)
    .map(() => c(0, 0));
  stateVec[initIndex] = c(1, 0);
  initStates = getInitStates(initIndex, nQ);
}

function getInitStates(initIndex, nQ) {
  const initStates = [];
  for (let i = nQ - 1; i >= 0; i--) {
    initStates.push((initIndex >> i) & 1);
  }
  return initStates;
}

function onGateTypeChange() {
  const type = gateType.value;
  updateGateHelp(type);
  // hide all
  singleTargetDiv.classList.add("hidden");
  cnotDiv.classList.add("hidden");
  swapDiv.classList.add("hidden");
  ccnotDiv.classList.add("hidden");
  angleDiv.classList.add("hidden");
  customMatrixDiv.classList.add("hidden");
  customCircuitDiv.classList.add("hidden");
  customControlDiv.classList.add("hidden");

  // show relevant
  if (
    [
      "X",
      "Y",
      "Z",
      "H",
      "S",
      "Sdg",
      "T",
      "Tdg",
      "Rx",
      "Ry",
      "Rz",
      "Phase",
      "MEASURE",
    ].includes(type)
  ) {
    singleTargetDiv.classList.remove("hidden");
  }
  if (["Rx", "Ry", "Rz", "Phase"].includes(type)) {
    angleDiv.classList.remove("hidden");
    angleLabel.textContent = type === "Phase" ? "φ (degrees):" : "θ (degrees):";
  }
  if (type === "CNOT" || type === "CZ") {
    cnotDiv.classList.remove("hidden");
  }
  if (type === "SWAP") {
    swapDiv.classList.remove("hidden");
  }
  if (type === "CCNOT") {
    ccnotDiv.classList.remove("hidden");
  }
  if (type === "CUSTOM_MATRIX") {
    customMatrixDiv.classList.remove("hidden");
    setupMatrixInput();
  }
  if (type === "CUSTOM_CIRCUIT") {
    customCircuitDiv.classList.remove("hidden");
    setupCircuitBuilder();
  }
  if (type === "CUSTOM_CONTROL") {
    customControlDiv.classList.remove("hidden");
    setupControlBuilder();
  }
}

function onAddGate() {
  const type = gateType.value;
  let gate = { type, params: [] };

  if (
    [
      "X",
      "Y",
      "Z",
      "H",
      "S",
      "Sdg",
      "T",
      "Tdg",
      "Rx",
      "Ry",
      "Rz",
      "Phase",
      "MEASURE",
    ].includes(type)
  ) {
    const t = parseInt(targetQ.value);
    gate.params = [t];
    if (["Rx", "Ry", "Rz", "Phase"].includes(type)) {
      gate.angle = ((parseFloat(angleDeg.value) || 0) * Math.PI) / 180; // store radians
    }
  } else if (type === "CNOT" || type === "CZ") {
    const c = parseInt(controlQ.value),
      t = parseInt(targetQ2.value);
    if (c === t) {
      alert("Control and target must be different");
      return;
    }
    gate.params = [c, t];
  } else if (type === "SWAP") {
    const a = parseInt(swapA.value),
      b = parseInt(swapB.value);
    if (a === b) {
      alert("Choose two different qubits");
      return;
    }
    gate.params = [a, b];
  } else if (type === "CCNOT") {
    const c1 = parseInt(cc_c1.value),
      c2 = parseInt(cc_c2.value),
      t = parseInt(cc_t.value);
    const set = new Set([c1, c2, t]);
    if (set.size < 3) {
      alert("Controls and target must be all different");
      return;
    }
    if (nQ < 3) {
      alert("CCNOT needs at least 3 qubits");
      return;
    }
    gate.params = [c1, c2, t];
  } else if (type === "CUSTOM_MATRIX") {
    if (!validateCustomMatrix()) return;
    const name = customGateName.value.trim();
    console.log("Custom matrix validated, size:", matrixSize.value);
    // const target = parseInt(controlTarget.value);
    const numTargets = Math.log2(matrixSize.value);
    const targets = [];

    for (let i = 0; i < numTargets; i++) {
      const sel = document.getElementById(`matrixTarget_${i}`);
      targets.push(parseInt(sel.value));
    }

    gate = customGates[name];
  } else if (type === "CUSTOM_CIRCUIT") {
    if (!validateCustomCircuit()) return;
    const name = circuitGateName.value.trim();
    gate = customGates[name];
  } else if (type === "CUSTOM_CONTROL") {
    if (!validateCustomControl()) return;
    const name = controlGateName.value.trim();
    const selectedControls = Array.from(
      controlQubitsList.querySelectorAll('input[type="checkbox"]:checked'),
    ).map((cb) => parseInt(cb.value));
    const target = parseInt(controlTarget.value);
    gate = customGates[name];
  }

  gateSequence.push(gate);
  renderGateList();

  const initIndex = parseInt(basisSelect.value, 2);

  const initStateString = initIndex.toString(2).padStart(nQ, "0");

  const payload = {
    numQubits: nQ,
    initialStates: initStateString,
    gates: gateSequence,
  };

  renderCircuitDiagram(payload);
}

function onUndo() {
  gateSequence.pop();
  renderGateList();
  container.innerHTML = "<h2> Circuit Diagram </h2>";
  blochSpheresDiv.innerHTML = "";
  resultsDiv.innerHTML = "";
  const initIndex = parseInt(basisSelect.value, 2);

  const initStateString = initIndex.toString(2).padStart(nQ, "0");

  const payload = {
    numQubits: nQ,
    initialStates: initStateString,
    gates: gateSequence,
  };

  renderCircuitDiagram(payload);
}

function onClearGates() {
  gateSequence = [];
  renderGateList();

  container.innerHTML = "<h2> Circuit Diagram </h2>";
  blochSpheresDiv.innerHTML = "";
  resultsDiv.innerHTML = "";
}

function renderGateList() {
  gatesListDiv.innerHTML = "";
  if (gateSequence.length === 0) {
    gatesListDiv.innerHTML = "<div class='small'>No gates added yet.</div>";
    return;
  }
  gateSequence.forEach((g, i) => {
    const d = document.createElement("div");
    d.className = "gate-item";

    const left = document.createElement("div");
    left.className = "gate-left";
    let desc = `${i + 1}.`;
    if (g.type === "CUSTOM") {
      desc += ` ${g.name}`;
      const customGate = customGates[g.name];
      if (customGate) {
        desc = `${i + 1}. ${g.name} (Custom ${customGate.type.replace("CUSTOM_", "")})`;
        if (g.params?.length) {
          desc += ` (${g.params.join(",")})`;
        }
      } else {
        desc = `${i + 1}. ${g.name} (Custom Gate - Not Found)`;
      }
    } else {
      desc += ` ${g.type}`;
      if (g.params?.length) {
        desc += ` (${g.params.join(",")})`;
      }
      if (g.angle !== undefined) {
        const deg = ((g.angle * 180) / Math.PI).toFixed(2);
        desc += `, ${deg}°`;
      }
    }
    left.textContent = desc;

    const right = document.createElement("div");
    right.className = "gate-right";

    const up = document.createElement("button");
    up.textContent = "↑";
    up.onclick = () => {
      if (i > 0) {
        [gateSequence[i - 1], gateSequence[i]] = [
          gateSequence[i],
          gateSequence[i - 1],
        ];
        renderGateList();
        container.innerHTML = "<h2>Circuit Diagram</h2>";
        const initIndex = parseInt(basisSelect.value, 2);

        const initStateString = initIndex.toString(2).padStart(nQ, "0");

        const payload = {
          numQubits: nQ,
          initialStates: initStateString,
          gates: gateSequence,
        };

        renderCircuitDiagram(payload);

        blochSpheresDiv.innerHTML = "";
        resultsDiv.innerHTML = "";
      }
    };

    const down = document.createElement("button");
    down.textContent = "↓";
    down.onclick = () => {
      if (i < gateSequence.length - 1) {
        [gateSequence[i + 1], gateSequence[i]] = [
          gateSequence[i],
          gateSequence[i + 1],
        ];
        renderGateList();
        container.innerHTML = "<h2>Circuit Diagram</h2>";
        const initIndex = parseInt(basisSelect.value, 2);

        const initStateString = initIndex.toString(2).padStart(nQ, "0");

        const payload = {
          numQubits: nQ,
          initialStates: initStateString,
          gates: gateSequence,
        };

        renderCircuitDiagram(payload);

        blochSpheresDiv.innerHTML = "";
        resultsDiv.innerHTML = "";
      }
    };

    const rm = document.createElement("button");
    rm.textContent = "Remove";
    rm.className = "rm";
    rm.onclick = () => {
      gateSequence.splice(i, 1);
      renderGateList();
      container.innerHTML = "<h2>Circuit Diagram</h2>";
      const initIndex = parseInt(basisSelect.value, 2);

      const initStateString = initIndex.toString(2).padStart(nQ, "0");

      const payload = {
        numQubits: nQ,
        initialStates: initStateString,
        gates: gateSequence,
      };

      renderCircuitDiagram(payload);

      blochSpheresDiv.innerHTML = "";
      resultsDiv.innerHTML = "";
    };

    right.appendChild(up);
    right.appendChild(down);
    right.appendChild(rm);

    d.appendChild(left);
    d.appendChild(right);
    gatesListDiv.appendChild(d);
  });
}

async function renderCircuitDiagram(payload) {
  const circuitDiv = document.getElementById("quantumCircuit");

  // Remove old image if exists (keep heading)
  circuitDiv.querySelectorAll("img").forEach((img) => img.remove());

  try {
    const res = await fetch("http://127.0.0.1:8000/circuit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Circuit API error");

    const data = await res.json();

    const img = document.createElement("img");
    img.src = "data:image/png;base64," + data.image;
    img.style.maxWidth = "50%";
    img.style.border = "1px solid #333";
    img.style.background = "#fff";
    img.style.padding = "10px";

    circuitDiv.appendChild(img);
  } catch (err) {
    console.error(err);
    alert("Failed to render circuit diagram");
  }
}

async function renderStateAnalysis(payload) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h2>Quantum State Analysis</h2>";

  try {
    const res = await fetch("http://127.0.0.1:8000/state-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("State analysis failed");

    const data = await res.json();
    console.log("State Analysis Data:", data);

    // ---------- Statevector ----------
    resultsDiv.appendChild(
      createMatrixSection(
        "Final Statevector |ψ⟩",
        formatComplexArray(data.statevector),
      ),
    );

    // ---------- Density Matrix ----------
    resultsDiv.appendChild(
      createMatrixSection(
        "Density Matrix ρ",
        formatComplexMatrix(data.density_matrix),
      ),
    );

    // ---------- Reduced Density Matrices ----------
    for (const [qubit, matrix] of Object.entries(
      data.reduced_density_matrices,
    )) {
      resultsDiv.appendChild(
        createMatrixSection(
          `Reduced Density Matrix (${qubit})`,
          formatComplexMatrix(matrix),
        ),
      );
    }
    const reducedList = Object.keys(data.reduced_density_matrices)
      .sort() // ensures qubit_0, qubit_1, ...
      .map((key) => data.reduced_density_matrices[key]);
    drawAllBloch(reducedList);
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML +=
      "<p style='color:red'>Failed to load state analysis</p>";
  }
}

/* ---------- FIXED COMPLEX FORMATTERS ---------- */

function formatComplex(c) {
  const re = Number(c[0]).toFixed(3);
  const im = Number(c[1]).toFixed(3);
  return `${re}${im >= 0 ? " + " : " - "}${Math.abs(im)}i`;
}

function formatReducedDensityMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("Invalid density matrix");
  }

  let output = "";

  for (let i = 0; i < matrix.length; i++) {
    if (!Array.isArray(matrix[i])) {
      throw new Error("Invalid density matrix row");
    }

    let rowStr = "";

    for (let j = 0; j < matrix[i].length; j++) {
      const c = matrix[i][j];

      if (
        typeof c !== "object" ||
        c === null ||
        typeof c.re !== "number" ||
        typeof c.im !== "number"
      ) {
        throw new Error(`Invalid complex entry at (${i}, ${j})`);
      }

      const re = c.re.toFixed(3);
      const im = Math.abs(c.im).toFixed(3);
      const sign = c.im >= 0 ? "+" : "-";

      rowStr += `${re} ${sign} ${im}i`;

      if (j < matrix[i].length - 1) {
        rowStr += "    ";
      }
    }

    output += rowStr;
    if (i < matrix.length - 1) {
      output += "\n";
    }
  }

  return output;
}

function formatComplexArray(arr) {
  const n = Math.log2(arr.length);

  // build entries with reversed index
  const entries = arr.map((c, i) => {
    const bin = i.toString(2).padStart(n, "0");
    const reversedBin = bin.split("").reverse().join("");
    const reversedIndex = parseInt(reversedBin, 2);

    return {
      label: reversedBin,
      index: reversedIndex,
      value: c,
    };
  });

  // sort by reversed index
  entries.sort((a, b) => a.index - b.index);

  // format output
  return entries
    .map((e) => `|${e.label}⟩ : ${formatComplex(e.value)}`)
    .join("\n");
}

function formatComplexMatrix(matrix) {
  const N = matrix.length;
  const n = Math.log2(N);

  // bit-reversal index
  function reverseIndex(i) {
    return parseInt(
      i.toString(2).padStart(n, "0").split("").reverse().join(""),
      2,
    );
  }

  // apply permutation: ρ'[i][j] = ρ[rev(i)][rev(j)]
  const reordered = Array.from({ length: N }, (_, i) =>
    Array.from(
      { length: N },
      (_, j) => matrix[reverseIndex(i)][reverseIndex(j)],
    ),
  );

  // format
  return reordered.map((row) => row.map(formatComplex).join("   ")).join("\n");
}

/* ---------- UI SECTION ---------- */

function createMatrixSection(title, content) {
  const section = document.createElement("div");
  section.style.marginBottom = "20px";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const pre = document.createElement("pre");
  pre.textContent = content;
  pre.style.background = "#f8f8f8";
  pre.style.padding = "12px";
  pre.style.border = "1px solid #ccc";
  pre.style.borderRadius = "6px";
  pre.style.overflowX = "auto";

  section.appendChild(heading);
  section.appendChild(pre);
  return section;
}

// ---------- Run simulation ----------
async function onRun() {
  const container = document.getElementById("blochSpheres");
  container.innerHTML = "";

  if (isRunningBackend) return;

  isRunningBackend = true;

  // clear ONCE before rendering
  clearVisuals();

  const initIndex = parseInt(basisSelect.value, 2);
  const initStateString = initIndex.toString(2).padStart(nQ, "0");

  const payload = {
    numQubits: nQ,
    initialStates: initStateString,
    gates: gateSequence,
  };
  console.log("👉 payload:", payload);

  await renderStateAnalysis(payload);

  try {
    // ---------- BLOCH ----------
    const blochRes = await fetch("http://127.0.0.1:8000/bloch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const blochData = await blochRes.json();

    const blochImg = document.createElement("img");
    blochImg.src = "data:image/png;base64," + blochData.image;
    blochImg.style.width = "300px";

    const blochLabel = document.createElement("p");
    blochLabel.textContent = "Bloch Sphere";

    const blochWrap = document.createElement("div");
    blochWrap.append(blochLabel, blochImg);

    // ---------- QSPHERE ----------
    const qsRes = await fetch("http://127.0.0.1:8000/qsphere", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const qsData = await qsRes.json();

    const qsImg = document.createElement("img");
    qsImg.src = "data:image/png;base64," + qsData.image;
    qsImg.style.width = "300px";

    const qsLabel = document.createElement("p");
    qsLabel.textContent = "Q-Sphere";

    const qsWrap = document.createElement("div");
    qsWrap.append(qsLabel, qsImg);

    container.style.display = "grid";
    container.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "20px";
    container.append(blochWrap, qsWrap);

    // ---------- BLOCH ALL QUBITS ----------
const blochAllRes = await fetch("http://127.0.0.1:8000/bloch-all", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const blochAllData = await blochAllRes.json();

// Section label
const blochAllTitle = document.createElement("h3");
blochAllTitle.textContent = "Bloch Spheres (All Qubits)";
blochAllTitle.style.gridColumn = "1 / -1";

// Wrapper for all Bloch spheres
const blochAllWrap = document.createElement("div");
blochAllWrap.style.display = "grid";
blochAllWrap.style.gridTemplateColumns =
  "repeat(auto-fit, minmax(250px, 1fr))";
blochAllWrap.style.gap = "20px";
blochAllWrap.style.gridColumn = "1 / -1";

// Loop over qubits
for (const [qubit, imgBase64] of Object.entries(blochAllData.images)) {
  const img = document.createElement("img");
  img.src = "data:image/png;base64," + imgBase64;
  img.style.width = "220px";

  const label = document.createElement("p");
  label.textContent = qubit;
  label.style.textAlign = "center";

  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.alignItems = "center";

  wrap.append(label, img);
  blochAllWrap.append(wrap);
}

// Append below Bloch + Q-Sphere
container.append(blochAllTitle, blochAllWrap);


    // ---------- COUNTS HISTOGRAM ----------
    const countsRes = await fetch("http://127.0.0.1:8000/counts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const countsData = await countsRes.json();

    // Create image
    const countsImg = document.createElement("img");
    countsImg.src = "data:image/png;base64," + countsData.image;
    countsImg.style.width = "500px";

    // Label
    const countsLabel = document.createElement("p");
    countsLabel.textContent = "Measurement Counts Histogram";

    // Wrapper (full width)
    const countsWrap = document.createElement("div");
    countsWrap.style.gridColumn = "1 / -1";
    countsWrap.append(countsLabel, countsImg);

    // Append BELOW all other plots
    container.append(countsWrap);

    // ---------- HISTOGRAM ----------
    const histRes = await fetch("http://127.0.0.1:8000/statevectorplot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const histData = await histRes.json();

    const canvas = document.getElementById("stateBarChart");
    const ctx = canvas.getContext("2d");

    canvas.classList.remove("hidden");

    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 500; // adjust if needed
      const scale = Math.min(1, MAX_WIDTH / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = "data:image/png;base64," + histData.image;

    //state city
    const stateRes = await fetch("http://127.0.0.1:8000/statevector", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const stateData = await stateRes.json();

    const stateImg = document.createElement("img");
    stateImg.src = "data:image/png;base64," + stateData.image;
    stateImg.style.width = "450px";

    const stateLabel = document.createElement("p");
    stateLabel.textContent = "Statevector (State City)";

    const stateWrap = document.createElement("div");
    stateWrap.append(stateLabel, stateImg);
    container.append(stateWrap);
  } catch (err) {
    console.error(err);
    alert("Failed to generate quantum visualizations");
  }
}

// ---------- Complex number utilities ----------
function complex(a, b = 0) {
  return { re: a, im: b };
}
function cadd(a, b) {
  return { re: a.re + b.re, im: a.im + b.im };
}
function csub(a, b) {
  return { re: a.re - b.re, im: a.im - b.im };
}
function cmul(a, b) {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}
function cconj(a) {
  return { re: a.re, im: -a.im };
}
function cabs2(a) {
  return a.re * a.re + a.im * a.im;
}

// ---------- Matrix utilities ----------
function zeros(n, m) {
  return Array.from({ length: n }, () =>
    Array.from({ length: m }, () => complex(0, 0)),
  );
}

// ---------- Negativity ----------
function partialTranspose(rho, sys) {
  const res = zeros(4, 4);
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++)
      for (let k = 0; k < 2; k++)
        for (let l = 0; l < 2; l++) {
          const a = i * 2 + j;
          const b = k * 2 + l;
          const aT = (sys === 0 ? k : i) * 2 + (sys === 0 ? j : l);
          const bT = (sys === 0 ? i : k) * 2 + (sys === 0 ? l : j);
          res[aT][bT] = rho[a][b];
        }
  return res;
}

function negativity(rho) {
  // Compute the partial transpose (assume partialTranspose(rho) returns 4x4 array)
  const rhoPT = partialTranspose(rho);

  // Ensure all entries are proper math.Complex
  const rhoMat = math.matrix(
    rhoPT.map((row) => row.map((x) => math.complex(x.re ?? x, x.im ?? 0))),
  );

  // Compute eigenvalues
  const eigvals = math
    .eigs(rhoMat)
    .values.toArray()
    .map((v) => math.re(v));

  // Sum absolute values of negative eigenvalues
  const negVals = eigvals.filter((v) => v < -1e-12);
  return -negVals.reduce((a, b) => a + b, 0);
}

// ---------- Main helper ----------
function analyzeAllPairwiseEntanglement(rhoFull, dims) {
  const numQubits = dims.length;
  const entangledPairs = Array.from({ length: numQubits }, () => new Set());
  const pairData = {}; // store concurrence/negativity for each pair
  console.log(dims);
  // Check pairwise entanglement
  for (let i = 0; i < numQubits; i++) {
    for (let j = i + 1; j < numQubits; j++) {
      const rho2 = partialTrace1(rhoFull, [i, j], dims);
      const c = concurrence(rho2);
      const n = negativity(rho2);

      pairData[`Q${i}-${j}`] = { concurrence: c, negativity: n };

      if (c > 1e-6 || n > 1e-6) {
        entangledPairs[i].add(j);
        entangledPairs[j].add(i);
      }
    }
  }

  // Check if system is fully entangled
  const allEntangled = entangledPairs.every(
    (set) => set.size === numQubits - 1,
  );

  // Build doc object
  const doc = {
    summary: allEntangled
      ? "All qubits are entangled together forming a fully entangled system."
      : "System may contain partial or pairwise entanglement.",
    qubits: [],
    pairwise: pairData,
  };

  // Fill per-qubit details
  for (let i = 0; i < numQubits; i++) {
    if (entangledPairs[i].size > 0) {
      const partners = Array.from(entangledPairs[i]);
      doc.qubits.push({
        qubit: i,
        entangledWith: partners,
        description: `Qubit ${i} is entangled with ${partners.map((q) => `Qubit ${q}`).join(", ")}.`,
      });
    } else {
      doc.qubits.push({
        qubit: i,
        entangledWith: [],
        description: `Qubit ${i} is not entangled with any other qubit.`,
      });
    }
  }

  return doc;
}

function qubitEntropy(x, y, z) {
  // Length of the Bloch vector
  const r = Math.sqrt(x * x + y * y + z * z);

  // Eigenvalues of the density matrix
  const lambda1 = (1 + r) / 2;
  const lambda2 = (1 - r) / 2;

  // Helper for safe log base 2 (avoids log(0) issues)

  // Von Neumann entropy
  const S = -(lambda1 * log2Safe(lambda1) + lambda2 * log2Safe(lambda2));
  return S;
}
function log2Safe(val) {
  return val > 0 ? Math.log(val) / Math.log(2) : 0;
}
function roundVal(val, digits = 3) {
  const num = Number(val.toFixed(digits));
  return Math.abs(num) < 1e-12 ? 0 : num;
}

function C(v) {
  // v is [re, im]
  return {
    re: Number(v?.[0] ?? 0),
    im: Number(v?.[1] ?? 0),
  };
}

function densityToBloch(rho) {
  const rho00 = C(rho[0][0]);
  const rho01 = C(rho[0][1]);
  const rho11 = C(rho[1][1]);

  return {
    x: 2 * rho01.re,
    y: -2 * rho01.im,
    z: rho00.re - rho11.re,
  };
}

function drawAllBloch(reducedList) {
  blochSpheresDiv.innerHTML = "";
  console.log(`Qubit  rho =`, reducedList);

  for (let q = 0; q < reducedList.length; q++) {
    const wrapper = document.createElement("div");
    wrapper.className = "bloch-wrapper";

    const block = document.createElement("div");
    block.id = "bloch_" + q;
    block.className = "bloch-canvas";
    wrapper.appendChild(block);

    const props = document.createElement("div");
    props.className = "bloch-properties";

    const bloc = densityToBloch(reducedList[q]);

    const x = bloc.x;
    const y = bloc.y;
    const z = bloc.z;

    const e = cleanFixed(qubitEntropy(x, y, z).toFixed(3));

    props.innerHTML = `
      <h3>Qubit ${q}</h3>
      <p>Bloch vector: (${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)})</p>
      <p>Entropy(mixedness): ${e}</p>
      <p>Purity: ${((1 + x * x + y * y + z * z) / 2).toFixed(3)}</p>
      <p>Measurement probabilities(|0>,|1>):
        ${C(reducedList[q][0][0]).re.toFixed(3)},
        ${C(reducedList[q][1][1]).re.toFixed(3)}
      </p>
    `;

    wrapper.appendChild(props);
    blochSpheresDiv.appendChild(wrapper);

    const r = Math.sqrt(x * x + y * y + z * z);
    if (r < 1e-6) {
      plotBloch(block.id, { x: 0, y: 0, z: 0 }, q);
    } else {
      plotBloch(block.id, bloc, q);
    }
  }
}

function plotBloch(containerId, bloch, q) {
  const colors = getPlotColors();
  const U = 30,
    V = 30;
  let xs = [],
    ys = [],
    zs = [];

  // Sphere coordinates
  for (let i = 0; i <= U; i++) {
    const rowx = [],
      rowy = [],
      rowz = [];
    const theta = (Math.PI * i) / U;
    for (let j = 0; j <= V; j++) {
      const phi = (2 * Math.PI * j) / V;
      rowx.push(Math.sin(theta) * Math.cos(phi));
      rowy.push(Math.sin(theta) * Math.sin(phi));
      rowz.push(Math.cos(theta));
    }
    xs.push(rowx);
    ys.push(rowy);
    zs.push(rowz);
  }

  // Sphere with wireframe (grid-like mesh)
  const sphere = {
    type: "surface",
    x: xs,
    y: ys,
    z: zs,
    opacity: 0.3,
    colorscale: [
      [0, "rgba(228, 246, 253, 0.87)"],
      [1, "rgba(248, 200, 244, 1)"],
    ],
    showscale: false,
    contours: {
      x: { show: true, color: "#5a56568a", width: 20 },
      y: { show: true, color: "#5a565680", width: 20 },
      z: { show: true, color: "#5a565685", width: 20 },
    },
    hoverinfo: "skip",
  };

  // Axes (colored like in your image)
  const axes = [
    {
      type: "scatter3d",
      mode: "lines",
      x: [-1, 1],
      y: [0, 0],
      z: [0, 0],
      line: { width: 3, color: "purple" },
      name: "x-axis",
    }, // X
    {
      type: "scatter3d",
      mode: "lines",
      x: [0, 0],
      y: [-1, 1],
      z: [0, 0],
      line: { width: 3, color: "purple" },
      name: "y-axis",
    }, // Y
    {
      type: "scatter3d",
      mode: "lines",
      x: [0, 0],
      y: [0, 0],
      z: [-1, 1],
      line: { width: 3, color: "purple" },
      name: "z-axis",
    }, // Z
  ];

  // Qubit vector
  const vx = bloch.x,
    vy = bloch.y,
    vz = bloch.z;
  const r = Math.sqrt(vx * vx + vy * vy + vz * vz);

  // Arrowhead

  // Basis state labels
  const labels = {
    type: "scatter3d",
    mode: "text",
    x: [0, 0, 1.3, -1.3, 0, 0],
    y: [0, 0, 0, 0, 1.3, -1.3],
    z: [1.3, -1.3, 0, 0, 0, 0],
    text: ["z |0⟩", "|1⟩", "x |+⟩", "|−⟩", "y |+i⟩", "|−i⟩"],
    textfont: { size: 13, color: "#161618b2" },
    textposition: "middle center",
    hoverinfo: "text",
  };

  let traces = [sphere, ...axes, labels];
  if (r < 1e-6) {
    traces.push({
      type: "scatter3d",
      mode: "markers",
      x: [0],
      y: [0],
      z: [0],
      marker: { size: 6, color: "red" },
      name: "mixed",
    });
  } else {
    const stateVector = {
      type: "scatter3d",
      mode: "lines+markers",
      x: [0, vx],
      y: [0, vy],
      z: [0, vz],
      line: { width: 6, color: "#ff6969ec" },
      marker: { size: 1, color: "#f16464f5" },
      hoverinfo: "x+y+z",
      name: "qubit",
    };
    const arrowHead = {
      type: "cone",
      x: [vx],
      y: [vy],
      z: [vz],
      u: [vx],
      v: [vy],
      w: [vz], // direction of the vector
      sizemode: "absolute",
      sizeref: 0.2,
      anchor: "tip", // <<< this makes the cone tip sit at (vx,vy,vz)
      colorscale: [
        [0, "red"],
        [1, "red"],
      ],
      showscale: false,
    };
    traces.push(stateVector, arrowHead);
  }
  const layout = {
    title: `Qubit ${q}`,
    margin: { l: 0, r: 0, b: 0, t: 30 },
    paper_bgcolor: colors.paper,
    plot_bgcolor: colors.plot,
    scene: {
      bgcolor: colors.scene,
      aspectmode: "cube",
      xaxis: {
        range: [-1.3, 1.3],
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        visible: false,
      },
      yaxis: {
        range: [-1.3, 1.3],
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        visible: false,
      },
      zaxis: {
        range: [-1.3, 1.3],
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        visible: false,
      },
      camera: { eye: { x: 0.8, y: 0.8, z: 0.8 } },
    },
  };
  Plotly.newPlot(containerId, traces, layout, { displayModeBar: false });
}
function cleanFixed(val, digits = 3) {
  const num = Number(val); // force conversion to number
  const rounded = Number(num.toFixed(digits));
  return rounded === 0 ? 0 : rounded; // remove negative zero
}

document.getElementById("qubitSelect").addEventListener("change", (e) => {
  const q = parseInt(e.target.value);
  showQubitInfo(q);
});
basisSelect.addEventListener("change", () => {
  const initIndex = parseInt(basisSelect.value, 2);
  initStates = getInitStates(initIndex, nQ);
  console.log("👉 Updated initial states:", initStates);
});
if (basisInput) {
  basisInput.addEventListener("input", () => {
    const raw = basisInput.value.trim();
    if (raw.length > nQ) basisInput.value = raw.slice(0, nQ);
  });
}
// ---------- Custom Gate Functions ----------

function setupMatrixInput() {
  const size = parseInt(matrixSize.value);
  matrixInput.innerHTML = "";

  const container = document.createElement("div");
  container.className = "matrix-input-container";
  container.style.gridTemplateColumns = `repeat(${size}, 40px)`;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "matrix-input-cell";
      input.placeholder = i === j ? "1" : "0";
      input.dataset.row = i;
      input.dataset.col = j;
      container.appendChild(input);
    }
  }

  matrixInput.appendChild(container);
}

// Circuit-based custom gate setup
function setupCircuitBuilder() {
  const numQubits = parseInt(circuitQubits.value);
  circuitGatesList.innerHTML =
    '<div class="small">No gates added to circuit yet.</div>';

  // Setup circuit gate selector
  setupCircuitGateSelector();
}

function setupCircuitGateSelector() {
  addCircuitGate.onclick = () => {
    const gateType = prompt(
      "Enter gate type (X, Y, Z, H, S, T, CNOT, CZ, SWAP, CCNOT, etc.):",
    );
    if (!gateType) return;

    const target = prompt(
      `Enter target qubit (0-${currentCustomGate.qubits - 1}):`,
    );
    if (target === null) return;

    const targetQubit = parseInt(target);
    if (
      isNaN(targetQubit) ||
      targetQubit < 0 ||
      targetQubit >= currentCustomGate.qubits
    ) {
      alert("Invalid target qubit");
      return;
    }

    let gate = { type: gateType, params: [targetQubit] };

    // Handle controlled gates
    if (["CNOT", "CZ", "SWAP", "CCNOT"].includes(gateType)) {
      let numControls = 1;
      if (gateType === "CCNOT") numControls = 2; // Toffoli specifically
      if (gateType === "SWAP") numControls = 0; // SWAP = two targets, special case

      for (let k = 0; k < numControls; k++) {
        const control = prompt(
          `Enter control qubit ${k + 1} (0-${currentCustomGate.qubits - 1}):`,
        );
        if (control === null) return;

        const controlQubit = parseInt(control);
        if (
          isNaN(controlQubit) ||
          controlQubit < 0 ||
          controlQubit >= currentCustomGate.qubits
        ) {
          alert("Invalid control qubit");
          return;
        }

        if (controlQubit === targetQubit) {
          alert("Control and target must be different");
          return;
        }
        if (controlQubit) {
          if (gate.params.includes(controlQubit)) {
            alert("Duplicate control qubit");
            return;
          }
        }
        gate.params.push(controlQubit);
      }

      if (gateType === "SWAP") {
        // SWAP needs two targets instead of control
        const swapTarget = prompt(
          `Enter second target qubit (0-${currentCustomGate.qubits - 1}):`,
        );
        if (swapTarget === null) return;

        const swapQubit = parseInt(swapTarget);
        if (
          isNaN(swapQubit) ||
          swapQubit < 0 ||
          swapQubit >= currentCustomGate.qubits ||
          swapQubit === targetQubit
        ) {
          alert("Invalid swap target qubit");
          return;
        }

        gate.params = swapQubit;
      }
    }

    // Handle rotation gates
    if (["Rx", "Ry", "Rz", "Phase"].includes(gateType)) {
      const angle = prompt("Enter angle in degrees:");
      if (angle === null) return;

      const angleRad = (parseFloat(angle) * Math.PI) / 180;
      if (isNaN(angleRad)) {
        alert("Invalid angle");
        return;
      }

      gate.params = angleRad;
    }

    currentCustomGate.gates.push(gate);
    console.log(currentCustomGate);
    updateCircuitGatesList();
  };
}

function updateCircuitGatesList() {
  circuitGatesList.innerHTML = "";

  if (currentCustomGate.gates.length === 0) {
    circuitGatesList.innerHTML =
      '<div class="small">No gates added to circuit yet.</div>';
    return;
  }

  currentCustomGate.gates.forEach((gate, index) => {
    const item = document.createElement("div");
    item.className = "gate-item";

    const left = document.createElement("div");
    left.className = "gate-left";
    let desc = `${index + 1}. ${gate.type}`;
    if (gate.params?.length) {
      desc += ` (${gate.params.join(",")})`;
    }
    if (gate.angle !== undefined) {
      const deg = ((gate.angle * 180) / Math.PI).toFixed(1);
      desc += `, ${deg}°`;
    }
    left.textContent = desc;

    const right = document.createElement("div");
    right.className = "gate-right";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.className = "rm";
    removeBtn.onclick = () => {
      currentCustomGate.gates.splice(index, 1);
      updateCircuitGatesList();
    };

    right.appendChild(removeBtn);
    item.appendChild(left);
    item.appendChild(right);
    circuitGatesList.appendChild(item);
  });
}

// Control-based custom gate setup
function setupControlBuilder() {
  controlQubitsList.innerHTML = "";
  controlTarget.innerHTML = "";

  // Populate control qubits (checkboxes)
  for (let i = 0; i < nQ; i++) {
    const item = document.createElement("div");
    item.className = "control-qubit-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `control_${i}`;
    checkbox.value = i;

    const label = document.createElement("label");
    label.htmlFor = `control_${i}`;
    label.textContent = `q${i}`;

    item.appendChild(checkbox);
    item.appendChild(label);
    controlQubitsList.appendChild(item);
  }

  // Populate target qubit
  for (let i = 0; i < nQ; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `q${i}`;
    controlTarget.appendChild(option);
  }

  // Show/hide angle input for rotation gates
  if (["Rx", "Ry", "Rz", "Phase"].includes(baseGate.value)) {
    controlAngleDiv.classList.remove("hidden");
  } else {
    controlAngleDiv.classList.add("hidden");
  }
}

//Matrix validation
function validateCustomMatrix() {
  const name = customGateName.value.trim();
  if (!name) {
    showValidation(matrixValidation, "Please enter a gate name", "error");
    return false;
  }

  const size = parseInt(matrixSize.value);
  if (isNaN(size) || size < 1 || size > 8) {
    showValidation(matrixValidation, "Invalid matrix size", "error");
    return false;
  }
  if (size === 1) {
  }
  const matrix = [];
  const inputs = matrixInput.querySelectorAll(".matrix-input-cell");

  if (inputs.length !== size * size) {
    showValidation(
      matrixValidation,
      "Matrix input not properly initialized",
      "error",
    );
    return false;
  }

  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      const input = matrixInput.querySelector(
        `[data-row="${i}"][data-col="${j}"]`,
      );
      if (!input) {
        showValidation(
          matrixValidation,
          `Missing input at position (${i},${j})`,
          "error",
        );
        return false;
      }

      const value = input.value.trim() || (i === j ? "1" : "0");

      try {
        matrix[i][j] = parseComplex(value);
      } catch (e) {
        showValidation(
          matrixValidation,
          `Invalid complex number at position (${i},${j}): "${value}". Use format like: 1, 0, i, 1+i, 0.5-0.3i`,
          "error",
        );
        return false;
      }
    }
  }

  // Check if matrix is unitary
  try {
    if (!isUnitary(matrix)) {
      showValidation(
        matrixValidation,
        "Matrix is not unitary (U†U ≠ I). Please ensure the matrix represents a valid quantum gate.",
        "error",
      );
      return false;
    }
  } catch (e) {
    showValidation(
      matrixValidation,
      `Error validating matrix: ${e.message}`,
      "error",
    );
    return false;
  }
  // const target = parseInt(controlTarget.value);
  const numTargets = Math.log2(size);
  const targets = [];

  for (let i = 0; i < numTargets; i++) {
    const sel = document.getElementById(`matrixTarget_${i}`);
    targets.push(parseInt(sel.value));
  }

  // Save custom gate
  customGates[name] = {
    type: "CUSTOM",
    name: name,
    customType: "CUSTOM_MATRIX",
    matrix: matrix,
    size: size,
    params: targets, // ✅ multiple target qubits
  };

  console.log(customGates[name]);
  showValidation(
    matrixValidation,
    `Custom gate "${name}" created successfully!`,
    "success",
  );
  return true;
}

function setupMatrixTargets() {
  const size = parseInt(matrixSize.value);
  const numTargets = Math.log2(size); // 2→1, 4→2, 8→3

  const container = document.getElementById("matrixTargets");
  container.innerHTML = "";

  for (let i = 0; i < numTargets; i++) {
    const wrapper = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = `Target ${i + 1}`;

    const select = controlTarget.cloneNode(true);
    select.classList.remove("hidden");
    select.id = `matrixTarget_${i}`;

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    container.appendChild(wrapper);
  }
}

//Circuit validation
function validateCustomCircuit() {
  const name = circuitGateName.value.trim();
  if (!name) {
    showValidation(circuitValidation, "Please enter a gate name", "error");
    return false;
  }

  if (currentCustomGate.gates.length === 0) {
    showValidation(
      circuitValidation,
      "Please add at least one gate to the circuit",
      "error",
    );
    return false;
  }
  const nqubits = circuitQubits.value.trim();
  let num = prompt(
    "enter the qubits numbers on which these circuit should applied ",
  );
  let params = num.split(" ").map(Number);
  // Save custom gate
  customGates[name] = {
    type: "CUSTOM",
    name: name,
    customType: "CUSTOM_CIRCUIT",
    qubits: currentCustomGate.qubits,
    subGates: [...currentCustomGate.gates],
    params: params,
  };
  console.log(customGates[name]);

  showValidation(
    circuitValidation,
    `Custom circuit "${name}" created successfully!`,
    "success",
  );
  return true;
}

// Control gate validation
function validateCustomControl() {
  const name = controlGateName.value.trim();
  if (!name) {
    showValidation(controlValidation, "Please enter a gate name", "error");
    return false;
  }

  const selectedControls = Array.from(
    controlQubitsList.querySelectorAll('input[type="checkbox"]:checked'),
  ).map((cb) => parseInt(cb.value));

  if (selectedControls.length === 0) {
    showValidation(
      controlValidation,
      "Please select at least one control qubit",
      "error",
    );
    return false;
  }

  const target = parseInt(controlTarget1.value);
  if (selectedControls.includes(target)) {
    showValidation(
      controlValidation,
      "Target qubit cannot be the same as control qubits",
      "error",
    );
    return false;
  }

  const type = baseGate.value;

  let gate = { type, params: [] };

  const angle = ["Rx", "Ry", "Rz", "Phase"].includes(type)
    ? (parseFloat(controlAngle.value || 0) * Math.PI) / 180
    : null;
  if (
    [
      "X",
      "Y",
      "Z",
      "H",
      "S",
      "Sdg",
      "T",
      "Tdg",
      "Rx",
      "Ry",
      "Rz",
      "Phase",
      "MEASURE",
    ].includes(type)
  ) {
    gate.params = [target];
    if (["Rx", "Ry", "Rz", "Phase"].includes(type)) {
      gate.angle = angle; // store radians
    }
  }
  // Save custom gate
  customGates[name] = {
    type: "CUSTOM",
    name: name,
    customType: "CUSTOM_CONTROL",
    subGates: [gate],
    params: [...selectedControls, target],
    angle: angle,
  };

  console.log(customGates[name]);
  showValidation(
    controlValidation,
    `Custom control gate "${name}" created successfully!`,
    "success",
  );
  return true;
}
function parseComplex(str) {
  str = str.replace(/\s+/g, "");

  // i, -i
  if (str === "i") return math.complex(0, 1);
  if (str === "-i") return math.complex(0, -1);

  // Real only: 1, -2, 0.5
  if (/^[+-]?\d*\.?\d+$/.test(str)) {
    return math.complex(parseFloat(str), 0);
  }

  // Imaginary only: 2i, -0.5i
  if (/^[+-]?\d*\.?\d+i$/.test(str)) {
    return math.complex(0, parseFloat(str.replace("i", "")));
  }

  // Full complex: a+bi or a-bi
  const match = str.match(/^([+-]?\d*\.?\d+)([+-]\d*\.?\d*)i$/);
  if (match) {
    return math.complex(parseFloat(match[1]), parseFloat(match[2]));
  }

  throw new Error(`Invalid complex number: ${str}`);
}

function isUnitary(matrix) {
  const n = matrix.length;

  // Identity matrix
  const identity = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) =>
      i === j ? math.complex(1, 0) : math.complex(0, 0),
    ),
  );

  // Compute U†U
  const product = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => math.complex(0, 0)),
  );

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        const conjVal = math.conj(matrix[k][i]);
        const matrixVal = matrix[k][j];
        product[i][j] = math.add(
          product[i][j],
          math.multiply(conjVal, matrixVal),
        );
      }
    }
  }

  // Compare with identity
  const tolerance = 1e-10;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const diff = math.subtract(product[i][j], identity[i][j]);
      if (math.abs(diff) > tolerance) return false;
    }
  }

  return true;
}

function showValidation(element, message, type) {
  element.innerHTML = `<div class="validation-message validation-${type}">${message}</div>`;
}

// Event listeners for custom gates
matrixSize.addEventListener("change", () => {
  setupMatrixInput(); // already exists
  setupMatrixTargets(); // 🔥 add this
});
validateMatrix.addEventListener("click", validateCustomMatrix);
circuitQubits.addEventListener("change", setupCircuitBuilder);
validateCircuit.addEventListener("click", validateCustomCircuit);
baseGate.addEventListener("change", () => {
  if (["Rx", "Ry", "Rz", "Phase"].includes(baseGate.value)) {
    controlAngleDiv.classList.remove("hidden");
  } else {
    controlAngleDiv.classList.add("hidden");
  }
});
validateControl.addEventListener("click", validateCustomControl);

// ---------- Interactivity Enhancements ----------
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  if (themeToggleBtn) themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
  // update plot backgrounds immediately
  refreshPlotBackgrounds();
}
function initThemeFromStorage() {
  const saved = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = saved ? saved === "dark" : prefersDark;
  if (useDark) document.body.classList.add("dark");
  if (themeToggleBtn) themeToggleBtn.textContent = useDark ? "☀️" : "🌙";
}

function getPlotColors() {
  const isDark = document.body.classList.contains("dark");
  return isDark
    ? { paper: "#8ca3d3", plot: "#8ca3d3", scene: "#8ca3d3" }
    : {
        paper: "rgb(246, 246, 248)",
        plot: "rgb(247, 247, 247)",
        scene: "rgb(249, 249, 250)",
      };
}

function refreshPlotBackgrounds() {
  const colors = getPlotColors();
  // Q-sphere
  const qDiv = document.getElementById("qsphereDiv");
  if (qDiv && qDiv.data) {
    try {
      Plotly.relayout(qDiv, {
        paper_bgcolor: colors.paper,
        plot_bgcolor: colors.plot,
        "scene.bgcolor": colors.scene,
      });
    } catch (e) {}
  }
  // Bloch spheres
  document.querySelectorAll(".bloch-canvas").forEach((el) => {
    try {
      Plotly.relayout(el, {
        paper_bgcolor: colors.paper,
        plot_bgcolor: colors.plot,
        "scene.bgcolor": colors.scene,
      });
    } catch (e) {}
  });
}

// One-off hover hints and first-time tour
function initHoverHints() {
  if (resultsDiv) {
    resultsDiv.title =
      "Results panel: shows amplitudes, density matrices, reduced states, entropies and entanglement summary. Scroll vertically to see all sections.";
  }
  if (blochSpheresDiv) {
    blochSpheresDiv.title =
      "Each card shows one qubit: Bloch vector, entropy, purity and measurement probabilities.";
  }
  if (container) {
    container.title =
      "Circuit diagram: each row is a qubit, gates are applied left-to-right, and measurements send results to classical registers at the bottom.";
  }
  const qsphere = document.getElementById("qsphereDiv");
  if (qsphere) {
    qsphere.title =
      "Q-sphere: dots represent basis states; size is probability and color encodes phase.";
  }
  const hist = document.getElementById("histogram");
  if (hist) {
    hist.title =
      "Measurement histogram: backend counts for each classical bitstring outcome.";
  }
}

function initFirstTimeTour() {
  try {
    const seen = localStorage.getItem("qsv_tour_seen");
    if (seen) {
      initHoverHints();
      return;
    }
    localStorage.setItem("qsv_tour_seen", "1");
    const banner = document.createElement("div");
    banner.id = "tourBanner";
    banner.className = "tour-banner";
    banner.innerHTML =
      "<strong>Welcome!</strong> Hover over the circuit, gate selector and result panels to see short explanations. This hint disappears after you start using the tool.";
    const main = document.querySelector(".main");
    if (main && main.parentNode) {
      main.parentNode.insertBefore(banner, main);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }
    const hide = () => {
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    };
    // Hide the banner on first interaction
    btnSet.addEventListener("click", hide, { once: true });
    btnAddGate.addEventListener("click", hide, { once: true });
    document.addEventListener("keydown", hide, { once: true });
  } catch (e) {
    // localStorage or DOM might fail; still ensure hover hints exist
  } finally {
    initHoverHints();
  }
}

function setControlsDisabled(disabled) {
  const controls = document.querySelectorAll("button, input, select");
  controls.forEach((el) => {
    if (el.id === "themeToggle") return; // keep theme usable
    el.disabled = disabled;
    el.style.opacity = disabled ? 0.7 : 1;
    el.style.pointerEvents = disabled ? "none" : "auto";
  });
}
function showLoading(show) {
  if (!loadingSpinner) return;
  loadingSpinner.style.display = show ? "block" : "none";
}
async function backendRunCore() {
  // Factor out body of existing handler to reuse with UX wrapper
  const nQ_local = nQ;
  if (nQ_local >= 6) {
    const initIndex = parseInt(basisSelect.value, 2);
    const initStateString = initIndex.toString(2).padStart(nQ, "0");
    const targetQubit = parseInt(document.getElementById("qubitSelect").value);
    const payload = {
      numQubits: nQ,
      initialStates: initStateString,
      gates: gateSequence,
      targetQubit: targetQubit,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/bloch2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("👉 Bloch sphere data received:", data);
      // Show the Bloch sphere image in the div
      document.getElementById("blochSpheres").innerHTML = `
            <img src="data:image/png;base64,${data.image}" alt="Bloch Sphere" />
        `;
      const p = document.createElement("p");
      p.textContent =
        `Bloch vector of qubit ${targetQubit}: (` +
        `${data.bloch_vector[0].toFixed(3)}, ` +
        `${data.bloch_vector[1].toFixed(3)}, ` +
        `${data.bloch_vector[2].toFixed(3)})`;
      const bloch = {
        x: data.bloch_vector[0],
        y: data.bloch_vector[1],
        z: data.bloch_vector[2],
      };
      resultsDiv.appendChild(p);
      resultsDiv.appendChild(
        createMatrixSection(
          "reduced density matrix of qubit " + targetQubit,
          formatReducedDensityMatrix(data.density_matrix),
        ),
      );
      const blochSpheresDiv = document.getElementById("blochSpheres");

      // Wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "bloch-wrapper";

      // Plot container
      const block = document.createElement("div");
      block.id = "bloch_single";
      block.className = "bloch-canvas";
      wrapper.appendChild(block);

      // Properties
      const props = document.createElement("div");
      props.className = "bloch-properties";

      const x = bloch.x.toFixed(3);
      const y = bloch.y.toFixed(3);
      const z = bloch.z.toFixed(3);
      const purity = (
        (1 + bloch.x ** 2 + bloch.y ** 2 + bloch.z ** 2) /
        2
      ).toFixed(3);

      props.innerHTML = `
        <h3>Qubit ${targetQubit}</h3>
        <p>Bloch vector: (${x}, ${y}, ${z})</p>
        <p>Purity: ${purity}</p>
      `;

      wrapper.appendChild(props);
      blochSpheresDiv.appendChild(wrapper);

      // Draw Bloch sphere
      const r = Math.sqrt(bloch.x ** 2 + bloch.y ** 2 + bloch.z ** 2);
      if (r < 1e-6) {
        plotBloch(block.id, { x: 0, y: 0, z: 0 }, targetQubit);
      } else {
        plotBloch(block.id, bloch, targetQubit);
      }
    } catch (err) {
      console.error("Error fetching Bloch sphere:", err);
    }
    try {
      // ---------- HISTOGRAM ----------
      const histRes = await fetch("http://127.0.0.1:8000/histogram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const histData = await histRes.json();

      const canvas = document.getElementById("stateBarChart");
      const ctx = canvas.getContext("2d");

      canvas.classList.remove("hidden");

      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 500; // adjust if needed
        const scale = Math.min(1, MAX_WIDTH / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = "data:image/png;base64," + histData.image;
    } catch (err) {
      console.error(err);
      alert("Failed to generate quantum visualizations");
    }
  } else {
    const initIndex = parseInt(basisSelect.value, 2);
    const initStateString = initIndex.toString(2).padStart(nQ, "0");
    const payload = {
      numQubits: nQ,
      initialStates: initStateString,
      gates: gateSequence,
    };

    const histRes = await fetch("http://127.0.0.1:8000/histogram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const histData = await histRes.json(); // { counts: {...}, image: "..." }

    // Get the div where results will appear
    const backendDiv = document.getElementById("backendResults");
    backendDiv.innerHTML = ""; // clear previous results

    // --- Display counts ---
    const countsPre = document.createElement("pre");
    countsPre.textContent = JSON.stringify(histData.counts, null, 2);
    backendDiv.appendChild(countsPre);

    // --- Display histogram image ---
    const histImg = document.createElement("img");
    histImg.src = "data:image/png;base64," + histData.image;
    histImg.style.width = "400px"; // adjust width if needed
    histImg.style.marginTop = "10px";
    backendDiv.appendChild(histImg);
  }
}

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (
    e.target &&
    (e.target.tagName === "INPUT" ||
      e.target.tagName === "SELECT" ||
      e.target.isContentEditable)
  )
    return;
  if (e.key === "a" || e.key === "A") {
    document.getElementById("btnAddGate").click();
  }
  if (e.key === "u" || e.key === "U") {
    btnUndo.click();
  }
  if (e.key === "c" || e.key === "C") {
    btnClearGates.click();
  }
  if (e.key === "r" || e.key === "R") {
    if (e.shiftKey) {
      runCircuitBtn.click();
    } else {
      btnRun.click();
    }
  }
});
// Initialize first-time tour and hover hints once the script has loaded
initFirstTimeTour();
