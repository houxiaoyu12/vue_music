<!--歌曲播放界面-->
<template>
	<div class="player" v-show="playList.length > 0">
		<!--展开的播放器-->
		<transition name="normal"
								@enter="enter"
								@after-enter="afterEnter"
								@leave="leave"
								@after-leave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
				<!--<div class="background">
						<img width="100%" height="100%" :src="currentSong.imag">
				</div>-->
				<div class="top">
					<div class="back" @click="back">
						<i class="icon-back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle"

				>
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="rotateClass">
								<img class="image" :src="currentSong.imag">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<div class="playing-lyric">playingLyric</div>
						</div>
					</div>
					<scroll class="middle-r" ref="lyricList">
						<div class="lyric-wrapper">
							<div>
								<p ref="lyricLine"
									 class="text"
									 v-for="(line,index) in lines">{{line}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class=""></span>
						<span class="dot" :class=""></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{formatTime(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent"
														@percentChange="onProgressBarChange"
							></progress-bar>
						</div>
						<span class="time time-r">{{formatTime(durationTime)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left" @click="changeMode">
							<i :class="iconMode"></i>
						</div>
						<div class="icon i-left" :class="disableCls">
							<i @click="prev" class="icon-prev"></i>
						</div>
						<div class="icon i-center" :class="disableCls">
							<i @click="togglePlaying" :class="playIcon"></i>
						</div>
						<div class="icon i-right" :class="disableCls">
							<i @click="next" class="icon-next"></i>
						</div>
						<div class="icon i-right">
							<i class="icon icon-not-favorite"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<!--收起的播放器-->
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :class="rotateClass" width="40" height="40" :src="currentSong.imag">
				</div>
				<div class="text">
					<h2 class="name" v-html="currentSong.name"></h2>
					<p class="desc" v-html="currentSong.singer"></p>
				</div>
				<div class="control">
					<progress-circle :radius="radius" :percent="percent">
						<i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
					</progress-circle>
				</div>
				<div class="control">
					<i class="icon-playlist"></i>
				</div>
			</div>
		</transition>
		<audio
			ref="audio"
			src="http://up_mp4.t57.cn/2018/1/03m/13/396131203208.m4a"
			@timeupdate="updateTime"
			@ended="end"
		></audio>
	</div>
</template>

<script>
	import {mapGetters, mapMutations,} from 'vuex'
	import animations from 'create-keyframe-animation' //js动画github API组件
	import {prefixStyle} from '../../common/js/dom'
	import ProgressBar from '../../base/progress-bar/progress-bar'
	import ProgressCircle from '../../base/progress-circle/progress-circle'
	import {playMode} from '../../common/js/config'
	import {shuffle} from "../../common/js/util";
	import Scroll from '../../base/scroll/scroll'

	const transform = prefixStyle('transform');

	export default {
		data() {
			return {
				lines: [
					'一闪一闪亮晶晶','漫天都是小星星',
					'一闪一闪亮晶晶','漫天都是小星星',
					'一闪一闪亮晶晶','漫天都是小星星',
					'一闪一闪亮晶晶','漫天都是小星星',
					'一闪一闪亮晶晶','漫天都是小星星',
					'一闪一闪亮晶晶','漫天都是小星星',
				],
				songReady: true, //用于audio标签播放暂停的时候使用的标志位
				currentTime: 0, //当前歌曲的时间
				durationTime: 0, //当前歌曲的总时间
				radius: 32, //circle大小
			}
		},
		props: {},
		computed: {
			...mapGetters([
				'fullScreen',
				'playList',
				'currentSong',
				'playing',
				'currentIndex',
				'mode',
				'sequenceList'
			]),

			playIcon() {
				return this.playing ? 'icon-pause' : 'icon-play'
			},
			miniIcon() {
				return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
			},
			//控制CD旋转的Cls
			rotateClass() {
				return this.playing ? 'play' : 'play pause'
			},
			//按钮置灰的Cls现在暂时不用，src写死的
			disableCls() {
				return this.songReady ? '' : 'disable'
			},
			//传入进度条的percent
			percent() {
				return this.currentTime / this.durationTime
			},
			iconMode() {
				return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
			}
		},
		components: {
			ProgressBar, ProgressCircle, Scroll
		},
		methods: {
			back() {
				this.setFullScreen(false)
			},
			open() {
				this.setFullScreen(true)
			},
			togglePlaying() {
				this.setPlayingState(!this.playing)
			},
			//下一曲
			next() {
				//todo
				/*//监测下一首歌是否准备好 audio标签中用的目前只有一首歌是写死的所以暂时不用，
				if (!this.songReady) {
					return
				}*/
				let index = this.currentIndex + 1;
				//当播放到最后一首歌的时候，要处理index的问题
				if (index === this.playList.length) {
					index = 0
				}
				this.setCurrentIndex(index);
				if (!this.playing) {
					this.togglePlaying()
				}
				/*this.songReady = false;*/
			},
			//上一曲
			prev() {
				/*if (!this.songReady) {
					return
				}*/
				let index = this.currentIndex - 1;
				//当时第一首歌的时候，再往前就是最后一首歌
				if (index === -1) {
					index = this.playList.length - 1
				}
				this.setCurrentIndex(index);
				if (!this.playing) {
					this.togglePlaying()
				}
				/*this.songReady = false;*/
			},
			end() {
				if (this.mode === playMode.loop) {
					this.loop()
				} else {
					this.next()
				}
			},
			loop() {
				this.$refs.audio.currentTime = 0;
				this.$refs.audio.play();
			},
			//改变进度条
			onProgressBarChange(percent) {
				this.$refs.audio.currentTime = this.durationTime * percent;
				if (!this.playing) {
					this.togglePlaying()
				}
			},
			//改变歌曲顺序
			changeMode() {
				const mode = (this.mode + 1) % 3;
				this.setPlayMode(mode);
				let list = null;
				if (mode === playMode.random) {
					list = shuffle(this.sequenceList)
				} else {
					list = this.sequenceList;
				}
				this.resetCurrentIndex(list)
				this.setPlayList(list)
			},
			//重置index的方法
			resetCurrentIndex(list) {
				let index = list.findIndex((item) => {
					return item.id === this.currentSong.id
				});
				this.setCurrentIndex(index)
			},
			/*=========audio 对应的API方法==============*/
			ready() {
				this.songReady = true;
			},
			error() {
				this.songReady = true;
			},
			updateTime(e) {
				this.currentTime = e.target.currentTime;
				this.durationTime = e.target.duration
			},
			/*=================飞入飞出动画==================*/
			enter(el, done) {
				const {x, y, scale} = this._getPosAndScale();
				let animation = {
					0: {
						transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
					},
					60: {
						transform: `translate3d(0,0,0) scale(1.1)`
					},
					100: {
						transform: `translate3d(0,0,0) scale(1)`
					}
				};
				animations.registerAnimation({
					name: 'move',
					animation,
					presets: {
						duration: 600, //间隔时间
						easing: 'linear' //缓动曲线
					}
				});
				animations.runAnimation(this.$refs.cdWrapper, 'move', done)
			},
			afterEnter() {
				animations.unregisterAnimation('move');
				this.$refs.cdWrapper.style.animation = ''
			},
			leave(el, done) {
				this.$refs.cdWrapper.style.transition = 'all 0.8s'
				const {x, y, scale} = this._getPosAndScale()
				this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
				this.$refs.cdWrapper.addEventListener('transitionend', done)
			},
			afterLeave() {
				this.$refs.cdWrapper.style.transition = ''
				this.$refs.cdWrapper.style[transform] = ''
			},
			_getPosAndScale() {
				const targetWidth = 40;
				const paddingLeft = 40;
				const paddingBottom = 30;
				const paddingTop = 80;
				const width = window.innerWidth * 0.8;
				const scale = targetWidth / width;
				const x = -(window.innerWidth / 2 - paddingLeft); //x轴位移的距离
				const y = window.innerHeight - paddingTop - width / 2 - paddingTop;
				return {
					x,
					y,
					scale
				}
			},
			/*==========================================================*/
			formatTime(interval) {
				interval = interval | 0; //向下取整类似Math.follow
				const minute = interval / 60 | 0;
				const second = this._pad(interval % 60);
				return `${minute}:${second}`
			},
			//补零
			_pad(num, n = 2) {
				let len = num.toString().length;
				while (len < n) {
					num = '0' + num;
					len++
				}
				return num;
			},
			...mapMutations({
				setFullScreen: 'SET_FULL_SCREEN',
				setPlayingState: 'SET_PLAYING_STATE',
				setCurrentIndex: 'SET_CURRENT_INDEX',
				setPlayMode: 'SET_PLAY_MODE',
				setPlayList: 'SET_PLAY_LIST',
			})
		},
		watch: {
			currentSong(newSong, oldSong) {
				if (newSong.id === oldSong.id) {
					return
				}
				this.$nextTick(() => {
					this.$refs.audio.play()
					this.currentSong.getLyric()
				})
			},
			playing(newPlaying) {
				const audio = this.$refs.audio;
				this.$nextTick(() => {
					newPlaying ? audio.play() : audio.pause()
				})
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	@import "./index.styl"
</style>
