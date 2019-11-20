# vue-music(自娱自乐项目)

> 音乐播放器

## 项目启动

``` bash
# 安装依赖
npm install

# 本地启动 localhost:8080
npm run dev

# 编译发布
npm run build
```
## 开发规范
1. 单位一律使用 px 作为单位
2. css 均使用 stylus，且 stylus 文件必须独立出来在 Vue 文件中引入
3. 方法 和 data 需简单注释出它的作用
4. 页面内部组件就放在页面同级的目录下，公用组件放在 components 下，禁止引用别的页面目录下的组件
5. 没用的代码一律删除
6. img 标签引用的 静态文件一律放到 static 目录下，background 引用的静态文件一律放到 src/asset 下
7. 一律使用 ES6 语法，不要出现 var 等
8. 大段代码务必拆解成多个方法
9. 缩进采用4个空格, 段尾加分号
10. 除极特殊情况外不允许直接操作 DOM
11. 可以使用箭头函数的地方不用 function
12. 注意命名规范