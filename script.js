const Utils = {

    getDadosDisc: function () {

        let dados = new Array();

        $(".field").each(function (index) {
            let valor = parseInt($(this).val());
            dados.push(valor);
        });

        // console.log(dados);

        return dados;

    },

    getDadosCont: function () {

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
        
        $(".row-2").hide();
        $("#mostra_inputs").prop("disabled", true);

        let dados = Utils.getDadosDisc(agrupados=false);
        dados.sort();
        let media = Utils.calcMediaDisc(agrupados=false, dados=dados);
        let variancia = Utils.calcVarianciaDisc(agrupados=false, dados=dados, media=media);
        let desvioPadrao = Math.sqrt(variancia);
        $("#rol").html(dados);
        $("#media").html(media.toFixed(2));
        $("#desvio_padrao").html(desvioPadrao.toFixed(3));

        $(".row-3").show();
        $(".row-4").show();


    },

    discretosAgrupados: function () {

        $(".row-2").hide();
        $("#mostra_inputs").prop("disabled", true);

        let dados = Utils.getDadosDisc(agrupados=true);
        let media = Utils.calcMediaDisc(agrupados=true, dados=dados);
        let variancia = Utils.calcVarianciaDisc(agrupados=true, dados=dados, media=media);
        let desvioPadrao = Math.sqrt(variancia);
        console.log(dados);
        $("#media").html(media.toFixed(2));
        $("#desvio_padrao").html(desvioPadrao.toFixed(3));

        $(".row-3").show();
        $(".row-4").show();

    },

    continuos: function () {

        let dados = Utils.getDadosCont();
        let media = Utils.calcMediaCont(dados);
        let variancia = Utils.calcVarianciaCont(dados, media);
        let desvioPadrao = Math.sqrt(variancia);
        console.log(dados);
        console.log(`Média: ${media.toFixed(1)}`);
        console.log(`Desvio Padrão: ${desvioPadrao.toFixed(3)}`);

    }

}

$(function(){
	function mostraInputsNaoAgrupados(quantidade){
		let div = $(".valores-inputs")
		for (let i = 0; i < quantidade; i++) {
			let campo = `<input type='number' id='valor_${i}' name='valor' class='field' max='100' min='1'>`;
			$(div).append(campo);
		}

		$(div).show();
		$(".valores").show();
	}

    function mostraInputsAgrupados(quantidade){
        let divValores = $(".valores-inputs");
        let j = $(".grupo").length;
        console.log(j)
        for (let i = 0; i < quantidade; i++) {
            let divGrupo = `<div class='grupo' id='grupo${j}'></div><br>`;

            let labelValor = "<label for='valor' class='tag-label'>Xi</label>";
            let campoValor = `<input type='number' id='valor_${i}' name='valor' class='field' max='100' min='1'>`;

            let labelFrequencia = "<label for='frequencia' class='tag-label'>Fi</label>";
            let campoFrequencia = `<input type='number' id='frequencia_${i}' name='frequecia' class='field' max='100' min='1'>`;

            $(divValores).append(divGrupo);

            divGrupo = $(`#grupo${j}`);

            $(divGrupo).append(labelValor);
            $(divGrupo).append(campoValor);

            $(divGrupo).append(labelFrequencia);
            $(divGrupo).append(campoFrequencia);

            j++;
        }

        $(divValores).show();
        $(".valores").show();
    }
    
    function mostraInputsContinuos(quantidade){
        let div = $(".valores-inputs")
        for (let i = 0; i < quantidade; i++) {
            let campo = `<input type='number' id='valor_${i}' name='valor' class='field' max='100' min='1'>`;
            $(div).append(campo);
        }

        $(div).show();
        $(".valores").show();
    }

	$("#mostra_inputs_nao_agrupados").click(function(){
 		let quantidade = $("#quantidade_nao_agrupado").val();
		let quantidadeAtual = $(".field").length;
        let quantidadeTotal = parseInt(quantidadeAtual) + parseInt(quantidade);

        // console.log(quantidadeTotal);

		if(quantidadeTotal > 100) {
			alert("O número máximo de valores é 100.");
		} else if(isNaN(quantidadeTotal) || quantidadeTotal <= 0) {
            alert("Valor inválido! Tente outro valor.");
        } else {
			mostraInputsNaoAgrupados(quantidade);
		}
	})

    $("#mostra_inputs_agrupados").click(function(){
        let quantidade = $("#quantidade_nao_agrupado").val();
        let quantidadeAtual = $(".field").length;
        let quantidadeTotal = parseInt(quantidadeAtual) + parseInt(quantidade);

        // console.log(quantidadeTotal);

        if(quantidadeTotal > 100) {
            alert("O número máximo de valores é 100.");
        } else if(isNaN(quantidadeTotal) || quantidadeTotal <= 0) {
            alert("Valor inválido! Tente outro valor.");
        } else {
            mostraInputsAgrupados(quantidade);
        }
    })

    $("#mostra_inputs_continuos").click(function(){
        let quantidade = $("#quantidade_nao_agrupado").val();
        let quantidadeAtual = $(".field").length;
        let quantidadeTotal = parseInt(quantidadeAtual) + parseInt(quantidade);

        // console.log(quantidadeTotal);

        if(quantidadeTotal > 100) {
            alert("O número máximo de valores é 100.");
        } else if(isNaN(quantidadeTotal) || quantidadeTotal <= 0) {
            alert("Valor inválido! Tente outro valor.");
        } else {
            mostraInputsContinuos(quantidade);
        }
    })

    $("#div_discretos_agrupados").click(function(){
        window.location.replace("discretos_agrupados.html");
    })

    $("#div_discretos_nao_agrupados").click(function(){
        window.location.replace("discretos_nao_agrupados.html");
    })

    $("#div_continuos").click(function(){
        window.location.replace("continuos.html");
    })

    $("#voltar").click(function(){
        window.location.replace("index.html");
    })
})