/*
 @victorvhpg
 https://github.com/victorvhpg/
 */
var efeitoGrafico = (function(requestAnimationFrame) {
    "use strict";

    var _configurarPadrao = function(configPadrao, configEnviada) {
        var config = {};
        configEnviada = configEnviada || {};
        for (var propriedade in configPadrao) {
            if(!configPadrao.hasOwnProperty(propriedade)){
                continue;
            }
            config[propriedade] = configEnviada.hasOwnProperty(propriedade) ? configEnviada[propriedade] : configEnviada[propriedade];
        }
        return config;
    };

    var efeitoGrafico = function(config) {
        this.canvas = null;
        this.ctx = null;
        this.config = _configurarPadrao(_config, config);

    };

    efeitoGrafico.criar = function(config) {
        return (new efeitoGrafico(config)).init();
    };

    efeitoGrafico.efeitos = {
        plasma: "plasma",
        inverteCor: "inverteCor",
        tunel: "tunel",
        fogo: "fogo"
    };

    var _config = {
        largura: 400,
        altura: 300,
        efeito: efeitoGrafico.efeitos.plasma,
        container: null,
        img: null
    };

    efeitoGrafico.prototype = {
        constructor: efeitoGrafico,

        anima: function() {
            var largura = this.ctx.canvas.width;
            var altura = this.ctx.canvas.height;
            if (this.config.img) {
                this.ctx.drawImage(this.config.img, 0, 0, largura, altura);
            }
            var objImageData = this.ctx.getImageData(0, 0, largura, altura);
            var pixels = objImageData.data;
            // this.ctx.clearRect(0, 0, largura, altura);

            _efeitos[this.config.efeito](pixels, largura, altura);
            this.ctx.putImageData(objImageData, 0, 0);
        },

        loop: function() {
            var that = this;
            this.anima();
            requestAnimationFrame(function() {
                that.loop();
            });

        },

        init: function() {
            this.canvas = document.createElement("canvas");
            this.canvas.height = this.config.altura;
            this.canvas.width = this.config.largura;
            this.ctx = this.canvas.getContext("2d");
            this.config.container.parentNode.replaceChild(this.canvas, this.config.container);
            this.loop();
            return this;
        }
    };

    var _efeitos = {
        inverteCor: function(pixels, largura, altura) {
            for (var y = 0; y < altura; y++) {
                for (var x = 0; x < largura; x++) {
                    var posPixel = (y * largura + x) * 4;
                    pixels[posPixel] = 255 - pixels[posPixel];
                    pixels[posPixel + 1] = 255 - pixels[posPixel + 1];
                    pixels[posPixel + 2] = 255 - pixels[posPixel + 2];
                    pixels[posPixel + 3] = pixels[posPixel + 3];
                }
            }
        },

        plasma: function(pixels, largura, altura) {
            var t = Date.now() * 0.003;
            var kx = largura / altura;
            for (var y = 0; y < altura; y++) {
                var yy = y / altura - 0.5;
                for (var x = 0; x < largura; x++) {
                    var xx = kx * x / largura - kx / 2;
                    var v = Math.sin((xx * 10 + t)) + Math.sin((yy * 10 + t) / 2) + Math.sin((xx * 10 + yy * 10 + t) / 2);
                    var cx = xx + 0.5 * Math.sin(t / 5);
                    var cy = yy + 0.5 * Math.cos(t / 3);
                    v += Math.sin(Math.sqrt(100 * (cx * cx + cy * cy) + 1) + t);
                    var posPixel = (y * largura + x) * 4;
                    v = v / 1.6;
                    pixels[posPixel] = 255 * (0.5 + 0.5 * Math.sin(Math.PI * v));
                    pixels[posPixel + 1] = 255 * (0.5 + 0.5 * Math.sin(Math.PI * v + 2 * Math.PI / 3));
                    pixels[posPixel + 2] = 255 * (0.5 + 0.5 * Math.sin(Math.PI * v + 4 * Math.PI / 3));
                    pixels[posPixel + 3] = 255;
                }
            }
        }
    };


    return efeitoGrafico;

})(window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(function() {
            callback(+new Date);
        }, 1000 / 60);
    });