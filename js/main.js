let keyPair = null;

const alg = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256",
    publicExponent: new Uint8Array([1, 0, 1]),
    modulusLength: 2048,
};

document.getElementById('csr-button').onclick = function (event) {
    event.preventDefault();
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.showModal();
}

document.getElementById('close-dialog').onclick = function () {
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.close();
    keyPair = null;
}

window.onclick = function (event) {
    if (event.target.className === 'dialog') {
        event.target.close();
        keyPair = null;
    }
}

async function generateAsymmetricKey() {
    try {
        keyPair = await crypto.subtle.generateKey(alg, false, ["sign", "verify"]);

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

document.getElementById('generate-csr-button').addEventListener('click', async function (event) {
    event.preventDefault();

    let cn = document.getElementById('cn').value;
    let o = document.getElementById('o').value;
    let ou = document.getElementById('ou').value;
    let c = document.getElementById('c').value;
    let s = document.getElementById('s').value;
    let l = document.getElementById('l').value;
    let e = document.getElementById('e').value;


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

        document.getElementById('csr-text').textContent = csr.toString("base64");
    } catch (error) {
        alert("Erro ao gerar o CSR: " + error);
    }
});
