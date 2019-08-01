import * as types from './mutation-types'

const mutations = {
  //歌单数据
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
};

export default mutations
