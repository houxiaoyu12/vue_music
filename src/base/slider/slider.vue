<!--轮播图组件-->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :keys="index"
      :class="{active: currentPageIndex === index}"
      >
      </span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from "../../common/js/dom";

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();

        if(this.autoplay){
          this._play();
        }
      })
      /*setTimeout(() => {
        this._setSliderWidth();
        this._initSlider();
      },20)*/
      //监听屏幕的尺寸，从新获取width
      window.addEventListener('resize', () => {
        if(!this.slider){
          return
        }
        this._setSliderWidth(true);
        this.slider.refresh(); //重新刷新better-scroll
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');

          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }

        if(this.loop && !isResize){
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          //click: true
        });

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if(this.loop){
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex;

          if(this.autoPlay){
            clearTimeout(this.timer);
            this._play();
          }
        })
      },
      _initDots() {//初始化dot点
        this.dots = new Array(this.children.length);
      },
      _play() {//自动播放的方法
        let pageIndex = this.currentPageIndex + 1;
        if(this.loop){
          pageIndex += 1;
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        },this.interval);
      }
    },
    destroyed() {
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
	@import "./index.styl"
</style>
