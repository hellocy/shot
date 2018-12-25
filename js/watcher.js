
import Bullet from './bullet.js';
import BubbleFactory from './bubbleFactory.js';

// 观察者 （当子弹击中气泡，气泡就爆炸，得分，有气泡触底，则游戏结束）
const Watcher = function () {
    this.score = 0;
    this.bulletSpeed = -5; // 子弹射击速度
    this.bulletFre = 300 // 子弹发射频率
    this.bubbleSpeed = 1; // 气泡下移速度
    this.bulletTimer = null;
    this.bullets = [];
    this.bubbleFty = null;
    this.$gun = document.querySelector("#gun");
    this.gunTop = 0;
    this.$scorer = document.querySelector("#score");

    this.init = function () {
        let that = this;
        let gunRect = this.$gun.getBoundingClientRect();
        this.gunTop = gunRect.top
        let hMax = window.innerWidth;
        let initLeft = (hMax - gunRect.width ) / 2;

        this.$gun.style.left = initLeft + 'px';

        let btnStart = document.querySelector('#btn-begin');
        let btnPause = document.querySelector('#btn-pause');
        let btnRestart = document.querySelector('#btn-restart');

        // 开始
        btnStart.addEventListener('click', function(e){
            that.begin();
        })

        // 暂停
        btnPause.addEventListener('click', function(e){
            cancelAnimationFrame(timer);
        })

        // 重开
        btnRestart.addEventListener('click', function(e){
            that.restart();
        })

        that.$gun.ontouchstart = function (e) {
            var that = this;
            var ix = e.touches[0].clientX;
            var ox = this.getBoundingClientRect().x;
            document.ontouchmove = function (e) {
                var cx = e.touches[0].clientX;
                var dx = cx - ix;
                that.style.left = (ox + dx) + 'px';

                document.ontouchend = function (e) {
                    document.onmousemove = null
                    document.onmouseup = null
                }
            }
        }

        // 监听手机Y轴方向的转动，水平移动手杆 #gun
        window.addEventListener('deviceorientation',function (e) {
            let cx = initLeft + e.gamma * 10;
            that.$gun.style.left = Math.max(-10, Math.min(cx, hMax - 30)) + 'px';
        })
    }

    // 开始游戏
    this.begin = function () {
        let that = this;
        navigator.vibrate([100]);

        this.bubbleFty = new BubbleFactory();

        this.bubbleFty.create(that);

        this.bubbleFty.timer = setInterval(function() {
            that.bubbleFty.create(that);
        }, 1000);

        // 发射子弹
        this.bulletTimer = setInterval(that.shot, that.bulletFre)
    }

    this.shot = function () {
        let bullet = new Bullet();
        bullet.init();
        bullet.run(this, this.bubbleFty);
        console.log(this, 4444444);
        return;
        this.bullets.push(bullet);
    }

    this.stop = function () {
        let bullets = this.bullets;
        let bubbles = this.bubbleFty.all;
        clearInterval(this.bubbleFty.timer);
        clearInterval(this.bulletTimer);
        for (let i = 0, len = bubbles.length; i < len; i++) {
            cancelAnimationFrame(bubbles[i].timer);
        }
        for (let i = 0, len = bullets.length; i < len; i++) {
            cancelAnimationFrame(bullets[i].timer);
        }
    }

    this.record = function (bubble) {
        this.score += bubble.r;
        this.$scorer.innerText = this.score;
    }

    // 升级难度级别
    this.update = function () {
        var newSpeed = this.score / 500;
        this.bubbleFty.speed = newSpeed < 1 ? 1 : newSpeed;
        this.bulletFre = Math.round(300 - this.bubbleFty.speed * 100)

        clearInterval(this.bulletTimer);
        this.bulletTimer = setInterval(that.shot, that.bulletFre)
        console.log(this.bulletFre)
    }

    // 重启
    this.restart = function () {
        this.score = 0;
        this.bulletSpeed = -5; // 重置子弹射击速度
        this.bulletFre = 300 // 重置子弹发射频率
        this.bubbleSpeed = 1; // 重置气泡下移速度

        for(let i = 0, len = this.bubbleFty.all.length; i < len; i++){
            cancelAnimationFrame(this.bubbleFty.all[i].timer);
            document.body.removeChild(this.bubbleFty.all[i].el);
        }
        for(let i = 0, len = this.bullets.length; i < len; i++){
            cancelAnimationFrame(this.bullets[i].timer);
            document.body.removeChild(this.bullets[i].el);
        }
        clearInterval(this.bubbleFty.timer);
        clearInterval(this.bulletTimer);

        this.bubbleFty = null;
        this.bullets = [];
    }
}

export default Watcher
