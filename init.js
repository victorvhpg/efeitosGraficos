/*
 @victorvhpg
 https://github.com/victorvhpg/efeitosGraficos
 */
(function(efeitoGrafico) {
    "use strict";
    var efeitos = {

        realizarEfeitos: function(vet){
            vet.forEach(function(item, indice){
                efeitoGrafico.criar(item);
            });
        },

        criarEfeitos: function() {
            var vet = [{
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasma,
                container: document.querySelector("#efeito2")
            }, {
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasmaComBuffer,
                container: document.querySelector("#efeito3")
            }, {
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasmaComBuffer,
                posBuffer: 1,
                container: document.querySelector("#efeito4")
            }, {
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasmaComBuffer,
                posBuffer: 2,
                container: document.querySelector("#efeito5")
            }];

            var img = new Image();
            img.addEventListener("load", function() {
              vet.push({
                    img: img,
                    largura: 256,
                    altura: 134,
                    efeito: efeitoGrafico.efeitos.inverteCor,
                    container: document.querySelector("#efeito1")
                });
              efeitos.realizarEfeitos(vet);
            });
            img.src = "img.png";

        },

        init: function() {
            document.addEventListener("DOMContentLoaded", function() {
                efeitos.criarEfeitos();
            });
        }
    };

    efeitos.init();

})(efeitoGrafico);