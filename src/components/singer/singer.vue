<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import Singer from '../../common/js/singer'
  import ListView from '../../base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      //子组件返回数据
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        //将点击的歌手数据存到vuex中
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if(res.code === ERR_OK){
            this.singers = this._normalizeSinger(res.data.list);
            //console.log(this.singers);//处理前数据
            //console.log(this._normalizeSinger(this.singers))
          }
        })
      },
      //处理数据
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };
        list.forEach((item, index) => {
          if(index < HOT_SINGER_LEN){
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid,
            }))
          }
          const key = item.Findex;
          if(!map[key]){
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid,
          }))
        });
        //console.log(map)//查看处理后数据
        //为了得到有序列表，处理map
        let hot = [];//热门数组
        let ret = [];//常规的数组
        for (let key in map) {
          let val = map[key];
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val);
          } else if(val.title === HOT_NAME) {
            hot.push(val);
          }
        }
        //处理ret数组，将其排成想要的a-z的方式,charCodeAt将字母转换成uicode编码
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        });
        //最后得到的是一维数组
        return hot.concat(ret);
      }
    },
    components: {
      ListView,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "./index.styl"
</style>
