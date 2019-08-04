import * as types from './mutation-types'

const mutations = {
  //歌单数据
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  //是否播放
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  //是否全屏播放
  [types.SET_FULL_SCREEN_](state, flag) {
    state.fullscreen = flag
  },
  //播放列表
  [types.SET_PLAY_LIST](state, list) {
    state.playlist = list
  },
  //播放模式列表
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  //播放的顺序
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  //当前播放的index
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  }
};

export default mutations
