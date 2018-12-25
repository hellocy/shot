// 构造子弹
const Bullet = function () {
    this.timer = null;
    this.el = null;
    this.run = function (watcher, allBubbles) {
        let that = this;

        cancelAnimationFrame(this.timer);
        this.timer = requestAnimationFrame(function init(){
            let rect = that.el.getBoundingClientRect();
            let cx = rect.x;
            let cr = rect.right;
            let cb = rect.bottom;
            let dy = rect.top;
            if(dy == 0){
                that.el.parentNode && that.el.parentNode.removeChild(that.el);
                return;
            }
            let cy = dy + watcher.bulletSpeed;
            that.el.style.top = cy + 'px';

            let bulletIdx = watcher.bullets.indexOf(that);

            for(let i = 0, len = allBubbles.all.length; i < len; i++) {
                let bubblei = allBubbles.all[i];
                let _rect = bubblei.el.getBoundingClientRect();

                if (cy <= _rect.bottom && cx > _rect.x - 5 && cr < _rect.right + 5) {

                    cancelAnimationFrame(bubblei.timer);
                    bubblei.el.style.animation = 'explode 0.3s';
                    allBubbles.all.splice(i, 1);
                    watcher.record(bubblei);
                    watcher.update();
                    that.el.parentNode && that.el.parentNode.removeChild(that.el);
                    watcher.bullets.splice(bulletIdx, 1);
                    cancelAnimationFrame(that.timer);
                    break;
                }
            }

            if (cb < -14) {
                that.el.parentNode.removeChild(that.el);
                watcher.bullets.splice(bulletIdx, 1);
                cancelAnimationFrame(that.timer);
            } else {
                that.timer = requestAnimationFrame(init);
            }

        });
    }
}

Bullet.prototype.init = function (){
    let _gunRect = gun.getBoundingClientRect();
    this.el = document.createElement('span');
    this.el.className = 'bullet';
    let _x = (_gunRect.x || _gunRect.left) + _gunRect.width / 2 - 2;
    let _y = _gunRect.top - 14;
    this.el.style.left = _x + 'px'
    this.el.style.top = _y + 'px'
    document.body.appendChild(this.el);
    return this;
}

module.exports = Bullet
