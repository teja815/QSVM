import matplotlib
matplotlib.use("Agg")

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import matplotlib.pyplot as plt
import io, base64
from fastapi.middleware.cors import CORSMiddleware

from qiskit.visualization import (
    plot_histogram,
    plot_bloch_multivector,
    plot_state_qsphere,
    plot_bloch_vector
)
from qiskit.quantum_info import Statevector
from qiskit.visualization import plot_state_city
import matplotlib.pyplot as plt

from circuit_builder1 import build_circuit, get_all_qubits_bloch_vectors, simulate_counts, get_statevector, get_quantum_outputs,reconstruct_single_qubit_rho,_reconstruct_rho_from_xyz,strip_measurements,plot_statevector_amplitudes, simulate_counts

app = FastAPI(title="Quantum Simulator API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- REQUEST MODELS ----------

class ComplexNumber(BaseModel):
    re: float
    im: float

class Gate(BaseModel):
    type: str
    name: Optional[str] = None           # "m", "cx", etc.
    customType: Optional[str] = None     # "CUSTOM_MATRIX", "CUSTOM_CIRCUIT", "CUSTOM_CONTROL"
    params: list[int] = []
    angle: float | None = None
    matrix: Optional[List[List[ComplexNumber]]] = None
    subGates: Optional[List["Gate"]] = None   # recursive definition for CUSTOM_CIRCUIT
    


class CircuitPayload(BaseModel):
    numQubits: int
    initialStates: str
    gates: List[Gate]
    targetQubit: int = None


# ---------- UTIL ----------

def fig_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format="png")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode()



# ---------- ENDPOINTS ----------

@app.post("/statevectorplot")
def statevector_endpoint(payload: CircuitPayload):
    # Build circuit
    qc = build_circuit(payload.numQubits, payload.initialStates, payload.gates)

    # Get statevector
    state = get_statevector(qc)

    # Plot statevector
    fig = plot_statevector_amplitudes(state)

    # Convert to Base64 and return
    return {"image": fig_to_base64(fig)}

@app.post("/counts")
def counts_endpoint(payload: CircuitPayload):
    """
    Returns measurement counts and a counts histogram.
    This represents classical measurement statistics, NOT the quantum state.
    """
    # Build circuit (includes measurements)
    qc = build_circuit(
        payload.numQubits,
        payload.initialStates,
        payload.gates
    )

    # Run measurement (default backend logic inside simulate_counts)
    counts = simulate_counts(qc)

    # Plot counts histogram
    fig = plot_histogram(counts)

    return {
        "image": fig_to_base64(fig),
        "counts": counts
    }

@app.post("/histogram")
def histogram(payload: CircuitPayload):
    qc = build_circuit(payload.numQubits, payload.initialStates, payload.gates)
    counts = simulate_counts(qc)
    fig = plot_histogram(counts)
    return {"image": fig_to_base64(fig),
            "counts": counts}

@app.post("/statevector")
def statevector(payload: CircuitPayload):
    # Build circuit (with measurements)
    qc = build_circuit(
        payload.numQubits,
        payload.initialStates,
        payload.gates
    )

    # Remove measurements for statevector
    qc_sv = strip_measurements(qc)

    # Compute statevector
    state = Statevector.from_instruction(qc_sv)

    # Plot state_city
    fig = plot_state_city(state)

    # Convert to base64
    image_base64 = fig_to_base64(fig)
    plt.close(fig)

    return {
        "image": image_base64
    }


@app.post("/circuit")
def circuit_diagram(payload: CircuitPayload):
    qc = build_circuit(
        payload.numQubits,
        payload.initialStates,
        payload.gates
    )

    # Draw circuit as matplotlib figure
    fig = qc.draw(output="mpl")

    return {"image": fig_to_base64(fig)}

# @app.post("/bloch")
# def bloch(payload: CircuitPayload):
#     qc = build_circuit(payload.numQubits, payload.initialStates, payload.gates)
#     psi = get_statevector(qc)
#     fig = plot_bloch_multivector(psi)
#     return {"image": fig_to_base64(fig)}


@app.post("/bloch2")
def bloch(payload: CircuitPayload):
    qc = build_circuit(payload.numQubits, payload.initialStates, payload.gates)
    bloch_vector = reconstruct_single_qubit_rho(qc, payload.targetQubit)
    
    fig = plot_bloch_vector(bloch_vector)
    img_base64 = fig_to_base64(fig)
    rho = _reconstruct_rho_from_xyz(*bloch_vector)
    rho_serializable = [
        [{"re": c.real, "im": c.imag} for c in row]
        for row in rho
    ]

    return {"image": img_base64, "density_matrix": rho_serializable, "bloch_vector": bloch_vector}

@app.post("/bloch-all")
def bloch_all_qubits(payload: CircuitPayload):
    # 1. Build circuit
    qc = build_circuit(
        payload.numQubits,
        payload.initialStates,
        payload.gates
    )

    # 2. Compute Bloch vectors using partial trace
    bloch_vectors = get_all_qubits_bloch_vectors(qc)

    # 3. Plot each Bloch sphere
    images = {}
    for qubit, vec in bloch_vectors.items():
        fig = plot_bloch_vector(vec)
        images[qubit] = fig_to_base64(fig)

    # 4. Return all images + raw vectors
    return {
        "bloch_vectors": bloch_vectors,
        "images": images
    }

@app.post("/qsphere")
def qsphere(payload: CircuitPayload):
    qc = build_circuit(payload.numQubits, payload.initialStates, payload.gates)
    psi = get_statevector(qc)
    fig = plot_state_qsphere(psi)
    return {"image": fig_to_base64(fig)}

@app.post("/state-analysis")
def state_analysis(payload: CircuitPayload):
    qc = build_circuit(payload.numQubits, payload.initialStates, payload.gates)
    return get_quantum_outputs(qc)
