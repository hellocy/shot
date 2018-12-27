/**
 * 加特林 不定时下落，击中获得一次快速射击的机会
 */

import util from './util.js';

const Gatlin = function () {
    this.timer = null;
    this.el = null;
    this.r = 0;

    this.create = function () {
        let el = document.createElement('span');
        let r = util.randomFrom(30, 45);
        let winW = window.innerWidth;
        let txt = document.createTextNode(r);
        let x = util.randomFrom(0, winW - r);
        let y = -r;

        el.className = 'gatlin';
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.width = r + 'px';
        el.style.height = r + 'px';
        el.style.lineHeight = r + 'px';

        this.el = el;

        el.appendChild(txt);
        document.body.appendChild(this.el);
        this.el.addEventListener("webkitAnimationEnd",function(){
            document.body.removeChild(el);
        });
        return this;
    }
}

Gatlin.prototype.run = function (watcher) {
    let that = this;
    let speed = 1;
    let winH = window.innerHeight;
    this.timer = requestAnimationFrame(function go() {
        let rect = that.el.getBoundingClientRect();
        let cy = rect.top + speed;
        let cb = rect.bottom;
        that.el.style.top = cy + 'px';
        if(cy > winH) {
            that.el.parentNode.removeChild(that.el);
            cancelAnimationFrame(that.timer);
        }else{
            that.timer = requestAnimationFrame(go);
        }
    })
}

export default Gatlin;
