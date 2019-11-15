/*Created by hxy on 19/11/15*/

import * as types from './mutation-types'

export const selectPlay = function ({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_PLAY_LIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN_, true);
    commit(types.SET_PLAYING_STATE, true);
};
