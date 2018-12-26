用<a href="https://www.browsersync.io/">browser-sync</a>建立本地服务，用于测试。
步骤：
1. 全局/本地安装：$ npm install -g browser-sync / $ npm install browser-sync --save-dev
2. 测试是否安装成功：browser-sync --version
3. 相关命令查看：browser-sync --help
4. 启动本地服务并监听任意文件的改动： browser-sync start --server --files "**"，这样，在任意终端都可以同步测试了

扩展 - 服务代理模式：
	browser-sync start --proxy "http://your-local-url.com:8080" --files "**"

