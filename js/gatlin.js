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
        let r = util.randomFrom(10, 35);
        let winH = window.innerHeight;
        let txt = document.createTextNode(r);
        let x = util.randomFrom(0, winW - r);
        let y = -r;

        el.className = 'gatlin';
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.width = r + 'px';
        el.style.height = r + 'px';
        el.style.backgroundColor = 'rgb(200, 200, 100)';
        el.style.color = '#fff';
        el.style.textAlign = 'center';

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
    let speed = 0.1;
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
