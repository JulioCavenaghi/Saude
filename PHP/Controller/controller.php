<?php
require_once('/xampp/htdocs/Saude/PHP/Function/Util.php');
require_once('/xampp/htdocs/Saude/PHP/Model/modelProcessamento.php');

if (isset($_POST['opcao'])) {
    $opcao              = $_POST['opcao'];
    
    switch ($opcao) {
        case 'consultarPlanos':
            $model = new modelProcessamento();
            $response = $model ->consultarPlanos();
            break;
        case 'proposta':
            $model = new modelProcessamento();
            $beneficiarios                  = $_POST['beneficiarios'] != '' ? $_POST['beneficiarios'] : '';
            $planoSelecionado               = $_POST['plano'] != '' ? $_POST['plano'] : '';
            $planos                         = $model ->consultarPlanos();

            $response = $model ->montarProposta($beneficiarios, $planoSelecionado,  $planos);
            break;
    }

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    $response = ['status' => 'error', 'message' => 'Nenhuma opção fornecida.'];
    header('Content-Type: application/json');
    echo json_encode($response);
}