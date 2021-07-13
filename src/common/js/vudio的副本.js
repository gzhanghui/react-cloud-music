function isCanvasElement(el){
    return Object.prototype.toString.call(el) !== '[object HTMLCanvasElement]'
}
function isMediaStream(stream){
  return  Object.prototype.toString.call(stream) !== '[object MediaStream]' 
}
function  isAudioSource( audioSource){
    return ['[object HTMLAudioSource]', '[object HTMLAudioElement]', '[object MediaStream]'].includes(Object.prototype.toString.call(audioSource))
}
function merge() {

    var result = {}

    Array.prototype.forEach.call(arguments, function(argument) {

        var prop;

        for (prop in argument) {
            if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                if (Object.prototype.toString.call(argument[prop]) === '[object Object]') {
                    result[prop] = merge(result[prop], argument[prop]);
                } else {
                    result[prop] = argument[prop];
                }
            }
        }

    });

    return result;

}

 (function(factory){
    if (typeof exports === 'object') {
         module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
         define(factory);
    } else {
         window.Vudio = factory();
    }

 })(function() {
    'use strict';
    var __default_option = {
        effect : 'circlebar',
        accuracy : 128,
        circlebar: {
            maxHeight : 50,
            minHeight : 1,
            spacing : 1,
            color : '#fcc',
            shadowBlur : 2,
            shadowColor : '#caa',
            fadeSide : true,
            prettify : false,
            particle: true,
            maxParticle: 100,
            circleRadius: 128,
            showProgress: true,
        }
    }

    /**
     * Constructor
     * @param {object} audioSource HTMLAudioSource/MediaStream
     * @param {object} canvasElement HTMLCanvasElement
     * @param {object} option Optional
     */
    function Vudio(audioSource, canvasElement, option) {

        if (!isAudioSource) {
            throw new TypeError('Invaild Audio Source');
        }

        if (isCanvasElement(canvasElement)) {
            throw new TypeError('Invaild Canvas Element');
        }

        this.audioSrc = audioSource;
        this.canvasEle = canvasElement;
        this.option = merge(__default_option, option);
        this.meta = {};

        this.stat = 0;
        this.freqByteData = null;
        this.particles = [];
        this.coverImg = new Image();

        this.__init();

    }

    // private functions


    Vudio.prototype = {

        __init : function() {

            var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext),
                source = isMediaStream(this.audioSrc)
                ? audioContext.createMediaElementSource(this.audioSrc) : audioContext.createMediaStreamSource(this.audioSrc);
            this.analyser = audioContext.createAnalyser();
            this.meta.spr = audioContext.sampleRate;
            source.connect(this.analyser);

            this.analyser.fftSize = this.option.accuracy * 2;
            this.analyser.connect(audioContext.destination);
            this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);

            // prepare for coverImage
            this.coverImg.src = 'https://imgessl.kugou.com/stdmusic/20210114/20210114205318454237.jpg';
            this.context2d = this.canvasEle.getContext('2d');

            var memCanv = document.createElement('canvas');
            this.memCtx = memCanv.getContext('2d');

            this.effects = this.__effects();

            this.__resizeCanvas();

            // listen click on vudioEle
            this.canvasEle.addEventListener('click', (function(){
                if (this.stat === 0) {
                    this.audioSrc.play();
                    this.dance();
                }
                else {
                    this.pause();
                    this.audioSrc.pause();
                }
            }).bind(this)
            );

            window.onresize = this.__resizeCanvas.bind(this);

        },

        __resizeCanvas() {
            var dpr = window.devicePixelRatio || 1;
            
            this.width = this.canvasEle.clientWidth;
            this.height = this.canvasEle.clientHeight;

            // ready for HD screen
            this.canvasEle.width = this.width * dpr;
            this.canvasEle.height = this.height * dpr;
            this.context2d.scale(dpr, dpr);
            this.context2d.globalCompositeOperation = 'lighter';

            // resize memCanvas also.
            this.memCtx.canvas.width = this.width * dpr;
            this.memCtx.canvas.height = this.height * dpr;
            this.memCtx.scale(dpr, dpr);
        },

        __recreateAnalyzer() {
            var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext),
                source = Object.prototype.toString.call() !== '[object MediaStream]' ?
                audioContext.createMediaElementSource(this.audioSrc) : audioContext.createMediaStreamSource(this.audioSrc);

            this.analyser = audioContext.createAnalyser();
            this.meta.spr = audioContext.sampleRate;

            source.connect(this.analyser);
            this.analyser.fftSize = this.option.accuracy * 2;
            this.analyser.connect(audioContext.destination);
        },

        __rebuildData : function (freqByteData, horizontalAlign) {

            var __freqByteData;

            if (horizontalAlign === 'center') {
                __freqByteData = [].concat(
                    Array.from(freqByteData).reverse().splice(this.option.accuracy / 2, this.option.accuracy / 2),
                    Array.from(freqByteData).splice(0, this.option.accuracy / 2)
                );
            } else if (horizontalAlign === 'left') {
                __freqByteData = freqByteData;
            } else if (horizontalAlign === 'right') {
                __freqByteData = Array.from(freqByteData).reverse();
            } else {
                __freqByteData = [].concat(
                    Array.from(freqByteData).reverse().slice(this.option.accuracy / 2, this.option.accuracy),
                    Array.from(freqByteData).slice(0, this.option.accuracy / 2)
                );
            }

            return __freqByteData;

        },

        readAudioSrc: function(fileEle, vudio, label) {
            if (fileEle.files.length === 0) {
                label.innerText = 'Drop Audio file here to play'
                return;
            }
            var file = fileEle.files[0];
            var fr = new FileReader();
            if (file.type.indexOf('audio') !== 0) return;
            label.innerText = file.name;
            fr.onload = function(evt) {
                vudio.audioSrc.src = evt.target.result;
                vudio.audioSrc.play();
                vudio.dance();
            }
            fr.readAsDataURL(file);
        },

        __animate : function() {
            if (this.stat === 1) {
                this.analyser.getByteFrequencyData(this.freqByteData);
                (typeof this.effects[this.option.effect] === 'function') && this.effects[this.option.effect](this.freqByteData);
                requestAnimationFrame(this.__animate.bind(this));
            }

        },
        // effect functions
        __effects : function() {

            var __that = this;

            return {

                circlebar: function(freqByteData) {
                    var circlebarOption = __that.option.circlebar;
                    var __fadeSide = circlebarOption.fadeSide;
                    var __freqByteData = __that.__rebuildData(freqByteData, circlebarOption.horizontalAlign);
                    var __angle = Math.PI * 2 / __freqByteData.length;
                    var __maxHeight, __width, __height, __left, __color;
                    var circleRadius = circlebarOption.circleRadius;
                    var __particle = circlebarOption.particle;
                    var __maxParticle = circlebarOption.maxParticle;
                    var __showProgress = circlebarOption.showProgress;
                    var __progress = __that.audioSrc.currentTime / __that.audioSrc.duration;
                    var __offsetX = 0;

                    if (circlebarOption.horizontalAlign !== 'center') {
                        __fadeSide = false;
                    }

                    // clear canvas
                    __that.context2d.clearRect(0, 0, __that.width, __that.height);
                    __that.context2d.save();
                    __that.context2d.translate(__that.width / 2 - .5, __that.height / 2 - .5);
                    
                    if (circlebarOption.shadowBlur > 0) {
                        __that.context2d.shadowBlur = circlebarOption.shadowBlur;
                        __that.context2d.shadowColor = circlebarOption.shadowColor;
                    }

                    // generate and render particles if enabled 
                    if (__particle) {
                        delete __that.particles.find(function(p){return p.dead});
                        if (__that.particles.length > __maxParticle) {
                            __that.particles.shift();
                        } else {
                            const deg = Math.random() * Math.PI * 2;
                            __that.particles.push(new Particle({
                                x: (circleRadius + 20) * Math.sin(deg),
                                y : (circleRadius + 20) * Math.cos(deg),
                                vx: .3 * Math.sin(deg) + Math.random()*.5 - .3,
                                vy: .3 * Math.cos(deg) + Math.random()*.5 - .3,
                                life: Math.random() * 10,
                                // type: 'rect'
                            }));
                        }
                        __that.particles.forEach((dot) => { dot.update(__that.context2d); });
                    }

                    __width = (circleRadius * Math.PI - __that.option.accuracy * circlebarOption.spacing) / __that.option.accuracy;
                    __offsetX = -__width / 2;
                    __color = circlebarOption.color;
                    // since circlebar use ctx.rotate for each bar, so do NOT support gradient in bar currently.
                    var renderStyle = __color instanceof Array ? __color[0] : __color;
                    __that.context2d.fillStyle = renderStyle
                    // style for progress bar
                    __that.context2d.strokeStyle = renderStyle;
                    __that.context2d.lineWidth = 4;
                    __that.context2d.lineCap = 'round';
                    __that.context2d.shadowBlur = 8;

                    __that.context2d.globalAlpha = 1;
                    __that.context2d.beginPath();

                    // draw circlebar
                    // console.warn('__freqBytesData: ', __freqByteData, ' first entry height: ', __freqByteData[1] / 256 * __circlebarOption.maxHeight);
                    for (var index = __freqByteData.length - 1; index >= 0; index--) {
                        var value = __freqByteData[index];
                        __left = index * (__width + circlebarOption.spacing);
                        circlebarOption.spacing !== 1 && (__left += circlebarOption.spacing / 2);
                        __maxHeight = circlebarOption.maxHeight;
                        __height = value / 256 * __maxHeight;
                        __height = __height < circlebarOption.minHeight ? circlebarOption.minHeight : __height;

                        if (__fadeSide) {
                            if (index <= __that.option.accuracy / 2) {
                                __that.context2d.globalAlpha = 1 - (__that.option.accuracy / 2 - 1 - index) / ( __that.option.accuracy / 2);
                            } else {
                                __that.context2d.globalAlpha = 1 - (index - __that.option.accuracy / 2) / ( __that.option.accuracy / 2);
                            }
                        }

                        __that.context2d.rotate(__angle);
                        __that.context2d.fillRect(__offsetX, circleRadius, __width, __height);
                        __that.context2d.fill();
                    }

                    if (__showProgress) { __that.drawProgress(null, __progress, circleRadius); }
                    __that.drawCover(__progress, circleRadius);
                    
                    // need to restore canvas after translate to center..
                    __that.context2d.restore();
                },
            }

        },

        dance : function() {
            if (this.stat === 0 || this.analyser.context.state === 'suspended') {
                this.analyser.context.resume();
                this.stat = 1;
                this.__animate();
            }
            return this;
        },

        pause : function() {
            this.stat = 0;
            //// for saving CPU, could cancle animation.
            return this;
        },

        setOption : function(option) {
            this.option = merge(this.option, option);
        },

        drawCover: function(__progress, circleRadius) {
            var __that = this;
            // draw cover image
            if (__that.coverImg.width !== 0) {
                var img = __that.coverImg;
                __that.context2d.save();
                __that.context2d.beginPath();
                __that.context2d.lineWidth = .5;
                __that.context2d.globalCompositeOperation = 'source-over';
                __that.context2d.rotate(Math.PI * 2 * __progress * 2);
                __that.context2d.arc(0, 0, circleRadius - 13, -Math.PI/2, Math.PI * 2 - Math.PI/2 );
                __that.context2d.stroke();
                __that.context2d.clip();
                if (img.width/img.height > 1) {
                    var croppedImgWidth = circleRadius*2*(img.width-img.height)/(img.height);
                    __that.context2d.drawImage(img, -circleRadius-10-croppedImgWidth/2, -circleRadius-10,circleRadius*2*img.width/img.height,circleRadius*2);
                } else {
                    __that.context2d.drawImage(img, -circleRadius-10, -circleRadius-10,circleRadius*2,circleRadius*2*img.height/img.width);
                }
                __that.context2d.restore();
            }
        },

        drawProgress: function(__color, __progress, circleRadius) {
            // draw progress circular.
            var __that = this;
            __that.context2d.beginPath();
            if (__color) {
                __that.context2d.strokeStyle = __color;
                __that.context2d.lineWidth = 4;
                __that.context2d.lineCap = 'round';
                __that.context2d.shadowBlur = 8;
            }
            __that.context2d.arc(0, 0, circleRadius - 10, -Math.PI/2, Math.PI * 2 * __progress - Math.PI/2 );     
            __that.context2d.stroke();
        }

    };

    function Particle(opt) {
        this.x = opt.x || 0;
        this.y = opt.y || 0;
        this.vx = opt.vx || Math.random() - .5;
        this.vy = opt.vy || Math.random() - .5;
        this.size = opt.size || Math.random() * 3;
        this.life = opt.life || Math.random() * 5;
        
        this.dead = false;
    
        this.alpha = 1;
        this.rotate = 0;
        this.color = opt.color || 'rgba(244,244,244,.9)';
        this.type = opt.type || 'circle';
    
        this.update = update;
        this.render = render;
    }
    
    function update(ctx) {
        this.x += this.vx;
        this.y += this.vy;
    
        this.life -= .01;
        this.alpha -= .003;
        this.rotate += Math.random() * .01;
        if (this.life < 0) {
            this.dead = true;
            this.alpha = 0;
            return;
        }
        this.render(ctx);
    }
    
    function render(ctx) {
        var dot = this, gA = ctx.globalAlpha;
        // ctx.shadowBlur = dot.size / 2;
        // ctx.shadowColor = 'rgba(244,244,244,.2)';
        ctx.fillStyle = dot.color;
        if (dot.type === 'circle') {
            ctx.beginPath();
            ctx.globalAlpha = dot.alpha;
            ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.save();
            ctx.translate(dot.x, dot.y);
            ctx.rotate(dot.rotate);
            ctx.rect(0, 0, dot.size, dot.size);
            ctx.restore();
            ctx.fill();
        }
        ctx.globalAlpha = gA;
    }    

    return Vudio;

 });