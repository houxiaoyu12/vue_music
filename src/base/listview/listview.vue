<!--歌手歌单列表组件-->
<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <!--歌单列表-->
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <!--每个字母表中的歌手类别-->
        <ul>
          <li @click="selectItem(item)" v-for="(item, index) in group.items" :keys="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--右侧字母表-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :key="index"
            class="item"
            :data-index="index"
            :class="{current: currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <!--固定title-->
    <div class="list-fixed" v-show="fixedTilte" ref="fixed">
      <h1 class="fixed-title">{{fixedTilte}}</h1>
    </div>
    <!--Loading-->
    <div class="loading-container" v-show="!data.length">
      <loading :title="title" />
    </div>
  </scroll>
</template>

<script>
  import Loading from '../../base/loading/loading'
  import Scroll from '../scroll/scroll'
  import {getData} from '../../common/js/dom'

  const ANCHOR_HEIGHT = 18;//每个元素的高度
  const TITLE_HEIGHT = 30;

  export default {
    created() {
      //初始化touch用于，两个函数之间的传值
      this.touch = {};
      this.listenScroll = true;
      this.listHeight = []; //存放着每个字母所包含的列表的高度
      this.probeType = 3; //滚动实时派发事件
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1, //滚动位置的坐标
        currentIndex: 0, //字母高亮的index
        diff: -1, //比较参数
        title: 'Loading...'
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substring(0, 1)
        })
      },
      fixedTilte() {
        if(this.scrollY > 0){
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index');
        //第一次获取触碰字母表的位置
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;//记录初始化的index
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        //|0 相当于math.floor()向下取整
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
        //console.log(delta)
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      //歌手滚动位置
      scroll(pos) {
        this.scrollY = pos.y;
      },
      //跳转到对应字母表的位置方法,第二的参数为0是即时滚动的
      _scrollTo(index) {
        //让点击字母表两端无效
        if(!index && index !== 0){
          return
        }
        //处理index边界问题
        if(index < 0){
          index = 0
        } else if(index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }

        this.scrollY = -this.listHeight[index];//实现点击字母表歌手列表滑动到对应的位置。
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      //将每个列表的高度计算出来
      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        },20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight;

        //当滚动到顶部，newY>0
        if(newY > 0){
          this.currentIndex = 0;
          return
        }
        //在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          //判断最后一个或者在中间的时候
          if(-newY >= height1 && -newY < height2){
            this.currentIndex = i;
            //console.log('hxy',this.currentIndex);
            this.diff = height2 + newY;
            return
          }
        }
        //当移动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2;
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if(this.fixedTop === fixedTop){
          return
        }
        this.fixedTop = fixedTop;
        //console.log(this.fixedTop);
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
	@import "./index.styl"
</style>
