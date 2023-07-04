
export function imageLoad(url) {
    return new window.Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = function () {
            resolve(image);
        }
        image.onerror = function (err) {
            reject(err);
        }
    });
}
export default class DrawCover {
    constructor(canvas, image, radius, speed) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas
        this.src = image
        this.radius = radius || 131
        this.angle = 0.1
        this.speed = speed || 1000 * 10
        this.init()
    }
    init() {
        imageLoad(this.src).then(image => {
            this.canvas.width = this.radius * 4
            this.canvas.height = this.radius * 4
            this.canvas.style.height = `${this.radius * 2}px`
            this.canvas.style.height = `${this.radius * 2}px`
            this.ctx.translate(this.radius * 2, this.radius * 2);
            this.image = image
            this.ctx.save()
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.radius * 2, 0, 2 * Math.PI);
            this.ctx.drawImage(this.image, -this.radius * 2, -this.radius * 2, this.radius * 4, this.radius * 4);
            this.ctx.restore();
        })
    }
    draw() {
        const ctx = this.ctx;
        const radius = this.radius
        ctx.save()
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.clip();
        this.angle = this.angle + (360 / this.speed) / (1000 / 60);
        ctx.rotate(this.angle);
        if (!this.image) return
        ctx.drawImage(this.image, -radius * 2, -radius * 2, radius * 4, radius * 4);
        ctx.restore();
        cancelAnimationFrame(this.animation)
        this.animation = window.requestAnimationFrame(this.draw.bind(this));
    }
    setImage(src) {
        this.stop()
        this.src = src
        imageLoad(this.src).then(image => {
            this.image = image
            this.angle = this.angle
            this.draw.bind(this)()
        })
    }
    stop() {
        if (this.animation) {
            cancelAnimationFrame(this.animation)
            this.animation = null
        }
    }
    start() {
        this.animation = window.requestAnimationFrame(this.draw.bind(this));
    }
    play() {
        this.animation = window.requestAnimationFrame(this.draw.bind(this));
    }
}
