function carregarPropostas() {
    fetch('http://localhost/Saude/js/tabelas/proposta.json')
      .then(response => response.json())
      .then(data => exibirPropostas(data))
      .catch(exibirPropostas(''));
}
  
function exibirPropostas(propostas) {
    const historicoDiv = document.getElementById('historico');
    historicoDiv.innerHTML = '<h2>Propostas Feitas:</h2>';

    if (propostas.length === 0) {
        historicoDiv.innerHTML += '<p>Nenhuma proposta encontrada.</p>';
        return;
    }

    propostas.forEach(proposta => {

        var beneficiariosDecodificados = [];

        $.each(proposta.beneficiarios, function(index, beneficiario) {
            var nomeDecodificado = '';
            var idadeDecodificada = '';

            for (var i = 0; i < beneficiario.nome.length; i += 4) {
                var letraBase64 = beneficiario.nome.substr(i, 4);
                nomeDecodificado += atob(letraBase64);
            }

            for (var j = 0; j < beneficiario.idade.length; j += 4) {
                var digitoBase64 = beneficiario.idade.substr(j, 4);
                idadeDecodificada += atob(digitoBase64);
            }

            beneficiariosDecodificados.push({
                nome: nomeDecodificado,
                idade: idadeDecodificada,
                preco: parseFloat(beneficiario.preco).toFixed(2)
            });
        });

        historicoDiv.innerHTML += `
        <div class="proposta-item">
        <p><b>Plano:</b> ${proposta.plano}</p>
        <p><b>Quantidade de Beneficiários:</b> ${proposta.beneficiarios.length}</p>
        <ul>
            ${beneficiariosDecodificados.map(beneficiario => `<li><b>Nome:</b> ${beneficiario.nome} - <b>Idade:</b> ${beneficiario.idade} - <b>Preço Individual:</b> R$ ${beneficiario.preco}</li>`).join('')}
        </ul>
        <p><b>Total do plano:</b> R$: ${proposta.totalPlano.toFixed(2)}
        </div>
        `;
    });
}

window.onload = function() {
    $('#voltar').click(function() {
        window.location.href = '../../index.html'
    });
    carregarPropostas();
};

