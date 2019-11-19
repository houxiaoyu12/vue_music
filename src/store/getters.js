//歌单数据
export const singer = state => state.singer;
//播放，暂停
export const playing = state => state.playing;
//是否全屏
export const fullScreen = state => state.fullScreen;
//播放列表
export const playList = state => state.playList;
//播放模式列表
export const sequenceList = state => state.sequenceList;
//播放的顺序
export const mode = state => state.mode;
//当前播放的index
export const currentIndex = state => state.currentIndex;
//当前播放的歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
};