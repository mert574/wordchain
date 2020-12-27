import turkishNameStoreService from '@/services/TurkishNameStoreService';
import lastCharOfLastItemInList from '@/util/lastCharOfLastItemInList';

export const actions = {
    START_GAME: 'START_GAME',
    ATTEMPT_ROUND: 'ATTEMPT_ROUND',
    CURRENT_PLAYER_LOST: 'CURRENT_PLAYER_LOST',
    RESET: 'RESET',
};

export const turn = {
    PLAYER: 'PLAYER',
    COMPUTER: 'COMPUTER',
};

const mutations = {
    RESET: 'RESET',
    SET_PLAYING: 'SET_PLAYING',
    ADD_NAME: 'ADD_NAME',
    SWITCH_TURN: 'SWITCH_TURN',
    ADD_SCORE: 'ADD_SCORE',
    SET_WINNER: 'SET_WINNER',
};

function getDefaultState() {
    return {
        turn: turn.PLAYER,
        previousNames: [],
        score: 0,
        isPlaying: false,
        winner: null,
    };
}

const game = {
    namespaced: true,
    state: getDefaultState,
    mutations: {
        [mutations.RESET](state) {
            Object.assign(state, getDefaultState());
        },
        [mutations.SET_PLAYING](state, value) {
            state.isPlaying = value;
        },
        [mutations.ADD_NAME](state, name) {
            state.previousNames.push(name);
        },
        [mutations.SWITCH_TURN](state) {
            const currentTurn = state.turn;
            state.turn = currentTurn === turn.COMPUTER ? turn.PLAYER : turn.COMPUTER;
        },
        [mutations.ADD_SCORE](state, amount) {
            state.score += amount;
        },
        [mutations.SET_WINNER](state, winner) {
            state.winner = winner;
        },
    },
    actions: {
        [actions.START_GAME]({ commit }, initialName) {
            commit(mutations.RESET);
            commit(mutations.SET_PLAYING, true);
            commit(mutations.ADD_NAME, initialName);
        },
        [actions.RESET]({ commit }) {
            commit(mutations.RESET);
        },
        [actions.ATTEMPT_ROUND]({ state, commit, dispatch, rootGetters }, name) {
            if (!state.isPlaying) {
                throw new Error('Oyun henüz başlamadı.');
            }
            if (state.previousNames.includes(name)) {
                dispatch(actions.CURRENT_PLAYER_LOST);
                throw new Error('Bu isim daha önce kullanıldı.');
            }
            if (!turkishNameStoreService.includes(name)) {
                dispatch(actions.CURRENT_PLAYER_LOST);
                throw new Error('Bu kelime bir isim değil.');
            }

            const previousLastChar = lastCharOfLastItemInList(state.previousNames);
            const currentFirstChar = name[0];
            if (previousLastChar !== currentFirstChar) {
                dispatch(actions.CURRENT_PLAYER_LOST);
                throw new Error('Bu isim geçerli değil.');
            }

            if (state.turn === turn.PLAYER) {
                const { scorePerTurn } = rootGetters['settings/activeSettings'];
                commit(mutations.ADD_SCORE, scorePerTurn);
            }
            commit(mutations.ADD_NAME, name);
            commit(mutations.SWITCH_TURN);
        },
        [actions.CURRENT_PLAYER_LOST]({ state, commit }) {
            const winner = state.turn === turn.COMPUTER ? turn.PLAYER : turn.COMPUTER;
            commit(mutations.SET_WINNER, winner);
            commit(mutations.SET_PLAYING, false);
        },
    },

};

export default game;
