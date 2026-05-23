# Contributing to Autonomous 3D Job Application Pipeline

First off, thank you for considering contributing to the Autonomous 3D Job Application Pipeline! It's people like you that make open source such a fantastic community to learn, inspire, and create.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please treat all contributors with respect.

## Getting Started

### 1. Fork and Clone
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/automated_job_pipeline.git
   ```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd automated_job_pipeline/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```

## Development Workflow

### Adding New AI Agents
When adding a new agent to the CrewAI pipeline:
1. Navigate to `backend/app/agents/crew.py`.
2. Define the new `Agent` with a clear `role`, `goal`, and `backstory`.
3. If the agent requires new Pydantic validation, add the schema in `backend/app/models/schemas.py`.

### Updating the 3D WebGL UI
When adding new 3D assets or animations:
1. React Three Fiber components live in `frontend/src/components/`.
2. Keep `.glb` or `.gltf` assets in `frontend/public/models/`.
3. Ensure any new physics loops in `useFrame` are optimized to avoid dropping frame rates (target 60fps).

## Security Guidelines
This project handles highly sensitive user data. When contributing:
- **Do not** disable the `slowapi` rate limits.
- **Do not** log raw, unencrypted PII (Personally Identifiable Information). Use the AES-256 encryption utilities in `core/security.py` when handling sensitive strings.

## Pull Request Process

1. Create a new branch for your feature: `git checkout -b feature/amazing-feature`
2. Commit your changes with descriptive commit messages.
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request against the `main` branch.
5. Ensure all tests and linting pass before requesting a review.

Thank you for your contributions!
