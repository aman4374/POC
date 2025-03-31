# Cryptographically Secure Random Number Generator (CSPRNG) with Quantum-Inspired Entropy

This project implements a Cryptographically Secure Random Number Generator (CSPRNG) using AES-CTR mode. It integrates Elliptic Curve Diffie-Hellman (ECDH) key exchange and Quantum-inspired entropy to generate highly secure random numbers. Additionally, it supports encryption and decryption of messages, providing a user-friendly frontend for demonstration.

## Features
- **ECDH Key Exchange:** Securely establishes a shared secret using elliptic curve cryptography.
- **Quantum Random Number Generator (QRNG) Simulation:** Uses `os.urandom(32)` for cryptographically secure entropy.
- **AES-CTR Encryption & Decryption:** Provides secure message encryption and decryption using AES in Counter (CTR) mode.
- **SHA-384 for Secure Seed Generation:** Ensures robust seed generation by combining the shared secret and quantum entropy.
- **Interactive Frontend:** Built using HTML, CSS, and JavaScript for a seamless user experience.

## Project Structure
```
csprng_project/
│
├── backend/
│   ├── app.py             # Flask API for encryption and decryption
├── frontend/
│   ├── index.html         # Main frontend file
│   ├── style.css          # Stylesheet for frontend
│   ├── script.js          # JavaScript for API requests and UI interactions
├── README.md              # Project documentation
```

## Prerequisites
Ensure you have the following installed on your system:
- Python 3.8 or above
- Flask
- Flask-CORS
- Cryptography library

## Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/csprng-project.git
cd csprng_project
```

2. Install dependencies:
```bash
pip install flask flask-cors cryptography
```

## Running the Project
### Step 1: Start the Backend
Navigate to the `backend` directory and run the backend server using Flask:
```bash
cd backend
python app.py
```
Backend will be accessible at `http://127.0.0.1:5000`

### Step 2: Open the Frontend
Navigate to the `frontend` directory and open `index.html` in your browser.

### Step 3: Perform Encryption and Decryption
1. Enter a message and click on **Encrypt**.
2. Copy the encrypted message and seed.
3. Paste them into the decryption fields and click on **Decrypt** to retrieve the original message.


Feel free to submit issues and pull requests to improve this project!

## License
This project is licensed under the MIT License.

