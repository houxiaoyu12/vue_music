import {playMode} from '../common/js/config' //播放配置js

const state = {
  singer: {}, //歌手
  playing: false, //是否播放
  fullScreen: false, //是否全屏播放
  playList: [], //播放列表
  sequenceList: [], //播放模式列表
  mode: playMode.sequence, //播放的顺序
  currentIndex: -1, //当前播放的index
  disc: {}, //歌单跳转页面数据
  topList: {}, //推荐歌单列表
};

export default state
