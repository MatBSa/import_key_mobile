let keyPair = null;

document.getElementById('csr-button').onclick = function (event) {
    event.preventDefault();
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.showModal();
}

document.getElementById('close-dialog').onclick = function () {
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.close();
}

window.onclick = function (event) {
    if (event.target.className === 'dialog') {
        event.target.close();
    }
}

async function generateAsymmetricKey() {
    try {
        keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );
        alert("Chave gerada com sucesso");
    } catch (error) {
        console.error("Erro ao gerar a chave:", error);
        alert("Erro ao gerar a chave: " + error);
    }
}

document.getElementById('generate-key-button').onclick = function (event) {
    event.preventDefault();
    generateAsymmetricKey();
}
