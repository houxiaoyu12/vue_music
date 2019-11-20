<!--歌手详情页面-->
<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from "../../api/singer";
  import {ERR_OK} from "../../api/config";
  import {createSong} from "../../common/js/song";
  import MusicList from "../music-list/music-list"
  //调用封装的方法

  export default {
    components: {MusicList},
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters(['singer'])
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if(!this.singer.id){
          this.$router.push('/singer');
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK){
            //console.log(res.data.list);
            this.songs = this._normalizeSongs(res.data.list)
            //console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if(musicData.songid && musicData.albumid){
            ret.push(createSong(musicData))
          }
        });
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
	@import "./index.styl"
</style>
