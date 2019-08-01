<!--歌手详情页面-->
<template>
  <div class="singer-detail"></div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
    animation: show 0.2s linear;

    @keyframes show {
      0% {
        transform: translate(100%, 0%);
      }
      100% {
        transform: translate(0%, 0%);
      }
    }

  /*.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)*/
</style>
