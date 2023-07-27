<?php
class modelProcessamento
{
  public function consultarPlanos()
  {
    $planos = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/Saude/js/tabelas/plans.json');

    $planos = json_decode($planos, true);

    return $planos;
  }
  public function montarProposta($beneficiarios, $planoSelecionado, $planos)
  {
    $precos = json_decode(file_get_contents($_SERVER["DOCUMENT_ROOT"].'/Saude/js/tabelas/prices.json'), true);
    
    $resultado = [];

    $total = 0;

    $plano = '';

    foreach ($beneficiarios as $beneficiario) {
      $preco = 0;
      
      foreach ($precos as $precoPlano) {
        if ($precoPlano["codigo"] == $planoSelecionado && count($beneficiarios) >= $precoPlano["minimo_vidas"]) 
        {
          if ($beneficiario["idade"] <= 17) 
          {
            $preco = $precoPlano["faixa1"];
          } elseif ($beneficiario["idade"] >= 18 && $beneficiario["idade"] <= 40) {
            $preco = $precoPlano["faixa2"];
          } else {
            $preco = $precoPlano["faixa3"];
          }
        }

        foreach ($planos as $nmPlan) {
          if($planoSelecionado == $nmPlan['codigo'])
          {
            $plano = $nmPlan['nome'];
          }
        }
        
      }

      $total += $preco;

      $nomeCrip = '';
      $idadeCrip    = ''; 

      $letras   = str_split($beneficiario["nome"]);
      $numeros   = str_split($beneficiario["idade"]);

      foreach($letras as $letra)
      {
        $nomeCrip .= base64_encode($letra);
      }

      foreach($numeros as $num)
      {
        $idadeCrip .= base64_encode($num);
      }

      $resultado[] = [
          "nome"  => $nomeCrip,
          "idade" => $idadeCrip,
          "preco" => number_format($preco, 2)
      ];
    }

    $proposta = array(
        'plano' => $plano,
        'beneficiarios' => $resultado,
        'totalPlano' => $total
    );

    if(file_exists($_SERVER["DOCUMENT_ROOT"].'/Saude/js/tabelas/proposta.json'))
    {
      $propostas = json_decode(file_get_contents($_SERVER["DOCUMENT_ROOT"].'/Saude/js/tabelas/proposta.json'), true);
      array_push($propostas, $proposta);
      file_put_contents($_SERVER["DOCUMENT_ROOT"].'/Saude/js/tabelas/proposta.json', json_encode($propostas, JSON_PRETTY_PRINT));
    } else {
      $propostas = array(
        $proposta
      );
      file_put_contents($_SERVER["DOCUMENT_ROOT"].'/Saude/js/tabelas/proposta.json', json_encode($propostas, JSON_PRETTY_PRINT));
    }

    return $propostas;
  }
}
