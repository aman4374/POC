let globalSeed = null;
let encryptedData = null;
let aesKey = null;
let nonce = null;

// Initialize Vanta.js background
VANTA.WAVES({
  el: "#background",
  color: "#6a11cb",
  shininess: 50,
});

async function deriveKeyFromSeed(seed) {
  const hash = await crypto.subtle.digest("SHA-384", seed);
  const fullHash = new Uint8Array(hash);
  const keyBytes = fullHash.slice(0, 32);
  nonce = fullHash.slice(32, 48);

  return crypto.subtle.importKey("raw", keyBytes, { name: "AES-CTR" }, false, ["encrypt", "decrypt"]);
}

async function encrypt() {
  const message = document.getElementById("inputMessage").value;
  if (!message.trim()) {
    alert("Please enter a message to encrypt.");
    return;
  }

  const msgBuffer = new TextEncoder().encode(message);
  globalSeed = crypto.getRandomValues(new Uint8Array(48));

  aesKey = await deriveKeyFromSeed(globalSeed);
  encryptedData = await crypto.subtle.encrypt({ name: "AES-CTR", counter: nonce, length: 64 }, aesKey, msgBuffer);

  document.getElementById("seedOutput").textContent = Array.from(globalSeed).map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById("encryptedOutput").textContent = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  document.getElementById("decryptedOutput").textContent = "--";
}

async function manualDecrypt() {
  const seedInput = document.getElementById("manualSeed").value;
  const encryptedMessageInput = document.getElementById("manualEncryptedMessage").value;

  if (!seedInput || !encryptedMessageInput) {
    alert("Please provide both seed and encrypted message.");
    return;
  }

  // Convert seed to Uint8Array from hex string
  const seed = new Uint8Array(seedInput.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  // Convert Base64 encrypted message back to array
  const encryptedMessage = new Uint8Array(atob(encryptedMessageInput).split('').map(c => c.charCodeAt(0)));

  // Derive the key and nonce from seed
  aesKey = await deriveKeyFromSeed(seed);
  encryptedData = encryptedMessage;

  const decrypted = await crypto.subtle.decrypt({ name: "AES-CTR", counter: nonce, length: 64 }, aesKey, encryptedData);
  const decryptedMessage = new TextDecoder().decode(decrypted);

  document.getElementById("decryptedOutput").textContent = decryptedMessage;
}

function copyToClipboard(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const copiedTextSpan = document.getElementById(id + 'Copied');
    copiedTextSpan.style.display = 'inline'; // Show "Copied!"
    setTimeout(() => {
      copiedTextSpan.style.display = 'none'; // Hide "Copied!" after 2 seconds
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy text: ", err);
  });
}
