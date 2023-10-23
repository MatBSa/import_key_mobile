document.getElementById('csr-button').onclick = function (event) {
    event.preventDefault();
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.showModal();
}

document.getElementById('export-button').onclick = function (event) {
    event.preventDefault();
    var exportDialog = document.getElementById('export-dialog');
    exportDialog.showModal();
}

document.getElementById('close-dialog').onclick = function () {
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.close();
}

document.getElementById('close-export-dialog').onclick = function () {
    var exportDialog = document.getElementById('export-dialog');
    exportDialog.close();
}

window.onclick = function (event) {
    if (event.target.className === 'dialog') {
        event.target.close();
    }
}

async function generateAsymmetricKey() {
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );

        const keyList = document.getElementById("key-list");
        const keyListItem = document.createElement("li");
        keyListItem.textContent = "Chave gerada: " + new Date().toLocaleString();
        keyList.appendChild(keyListItem);
    } catch (error) {
        console.error("Erro ao gerar a chave:", error);
    }
}

document.getElementById('generate-key-button').onclick = function (event) {
    event.preventDefault();
    generateAsymmetricKey();
}
