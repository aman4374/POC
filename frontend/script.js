const backendUrl = "http://127.0.0.1:5000";

async function encryptMessage() {
    const message = document.getElementById("message").value;
    if (!message) {
        alert("Enter a message to encrypt!");
        return;
    }

    const response = await fetch(`${backendUrl}/encrypt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    document.getElementById("encryptedMessage").textContent = data.encrypted_message;
    document.getElementById("seed").textContent = data.seed;
}

async function decryptMessage() {
    const encryptedMessage = document.getElementById("decryptInput").value;
    const seed = document.getElementById("seedInput").value;

    if (!encryptedMessage || !seed) {
        alert("Enter both encrypted message and seed!");
        return;
    }

    const response = await fetch(`${backendUrl}/decrypt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ encrypted_message: encryptedMessage, seed })
    });

    const data = await response.json();
    document.getElementById("decryptedMessage").textContent = data.decrypted_message;
}
