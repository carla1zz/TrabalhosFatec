const Utils = {

    pedirOpc: function () {

        return 3;

    },

    pedirDadosDisc: function (agrupados) {

        let dados = new Array();
        let quant = 5;

        $(".field").each(function (index) {
            let valor = $(this).val();
            dados.push(valor);
        });

        return dados;

    },

    pedirDadosCont: function () {

        let dados = new Array();
        let quantidadeClasses = 3;
        let limiteInferior = 1;
        let amplitude = 3;
        let limiteSuperior;
        let frequenciaClasses;

        for (let i = 0; i < quantidadeClasses; i++) {
            limiteSuperior = limiteInferior + amplitude;
            frequenciaClasses = Math.floor(Math.random() * 5) + 1;
            dados.push(new Array(limiteInferior, limiteSuperior, frequenciaClasses));
            limiteInferior = limiteSuperior;
        }

        return dados;

    },

    calcMediaDisc: function (agrupados, dados) {

        if (!agrupados) {
            let soma = dados.reduce((somaParcial, val) => somaParcial + val, 0);
            return soma / dados.length;
        }

        let xi_fi = 0;
        let soma_fi = 0;
        dados.forEach((i) => {
            xi_fi += i.reduce((xi, fi) => xi * fi, 1);
            soma_fi += i[1];
        });

        return xi_fi / soma_fi;

    },

    calcMediaCont: function (dados) {

        let soma_xi;
        let soma_fi = 0;
        let xi_fi = 0;
        dados.forEach((classe) => {
            soma_xi = (classe[0] + classe[1]) / 2;
            soma_fi += classe[2];
            xi_fi += soma_xi * classe[2];
        });

        return xi_fi / soma_fi;

    },

    calcVarianciaDisc: function (agrupados, dados, media) {

        let soma = 0;
        if (dados.length <= 1) {
            return soma;
        }

        if (!agrupados) {
            dados.forEach((dado) => soma += (dado - media) ** 2);
            return soma / dados.length;
        }

        let soma_fi = 0;
        dados.forEach((i) => {
            soma += ((i[0] - media) ** 2) * i[1];
            soma_fi += i[1];
        });

        return soma / (soma_fi - 1);

    },

    calcVarianciaCont: function (dados, media) {

        let soma = 0;
        let soma_fi = 0;
        let soma_xi;
        if (dados.length <= 1) {
            return soma;
        }

        dados.forEach((classe) => {
            soma_xi = (classe[0] + classe[1]) / 2;
            soma_fi += classe[2];
            soma += ((soma_xi - media) ** 2) * classe[2];
        });

        return soma / (soma_fi - 1)

    }

}

const Dados = {

    discretosNaoAgrupados: function () {
        
        let dados = Utils.pedirDadosDisc(agrupados=false);
        console.log(`Dados: ${dados}`);
        dados.sort();
        let media = Utils.calcMediaDisc(agrupados=false, dados=dados);
        let variancia = Utils.calcVarianciaDisc(agrupados=false, dados=dados, media=media);
        let desvioPadrao = Math.sqrt(variancia);
        console.log(`Rol: ${dados}`);
        console.log(`Média: ${media.toFixed(1)}`);
        console.log(`Desvio Padrão: ${desvioPadrao.toFixed(3)}`)

    },

    discretosAgrupados: function () {

        let dados = Utils.pedirDadosDisc(agrupados=true);
        let media = Utils.calcMediaDisc(agrupados=true, dados=dados);
        let variancia = Utils.calcVarianciaDisc(agrupados=true, dados=dados, media=media);
        let desvioPadrao = Math.sqrt(variancia);
        console.log(dados);
        console.log(`Média: ${media.toFixed(1)}`);
        console.log(`Desvio Padrão: ${desvioPadrao.toFixed(3)}`);

    },

    continuos: function () {

        let dados = Utils.pedirDadosCont();
        let media = Utils.calcMediaCont(dados);
        let variancia = Utils.calcVarianciaCont(dados, media);
        let desvioPadrao = Math.sqrt(variancia);
        console.log(dados);
        console.log(`Média: ${media.toFixed(1)}`);
        console.log(`Desvio Padrão: ${desvioPadrao.toFixed(3)}`);

    }

}

$(function(){
	function mostra_inputs(quantidade){
		var div = $(".valores-inputs")
		for (var i = 0; i < quantidade; i++) {
			var campo = `<input type='number' id='valor_${i}' name='valor' class='field' max='100' min='1'>`;
			$(div).append(campo);
		}

		$(div).show();
		$(".valores").show();
	}

	$("#mostra_inputs").click(function(){
 		var quantidade = $("#quantidade_nao_agrupado").val();
		var quantidade_atual = $(".field").length;

		if((parseInt(quantidade_atual) + parseInt(quantidade)) <= 100){
			mostra_inputs(quantidade);
		}else{
			alert("O n�mero m�ximo de valores � 100.")
		}
	})
})