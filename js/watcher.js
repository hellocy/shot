
import util from './util.js';
import Bullet from './bullet.js';
import BubbleFactory from './bubbleFactory.js';
import Gatlin from './gatlin.js';

// 观察者 （当子弹击中气泡，气泡就爆炸，得分，有气泡触底，则游戏结束）
const Watcher = function () {
    this.score = 0;
    this.bulletSpeed = -5; // 子弹射击速度
    this.bulletFre = 300 // 子弹发射频率
    this.cacheBulletFre = 0;
    this.bubbleSpeed = 1; // 气泡下移速度
    this.bulletTimer = null;
    this.bullets = [];
    this.bubbleFty = null;
    this.$mask = document.querySelector(".mask");
    this.$gun = document.querySelector("#gun");
    this.gunTop = 0;
    this.$faster = document.querySelector(".faster");
    this.$scorer = document.querySelector("#score");
    this.$talker = document.querySelector("#talker");
    this.isAnimation = false;
    this.animationFlag = true;
    this.level = 0;
    this.oldLevel = 0;
    this.gatlinTimer = null;
    this.allGatlins = [];

    this.isOver = false;

    this.init = function () {
        let that = this;
        let gunRect = this.$gun.getBoundingClientRect();
        this.gunTop = gunRect.top
        let hMax = window.innerWidth;
        let initLeft = (hMax - gunRect.width ) / 2;

        this.$gun.style.left = initLeft + 'px';

        let btnStart = document.querySelector('#btn-begin');
        let btnRestart = document.querySelector('#btn-restart');

        // 开始
        btnStart.addEventListener('click', function(e){
            that.$mask.style.animation = 'maskgo 1s 1s ease-in-out forwards'
            setTimeout(function(){
                that.begin();
            }, 1000)
        })

        // 重开
        btnRestart.addEventListener('click', function(e){
            location.reload()
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

        let fnFasterShot = function(e){
            if(that.isOver){return;}
            that.cacheBulletFre = that.bulletFre;
            that.bulletFre = 30;
            that.updateShot();
            util.addClass(that.$gun, 'fast')
            util.removeClass(that.$faster, 'up')
        }

        that.$faster.addEventListener('touchstart', fnFasterShot)

        that.$faster.addEventListener('touchend', function(e){
            that.bulletFre = that.cacheBulletFre;
            that.updateShot();
            util.removeClass(that.$gun, 'fast');
            util.addClass(that.$faster, 'up')
        })

        that.$talker.addEventListener("webkitAnimationEnd",function(){
            this.style.animation = '';
            that.isAnimation = false;
        });

        document.onkeydown = function (e) {
            let keycode = e.which || e.keyCode;
            let $gun = that.$gun;
            let gunRect = $gun.getBoundingClientRect();
            if (keycode == 37) {
                $gun.style.left = ((gunRect.x || gunRect.left) - 10) + 'px';
            }else if(keycode = 39) {
                $gun.style.left = ((gunRect.x || gunRect.left) + 10) + 'px';
            }
        }

        // 监听手机Y轴方向的转动，水平移动手杆 #gun
        window.addEventListener('deviceorientation',function (e) {
            let cx = initLeft + e.gamma * 10;
            that.$gun.style.left = Math.max(-10, Math.min(cx, hMax - 20)) + 'px';
        })
    }

    // 开始游戏
    this.begin = function () {
        let that = this;
        navigator.vibrate([100]);

        // 实例化气泡工厂
        that.bubbleFty = new BubbleFactory();

        // 气泡跑起来
        that.bubbleFty.create(that);
        that.bubbleFty.timer = setInterval(function() {
            that.bubbleFty.create(that);
        }, 1000);

        // 发射子弹
        that.updateShot();

        // 加特林
        that.gatlinTimer = setInterval(function(){
            let gatlin = new Gatlin();
            gatlin.create().run();
            that.allGatlins.push(gatlin);
        }, 3000)
    }

    this.shot = function () {
        let that = this;
        let bullet = new Bullet();
        bullet.init(that.$gun);
        bullet.run(that, that.bubbleFty, that.allGatlins);
        that.bullets.push(bullet);
    }

    this.updateShot = function () {
        let that = this;
        clearInterval(that.bulletTimer);

        if(!that.isOver){
            that.bulletTimer = setInterval(function () {
                that.shot();
            }, that.bulletFre)
        }

    }

    this.stop = function () {
        let bullets = this.bullets;
        let bubbles = this.bubbleFty.all;
        let allGatlins = this.allGatlins;
        clearInterval(this.bubbleFty.timer);
        clearInterval(this.bulletTimer);
        clearInterval(this.gatlinTimer);
        for (let i = 0, len = bubbles.length; i < len; i++) {
            cancelAnimationFrame(bubbles[i].timer);
        }
        for (let i = 0, len = bullets.length; i < len; i++) {
            cancelAnimationFrame(bullets[i].timer);
        }
        for (let i = 0, len = allGatlins.length; i < len; i++) {
            cancelAnimationFrame(allGatlins[i].timer);
        }
        this.isOver = true;
    }

    this.record = function (bubble) {
        this.score += bubble.r;
        this.$scorer.innerText = this.score;
    }

    // 升级难度级别
    this.update = function () {
        let that = this;

        let score = this.score;
        let speed = 1;

        let talkText = '';

        if(100 < score && score < 200) {
            that.bulletFre = 260;
            talkText = '你真棒！继续加油!';
            this.level = 2;
        } else if (500 <= score && score < 1000){
            that.bulletFre = 240;
            talkText = '干得漂亮！';
            this.level = 3;
        } else if (1000 <= score && score < 1500){
            that.bulletFre = 220;
            talkText = '真厉害！';
            this.level = 4;
        } else if (2500 <= score && score < 3000){
            that.bulletFre = 200;
            talkText = '这是高手，这是高手！';
            this.level = 5;
        } else if (3000 <= score && score < 3500){
            that.bulletFre = 180;
            talkText = '我对你刮目相看啦！';
            this.level = 6;
        } else if (3500 <= score && score < 4000){
            that.bulletFre = 160;
            talkText = '你简直逆天了啊！';
            this.level = 7;
        } else if (4000 <= score && score < 4500){
            that.bulletFre = 140;
            talkText = '你已经超越了人类极限！';
            this.level = 8;
        } else if (4500 <= score && score < 5000){
            that.bulletFre = 100;
            talkText = '天啦，上帝收了他吧！';
            this.level = 9;
        } else if (10000 <= score){
            that.bulletFre = 80;
            talkText = '宇宙要爆炸啦...';
            this.level = 50;
        }

        let newSpeed = speed + Math.floor(score / 500) * 0.1;

        if(!that.isAnimation && that.oldLevel != that.level) {
            that.isAnimation = true;
            that.$talker.innerText = talkText;
            that.$talker.style.animation = 'talktext 3s';
            that.oldLevel = that.level;
        }

        that.bubbleFty.speed = newSpeed;

        console.log(that.bulletFre);

        // 更新发射子弹速度
        clearInterval(that.bulletTimer);
        that.bulletTimer = setInterval(function () {
            that.shot();
        }, that.bulletFre)
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
