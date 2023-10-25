let keyPair = null;

const alg = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256",
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength: 2048,
};

function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

document.getElementById('csr-button').onclick = function (event) {
    event.preventDefault();
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.showModal();
}

function clearDialog() {
    var csrDialog = document.getElementById('csr-dialog');

    var formElements = csrDialog.getElementsByTagName('input');
    for (var i = 0;i < formElements.length;i++) {
        if (formElements[i].type != 'button') {
            formElements[i].value = '';
        }
    }

    document.getElementById('csr-text').textContent = '';
}

document.getElementById('close-dialog').onclick = function () {
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.close();
    clearDialog();
}

window.onclick = function (event) {
    if (event.target.className === 'dialog') {
        event.target.close();
        clearDialog();
    }
}

async function generateAsymmetricKey() {
    try {
        keyPair = await crypto.subtle.generateKey(alg, true, ["sign", "verify"]);

        const exportedKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        let keyName = buf2hex(exportedKey);
        keyName = keyName.slice(-32);

        let db;
        const request = indexedDB.open("KeyDatabase", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.createObjectStore("keys", { keyPath: "name" });
        };
        request.onsuccess = function (event) {
            db = event.target.result;

            const transaction = db.transaction(["keys"], "readwrite");
            const objectStore = transaction.objectStore("keys");
            objectStore.add({ name: keyName, key: keyPair });

            alert("Chave gerada com sucesso. O nome da chave é: " + keyName);

            updateKeyList(db);
        };
    } catch (error) {
        alert("Erro ao gerar a chave: " + error);
    }
}

function updateKeyList(db) {
    const transaction = db.transaction(["keys"], "readonly");
    const objectStore = transaction.objectStore("keys");

    const request = objectStore.getAll();
    request.onsuccess = function (event) {
        const keys = event.target.result;

        const keyListElement = document.getElementById('stored-keys');
        keyListElement.innerHTML = '';
        keys.forEach(key => {
            const listItemElement = document.createElement('li');
            listItemElement.textContent = key.name;
            keyListElement.appendChild(listItemElement);
        });
    };
}

document.getElementById('generate-key-button').onclick = function (event) {
    event.preventDefault();
    generateAsymmetricKey();
}

document.getElementById('generate-csr-button').addEventListener('click', async function (event) {
    event.preventDefault();

    const cn = document.getElementById('cn').value;
    const o = document.getElementById('o').value;
    const ou = document.getElementById('ou').value;
    const c = document.getElementById('c').value;
    const s = document.getElementById('s').value;
    const l = document.getElementById('l').value;
    const e = document.getElementById('e').value;

    if (!keyPair) {
        alert("Por favor, gere um par de chaves primeiro.");
        return;
    }

    if (!cn) {
        alert("Por favor, informe um CN.");
        return;
    }

    try {
        const csr = await x509.Pkcs10CertificateRequestGenerator.create({
            name: '/C=' + c + '/ST=' + s + '/L=' + l + '/O=' + o + '/OU=' + ou + '/CN=' + cn + '/emailAddress=' + e,
            keys: keyPair,
            signingAlgorithm: alg,
            extensions: [
                new x509.KeyUsagesExtension(x509.KeyUsageFlags.digitalSignature | x509.KeyUsageFlags.keyEncipherment),
            ],
            attributes: [
                new x509.ChallengePasswordAttribute("password"),
            ]
        });

        document.getElementById('csr-text').textContent = csr;
    } catch (error) {
        alert("Erro ao gerar o CSR: " + error);
    }
});
