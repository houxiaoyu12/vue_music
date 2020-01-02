<template>
	<!--歌手详情页头部-->
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title">{{title}}</h1>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
			<div class="play-wrapper">
				<div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter" ref="filter"></div>
		</div>
		<!--歌手详情页滑动-->
		<div class="bg-layer" ref="layer"></div>
		<!--歌手详情页歌单部分-->
		<scroll :probe-type="probeType"
						:listen-scroll="listenScroll"
						:data="songs"
						class="list"
						ref="list"
						@scroll="scroll"
		>
			<div class="song-list-wrapper">
				<song-list @select="selectItem" :songs="songs"></song-list>
			</div>
			<div class="loading-container" v-show="!songs.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>

<script>
	import Scroll from '../../base/scroll/scroll'
	import SongList from '../../base/song-list/song-list'
	import Loading from '../../base/loading/loading'
	import {prefixStyle} from '../../common/js/dom'
	import {mapActions} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'

  const RESERVED_HEIGHT = 40;
	const transform = prefixStyle('transform');
	const backdrop = prefixStyle('backdropFilter');

	export default {
	  mixins: [playlistMixin],
		props: {
			bgImage: {
				type: String,
				default: ''
			},
			songs: {
				type: Array,
				default: () => {
					return []
				}
			},
			title: {
				type: String,
				default: ''
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				scrollY: 0
			}
		},
		methods: {
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
			scroll(pos) {
				//console.log(pos.y)
				this.scrollY = pos.y;
			},
			back() {
				this.$router.back()
			},
			selectItem(item, index) {
				this.selectPlay({
					list: this.songs,
					index
				})
			},
			random() {
				this.randomPlay({
					list: this.songs
				})
			},
			...mapActions([
				'selectPlay',
				'randomPlay'
			])
		},
		computed: {
			bgStyle() {
				return `background-image:url(${this.bgImage})`
			}
		},
		watch: {
			scrollY(newY) {
				let translateY = Math.max(this.minTranslateY, newY);
				let zIndex = 0;
				let scale = 1;
				let blur = 0;
				this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
				//this.$refs.layer.style.webkitTransform = `translate3d(0,${translateY}px,0)`;
				const percent = Math.abs(newY / this.imageHeight);
				if (newY > 0) {
					scale = 1 + percent;
					zIndex = 10;
				} else {
					blur = Math.min(20 * percent, 20)
				}
				//处理图片模糊
				this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
				//this.$refs.filter.style.webkitBackdropFilter = `blur(${blur}px)`;

				if (newY < this.minTranslateY) {
					zIndex = 10;
					this.$refs.bgImage.style.paddingTop = 0;
					this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
					this.$refs.filter.style.boxShadow = `0px 10px 100px rgba(7, 17, 27, 0.5) inset`;
					this.$refs.playBtn.style.display = 'none'
				} else {
					this.$refs.bgImage.style.paddingTop = '70%';
					this.$refs.bgImage.style.height = 0;
					this.$refs.filter.style.boxShadow = `0px 0px 100px rgba(7, 17, 27, 1) inset`;
					this.$refs.playBtn.style.display = ''
				}
				this.$refs.bgImage.style.zIndex = zIndex;
				this.$refs.bgImage.style[transform] = `scale(${scale})`;
				//this.$refs.bgImage.style.webkitTransform = `scale(${scale})`;
			}
		},
		created() {
			this.probeType = 3;
			this.listenScroll = true;
		},
		mounted() {
			this.imageHeight = this.$refs.bgImage.clientHeight;
			this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
			//动态设置top
			this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
		},
		components: {
			Scroll,
			SongList,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	@import "./index.styl"
</style>
