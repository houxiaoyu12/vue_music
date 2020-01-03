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
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  //播放列表
  [types.SET_PLAY_LIST](state, list) {
    state.playList = list
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
  },
  //推荐歌单详情页数据
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  //推荐歌单列表
  [types.SET_TOPLIST](state, topList) {
    state.topList = topList
  },
};

export default mutations
