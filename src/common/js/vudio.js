/* eslint-disable */

import cd from 'components/player/default-music.svg'

var default_option = {
    effect: 'circlewave',
    accuracy: 128,
    height: 200,
    width: 200,
    circlewave: {
        maxHeight: 20,
        minHeight: -5,
        spacing: 1000,
        color: '#20BF76',
        shadowBlur: 2,
        shadowColor: '#caa',
        fadeSide: true,
        prettify: false,
        particle: true,
        maxParticle: 100,
        circleRadius: 128,
        showProgress: true,
    },
}

/**
 * Constructor
 * @param {object} audioSource HTMLAudioSource/MediaStream
 * @param {object} canvasElement HTMLCanvasElement
 * @param {object} option Optional
 */
function Vudio(audioSource, canvasElement, option) {

    if (['[object HTMLAudioSource]', '[object HTMLAudioElement]', '[object MediaStream]'].indexOf(Object.prototype.toString.call(audioSource)) === -1) {
        throw new TypeError('Invaild Audio Source');
    }

    if (Object.prototype.toString.call(canvasElement) !== '[object HTMLCanvasElement]') {
        throw new TypeError('Invaild Canvas Element');
    }

    this.audioSrc = audioSource;
    this.canvasEle = canvasElement;
    this.option = mergeOption(default_option, option);
    this.meta = {};

    this.stat = 0;
    this.freqByteData = null;
    this.particles = [];
    this.coverImg = new Image();

    this.init();

}

// private functions
function mergeOption() {

    var result = {}

    Array.prototype.forEach.call(arguments, function (argument) {

        var prop;
        var value;

        for (prop in argument) {
            if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                if (Object.prototype.toString.call(argument[prop]) === '[object Object]') {
                    result[prop] = mergeOption(result[prop], argument[prop]);
                } else {
                    result[prop] = argument[prop];
                }
            }
        }

    });

    return result;

}

Vudio.prototype = {

    init: function () {

        var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext),
            source = Object.prototype.toString.call(this.audioSrc) !== '[object MediaStream]'
                ? audioContext.createMediaElementSource(this.audioSrc) : audioContext.createMediaStreamSource(this.audioSrc);
        this.analyser = audioContext.createAnalyser();
        this.meta.spr = audioContext.sampleRate;

        source.connect(this.analyser);
        this.analyser.fftSize = this.option.accuracy * 2;
        this.analyser.connect(audioContext.destination);

        this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);

        // prepare for coverImage
        this.coverImg.src = this.option.circlewave.coverImg || cd;
        this.context2d = this.canvasEle.getContext('2d');

        var memCanv = document.createElement('canvas');
        this.memCtx = memCanv.getContext('2d');

        this.effects = this.effects();

        this.resizeCanvas();

        // listen click on vudioEle
        this.canvasEle.addEventListener('click', (function () {
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

        window.onresize = this.resizeCanvas.bind(this);

    },

    resizeCanvas() {
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

    recreateAnalyzer() {
        var audioContext = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext),
            source = Object.prototype.toString.call(this.audioSrc) !== '[object MediaStream]' ?
                audioContext.createMediaElementSource(this.audioSrc) : audioContext.createMediaStreamSource(this.audioSrc);

        this.analyser = audioContext.createAnalyser();
        this.meta.spr = audioContext.sampleRate;

        source.connect(this.analyser);
        this.analyser.fftSize = this.option.accuracy * 2;
        this.analyser.connect(audioContext.destination);
    },

    rebuildData: function (freqByteData, horizontalAlign) {

        var freqByteData;

        if (horizontalAlign === 'center') {
            freqByteData = [].concat(
                Array.from(freqByteData).reverse().splice(this.option.accuracy / 2, this.option.accuracy / 2),
                Array.from(freqByteData).splice(0, this.option.accuracy / 2)
            );
        } else if (horizontalAlign === 'left') {
            freqByteData = freqByteData;
        } else if (horizontalAlign === 'right') {
            freqByteData = Array.from(freqByteData).reverse();
        } else {
            freqByteData = [].concat(
                Array.from(freqByteData).reverse().slice(this.option.accuracy / 2, this.option.accuracy),
                Array.from(freqByteData).slice(0, this.option.accuracy / 2)
            );
        }

        return freqByteData;

    },


    animate: function () {
        if (this.stat === 1) {
            this.analyser.getByteFrequencyData(this.freqByteData);
            (typeof this.effects[this.option.effect] === 'function') && this.effects[this.option.effect](this.freqByteData);
            requestAnimationFrame(this.animate.bind(this));
        }

    },

    /**
     * render blured background particles
     */
    renderMemParticles: function (strokStyle, fillStyle, type) {
        // // generate and render particles if enabled 
        if (1) {
            // should clean dead particle before render, remove the first particle if full.
            delete this.particles.find(function (p) { return p.dead });
            if (this.particles.length > 50) {
                this.particles.shift();
            } else {
                this.particles.push(new Particle({
                    x: Math.random() * this.width,
                    y: Math.random() * 100 - 50 + this.height / 2,
                    vx: Math.random() * .2 - .3,
                    vy: Math.random() * .3 - .4,
                    size: Math.random() * 5,
                    life: Math.random() * 50,
                    type: type,
                    color: fillStyle,
                }));
            }
            this.particles.forEach((dot) => { dot.update(this.context2d); });
        }
    },

    // effect functions
    effects: function () {
        var that = this;
        return {
            circlewave: function (freqByteData) {
                var option = that.option.circlewave;
                var fadeSide = option.fadeSide;
                var prettify = option.prettify;
                var freqByteData = that.rebuildData(freqByteData, option.horizontalAlign);
                var angle = Math.PI * 2 / freqByteData.length;
                var maxHeight, width, height, left, top, color, linearGradient, pos;
                var circleRadius = option.circleRadius;
                var particle = option.particle;
                var maxParticle = option.maxParticle;
                var showProgress = option.showProgress;
                var progress = that.audioSrc.currentTime / that.audioSrc.duration;
                var isStart = true;
                color = option.color;

                if (option.horizontalAlign !== 'center') {
                    fadeSide = false;
                    prettify = false;
                }

                // clear canvas
                that.context2d.clearRect(0, 0, that.width, that.height);
                that.context2d.save();
                that.context2d.lineWidth = 4;
                that.context2d.fillStyle = 'rgba(200, 200, 200, .2)';
                that.context2d.translate(that.width / 2 - .5, that.height / 2 - .5);

                if (option.shadowBlur > 0) {
                    that.context2d.shadowBlur = option.shadowBlur;
                    that.context2d.shadowColor = option.shadowColor;
                }

                // generate and render particles if enabled 
                if (particle) {
                    // should clean dead particle before render.
                    delete that.particles.find(function (p) { return p.dead });
                    if (that.particles.length > maxParticle) {
                        that.particles.shift();
                    } else {
                        const deg = Math.random() * Math.PI * 2;
                        that.particles.push(new Particle({
                            x: (circleRadius + 30) * Math.sin(deg),
                            y: (circleRadius + 30) * Math.cos(deg),
                            vx: .3 * Math.sin(deg) + Math.random() * .5 - .3,
                            vy: .3 * Math.cos(deg) + Math.random() * .5 - .3,
                            life: Math.random() * 10,
                        }));
                    }

                    that.particles.forEach((dot) => { dot.update(that.context2d); });
                }

                that.context2d.beginPath();

                // draw circlewave
                freqByteData.forEach(function (value, index) {

                    width = (circleRadius * Math.PI - that.option.accuracy * option.spacing) / that.option.accuracy;
                    left = index * (width + option.spacing);
                    option.spacing !== 1 && (left += option.spacing / 2);

                    if (prettify) {
                        if (index <= that.option.accuracy / 2) {
                            maxHeight = (1 - (that.option.accuracy / 2 - 1 - index) / (that.option.accuracy / 2)) * option.maxHeight;
                        } else {
                            maxHeight = (1 - (index - that.option.accuracy / 2) / (that.option.accuracy / 2)) * option.maxHeight;
                        }
                    } else {
                        maxHeight = option.maxHeight;
                    }

                    height = value / 256 * maxHeight;
                    height = height < option.minHeight ? option.minHeight : height;

                    if (color instanceof Array) {

                        linearGradient = that.context2d.createLinearGradient(
                            -circleRadius - maxHeight,
                            -circleRadius - maxHeight,
                            circleRadius + maxHeight,
                            circleRadius + maxHeight
                        );

                        color.forEach(function (color, index) {
                            var pos, effectiveColor;
                            if (color instanceof Array) {
                                effectiveColor = color[1];
                            } else {
                                effectiveColor = color;
                            }
                            pos = index / color.length;
                            linearGradient.addColorStop(pos, effectiveColor);
                        });

                        that.context2d.strokeStyle = linearGradient;
                        that.context2d.fillStyle = linearGradient;
                    } else {
                        that.context2d.strokeStyle = color;
                        that.context2d.fillStyle = color;
                    }

                    if (fadeSide) {
                        if (index <= that.option.accuracy / 2) {
                            that.context2d.globalAlpha = 1 - (that.option.accuracy / 2 - 1 - index) / (that.option.accuracy / 2);
                        } else {
                            that.context2d.globalAlpha = 1 - (index - that.option.accuracy / 2) / (that.option.accuracy / 2);
                        }
                    } else {
                        that.context2d.globalAlpha = 1;
                    }

                    var curAngle = angle * index;
                    var x = Math.sin(curAngle) * (circleRadius + height);
                    var y = Math.cos(curAngle) * (circleRadius + height);

                    // that.context2d.rotate(angle * index);
                    if (isStart) {
                        that.context2d.moveTo(x, y);
                        isStart = false;
                    } else {
                        that.context2d.lineTo(x, y);
                    }
                });
                var globalAlpha = that.context2d.globalAlpha;
                that.context2d.closePath();
                that.context2d.stroke();
                that.context2d.globalAlpha = .5;
                that.context2d.fill();
                that.context2d.globalAlpha = globalAlpha;

                if (showProgress) { that.drawProgress(color, progress, circleRadius); }
                that.drawCover(progress, circleRadius);

                // need to restore canvas after translate to center..
                that.context2d.restore();
            },
        }

    },

    dance: function () {
        if (this.stat === 0 || this.analyser.context.state === 'suspended') {
            this.analyser.context.resume();
            this.stat = 1;
            this.animate();
        }
        return this;
    },

    pause: function () {
        this.stat = 0;
        return this;
    },

    setOption: function (option) {
        this.option = mergeOption(this.option, option);
    },

    drawCover: function (progress, circleRadius) {
        const { width, height } = this.coverImg
        if (width === 0) return
        const img = this.coverImg;
        this.context2d.save();
        this.context2d.beginPath();
        this.context2d.lineWidth = .5;
        this.context2d.globalCompositeOperation = 'source-over';
        this.context2d.rotate(Math.PI * 2 * progress * 2);
        this.context2d.arc(0, 0, circleRadius - 13, -Math.PI / 2, Math.PI * 2 - Math.PI / 2);
        this.context2d.stroke();
        this.context2d.clip();
        if (width / height === 1) {
            this.context2d.drawImage(img, -circleRadius, -circleRadius, circleRadius * 2, circleRadius * 2 * height / width);
        } else if (width / height > 1) {
            var croppedImgWidth = circleRadius * 2 * (width - height) / height;
            this.context2d.drawImage(img, -circleRadius - 10 - croppedImgWidth / 2, -circleRadius - 10, circleRadius * 2 * width / height, circleRadius * 2);
        } else {
            this.context2d.drawImage(img, -circleRadius - 10, -circleRadius - 10, circleRadius * 2, circleRadius * 2 * img.height / img.width);
        }
        this.context2d.restore();
    },

    drawProgress: function (color, progress, circleRadius) {
        this.context2d.beginPath();
            this.context2d.strokeStyle = '#20BF76';
            this.context2d.lineWidth = 4;
            this.context2d.lineCap = 'round';
            this.context2d.shadowBlur = 0;
        this.context2d.arc(0, 0, circleRadius - 10, -Math.PI / 2, Math.PI * 2 * progress - Math.PI / 2);
        this.context2d.stroke();
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
    this.color = opt.color || 'red';
    this.type = opt.type || 'circle';

    this.update = update;
    this.render = render;
    // return this;
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

export default Vudio;
