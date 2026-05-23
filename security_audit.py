import os
import re
import json
from datetime import datetime

# Configuration
PROJECT_ROOT = os.getcwd()
REPORT_FILE = "security_report.json"
EXCLUDE_DIRS = {".next", "node_modules", "venv", "__pycache__", ".git"}
EXCLUDE_FILES = {os.path.basename(__file__), REPORT_FILE}
SENSITIVE_PATTERNS = [
    (r"(?i)api_key\s*=\s*['\"][\w-]{10,}['\"]", "Hardcoded API Key"),
    (r"(?i)password\s*=\s*['\"][\w-]{5,}['\"]", "Hardcoded Password"),
    (r"(?i)secret\s*=\s*['\"][\w-]{10,}['\"]", "Hardcoded Secret"),
    (r"eval\(", "Use of dangerous eval() function"),
    (r"os\.system\(", "Potential Command Injection point"),
    (r"subprocess\.run\(.*shell=True", "Insecure shell=True in subprocess"),
    (r"dangerouslySetInnerHTML", "React XSS vulnerability (dangerouslySetInnerHTML)"),
    (r"cipher_suite\.decrypt\(", "Encryption/Decryption execution point"),
    (r"OAuth2PasswordBearer", "Authentication endpoint pattern"),
]

def analyze_file(file_path):
    findings = []
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            for pattern, description in SENSITIVE_PATTERNS:
                matches = re.finditer(pattern, content)
                for match in matches:
                    findings.append({
                        "pattern_found": match.group(),
                        "description": description,
                        "line": content.count("\n", 0, match.start()) + 1
                    })
    except Exception as e:
        findings.append({"error": str(e)})
    return findings

def get_file_purpose(file_name, extension):
    mapping = {
        ".py": "Python Backend Logic",
        ".tsx": "React Component (TypeScript)",
        ".ts": "TypeScript Logic",
        ".js": "JavaScript Logic",
        ".json": "Configuration Data",
        ".html": "HTML Structure",
        ".css": "Styling",
        "Dockerfile": "Container Configuration",
        "docker-compose.yml": "Orchestration Configuration",
        ".env": "Environment Variables (SENSITIVE)"
    }
    return mapping.get(extension, mapping.get(file_name, "Source File"))

def run_audit():
    audit_results = {
        "timestamp": datetime.now().isoformat(),
        "project_root": PROJECT_ROOT,
        "scanned_files": []
    }

    print(f"--- Starting Cyber Security Audit at {PROJECT_ROOT} ---")

    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for file in files:
            if file in EXCLUDE_FILES:
                continue
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, PROJECT_ROOT)
            _, ext = os.path.splitext(file)

            file_data = {
                "file": rel_path,
                "type": ext,
                "purpose": get_file_purpose(file, ext),
                "security_findings": analyze_file(file_path),
                "status": "PASS"
            }

            if any("error" not in f for f in file_data["security_findings"]):
                file_data["status"] = "WARNING/FAIL"

            audit_results["scanned_files"].append(file_data)
            print(f"Scanned: {rel_path} | Status: {file_data['status']}")

    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        json.dump(audit_results, f, indent=4)

    print(f"\n--- Audit Complete! ---")
    print(f"Detailed JSON report saved to: {REPORT_FILE}")

if __name__ == "__main__":
    run_audit()
