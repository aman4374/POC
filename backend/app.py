import os
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Generate a shared secret using ECDH
def generate_shared_secret():
    alice_private_key = ec.generate_private_key(ec.SECP384R1())
    bob_private_key = ec.generate_private_key(ec.SECP384R1())

    shared_secret = alice_private_key.exchange(ec.ECDH(), bob_private_key.public_key())
    return shared_secret

# Simulate Quantum Random Number Generation
def get_quantum_random_number():
    return os.urandom(32)

# Create a secure seed using SHA-384
def create_seed(shared_secret, qrng_output):
    digest = hashes.Hash(hashes.SHA384())
    digest.update(shared_secret + qrng_output)
    return digest.finalize()

# Encrypt message using AES-CTR
def encrypt_message(message, seed):
    key = seed[:32]
    nonce = seed[32:48]
    cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(message.encode()) + encryptor.finalize()
    return base64.b64encode(ciphertext).decode()

# Decrypt message using AES-CTR
def decrypt_message(ciphertext, seed):
    key = seed[:32]
    nonce = seed[32:48]
    cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=default_backend())
    decryptor = cipher.decryptor()
    plaintext = decryptor.update(base64.b64decode(ciphertext)) + decryptor.finalize()
    return plaintext.decode()

@app.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.json
    message = data.get("message")
    
    shared_secret = generate_shared_secret()
    qrng_output = get_quantum_random_number()
    seed = create_seed(shared_secret, qrng_output)

    encrypted_message = encrypt_message(message, seed)
    return jsonify({"encrypted_message": encrypted_message, "seed": base64.b64encode(seed).decode()})

@app.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.json
    encrypted_message = data.get("encrypted_message")
    seed = base64.b64decode(data.get("seed"))

    decrypted_message = decrypt_message(encrypted_message, seed)
    return jsonify({"decrypted_message": decrypted_message})

if __name__ == "__main__":
    app.run(debug=True)
