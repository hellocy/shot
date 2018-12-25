import Bubble from './bubble.js';

const BubbleFactory = function () {
    this.speed = 1;
    this.all = [];
    this.timer;
}

BubbleFactory.prototype.create = function (watcher) {
    let that = this;
    let winW = window.innerWidth;
    for(let i = 0; i < 2; i++){
        let r = randomFrom(10, 35);
        let _x = randomFrom(0, winW - r);
        let _y = -r;

        let bubble = new Bubble();
        that.all.push(bubble);
        bubble.create(_x, _y, r);
        bubble.run(that.speed, watcher);
    }
}

module.exports = BubbleFactory;
