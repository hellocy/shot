import util from './util.js';

const Bubble = function () {
    this.timer = null;
    this.el = null;
    this.r = 0;

    this.bg = function () {
        let r = util.randomFrom(0, 255);
        let g = util.randomFrom(0, 255);
        let b = util.randomFrom(0, 255);
        return 'rgb('+r+', '+g+', '+b+')';
    }

    this.create = function (x, y, r) {
        let el = document.createElement('span');
        this.r = r;
        el.className = 'bubble';
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.width = r + 'px';
        el.style.height = r + 'px';
        el.style.backgroundColor = this.bg();
        this.el = el;
        document.body.appendChild(this.el);
        this.el.addEventListener("webkitAnimationEnd",function(){
            document.body.removeChild(el);
        });
        return this;
    }
}

Bubble.prototype.run = function (speed, watcher) {
    let that = this;
    var speed = speed || 0.1;
    var winH = window.innerHeight;
    this.timer = requestAnimationFrame(function go() {
        let rect = that.el.getBoundingClientRect();
        let cy = rect.top + speed;
        let cb = rect.bottom;
        that.el.style.top = cy + 'px';
        if(cy > winH) {
            that.el.parentNode.removeChild(that.el);
            cancelAnimationFrame(that.timer);
        }else if (cb > watcher.gunTop - 5) {
            watcher.stop();
        }else{
            that.timer = requestAnimationFrame(go);
        }
    })
}

Bubble.prototype.exploded = function () {
    this.el.parentNode.removeChild(this.el);
}

export default Bubble;
