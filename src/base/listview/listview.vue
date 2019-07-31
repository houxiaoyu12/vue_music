<!--歌手歌单列表组件-->
<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" class="item" :data-index="index">{{item}}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '../scroll/scroll'
  import {getData} from '../../common/js/dom'

  const ANCHOR_HEIGHT = 18;//每个元素的高度

  export default {
    created() {
      //初始化touch用于，两个函数之间的传值
      this.touch = {};
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substring(0, 1)
        })
      }
    },
    methods: {
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
      //跳转到对应字母表的位置方法,第二的参数为0是即时滚动的
      _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
