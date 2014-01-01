/*
 @victorvhpg
 https://github.com/victorvhpg/efeitosGraficos
 */
(function(efeitoGrafico) {
    "use strict";
    var efeitos = {

        criarEfeitos: function() {
            var img = new Image();
            img.addEventListener("load", function() {
                var efeito1 = efeitoGrafico.criar({
                    img: img,
                    largura: 256,
                    altura: 134,
                    efeito: efeitoGrafico.efeitos.inverteCor,
                    container: document.querySelector("#efeito1")
                });
            });
            img.src = "img.png";
            //==============
            var efeito2 = efeitoGrafico.criar({
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasma,
                container: document.querySelector("#efeito2")
            });
            //=============
            var efeito3 = efeitoGrafico.criar({
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasmaComBuffer,
                container: document.querySelector("#efeito3")
            });
            //=============
            var efeito4 = efeitoGrafico.criar({
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasmaComBuffer,
                posBuffer: 1,
                container: document.querySelector("#efeito4")
            });
            //=============
            var efeito5 = efeitoGrafico.criar({
                largura: 500,
                altura: 200,
                efeito: efeitoGrafico.efeitos.plasmaComBuffer,
                posBuffer: 2,
                container: document.querySelector("#efeito5")
            });
        },

        init: function() {
            document.addEventListener("DOMContentLoaded", function() {
                efeitos.criarEfeitos();
            });
        }
    };

    efeitos.init();

})(efeitoGrafico);