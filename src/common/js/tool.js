import { padStart } from 'lodash'

// const _pad = (num, n = 2) => {
//   let len = num.toString().length
//   while (len < n) {
//     num = '0' + num
//     len++
//   }
//   return num
// }

export const formatTime = (time) => {
  time = time | 0
  const minute = padStart(`${parseInt(time / 60 )}`,2,'0')
  const second = padStart(`${parseInt((time) % 60)}`,2,'0' )
  return `${minute}:${second}`
}

export function imageLoad(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = function () {
      resolve(image);
    }
    image.οnerrοr = function (err) {
      reject(err);
    }
  });
}
export class drawCD {
  constructor(canvas, image, radius, speed) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas
    this.src = image
    this.radius = radius || 131
    this.angle = 0.1
    this.speed = speed || 10000
    this.init()
  }
  init() {
    imageLoad(this.src).then(image => {
      // var dpr = window.devicePixelRatio || 1;
      // this.ctx.backingStorePixelRatio || 1
      // this.ctx.scale(dpr, dpr);
      this.canvas.width = this.radius * 4
      this.canvas.height = this.radius * 4
      this.canvas.style.height = `${this.radius * 2}px`
      this.canvas.style.height = `${this.radius * 2}px`
      this.ctx.translate(this.radius * 2, this.radius * 2);
      this.image = image
      this.start()
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
    ctx.drawImage(this.image, -radius * 2, -radius * 2, radius * 4, radius * 4);
    ctx.restore();
    this.animation = window.requestAnimationFrame(this.draw.bind(this));
  }
  drawCover(src) {
    this.stop()
    this.src = src
    imageLoad(this.src).then(image => {
      this.image = image
      this.angle = 0
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
