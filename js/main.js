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

// Botão de fechar a caixa de diálogo de CSR
document.getElementById('close-dialog').onclick = function () {
    var csrDialog = document.getElementById('csr-dialog');
    csrDialog.close();
}

// Botão de fechar a caixa de diálogo de Exportar
document.getElementById('close-export-dialog').onclick = function () {
    var exportDialog = document.getElementById('export-dialog');
    exportDialog.close();
}

window.onclick = function (event) {
    if (event.target.className === 'dialog') {
        event.target.close();
    }
}
