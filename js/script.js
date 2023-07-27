
$(document).ready(function() {
    const quantidadeInput = $("#quantidade_beneficiarios");
    const beneficiariosDiv = $("#beneficiarios");
    const planoSelect = $("#plano");

    $('#visualizar').click(function() {
        window.location.href = 'PHP/View/historico.html'
    });

    quantidadeInput.on("input", function() {
        if (!$.isNumeric(quantidadeInput.val())) {
            alert('A quantidade de beneficiários deve ser um valor numérico');
        } else {
            const quantidade = parseInt(quantidadeInput.val());

            beneficiariosDiv.empty();
            planoSelect.html('<option value="">Selecione o Plano</option>');

            for (let i = 0; i < quantidade; i++) {
                const nomeInput = $("<input>").attr({
                    type: "text",
                    placeholder: "Nome do Beneficiário " + (i + 1)
                });

                const idadeInput = $("<input>").attr({
                    type: "text",
                    placeholder: "Idade do Beneficiário " + (i + 1)
                });

                beneficiariosDiv.append(nomeInput).append(idadeInput);
            }

            $.ajax({
                url: "PHP/Controller/controller.php",
                type: "POST",
                data: {
                    opcao: "consultarPlanos",
                },
                success: function(response) {
                    const planos = response;
                    planos.forEach(function(plano) {
                        const option = $("<option>").attr({
                            value: plano.codigo
                        }).text(plano.nome);
                        planoSelect.append(option);
                    });
                },
                error: function(xhr, status, error) {
                    console.log(error);
                }
            });
        }
    });
});

function calcularPreco() {
    const quantidadeBeneficiarios = parseInt($("#quantidade_beneficiarios").val());
    if(quantidadeBeneficiarios > 0)
    {  
        const planoSelecionado = $("#plano").val();
        const beneficiarios = [];
        var validado = true;
        for (var i = 0; i < quantidadeBeneficiarios; i++) {
            const nome = $("#beneficiarios input[type='text']")[i * 2].value;
            const idade = parseInt($("#beneficiarios input[type='text']")[i * 2 + 1].value);
            validado = validarCampos(nome, idade, planoSelecionado, i + 1);
            if (!validado) {
                break;
            } else {
                beneficiarios.push({ nome, idade });
            }
        }

        if (validado) {
            $.ajax({
                url: "PHP/Controller/controller.php",
                type: "POST",
                data: {
                    opcao: "proposta",
                    beneficiarios: beneficiarios,
                    plano: planoSelecionado
                },
                success: function() {
                    window.location.reload();
                },
                error: function(xhr, status, error) {
                    console.log(error);
                }
            });
        }
    } else 
    {
        alert('Adicione pelo menos 1 beneficiário antes de calcular o preço!')
    }

}

function validarCampos(nome, idade, plano, benef) {
    let result = true;
    let message = '';

    if ($.trim(nome) === '') {
        result = false;
        message = 'O campo nome do ' + benef + '° beneficiário não pode ser nulo';
    } else if ($.trim(idade) === '') {
        result = false;
        message = 'O campo idade do ' + benef + '° beneficiário não pode ser nulo';
    } else if (!$.isNumeric(idade)) {
        result = false;
        message = 'O campo idade do ' + benef + '° beneficiário deve ser um valor numérico';
    } else if ($.trim(plano) === '') {
        result = false;
        message = 'O campo plano não pode ser nulo';
    }

    if (!result) {
        alert(message);
    }

    return result;
}