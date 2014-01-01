/*
 @victorvhpg
 https://github.com/victorvhpg/efeitosGraficos

//===================================
formulas de plasma foram baseadas em:
http://lodev.org/cgtutor/plasma.html
http://www.bidouille.org/prog/plasma
//====================================

 */

var efeitoGrafico = (function(requestAnimationFrame) {
    "use strict";

    var _configurarPadrao = function(configPadrao, configEnviada) {
        var config = {};
        configEnviada = configEnviada || {};
        for (var propriedade in configPadrao) {
            if (!configPadrao.hasOwnProperty(propriedade)) {
                continue;
            }
            config[propriedade] = configEnviada.hasOwnProperty(propriedade) ? configEnviada[propriedade] : configPadrao[propriedade];
        }
        return config;
    };

    var efeitoGrafico = function(config) {
        this.canvas = null;
        this.ctx = null;
        this.bufferPlasma = [];
        this.paleta = [];
        this.config = _configurarPadrao(_config, config);
        if (this.config.efeito === efeitoGrafico.efeitos.plasmaComBuffer) {
            this.setBufferPlasma(this.config.posBuffer);
            for (var i = 0; i < 256; i++) {
                this.paleta[i] = {
                    r: (128 + 128 * Math.sin(Math.PI * i / 32)),
                    g: (128 + 128 * Math.sin(Math.PI * i / 64)),
                    b: (128 + 128 * Math.sin(Math.PI * i / 128))
                }
            }
        };
    };

    efeitoGrafico.criar = function(config) {
        return (new efeitoGrafico(config)).init();
    };

    efeitoGrafico.efeitos = {
        plasma: "plasma",
        plasmaComBuffer: "plasmaComBuffer",
        inverteCor: "inverteCor",
        tunel: "tunel",
        fogo: "fogo"
    };

    var _config = {
        largura: 400,
        altura: 300,
        efeito: efeitoGrafico.efeitos.plasma,
        container: null,
        img: null,
        posBuffer:0
    };

    efeitoGrafico.prototype = {
        constructor: efeitoGrafico,

        setBufferPlasma: function(bufferPos) {
            var bufferPlasma = [];
            var largura = this.config.largura;
            var altura = this.config.altura;
            for (var x = 0; x < largura; x++) {
                bufferPlasma[x] = [];
                for (var y = 0; y < altura; y++) {
                    bufferPlasma[x][y] = this.valorBuffer(x, y, largura, altura, bufferPos);
                }
            }
            this.bufferPlasma = bufferPlasma;
        },

        valorBuffer: function(x, y, w, h, bufferPos) {
            var b = [
                (128 + (128 * Math.sin(x / 16)) + 128 + (128 * Math.sin(y / 16))) / 2,
                //===
                (128.0 + (128.0 * Math.sin(x / 16.0)) + 128.0 + (128.0 * Math.sin(y / 32.0)) + 128.0 + (128.0 * Math.sin(Math.sqrt(((x - w / 2.0) * (x - w / 2.0) + (y - h / 2.0) * (y - h / 2.0))) / 8.0)) + 128.0 + (128.0 * Math.sin(Math.sqrt((x * x + y * y)) / 8.0))) / 4,
                //===
                (128.0 + (128.0 * Math.sin(x / 16.0)) + 128.0 + (128.0 * Math.sin(y / 8.0)) + 128.0 + (128.0 * Math.sin((x + y) / 16.0)) + 128.0 + (128.0 * Math.sin(Math.sqrt((x * x + y * y)) / 8.0))) / 4
            ];
            return b[bufferPos];
        },

        anima: function() {
            var largura = this.ctx.canvas.width;
            var altura = this.ctx.canvas.height;
            if (this.config.img) {
                this.ctx.drawImage(this.config.img, 0, 0, largura, altura);
            }
            var objImageData = this.ctx.getImageData(0, 0, largura, altura);
            var pixels = objImageData.data;
            _efeitos[this.config.efeito](pixels, largura, altura, this);
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
            var t = Date.now() * 0.002;
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
                    pixels[posPixel] = 255 * (0.5 + 0.7 * Math.sin(Math.PI * v));
                    pixels[posPixel + 1] = 255 * (1.4 + 1.9 * Math.sin(Math.PI * v + 2 * Math.PI / 3));
                    pixels[posPixel + 2] = 255 * (1.3 + 1.9 * Math.sin(Math.PI * v + 4 * Math.PI / 3));
                    pixels[posPixel + 3] = 255;
                }
            }
        },

        plasmaComBuffer: function(pixels, largura, altura, obj) {
            var t = Date.now() / 10;
            var kx = largura / altura;
            for (var y = 0; y < altura; y++) {
                var yy = y / altura - 0.5;
                for (var x = 0; x < largura; x++) {
                    var posPixel = (y * largura + x) * 4;
                    var cor = obj.paleta[~~(obj.bufferPlasma[x][y] + t) % 256];
                    pixels[posPixel] = cor.r;
                    pixels[posPixel + 1] = cor.g;
                    pixels[posPixel + 2] = cor.b;
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