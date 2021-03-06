/*Created by hxy on 19/11/15*/

import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// 筛选歌曲的index
function findIndex(list, song) {
	return list.findIndex((item) => {
		return item.id === song.id
	})
}

// 选择歌曲
export const selectPlay = function ({commit, state}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list);
	if (state.mode === playMode.random) {
		let randomList = shuffle(list);
		commit(types.SET_PLAY_LIST, randomList);
		index = findIndex(randomList, list[index])
	} else {
		commit(types.SET_PLAY_LIST, list);
	}
	commit(types.SET_CURRENT_INDEX, index);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
};

//随机按钮对应
export const randomPlay = function ({commit}, {list}) {
	commit(types.SET_PLAY_MODE, playMode.random);
	commit(types.SET_SEQUENCE_LIST, list);
	let randomList = shuffle(list);
	commit(types.SET_PLAY_LIST, randomList);
	commit(types.SET_CURRENT_INDEX, 0);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}

//插入歌曲
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice() //操作副本，就不会造成vuex修改的报错了
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}