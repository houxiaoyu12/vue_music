<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  //import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      }
    },
    created () {
      this.$watch('query', (newQuery) => {
        this.$emit('query', newQuery)
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "./index.styl"
</style>