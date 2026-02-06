import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Cpu, Brain, Lock, Search, Database, Shield, LineChart,
  PlayCircle, Code, Info, ExternalLink, BookOpen, Download,
  Copy, ChevronDown, CheckCircle, Clock, Users, BarChart2,
  CircuitBoard, Lightbulb, Atom, Network, Key, X, Maximize2,
  Minimize2, Sparkles, Target, Globe, ShieldCheck, Cpu as CpuIcon
} from "lucide-react";

const algorithms = [
  {
    id: "shor",
    icon: <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />,
    title: "Shor's Algorithm",
    category: "Cryptography",
    complexity: "Polynomial",
    shortDescription: "Quantum algorithm for integer factorization. Can break RSA encryption by finding prime factors exponentially faster than classical algorithms.",
    fullDescription: `Shor's algorithm is a quantum algorithm for integer factorization discovered by Peter Shor in 1994. It demonstrates exponential speedup over the best-known classical factoring algorithm. The algorithm can factor an integer N in time O((log N)³), which is exponentially faster than the classical general number field sieve, which works in sub-exponential time.

The algorithm works by reducing the factoring problem to the problem of finding the period of a function. It uses quantum parallelism and the quantum Fourier transform (QFT) to find this period efficiently. Once the period is found, classical number theory can be used to compute the factors.

Key Components:
1. Quantum Fourier Transform (QFT) - provides the quantum speedup
2. Modular exponentiation - encoded as a quantum circuit
3. Classical post-processing - uses the period to find factors

The algorithm's ability to factor large integers efficiently poses a significant threat to RSA encryption, which relies on the difficulty of factoring large numbers.`,
    realTimeExample: "Breaking 2048-bit RSA encryption would take classical computers billions of years, but Shor's algorithm could theoretically do it in hours on a sufficiently large quantum computer.",
    steps: [
      "Initialize quantum registers in superposition",
      "Apply modular exponentiation using quantum gates",
      "Perform Quantum Fourier Transform (QFT)",
      "Measure the first register to obtain period information",
      "Use continued fractions on classical computer to extract period",
      "Compute greatest common divisors to find factors"
    ],
    code: `# Shor's Algorithm Implementation
from qiskit import QuantumCircuit, Aer, execute
from qiskit.algorithms import Shor
from qiskit.utils import QuantumInstance
import math

def shor_algorithm(N):
    """
    Simplified Shor's algorithm implementation
    N: number to factor
    """
    # Step 1: Check trivial cases
    if N % 2 == 0:
        return 2, N // 2
    
    # Step 2: Choose random number a
    a = 7  # For demonstration with N=15
    while math.gcd(a, N) != 1:
        a = random.randint(2, N-1)
    
    # Step 3: Quantum period finding (simulated)
    # In real implementation: quantum circuit with QFT
    def find_period(a, N):
        # This is classical simulation of quantum period finding
        for r in range(1, N):
            if pow(a, r, N) == 1:
                return r
        return N
    
    r = find_period(a, N)
    
    # Step 4: Extract factors
    if r % 2 == 0:
        x = pow(a, r // 2, N)
        factor1 = math.gcd(x - 1, N)
        factor2 = math.gcd(x + 1, N)
        if factor1 not in [1, N] and factor2 not in [1, N]:
            return factor1, factor2
    
    return None

# Example factorization
N = 15
factors = shor_algorithm(N)
print(f"Factors of {N}: {factors}")`,
    applications: ["Cryptanalysis", "Integer Factorization", "Cybersecurity"],
    uses: [
      "Breaking RSA encryption",
      "Prime number factorization",
      "Cryptographic security analysis",
      "Digital signature verification",
      "Public key infrastructure testing"
    ],
    realtimeApps: [
      "Banking security assessment",
      "Military communication encryption",
      "Blockchain security protocols",
      "Secure email systems",
      "Digital certificate validation"
    ],
    circuit: [
      { type: "h", qubits: [0, 1, 2, 3], label: "Create superposition" },
      { type: "x", qubits: [4], label: "Initialize" },
      { type: "cx", controls: [0], target: 4, label: "CNOT" },
      { type: "cx", controls: [1], target: 4, label: "CNOT" },
      { type: "cp", controls: [0], target: 2, angle: "π/2", label: "Phase" },
      { type: "h", qubits: [0], label: "Hadamard" },
      { type: "swap", qubits: [0, 3], label: "Swap" },
      { type: "measure", qubits: [0, 1, 2, 3], classical: [0, 1, 2, 3], label: "Measure" }
    ],
    mathematicalBasis: `The algorithm reduces factoring to period finding:
    
Given N to factor, choose random a < N with gcd(a, N) = 1
Find smallest r such that: a^r ≡ 1 (mod N)
Then factors are: gcd(a^{r/2} ± 1, N)

The quantum speedup comes from:
1. Quantum parallelism: Evaluate f(x) = a^x mod N for all x simultaneously
2. QFT: Amplifies the period information
3. Measurement: Collapses to state encoding period`,
    references: [
      "Shor, P. W. (1994). Algorithms for quantum computation: discrete logarithms and factoring.",
      "Nielsen, M. A., & Chuang, I. L. (2010). Quantum Computation and Quantum Information.",
      "IBM Quantum Experience Documentation"
    ]
  },
  {
    id: "grover",
    icon: <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Grover's Algorithm",
    category: "Search",
    complexity: "O(√N)",
    shortDescription: "Quantum search algorithm that finds marked items in an unsorted database quadratically faster than classical algorithms.",
    fullDescription: `Grover's algorithm, discovered by Lov Grover in 1996, provides a quadratic speedup for unstructured search problems. While classical algorithms require O(N) queries to find a specific item in an unsorted database, Grover's algorithm requires only O(√N) queries.

The algorithm works by amplifying the amplitude of the solution state while suppressing the amplitudes of non-solution states. This is achieved through two key operations:
1. Oracle: Marks the solution states by flipping their sign
2. Diffusion operator: Inverts all amplitudes about their average

After approximately π√N/4 iterations, the amplitude of the solution state is maximized, and measurement yields the solution with high probability.

Applications extend beyond database search to include:
- Satisfiability problems
- Graph problems
- Cryptanalysis
- Machine learning`,
    realTimeExample: "Searching a database of 1 trillion unsorted records would take classical computers ~500 billion operations on average, but Grover's algorithm can do it in ~1 million operations.",
    steps: [
      "Initialize superposition of all N states",
      "Apply oracle to mark solution states",
      "Apply Grover diffusion operator",
      "Repeat steps 2-3 approximately √N times",
      "Measure to obtain solution with high probability"
    ],
    code: `# Grover's Algorithm for Database Search
from qiskit import QuantumCircuit, Aer, execute
import numpy as np

def grover_algorithm(n_qubits, marked_items):
    """
    Grover's algorithm implementation
    n_qubits: number of qubits representing database
    marked_items: list of items to find
    """
    # Create quantum circuit
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Step 1: Initialize superposition
    qc.h(range(n_qubits))
    
    # Define oracle for marked items
    def oracle(qc, marked):
        for item in marked:
            # Apply multi-controlled Z gate for each marked state
            # Simplified for demonstration
            qc.cz(0, 1)  # Example for item (0,1)
    
    # Define diffusion operator
    def diffusion(qc, n):
        qc.h(range(n))
        qc.x(range(n))
        qc.h(n-1)
        qc.mct(list(range(n-1)), n-1)
        qc.h(n-1)
        qc.x(range(n))
        qc.h(range(n))
    
    # Apply Grover iterations
    iterations = int(np.pi/4 * np.sqrt(2**n_qubits))
    for _ in range(iterations):
        oracle(qc, marked_items)
        diffusion(qc, n_qubits)
    
    # Measurement
    qc.measure(range(n_qubits), range(n_qubits))
    
    return qc

# Example: Search in 8-item database (3 qubits)
qc = grover_algorithm(3, [(0,1)])
print("Grover's circuit created for searching 8 items")`,
    applications: ["Database Search", "Cryptography", "Optimization"],
    uses: [
      "Unstructured database search",
      "Optimization problems",
      "Cryptographic key search",
      "Pattern matching",
      "SAT problems"
    ],
    realtimeApps: [
      "Medical records search",
      "Image pattern recognition",
      "Supply chain optimization",
      "Network routing",
      "Code breaking"
    ],
    circuit: [
      { type: "h", qubits: [0, 1, 2], label: "Superposition" },
      { type: "x", qubits: [0, 1, 2], label: "X gates" },
      { type: "h", qubits: [2], label: "Hadamard" },
      { type: "ccx", controls: [0, 1], target: 2, label: "Toffoli" },
      { type: "h", qubits: [2], label: "Hadamard" },
      { type: "x", qubits: [0, 1, 2], label: "X gates" },
      { type: "h", qubits: [0, 1, 2], label: "Diffusion" },
      { type: "measure", qubits: [0, 1, 2], classical: [0, 1, 2], label: "Measure" }
    ],
    mathematicalBasis: `Algorithm amplifies solution amplitude:

Let |s⟩ be solution state, |ψ⟩ = 1/√N Σ|x⟩
Oracle: O|x⟩ = -|x⟩ if x is solution, else |x⟩
Diffusion: D = 2|ψ⟩⟨ψ| - I

Each iteration: |ψ⟩ → DO|ψ⟩
After k ≈ π√N/4 iterations: |⟨s|ψ⟩|² ≈ 1`,
    references: [
      "Grover, L. K. (1996). A fast quantum mechanical algorithm for database search.",
      "Boyer, M., et al. (1998). Tight bounds on quantum searching.",
      "IBM Grover Algorithm Documentation"
    ]
  },
  {
    id: "qft",
    icon: <LineChart className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    title: "Quantum Fourier Transform",
    category: "Signal Processing",
    complexity: "O(n log n)",
    shortDescription: "Quantum version of the discrete Fourier transform. Foundation for many quantum algorithms including Shor's algorithm.",
    fullDescription: `The Quantum Fourier Transform (QFT) is the quantum analogue of the classical discrete Fourier transform. It transforms a quantum state's amplitude distribution from the computational basis to the Fourier basis. While the classical Fast Fourier Transform (FFT) requires O(N log N) operations for N data points, QFT requires only O((log N)²) quantum gates.

QFT is a fundamental building block for many quantum algorithms:
1. Shor's algorithm - for period finding
2. Phase estimation - eigenvalue estimation
3. Quantum simulations - solving differential equations
4. Signal processing - frequency domain analysis

The circuit implementation uses Hadamard gates and controlled phase rotation gates in a specific pattern, followed by swap gates to reorder the qubits.`,
    realTimeExample: "Used in quantum chemistry simulations to analyze molecular vibrations and in quantum machine learning for feature extraction from quantum data.",
    steps: [
      "Apply Hadamard gate to first qubit",
      "Apply controlled rotation gates to subsequent qubits",
      "Repeat for all qubits in reverse order",
      "Apply swap gates to reorder qubits",
      "Output is the Fourier-transformed quantum state"
    ],
    code: `# Quantum Fourier Transform Implementation
from qiskit import QuantumCircuit
import numpy as np

def qft(circuit, n_qubits):
    """
    Apply QFT to the first n_qubits in circuit
    """
    # Apply QFT to each qubit
    for j in range(n_qubits):
        circuit.h(j)
        for k in range(j + 1, n_qubits):
            # Controlled rotation by pi/2^(k-j)
            angle = np.pi / (2 ** (k - j))
            circuit.cp(angle, k, j)
    
    # Swap qubits to correct order
    for j in range(n_qubits // 2):
        circuit.swap(j, n_qubits - j - 1)
    
    return circuit

def inverse_qft(circuit, n_qubits):
    """
    Apply inverse QFT (for phase estimation)
    """
    # Reverse order for inverse
    for j in range(n_qubits // 2):
        circuit.swap(j, n_qubits - j - 1)
    
    for j in reversed(range(n_qubits)):
        for k in reversed(range(j + 1, n_qubits)):
            angle = -np.pi / (2 ** (k - j))
            circuit.cp(angle, k, j)
        circuit.h(j)
    
    return circuit

# Create QFT circuit for 4 qubits
qc = QuantumCircuit(4)
qft(qc, 4)
print("4-qubit QFT circuit created")`,
    applications: ["Signal Processing", "Quantum Chemistry", "Machine Learning"],
    uses: [
      "Frequency domain analysis",
      "Phase estimation",
      "Signal decomposition",
      "Quantum state tomography",
      "Algorithmic primitives"
    ],
    realtimeApps: [
      "Quantum image processing",
      "Molecular vibration analysis",
      "Financial signal analysis",
      "Quantum sensor data processing",
      "Cryptographic analysis"
    ],
    circuit: [
      { type: "h", qubits: [0], label: "H" },
      { type: "cp", controls: [1], target: 0, angle: "π/2", label: "R2" },
      { type: "cp", controls: [2], target: 0, angle: "π/4", label: "R3" },
      { type: "cp", controls: [3], target: 0, angle: "π/8", label: "R4" },
      { type: "h", qubits: [1], label: "H" },
      { type: "cp", controls: [2], target: 1, angle: "π/2", label: "R2" },
      { type: "cp", controls: [3], target: 1, angle: "π/4", label: "R3" },
      { type: "h", qubits: [2], label: "H" },
      { type: "cp", controls: [3], target: 2, angle: "π/2", label: "R2" },
      { type: "h", qubits: [3], label: "H" },
      { type: "swap", qubits: [0, 3], label: "Swap" },
      { type: "swap", qubits: [1, 2], label: "Swap" }
    ],
    mathematicalBasis: `QFT transforms basis states:

QFT|j⟩ = 1/√N Σ_{k=0}^{N-1} ω^{jk} |k⟩
where ω = e^{2πi/N}, N = 2^n

Circuit complexity: O(n²) gates
Compared to classical FFT: O(N log N)`,
    references: [
      "Cooley, J. W., & Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series.",
      "Nielsen & Chuang. Quantum Computation and Quantum Information.",
      "Qiskit Textbook - Quantum Fourier Transform"
    ]
  },
  {
    id: "vqe",
    icon: <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />,
    title: "Variational Quantum Eigensolver",
    category: "Quantum Chemistry",
    complexity: "Hybrid",
    shortDescription: "Hybrid quantum-classical algorithm for finding ground states of molecules. Used in quantum chemistry simulations.",
    fullDescription: `The Variational Quantum Eigensolver (VQE) is a hybrid quantum-classical algorithm designed for near-term quantum computers. It finds the ground state energy of molecular systems by combining:
1. A parameterized quantum circuit (ansatz) to prepare trial states
2. Quantum measurements to estimate expectation values
3. Classical optimization to update parameters

VQE is particularly important because:
- It's noise-resilient (NISQ-friendly)
- Requires fewer qubits than quantum phase estimation
- Enables practical quantum chemistry calculations today

The algorithm works by minimizing the expectation value ⟨ψ(θ)|H|ψ(θ)⟩ where H is the Hamiltonian of the system and |ψ(θ)⟩ is the parameterized quantum state. This is done through iterative optimization where the quantum computer evaluates the energy and the classical computer updates parameters.`,
    realTimeExample: "Calculating the ground state energy of complex molecules like caffeine or penicillin, which is computationally prohibitive for classical computers but feasible with VQE on near-term quantum devices.",
    steps: [
      "Prepare parameterized quantum circuit (ansatz)",
      "Measure expectation values of Hamiltonian terms",
      "Classical optimization loop",
      "Update parameters based on gradient",
      "Converge to ground state energy"
    ],
    code: `# VQE for Hydrogen Molecule
from qiskit_nature.drivers import Molecule
from qiskit_nature.problems.second_quantization import ElectronicStructureProblem
from qiskit.algorithms import VQE
from qiskit.circuit.library import TwoLocal
from qiskit.algorithms.optimizers import COBYLA
from qiskit import Aer

def vqe_ground_state(molecule_geometry):
    """
    VQE implementation for molecular ground state
    """
    # Define molecule
    molecule = Molecule(geometry=molecule_geometry)
    
    # Create electronic structure problem
    problem = ElectronicStructureProblem(molecule)
    
    # Get qubit Hamiltonian
    qubit_op = problem.second_q_ops()[0]
    
    # Create variational form (ansatz)
    ansatz = TwoLocal(
        rotation_blocks='ry',
        entanglement_blocks='cz',
        entanglement='linear',
        reps=3
    )
    
    # Set up optimizer
    optimizer = COBYLA(maxiter=100)
    
    # Set up VQE
    backend = Aer.get_backend('statevector_simulator')
    vqe = VQE(
        ansatz=ansatz,
        optimizer=optimizer,
        quantum_instance=backend
    )
    
    # Compute ground state
    result = vqe.compute_minimum_eigenvalue(qubit_op)
    
    return result.eigenvalue

# Example: Hydrogen molecule
h2_geometry = [['H', [0., 0., 0.]],
               ['H', [0., 0., 0.735]]]
energy = vqe_ground_state(h2_geometry)
print(f"H2 ground state energy: {energy} Hartree")`,
    applications: ["Drug Discovery", "Material Science", "Catalysis Design"],
    uses: [
      "Molecular energy calculation",
      "Chemical reaction simulation",
      "Material property prediction",
      "Protein folding",
      "Catalyst design"
    ],
    realtimeApps: [
      "Pharmaceutical drug design",
      "Battery material optimization",
      "Catalyst development",
      "Polymer design",
      "Fuel cell optimization"
    ],
    circuit: [
      { type: "ry", qubits: [0], angle: "θ₁", label: "Rotation" },
      { type: "ry", qubits: [1], angle: "θ₂", label: "Rotation" },
      { type: "cx", controls: [0], target: 1, label: "Entangle" },
      { type: "ry", qubits: [2], angle: "θ₃", label: "Rotation" },
      { type: "cx", controls: [1], target: 2, label: "Entangle" },
      { type: "ry", qubits: [3], angle: "θ₄", label: "Rotation" },
      { type: "cx", controls: [2], target: 3, label: "Entangle" },
      { type: "measure", qubits: [0, 1, 2, 3], classical: [0, 1, 2, 3], label: "Measure" }
    ],
    mathematicalBasis: `VQE minimizes energy:

E(θ) = ⟨ψ(θ)|H|ψ(θ)⟩

where H = Σ_i c_i P_i (Pauli decomposition)
|ψ(θ)⟩ = U(θ)|0⟩ (parameterized circuit)

Optimization: θ_{k+1} = θ_k - η∇E(θ_k)`,
    references: [
      "Peruzzo, A., et al. (2014). A variational eigenvalue solver on a photonic quantum processor.",
      "McClean, J. R., et al. (2016). The theory of variational hybrid quantum-classical algorithms.",
      "Qiskit Nature Documentation"
    ]
  },
  {
    id: "qml",
    icon: <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
    title: "Quantum Machine Learning",
    category: "Machine Learning",
    complexity: "Varied",
    shortDescription: "Quantum algorithms for machine learning tasks including classification, clustering, and pattern recognition.",
    fullDescription: `Quantum Machine Learning (QML) leverages quantum computing to enhance machine learning algorithms. Key approaches include:

1. Quantum Neural Networks (QNNs): Parameterized quantum circuits trained via gradient descent
2. Quantum Kernel Methods: Using quantum feature maps to compute kernels in high-dimensional space
3. Quantum Generative Models: Learning and generating quantum data distributions
4. Quantum Optimization: Solving ML optimization problems on quantum hardware

QML offers potential advantages:
- Exponential speedup for specific problems
- Ability to work with quantum data natively
- Access to exponentially large feature spaces
- Natural implementation of certain ML primitives

Current applications include quantum classification, clustering, dimensionality reduction, and generative modeling.`,
    realTimeExample: "Quantum neural networks for financial fraud detection can analyze transaction patterns with exponential speedup, identifying fraudulent activities in real-time across millions of transactions.",
    steps: [
      "Encode classical data into quantum states",
      "Apply parameterized quantum circuit",
      "Measure quantum system to obtain predictions",
      "Compute loss function classically",
      "Update parameters via gradient descent",
      "Repeat until convergence"
    ],
    code: `# Quantum Machine Learning Classifier
from qiskit_machine_learning.algorithms import QSVC
from qiskit_machine_learning.kernels import QuantumKernel
from qiskit.circuit.library import ZZFeatureMap
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def quantum_svm_classifier():
    """
    Quantum Support Vector Classifier using quantum kernels
    """
    # Create quantum feature map
    feature_dimension = 4
    feature_map = ZZFeatureMap(
        feature_dimension=feature_dimension,
        reps=2,
        entanglement='linear'
    )
    
    # Create quantum kernel
    quantum_kernel = QuantumKernel(
        feature_map=feature_map,
        quantum_instance=Aer.get_backend('statevector_simulator')
    )
    
    # Generate sample data
    X, y = make_classification(
        n_samples=100,
        n_features=feature_dimension,
        n_classes=2,
        random_state=42
    )
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Create and train Quantum SVM
    qsvc = QSVC(quantum_kernel=quantum_kernel)
    qsvc.fit(X_train, y_train)
    
    # Predict and evaluate
    y_pred = qsvc.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    return accuracy

# Run quantum ML classifier
accuracy = quantum_svm_classifier()
print(f"Quantum SVM Accuracy: {accuracy:.2%}")`,
    applications: ["Pattern Recognition", "Anomaly Detection", "Financial Modeling"],
    uses: [
      "Quantum classification",
      "Feature mapping",
      "Pattern recognition",
      "Dimensionality reduction",
      "Generative modeling"
    ],
    realtimeApps: [
      "Fraud detection in banking",
      "Medical diagnosis assistance",
      "Stock market prediction",
      "Image classification",
      "Natural language processing"
    ],
    circuit: [
      { type: "h", qubits: [0, 1, 2, 3], label: "Superposition" },
      { type: "rz", qubits: [0], angle: "φ₁", label: "Encode x1" },
      { type: "rz", qubits: [1], angle: "φ₂", label: "Encode x2" },
      { type: "cz", qubits: [0, 1], label: "Entangle" },
      { type: "cz", qubits: [1, 2], label: "Entangle" },
      { type: "cz", qubits: [2, 3], label: "Entangle" },
      { type: "ry", qubits: [0], angle: "θ₁", label: "Trainable" },
      { type: "ry", qubits: [1], angle: "θ₂", label: "Trainable" },
      { type: "cx", controls: [0], target: [1], label: "CNOT" },
      { type: "measure", qubits: [0, 1], classical: [0, 1], label: "Measure" }
    ],
    mathematicalBasis: `Quantum kernel methods:

k(x, x') = |⟨φ(x)|φ(x')⟩|²

where φ(x) maps classical data to quantum states

Quantum neural networks:

f(x) = ⟨0|U^†(θ) M U(θ)|0⟩

where U(θ) is parameterized quantum circuit`,
    references: [
      "Biamonte, J., et al. (2017). Quantum machine learning.",
      "Schuld, M., & Petruccione, F. (2018). Supervised learning with quantum computers.",
      "Qiskit Machine Learning Documentation"
    ]
  },
  {
    id: "qkd",
    icon: <Shield className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />,
    title: "Quantum Key Distribution",
    category: "Security",
    complexity: "Linear",
    shortDescription: "BB84 protocol for secure cryptographic key exchange using quantum mechanics principles. Provides unconditional security.",
    fullDescription: `Quantum Key Distribution (QKD) enables two parties to generate a shared random secret key that can be used to encrypt and decrypt messages. The most famous protocol is BB84, invented by Charles Bennett and Gilles Brassard in 1984.

Key Principles:
1. Quantum Uncertainty: Measuring a quantum state disturbs it
2. No-Cloning Theorem: Quantum states cannot be copied
3. Entanglement: Can be used for enhanced protocols (E91)

BB84 Protocol Steps:
1. Alice sends qubits encoded in randomly chosen bases
2. Bob measures in randomly chosen bases
3. Public discussion about bases (no key bits revealed)
4. Error rate estimation to detect eavesdropping
5. Privacy amplification to remove leaked information

Security is guaranteed by the laws of quantum mechanics - any eavesdropping attempt introduces detectable errors.`,
    realTimeExample: "Used by banks and governments for ultra-secure communication. China's quantum satellite 'Micius' uses QKD to create hack-proof communication channels between Beijing and Shanghai.",
    steps: [
      "Alice generates random bits and random bases",
      "Alice sends encoded qubits to Bob",
      "Bob measures received qubits in random bases",
      "Alice and Bob publicly compare bases",
      "Estimate error rate to check for eavesdropping",
      "Perform privacy amplification on matching bits"
    ],
    code: `# BB84 Quantum Key Distribution Simulation
import numpy as np

class BB84Protocol:
    def __init__(self, key_length=256):
        self.key_length = key_length
        
    def generate_key(self):
        """
        Simulate BB84 protocol key generation
        """
        # Alice's random bits and bases
        alice_bits = np.random.randint(2, size=self.key_length)
        alice_bases = np.random.randint(2, size=self.key_length)
        
        # Bob's random bases
        bob_bases = np.random.randint(2, size=self.key_length)
        
        # Simulate quantum transmission with potential eavesdropping
        bob_bits = []
        error_rate = 0.15  # Simulated channel noise/eavesdropping
        
        for i in range(self.key_length):
            if np.random.random() < error_rate:
                # Simulate error/eavesdropping
                bob_bits.append(1 - alice_bits[i] if np.random.random() < 0.5 else alice_bits[i])
            else:
                if alice_bases[i] == bob_bases[i]:
                    bob_bits.append(alice_bits[i])
                else:
                    # Wrong basis - random result
                    bob_bits.append(np.random.randint(2))
        
        # Key sifting: keep bits where bases match
        matching_indices = np.where(alice_bases == bob_bases)[0]
        sifted_key = [bob_bits[i] for i in matching_indices]
        
        # Estimate error rate (simplified)
        sample_size = min(20, len(sifted_key))
        error_samples = sum(1 for i in range(sample_size) 
                          if sifted_key[i] != alice_bits[matching_indices[i]])
        estimated_error = error_samples / sample_size
        
        # Privacy amplification (simplified)
        if estimated_error < 0.11:  # BB84 error threshold
            final_key = sifted_key[:len(sifted_key)//2]  # Simple compression
            return final_key, estimated_error
        else:
            return None, estimated_error  # Abort if error too high

# Run BB84 simulation
bb84 = BB84Protocol(key_length=128)
key, error_rate = bb84.generate_key()
if key:
    print(f"Generated {len(key)}-bit secure key with {error_rate:.1%} error rate")
else:
    print(f"Key generation aborted: {error_rate:.1%} error rate exceeds threshold")`,
    applications: ["Secure Communication", "Military Encryption", "Financial Transactions"],
    uses: [
      "Secure key distribution",
      "Quantum cryptography",
      "Eavesdropping detection",
      "Network security",
      "Voting systems"
    ],
    realtimeApps: [
      "Government secure communications",
      "Banking transaction security",
      "Military command channels",
      "Healthcare data protection",
      "Critical infrastructure protection"
    ],
    circuit: [
      { type: "h", qubits: [0], label: "Random Basis" },
      { type: "measure", qubits: [0], classical: [0], label: "Measurement" },
      { type: "h", qubits: [1], label: "Key Bit" },
      { type: "measure", qubits: [1], classical: [1], label: "Received Bit" },
      { type: "h", qubits: [2], label: "Eve's Basis" },
      { type: "measure", qubits: [2], classical: [2], label: "Eve Measures" }
    ],
    mathematicalBasis: `BB84 security proof:

Let ε be eavesdropper's information
Let QBER be quantum bit error rate
Security condition: ε ≤ f(QBER)

Protocol uses two conjugate bases:
{|0⟩, |1⟩} and {|+⟩, |-⟩}
where |±⟩ = (|0⟩ ± |1⟩)/√2`,
    references: [
      "Bennett, C. H., & Brassard, G. (1984). Quantum cryptography: Public key distribution and coin tossing.",
      "Ekert, A. K. (1991). Quantum cryptography based on Bell's theorem.",
      "Scarani, V., et al. (2009). The security of practical quantum key distribution."
    ]
  }
];

const categories = [
  "All",
  "Cryptography",
  "Search",
  "Signal Processing",
  "Quantum Chemistry",
  "Machine Learning",
  "Security"
];

// Enhanced Circuit Visualization Component
const CircuitVisualization = ({ circuit, darkMode, algorithmName }) => {
  const maxQubits = Math.max(...circuit.flatMap(g => g.qubits)) + 1;
  
  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CircuitBoard className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
          <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {algorithmName} Circuit Diagram
          </h4>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-700'}`}>
          {maxQubits} Qubits
        </span>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'} overflow-x-auto`}>
        <div className="flex flex-col space-y-4 min-w-max">
          {/* Qubit Lines */}
          {Array.from({ length: maxQubits }).map((_, qubit) => (
            <div key={qubit} className="flex items-center min-h-[60px]">
              <span className={`w-16 text-sm font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                |q{qubit}⟩
              </span>
              <div className="flex-1 relative">
                {/* Timeline */}
                <div className={`absolute top-1/2 left-0 right-0 h-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                
                {/* Gates */}
                {circuit
                  .filter(gate => gate.qubits.includes(qubit))
                  .map((gate, idx) => {
                    const isControl = gate.controls && gate.controls.includes(qubit);
                    const isTarget = gate.target === qubit || (Array.isArray(gate.target) && gate.target.includes(qubit));
                    
                    return (
                      <div
                        key={`${qubit}-${idx}`}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${
                          gate.type === 'measure' ? 'w-32' : 
                          gate.type === 'swap' ? 'w-24' : 'w-20'
                        } h-10 ${
                          darkMode 
                            ? gate.type === 'measure' ? 'bg-gradient-to-r from-red-700 to-pink-800 border-red-500' :
                              gate.type === 'h' ? 'bg-gradient-to-r from-green-700 to-emerald-800 border-green-500' :
                              gate.type === 'cx' ? 'bg-gradient-to-r from-blue-700 to-indigo-800 border-blue-500' :
                              'bg-gradient-to-r from-cyan-700 to-blue-800 border-cyan-500'
                            : gate.type === 'measure' ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300' :
                              gate.type === 'h' ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300' :
                              gate.type === 'cx' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300' :
                              'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300'
                        } border rounded-lg flex items-center justify-center`}
                        style={{ left: `${idx * 120 + 20}px` }}
                      >
                        <span className={`text-xs font-bold ${
                          darkMode 
                            ? gate.type === 'measure' ? 'text-red-300' :
                              gate.type === 'h' ? 'text-green-300' :
                              gate.type === 'cx' ? 'text-blue-300' : 'text-cyan-300'
                            : gate.type === 'measure' ? 'text-red-700' :
                              gate.type === 'h' ? 'text-green-700' :
                              gate.type === 'cx' ? 'text-blue-700' : 'text-blue-700'
                        }`}>
                          {gate.type.toUpperCase()}
                          {gate.angle && `\n${gate.angle}`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Gate Legend */}
        <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <h5 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Gate Legend
          </h5>
          <div className="flex flex-wrap gap-3">
            {[...new Set(circuit.map(g => g.type))].map((gateType, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-8 h-6 rounded flex items-center justify-center ${
                  darkMode 
                    ? gateType === 'h' ? 'bg-green-700/30 text-green-300' :
                      gateType === 'cx' ? 'bg-blue-700/30 text-blue-300' :
                      gateType === 'measure' ? 'bg-red-700/30 text-red-300' :
                      'bg-gray-700 text-cyan-300'
                    : gateType === 'h' ? 'bg-green-100 text-green-700' :
                      gateType === 'cx' ? 'bg-blue-100 text-blue-700' :
                      gateType === 'measure' ? 'bg-red-100 text-red-700' :
                      'bg-gray-200 text-blue-700'
                }`}>
                  <span className="text-xs font-bold">{gateType.toUpperCase()}</span>
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {gateType === 'h' ? 'Hadamard' : 
                   gateType === 'cx' ? 'CNOT' : 
                   gateType === 'measure' ? 'Measurement' : 
                   gateType === 'swap' ? 'Swap' : 
                   gateType === 'cp' ? 'Phase' : 
                   gateType === 'ccx' ? 'Toffoli' :
                   gateType === 'rz' ? 'Rotation Z' :
                   gateType === 'ry' ? 'Rotation Y' :
                   gateType.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Algorithm Details Modal Component
const AlgorithmDetailsModal = ({ algorithm, isOpen, onClose, darkMode }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(algorithm.code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const runSimulation = () => {
    alert(`🚀 Running ${algorithm.title} Simulation...\n\n${algorithm.realTimeExample}`);
    setTimeout(() => {
      alert(`✅ ${algorithm.title} completed successfully!\n\nThis demonstrates how quantum algorithms can solve problems exponentially faster than classical approaches.`);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 p-6 border-b ${
            darkMode ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'
          } backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'
                }`}>
                  {algorithm.icon}
                </div>
                <div>
                  <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {algorithm.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {algorithm.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      darkMode ? 'bg-gray-800 text-amber-300' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {algorithm.complexity} Complexity
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      darkMode ? 'bg-gray-800 text-green-300' : 'bg-green-100 text-green-700'
                    }`}>
                      Quantum Advantage
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-180px)] p-6 pb-32 sm:max-h-[calc(90vh-120px)] sm:pb-24">
            <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
              {["overview", "circuit", "implementation", "math", "applications"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    activeSection === section
                      ? darkMode
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {section === 'math' ? 'Mathematical Basis' : section}
                </button>
              ))}
            </div>

            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Full Description */}
                <div>
                  <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Algorithm Overview
                  </h3>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <p className="whitespace-pre-line">{algorithm.fullDescription}</p>
                  </div>
                </div>

                {/* Real-time Example */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Real-time Example
                    </h4>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-amber-50 border border-amber-200'}`}>
                    <p className={darkMode ? 'text-amber-200' : 'text-amber-900'}>{algorithm.realTimeExample}</p>
                  </div>
                </div>

                {/* Algorithm Steps */}
                <div>
                  <h4 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Algorithm Steps
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {algorithm.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl ${
                          darkMode 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-white border border-gray-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            darkMode 
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}>
                            <span className="text-white text-sm font-bold">{idx + 1}</span>
                          </div>
                          <span className={`font-medium ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`}>
                            Step {idx + 1}
                          </span>
                        </div>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Circuit Section */}
            {activeSection === "circuit" && (
              <div>
                <CircuitVisualization 
                  circuit={algorithm.circuit} 
                  darkMode={darkMode}
                  algorithmName={algorithm.title}
                />
                
                {/* Circuit Explanation */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-6`}>
                  <h4 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Circuit Explanation
                  </h4>
                  <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {algorithm.circuit.map((gate, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          darkMode ? 'bg-gray-700 text-cyan-300' : 'bg-gray-200 text-blue-700'
                        }`}>
                          {gate.type.toUpperCase()}
                        </span>
                        <span>
                          {gate.label || `Gate applied to qubit${gate.qubits.length > 1 ? 's' : ''} ${gate.qubits.join(', ')}`}
                          {gate.angle && ` with angle ${gate.angle}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Implementation Section */}
            {activeSection === "implementation" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Python Implementation
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                        darkMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {copiedCode ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => alert(`Exporting ${algorithm.title} as Python file...`)}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                        darkMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
                
                <pre className={`p-6 rounded-xl overflow-x-auto text-sm ${
                  darkMode 
                    ? 'bg-gray-950 text-gray-300 border border-gray-800' 
                    : 'bg-gray-900 text-gray-100 border border-gray-700'
                }`}>
                  <code>{algorithm.code}</code>
                </pre>
                
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                  <h5 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                    Implementation Notes
                  </h5>
                  <ul className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                    <li>• This implementation uses Qiskit for quantum circuit simulation</li>
                    <li>• For real quantum hardware, backend would be changed to actual quantum processor</li>
                    <li>• Error handling and optimization are simplified for demonstration</li>
                    <li>• Requires Python 3.8+ and Qiskit installation</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Mathematical Basis Section */}
            {activeSection === "math" && (
              <div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                  <h4 className={`font-bold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mathematical Foundation
                  </h4>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} font-mono text-sm whitespace-pre-line`}>
                    {algorithm.mathematicalBasis}
                  </div>
                </div>
                
                {/* References */}
                <div className="mt-6">
                  <h5 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    References
                  </h5>
                  <div className="space-y-2">
                    {algorithm.references.map((ref, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                        <span className="text-sm">{ref}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Applications Section */}
            {activeSection === "applications" && (
              <div className="space-y-6">
                {/* All Uses */}
                <div>
                  <h4 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    All Uses
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {algorithm.uses.map((use, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          darkMode 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-white border border-gray-200 shadow-sm'
                        }`}
                      >
                        <Target className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{use}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Applications */}
                <div>
                  <h4 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Real-time Applications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {algorithm.realtimeApps.map((app, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          darkMode 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-white border border-gray-200 shadow-sm'
                        }`}
                      >
                        <Globe className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <h4 className={`font-bold text-lg mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Application Areas
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {algorithm.applications.map((app, idx) => (
                      <span
                        key={idx}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          darkMode
                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-300 border border-gray-700'
                            : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`sticky bottom-0 p-4 border-t ${
            darkMode ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'
          } backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <button
                onClick={runSimulation}
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
                  darkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                }`}
              >
                <PlayCircle className="w-5 h-5" />
                Run Algorithm Simulation
              </button>
              <a
                href={`https://en.wikipedia.org/wiki/${algorithm.title.replace(/'s /, '_')}_algorithm`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ExternalLink className="w-5 h-5" />
                Learn More on Wikipedia
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Component
export default function QuantumAlgorithms({ darkMode }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedAlgorithm, setExpandedAlgorithm] = useState(null);
  const [detailedAlgorithm, setDetailedAlgorithm] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [highlightedCard, setHighlightedCard] = useState(null);

  const filteredAlgorithms = selectedCategory === "All" 
    ? algorithms 
    : algorithms.filter(algo => algo.category === selectedCategory);

  const copyToClipboard = (code, algorithmId) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(algorithmId);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const runAlgorithmSimulation = (algorithm) => {
    alert(`🚀 Running ${algorithm.title} Simulation...\n\n${algorithm.realTimeExample}`);
    setTimeout(() => {
      alert(`✅ ${algorithm.title} completed successfully!\n\nThis demonstrates how quantum algorithms can solve problems exponentially faster than classical approaches.`);
    }, 1500);
  };

  const handleReadMore = (algorithmId) => {
    setHighlightedCard(algorithmId);
    setDetailedAlgorithm(algorithmId);
    
    // Scroll to the card if it's not in view
    const cardElement = document.getElementById(`card-${algorithmId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className={`min-h-screen py-20 px-4 ${darkMode ? "bg-transparent" : "light-mode-theme"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-6">
            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-gray-800/70 border-gray-700" : "bg-gradient-to-br from-blue-50 to-purple-50 border-violet-300"}`}>
              <CircuitBoard className="w-14 h-14 text-blue-600 dark:text-cyan-400" />
            </div>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${darkMode
            ? "text-white"
            : "bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-500 bg-clip-text text-transparent"}`}>
            Quantum <span className="gradient-text">Algorithms</span> Explorer
          </h1>
          <p className={`text-xl max-w-4xl mx-auto mb-8 ${darkMode ? "text-gray-300" : "light-body"}`}>
            Explore fundamental quantum algorithms with real-time examples, implementation code, circuit visualizations, and practical applications. 
            Each algorithm demonstrates quantum advantage over classical approaches.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? darkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : darkMode
                    ? "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    : "bg-white border border-violet-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredAlgorithms.map((algorithm, index) => (
            <motion.div
              id={`card-${algorithm.id}`}
              key={algorithm.id}
              className={`rounded-2xl overflow-hidden border shadow-lg transition-all duration-500 ${
                darkMode 
                  ? "bg-gray-800/70 border-gray-700" 
                  : "bg-white border-violet-300"
              } ${
                highlightedCard === algorithm.id 
                  ? darkMode 
                    ? "ring-4 ring-cyan-500/50 shadow-2xl shadow-cyan-500/20 transform scale-[1.02]" 
                    : "ring-4 ring-blue-500/50 shadow-2xl shadow-blue-500/20 transform scale-[1.02]"
                  : "hover:shadow-xl"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Algorithm Header */}
              <div className={`p-6 border-b ${
                darkMode ? "border-gray-700" : "border-violet-200"
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      darkMode ? "bg-gray-700" : "bg-gradient-to-br from-blue-50 to-purple-50"
                    }`}>
                      {algorithm.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {algorithm.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? "bg-gray-700 text-gray-300" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {algorithm.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? "bg-gray-700 text-amber-300" 
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {algorithm.complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedAlgorithm(expandedAlgorithm === algorithm.id ? null : algorithm.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode 
                        ? "hover:bg-gray-700" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedAlgorithm === algorithm.id ? "rotate-180" : ""
                    } ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                  </button>
                </div>
                
                <p className={`${darkMode ? "text-gray-300" : "light-body"} mb-4`}>
                  {algorithm.shortDescription}
                </p>
                
                {/* Read More Button */}
                <button
                  onClick={() => handleReadMore(algorithm.id)}
                  className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 mb-4 ${
                    darkMode
                      ? "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20 text-cyan-400 border border-cyan-500/30"
                      : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-blue-600 border border-blue-500/30"
                  }`}
                >
                  <Maximize2 className="w-4 h-4" />
                  Read Full Algorithm Details
                </button>
                
                {/* Uses and Real-time Applications */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Primary Uses
                      </span>
                    </div>
                    <div className="space-y-1">
                      {algorithm.uses.slice(0, 2).map((use, idx) => (
                        <div key={idx} className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          • {use}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Atom className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Real-time Apps
                      </span>
                    </div>
                    <div className="space-y-1">
                      {algorithm.realtimeApps.slice(0, 2).map((app, idx) => (
                        <div key={idx} className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          • {app}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              <AnimatePresence>
                {expandedAlgorithm === algorithm.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 border-t border-dashed"
                  >
                    {/* Circuit Visualization */}
                    <CircuitVisualization 
                      circuit={algorithm.circuit} 
                      darkMode={darkMode}
                      algorithmName={algorithm.title}
                    />

                    {/* Real-time Example */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className={`w-5 h-5 ${
                          darkMode ? "text-amber-400" : "text-amber-600"
                        }`} />
                        <h4 className={`font-bold text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Real-time Example
                        </h4>
                      </div>
                      <div className={`p-4 rounded-xl ${
                        darkMode 
                          ? "bg-gray-700/50 border border-gray-600" 
                          : "bg-gradient-to-br from-blue-50 to-purple-50 border border-violet-200"
                      }`}>
                        <p className={`${darkMode ? "text-gray-300" : "light-body"}`}>
                          {algorithm.realTimeExample}
                        </p>
                      </div>
                    </div>

                    {/* Algorithm Steps */}
                    <div className="mb-6">
                      <h4 className={`font-bold text-lg mb-3 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        Algorithm Steps
                      </h4>
                      <div className="space-y-2">
                        {algorithm.steps.slice(0, 4).map((step, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-3"
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              darkMode 
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600" 
                                : "bg-gradient-to-r from-blue-500 to-purple-500"
                            }`}>
                              <span className="text-white text-xs font-bold">{idx + 1}</span>
                            </div>
                            <span className={darkMode ? "text-gray-300" : "light-body"}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Code Preview */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-bold text-lg ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Code Preview
                        </h4>
                        <button
                          onClick={() => copyToClipboard(algorithm.code, algorithm.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {copiedCode === algorithm.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy Code
                            </>
                          )}
                        </button>
                      </div>
                      <pre className={`p-4 rounded-xl overflow-x-auto text-xs max-h-40 ${
                        darkMode 
                          ? "bg-gray-900 text-gray-300 border border-gray-700" 
                          : "bg-gray-50 text-gray-800 border border-gray-200"
                      }`}>
                        <code>{algorithm.code.split('\n').slice(0, 15).join('\n')}...</code>
                      </pre>
                    </div>

                    {/* View Full Details Button */}
                    <button
                      onClick={() => handleReadMore(algorithm.id)}
                      className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                        darkMode
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      View Complete Algorithm Details
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Actions */}
              <div className={`p-4 border-t ${
                darkMode ? "border-gray-700 bg-gray-800/50" : "border-violet-200 bg-gray-50"
              }`}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => runAlgorithmSimulation(algorithm)}
                    className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
                      darkMode
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md"
                    }`}
                  >
                    <PlayCircle className="w-5 h-5" />
                    Run Simulation
                  </button>
                  <a
                    href={`https://en.wikipedia.org/wiki/${algorithm.title.replace(/'s /, '_')}_algorithm`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
                      darkMode
                        ? "text-gray-400 hover:text-cyan-400"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Algorithm Details Modal */}
        <AlgorithmDetailsModal
          algorithm={algorithms.find(a => a.id === detailedAlgorithm)}
          isOpen={detailedAlgorithm !== null}
          onClose={() => {
            setDetailedAlgorithm(null);
            setHighlightedCard(null);
          }}
          darkMode={darkMode}
        />

        {/* Quantum Advantage Section */}
        <motion.div
          className={`p-8 rounded-2xl mb-12 ${
            darkMode 
              ? "bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700" 
              : "bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-violet-300"
          }`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <Brain className={`w-14 h-14 mx-auto mb-4 ${
              darkMode ? "text-cyan-400" : "text-purple-600"
            }`} />
            <h2 className={`text-3xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Quantum Advantage Explained
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              darkMode ? "text-gray-300" : "light-body"
            }`}>
              Quantum algorithms provide exponential speedups for specific problems by leveraging superposition, entanglement, and interference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-violet-200"
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  darkMode ? "bg-cyan-900/30" : "bg-blue-100"
                }`}>
                  <Clock className={`w-6 h-6 ${
                    darkMode ? "text-cyan-400" : "text-blue-600"
                  }`} />
                </div>
                <h3 className={`font-bold text-lg ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  Exponential Speedup
                </h3>
              </div>
              <p className={darkMode ? "text-gray-300" : "light-body"}>
                Problems like integer factorization (Shor's) and unstructured search (Grover's) see quadratic to exponential improvements over classical algorithms.
              </p>
            </div>

            <div className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-violet-200"
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  darkMode ? "bg-purple-900/30" : "bg-purple-100"
                }`}>
                  <BarChart2 className={`w-6 h-6 ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`} />
                </div>
                <h3 className={`font-bold text-lg ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  Real-world Applications
                </h3>
              </div>
              <p className={darkMode ? "text-gray-300" : "light-body"}>
                From drug discovery and material science to financial modeling and cryptography, quantum algorithms enable breakthroughs across industries.
              </p>
            </div>

            <div className={`p-6 rounded-xl ${
              darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-violet-200"
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  darkMode ? "bg-green-900/30" : "bg-green-100"
                }`}>
                  <Users className={`w-6 h-6 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`} />
                </div>
                <h3 className={`font-bold text-lg ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  Accessible Learning
                </h3>
              </div>
              <p className={darkMode ? "text-gray-300" : "light-body"}>
                With simulators and cloud access, anyone can experiment with quantum algorithms and understand their transformative potential.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Resources Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className={`text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            Ready to Dive Deeper?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://qiskit.org/textbook/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-3 ${
                darkMode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Qiskit Textbook
            </a>
            <a
              href="https://quantum-computing.ibm.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-3 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300"
                  : "bg-white border border-violet-300 hover:bg-gray-50 text-gray-700 shadow-lg"
              }`}
            >
              <CpuIcon className="w-5 h-5" />
              IBM Quantum Experience
            </a>
            <a
              href="https://github.com/Qiskit"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-3 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300"
                  : "bg-white border border-violet-300 hover:bg-gray-50 text-gray-700 shadow-lg"
              }`}
            >
              <Code className="w-5 h-5" />
              GitHub Repositories
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}