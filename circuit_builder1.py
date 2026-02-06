from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector, DensityMatrix, partial_trace
import numpy as np
from typing import Tuple, Dict, List, Optional
from qiskit.circuit.library import UnitaryGate
import matplotlib.pyplot as plt
from qiskit_ibm_runtime import QiskitRuntimeService, Sampler
from qiskit.visualization import plot_histogram
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env

token = os.getenv("IBM_API_KEY")


try:
    from qiskit_experiments.library import StateTomography

    HAS_QISKIT_EXPERIMENTS = True
except Exception:
    HAS_QISKIT_EXPERIMENTS = False
    

# ---------------- IBM Quantum Account Setup ----------------
from qiskit_ibm_runtime import QiskitRuntimeService


QiskitRuntimeService.save_account(
    channel="ibm_cloud",
    token= token,
    instance="open-instance",
    overwrite=True
)

# Initialize service (used later by get_execution_backend)
_IBMQ_SERVICE = QiskitRuntimeService()
# ----------------------------------------------------------



class ComplexNumber:
    def __init__(self, re: float, im: float):
        self.re = re
        self.im = im


class Gate:
    def __init__(
        self,
        type: str,
        params=None,
        angle=None,
        name=None,
        customType=None,
        matrix=None,
        subGates=None,
    ):
        self.type = type
        self.params = params or []
        self.angle = angle
        self.name = name
        self.customType = customType
        self.matrix = matrix
        self.subGates = subGates or []


def decode_complex_matrix(mat):
    rows, cols = len(mat), len(mat[0])
    out = np.zeros((rows, cols), dtype=complex)

    for i in range(rows):
        for j in range(cols):
            c = mat[i][j]
            out[i, j] = complex(c.re, c.im)

    return out


def get_execution_backend(
    backend_mode: str = "hardware",
):
    """
    Returns:
    - exec_backend: object used to RUN circuits
    - backend_type: 'hardware' or 'simulator'
    """
    if backend_mode == "simulator":
        return AerSimulator(), "simulator"

    # default: hardware
    backend = _IBMQ_SERVICE.least_busy(simulator=False, operational=True)
    return backend, "hardware"


def apply_gate(qc: QuantumCircuit, gate):
    g = gate.type
    p = gate.params
    a = gate.angle

    if g == "X":
        qc.x(p[0])

    elif g == "Y":
        qc.y(p[0])

    elif g == "Z":
        qc.z(p[0])

    elif g == "H":
        qc.h(p[0])

    elif g == "S":
        qc.s(p[0])

    elif g == "Sdg":
        qc.sdg(p[0])

    elif g == "T":
        qc.t(p[0])

    elif g == "Tdg":
        qc.tdg(p[0])

    elif g == "Rx":
        qc.rx(a, p[0])

    elif g == "Ry":
        qc.ry(a, p[0])

    elif g == "Rz":
        qc.rz(a, p[0])

    elif g == "Phase":
        qc.p(a, p[0])

    elif g == "CNOT":
        qc.cx(p[0], p[1])

    elif g == "CZ":
        qc.cz(p[0], p[1])

    elif g == "SWAP":
        qc.swap(p[0], p[1])

    elif g == "CCNOT":
        qc.ccx(p[0], p[1], p[2])

    else:
        raise ValueError(f"Unsupported gate type: {g}")


def build_circuit(num_qubits, initial_states, gates):
    qc = QuantumCircuit(num_qubits, num_qubits)

    # Initial state
    for idx, bit in enumerate(initial_states):
        if int(bit) == 1:
            qc.x(idx)

    # Apply gates
    for gate in gates:
        g = gate.type.upper()
        p = gate.params if hasattr(gate, "params") else []
        a = getattr(gate, "angle", None)

        # Single-qubit gates
        if g == "X":
            qc.x(p[0])

        elif g == "Y":
            qc.y(p[0])

        elif g == "Z":
            qc.z(p[0])

        elif g == "H":
            qc.h(p[0])

        elif g == "S":
            qc.s(p[0])

        elif g == "SDG":
            qc.sdg(p[0])

        elif g == "T":
            qc.t(p[0])

        elif g == "TDG":
            qc.tdg(p[0])

        elif g == "RX":
            qc.rx(a, p[0])

        elif g == "RY":
            qc.ry(a, p[0])

        elif g == "RZ":
            qc.rz(a, p[0])

        elif g == "PHASE":
            qc.p(a, p[0])

        # Two-qubit gates
        elif g == "CNOT" or g == "CX":
            qc.cx(p[0], p[1])

        elif g == "CZ":
            qc.cz(p[0], p[1])

        elif g == "SWAP":
            qc.swap(p[0], p[1])

        # Three-qubit gate
        elif g == "CCNOT" or g == "CCX":
            qc.ccx(p[0], p[1], p[2])

        # Custom unitary matrix
        elif g == "CUSTOM" and gate.customType == "CUSTOM_MATRIX":
            matrix_np = decode_complex_matrix(gate.matrix)
            unitary = UnitaryGate(matrix_np, label=gate.name)
            qc.append(unitary, p)

        # Custom sub-circuit
        elif g == "CUSTOM" and gate.customType == "CUSTOM_CIRCUIT":
            max_qubit = -1
            for sg in gate.subGates or []:
                if sg.params:
                    max_qubit = max(max_qubit, max(sg.params))

            num_sub_qubits = max_qubit + 1 if max_qubit >= 0 else len(p)
            sub_qc = QuantumCircuit(num_sub_qubits)

            for sg in gate.subGates or []:
                apply_gate(sub_qc, sg)

            qc.compose(sub_qc, p, inplace=True)

        # Multi-controlled custom gate
        elif g == "CUSTOM" and gate.customType == "CUSTOM_CONTROL":
            if not gate.subGates or len(gate.subGates) != 1:
                raise ValueError("CUSTOM_CONTROL must wrap exactly one subGate")

            sg = gate.subGates[0]
            ctrl_qubits = p[:-1]
            target = p[-1]

            if sg.type == "X":
                qc.mcx(ctrl_qubits, target)
            elif sg.type == "Y":
                qc.mcy(ctrl_qubits, target)
            elif sg.type == "Z":
                qc.mcz(ctrl_qubits, target)
            elif sg.type == "H":
                qc.mch(ctrl_qubits, target)
            elif sg.type == "RX":
                qc.mcrx(sg.angle, ctrl_qubits, target)
            elif sg.type == "RY":
                qc.mcry(sg.angle, ctrl_qubits, target)
            elif sg.type == "RZ":
                qc.mcrz(sg.angle, ctrl_qubits, target)
            elif sg.type == "PHASE":
                qc.mcp(sg.angle, ctrl_qubits, target)
            elif sg.type == "S":
                qc.mcp(np.pi / 2, ctrl_qubits, target)
            elif sg.type == "T":
                qc.mcp(np.pi / 4, ctrl_qubits, target)
            else:
                raise ValueError(f"Unsupported controlled gate: {sg.type}")

        else:
            raise ValueError(f"Unsupported gate type: {g}")

    # Measure all qubits
    qc.measure(range(num_qubits), range(num_qubits))

    return qc


def strip_measurements(qc: QuantumCircuit) -> QuantumCircuit:
    qc_sv = qc.copy()
    qc_sv.remove_final_measurements(inplace=True)
    return qc_sv


def plot_statevector_amplitudes(state):
    """
    Plots |ψ⟩ amplitudes as a bar chart.
    Returns a matplotlib Figure.
    """
    amps = state.data
    num_qubits = int(np.log2(len(amps)))
    labels = [f"|{i:0{num_qubits}b}⟩" for i in range(len(amps))]

    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(labels, np.abs(amps))
    ax.set_title("Statevector Amplitudes |ψ⟩")
    ax.set_ylabel("Probability Amplitude")
    ax.set_xlabel("Basis State")
    plt.xticks(rotation=45)

    return fig


# def simulate_counts(qc, shots=1024):
#     qc_m = qc.copy()
#     qc_m.measure(range(qc.num_qubits), range(qc.num_qubits))

#     simulator = AerSimulator()
#     compiled = transpile(qc_m, simulator)
#     result = simulator.run(compiled, shots=shots).result()
#     return result.get_counts()


def simulate_counts(qc, shots=1024, backend_mode="hardware"):
    exec_backend, backend_type = get_execution_backend(backend_mode)

    qc_m = qc.copy()
    qc_m.measure(range(qc.num_qubits), range(qc.num_qubits))

    if backend_type == "simulator":
        compiled = transpile(qc_m, exec_backend)
        result = exec_backend.run(compiled, shots=shots).result()
        return result.get_counts()

    # ---- hardware path (Sampler) ----
    tqc = transpile(qc_m, exec_backend, optimization_level=1)
    sampler = Sampler(mode=exec_backend)
    job = sampler.run([tqc], shots=shots)
    result = job.result()

    data_bin = result[0].data
    bitarray = next(iter(data_bin.values()))
    return bitarray.get_counts()


def get_statevector(qc):
    qc_nom = qc.remove_final_measurements(inplace=False)
    return Statevector.from_instruction(qc_nom)


def complex_to_list(c):
    return [float(c.real), float(c.imag)]


def vector_to_json(vec):
    return [complex_to_list(c) for c in vec]


def matrix_to_json(mat):
    return [[complex_to_list(c) for c in row] for row in mat]


def get_quantum_outputs(qc):
    """
    Returns:
    - statevector
    - full density matrix
    - reduced density matrix for each qubit
    """

    # Remove measurements
    qc_nom = qc.remove_final_measurements(inplace=False)

    # 1️⃣ Statevector
    statevector = Statevector.from_instruction(qc_nom)

    # 2️⃣ Density Matrix
    density_matrix = DensityMatrix(statevector)

    # 3️⃣ Reduced Density Matrices
    reduced_density_matrices = {}

    n = qc.num_qubits
    for q in range(n):
        traced_out = [i for i in range(n) if i != q]
        rdm = partial_trace(density_matrix, traced_out)
        reduced_density_matrices[f"qubit_{q}"] = matrix_to_json(rdm.data)

    return {
        "statevector": vector_to_json(statevector.data),
        "density_matrix": matrix_to_json(density_matrix.data),
        "reduced_density_matrices": reduced_density_matrices,
    }


def get_all_qubits_bloch_vectors(qc: QuantumCircuit):
    """
    Computes Bloch vectors for ALL qubits using partial trace.
    This is the core function that completes the problem statement.
    """

    # Remove measurements (Bloch/state is pre-measurement)
    qc_nom = qc.remove_final_measurements(inplace=False)

    # Global pure state → density matrix
    state = Statevector.from_instruction(qc_nom)
    rho = DensityMatrix(state)

    n = qc.num_qubits
    bloch_vectors = {}

    for q in range(n):
        # Trace out all qubits except q
        traced_out = [i for i in range(n) if i != q]
        rdm = partial_trace(rho, traced_out)

        # Extract Bloch components from 2x2 density matrix
        rho_q = rdm.data

        x = 2 * np.real(rho_q[0, 1])
        y = -2 * np.imag(rho_q[0, 1])
        z = np.real(rho_q[0, 0] - rho_q[1, 1])

        bloch_vectors[f"qubit_{q}"] = [x, y, z]

    return bloch_vectors


def reconstruct_single_qubit_rho(qc: QuantumCircuit, target: int, shots=1024):
    if HAS_QISKIT_EXPERIMENTS:
        try:
            tomo = StateTomography(qc, [target])
            exp_data = tomo.run(AerSimulator(), shots=shots).block_f_results()

            rho_np = None
            # Try pattern 1: analysis_results("state")
            try:
                ar = exp_data.analysis_results("state")
                if isinstance(ar, (list, tuple)):
                    ar = ar[0] if len(ar) > 0 else None
                if ar is not None and hasattr(ar, "value"):
                    rho_obj = ar.value
                    rho_np = (
                        rho_obj.data
                        if isinstance(rho_obj, DensityMatrix)
                        else np.array(rho_obj)
                    )
                    print("Qiskit-experiments reconstruction succeeded (pattern 1)")
            except Exception:
                rho_np = None

            # fallback pattern
            if rho_np is None:
                for ar in exp_data.analysis_results():
                    if hasattr(ar, "value") and ar.value is not None:
                        val = ar.value
                        if isinstance(val, DensityMatrix):
                            rho_np = val.data
                            break
                        if isinstance(val, dict):
                            for key in (
                                "density_matrix",
                                "state",
                                "rho",
                                "reconstructed_state",
                            ):
                                if key in val:
                                    v = val[key]
                                    if isinstance(v, DensityMatrix):
                                        rho_np = v.data
                                        break
                                    elif isinstance(v, (np.ndarray, list)):
                                        rho_np = np.array(v)
                                        break
                            if rho_np is not None:
                                break

            if rho_np is None:
                raise RuntimeError("Qiskit-experiments reconstruction failed")

            rho_mat = np.array(rho_np, dtype=complex)
            x = 2 * np.real(rho_mat[0, 1])
            y = -2 * np.imag(rho_mat[0, 1])
            z = np.real(rho_mat[0, 0] - rho_mat[1, 1])
            return [x, y, z]

        except Exception:
            # fallback to manual
            return reconstruct_single_qubit_rho_manual(qc, target, shots)
    else:
        # no experiments installed → manual
        return reconstruct_single_qubit_rho_manual(qc, target, shots)


def _make_meas_circuit_variant(
    base_qc: QuantumCircuit, target: int, basis: str
) -> QuantumCircuit:
    """Return a copy of base_qc with measurement in chosen basis (Z, X, Y)."""
    qc = base_qc.copy()
    if basis == "X":
        qc.h(target)
    elif basis == "Y":
        qc.sdg(target)
        qc.h(target)
    elif basis == "Z":
        pass
    else:
        raise ValueError("basis must be 'X','Y' or 'Z'")
    qc.measure(target, 0)
    return qc


def _expectation_from_probs(p0: float, p1: float) -> float:
    return float(p0 - p1)


def _counts_bit_for_qubit(
    counts: Dict[str, int], n_qubits: int, target: int
) -> Tuple[float, float]:
    """Compute probabilities P(0), P(1) for target qubit given counts dict."""
    total, c0 = 0, 0
    for bitstr, cnt in counts.items():
        total += cnt
        rev = bitstr[::-1]  # reverse bitstring so index matches qubit
        if rev[target] == "0":
            c0 += cnt
    if total == 0:
        return 0.0, 0.0
    p0 = c0 / total
    p1 = 1.0 - p0
    return p0, p1


def _reconstruct_rho_from_xyz(x: float, y: float, z: float) -> np.ndarray:
    """Reconstruct density matrix rho = 1/2 (I + xX + yY + zZ)."""
    rho = 0.5 * np.array([[1 + z, x - 1j * y], [x + 1j * y, 1 - z]], dtype=complex)
    return rho


# -------------------- Tomography functions --------------------


def reconstruct_single_qubit_rho_manual(
    base_qc: QuantumCircuit,
    target: int,
    shots: int = 1024,
    backend_mode: str = "hardware",
):
    """Reconstruct reduced density matrix for a single qubit."""
    n = base_qc.num_qubits
    if not (0 <= target < n):
        raise ValueError("Target qubit out of range.")

    exec_backend, backend_type = get_execution_backend(backend_mode)
    circuits, bases = [], []

    for basis in ("Z", "X", "Y"):
        circuits.append(_make_meas_circuit_variant(base_qc, target, basis))
        bases.append(basis)

    if backend_type == "simulator":
        tcirc = transpile(circuits, exec_backend)
        result = exec_backend.run(tcirc, shots=shots).result()
        get_counts = result.get_counts
    else:
        tcirc = transpile(circuits, exec_backend, optimization_level=1)
        sampler = Sampler(mode=exec_backend)
        job = sampler.run(tcirc, shots=shots)
        presult = job.result()
        get_counts = lambda idx: presult[idx].data.meas.get_counts()


    exps = {}
    for idx, basis in enumerate(bases):
        counts = get_counts(idx)
        p0, p1 = _counts_bit_for_qubit(counts, n, target)
        exps[basis] = _expectation_from_probs(p0, p1)

    x, y, z = exps["X"], exps["Y"], exps["Z"]
    return [x, y, z]
