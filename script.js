const Utils = {

    getDadosDisc: function (agrupados) {

        let dados = new Array();
        
        if (!agrupados) {
            $(".field").each(function (index) {
                let valor = parseInt($(this).val());
                dados.push(valor);
            });
        } else {
            let arrXiFi = new Array();
            $(".field").each(function (index) {
                let valor = parseInt($(this).val());
                if ($(this).hasClass("xi")) {
                    arrXiFi.push(valor);
                } else if ($(this).hasClass("fi")) {
                    arrXiFi.push(valor);
                    dados.push(arrXiFi);
                    arrXiFi = new Array();
                }
            });
        }

        return dados;

    },

    getDadosCont: function () {

        let classes = Utils.formatarClasse();
        $(".field").each(function (index) {
            classes[index].push(parseInt($(this).val()));
        });

        return classes;

    },

    formatarClasse: function () {

        let classes = new Array();
        let quantidadeClasses = parseInt($("#quantidade_classes").val());
        let limiteInferior = parseInt($("#limite_inferior").val());
        let amplitude = parseInt($("#amplitude").val());
        let limiteSuperior;

        for (let i = 0; i < quantidadeClasses; i++) {
            limiteSuperior = limiteInferior + amplitude;
            classes.push(new Array(limiteInferior, limiteSuperior));
            limiteInferior = limiteSuperior;
        }

        return classes;

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

    },

    printTabela: function(tipo, dados) {
        let body;
        let tr;
        let td;
        let trCount = 0;
        if (tipo === "agrupados") {
            body = $("#body_agrupados");
            dados.forEach((grupo) => {
                let count = 0;
                grupo.forEach((valor) => {
                    if (count === 0) {
                        tr = `<tr id="tr_${trCount}"></tr>`;
                        td = `<td>${valor}</td>`;
                        body.append(tr);
                        $(`#tr_${trCount}`).append(td);
                        count++;
                    } else if (count === 1) {
                        td = `<td>${valor}</td>`
                        $(`#tr_${trCount}`).append(td);
                        trCount++;
                    }
                });
            });

        } else if (tipo === "continuos") {

            body = $("#body_continuos");
            let count = 0;
            dados.forEach((classe) => {
                console.log(count);
                if (count === 0) {
                    tr = `<tr id="tr_${trCount}"></tr>`;
                    td = `<td>${classe[0]} |-- ${classe[1]}</td>`;
                    body.append(tr);
                    $(`#tr_${trCount}`).append(td);
                    count++;
                }
                
                if (count === 1) {
                    td = `<td>${classe[2]}</td>`;
                    $(`#tr_${trCount}`).append(td);
                    count = 0;
                    trCount++;
                }
            });

        }

    }

}

const Dados = {

    discretosNaoAgrupados: function () {
         
        let empty = false;

        let dados = Utils.getDadosDisc(agrupados=false);

        dados.forEach((i) => {
            if(isNaN([i])){
                empty = true;
            }
        });

        if(empty){
            alert("Insira os dados e tente novamente.");
        }

        if(!empty){

            $(".row-2").hide();

            dados.sort();
            let media = Utils.calcMediaDisc(agrupados=false, dados=dados);
            let variancia = Utils.calcVarianciaDisc(agrupados=false, dados=dados, media=media);
            let desvioPadrao = Math.sqrt(variancia);
            $("#rol").html(dados);
            $("#media").html(media.toFixed(2));
            $("#desvio_padrao").html(desvioPadrao.toFixed(3));

            $(".row-3").show();
            $(".row-4").show();
            $("#corrigir").hide();

        }


    },

    discretosAgrupados: function () {

        let empty = false;

        let dados = Utils.getDadosDisc(agrupados=true);

        dados.forEach((i) => {
            i.forEach((j) => {
                if(isNaN([j])){
                    empty = true;
                }
            })
        });

        if(empty){
            alert("Insira os dados e tente novamente.");
        }

        if(!empty){

            $(".row-2").hide();

            dados.sort();
            let media = Utils.calcMediaDisc(agrupados=true, dados=dados);
            let variancia = Utils.calcVarianciaDisc(agrupados=true, dados=dados, media=media);
            let desvioPadrao = Math.sqrt(variancia);
            
            Utils.printTabela(tipo="agrupados", dados);
            $("#media").html(media.toFixed(2));
            $("#desvio_padrao").html(desvioPadrao.toFixed(3));

            $(".row-3").show();
            $(".row-4").show();
            $("#corrigir").hide();

        }

    },

    continuos: function () {


        let empty = false;

        let dados = Utils.getDadosCont(agrupados=true);

        dados.forEach((i) => {
            i.forEach((j) => {
                if(isNaN([j])){
                    empty = true;
                }
            })
        });


        if(empty){
            alert("Insira os dados e tente novamente.");
        }

        if(!empty){

            $(".row-2").hide();

            let media = Utils.calcMediaCont(dados);
            let variancia = Utils.calcVarianciaCont(dados, media);
            let desvioPadrao = Math.sqrt(variancia);

            Utils.printTabela(tipo="continuos", dados);
            $("#media").html(media.toFixed(2));
            $("#desvio_padrao").html(desvioPadrao.toFixed(3));

            $(".row-3").show();
            $(".row-4").show();
            $("#corrigir").hide();

        }

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
        // console.log(j)
        for (let i = 0; i < quantidade; i++) {
            let divGrupo = `<div class='grupo' id='grupo${j}'></div><br>`;

            let labelValor = "<label for='valor' class='tag-label'>Xi</label>";
            let campoValor = `<input type='number' id='valor_${i}' name='valor' class='field xi' max='100' min='1'>`;

            let labelFrequencia = "<label for='frequencia' class='tag-label'>Fi</label>";
            let campoFrequencia = `<input type='number' id='frequencia_${i}' name='frequecia' class='field fi' max='100' min='1'>`;

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
        let divValores = $(".valores-inputs");
        let j = $(".grupo").length;
        // console.log(j)

        let classes = Utils.formatarClasse();

        for (let i = 0; i < quantidade; i++) {
            let divGrupo = `<div class='grupo' id='grupo${j}'></div><br>`;

            let labelValor = `<label for='valor' class='tag-label'>${classes[i][0]} |-- ${classes[i][1]}</label>`;

            let campoFrequencia = `<input type='number' id='frequencia_${i}' name='frequecia' class='field fi' max='100' min='1'>`;

            $(divValores).append(divGrupo);

            divGrupo = $(`#grupo${j}`);

            $(divGrupo).append(labelValor);

            $(divGrupo).append(campoFrequencia);

            j++;
        }

        $(divValores).show();
        $(".valores").show();
    }

	$("#mostra_inputs_nao_agrupados").click(function(){
        let quantidade = $("#quantidade_nao_agrupado").val();
		let quantidadeAtual = $(".field").length;
        let quantidadeTotal = parseInt(quantidadeAtual) + parseInt(quantidade);
        
        // console.log(quantidadeTotal);
        
		if(quantidadeTotal > 70) {
            alert("O número máximo de valores é 70.");
		} else if(isNaN(quantidadeTotal) || quantidadeTotal <= 0) {
            alert("Valor inválido! Tente outro valor.");
        } else {
            $(".row-1").hide();
            $("#corrigir").show();
			mostraInputsNaoAgrupados(quantidade);
		}
	})

    $("#mostra_inputs_agrupados").click(function(){
        let quantidade = $("#quantidade_agrupado").val();
        let quantidadeAtual = $(".field").length;
        let quantidadeTotal = parseInt(quantidadeAtual) + parseInt(quantidade);
        
        // console.log(quantidadeTotal);
        
        if(quantidadeTotal > 24) {
            alert("O número máximo de valores é 24.");
        } else if(isNaN(quantidadeTotal) || quantidadeTotal <= 0) {
            alert("Valor inválido! Tente outro valor.");
        } else {
            $(".row-1").hide();
            $("#corrigir").show();
            mostraInputsAgrupados(quantidade);
        }
    })

    $("#mostra_inputs_continuos").click(function(){
        let quantidade = $("#quantidade_classes").val();
        let quantidadeAtual = $(".field").length;
        let quantidadeTotal = parseInt(quantidadeAtual) + parseInt(quantidade);
        
        // console.log(quantidadeTotal);
        
        if(quantidadeTotal > 24) {
            alert("O número máximo de valores é 24.");
        } else if(isNaN(quantidadeTotal) || quantidadeTotal <= 0) {
            alert("Valor inválido! Tente outro valor.");
        } else {
            $(".row-1").hide();
            $("#corrigir").show();
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

    // $(function() {
    //     $(".footer").load("footer.html");
    // })

})
