<template>
	<div class="progress-bar" ref="progressBar" @click="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div class="progress-btn-wrapper" ref="progressBtn"
					 @touchstart.prevent="progressTouchStart"
					 @touchmove.prevent="progressTouchMove"
					 @touchend="progressTouchEnd"
			>
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import {prefixStyle} from '../../common/js/dom'

	const progressBtnWidth = 16;
	const transform = prefixStyle('transform');

	export default {
		props: {
			percent: {
				type: Number,
				default: 0
			}
		},
		created() {
			//用于共享数据
			this.touch = {}
		},
		methods: {
			progressTouchStart(e) {
				this.touch.initiated = true;
				this.touch.startX = e.touches[0].pageX; //第一个手指触摸时的坐标
				this.touch.left = this.$refs.progress.clientWidth; //进度条距离左侧的位置
			},
			progressTouchMove(e) {
				if (!this.touch.initiated) {
					return
				}
				const deltaX = e.touches[0].pageX - this.touch.startX;
				const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
				this._offset(offsetWidth)
			},
			progressTouchEnd() {
				this.touch.initiated = false;
				this._triggerPercent()
			},
			progressClick(e) {
				this._offset(e.offsetX)
				this._triggerPercent()
			},
			_triggerPercent() {
				const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
				const percent = this.$refs.progress.clientWidth / barWidth
				this.$emit('percentChange', percent)
			},
			_offset(offsetWidth) {
				this.$refs.progress.style.width = `${offsetWidth}px`;
				this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
			}
		},
		watch: {
			percent(newPercent) {
				if (newPercent >= 0 && !this.touch.initiated) {
					const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
					const offsetWidth = newPercent * barWidth;
					this._offset(offsetWidth)
				}
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	@import "./index.styl"
</style>