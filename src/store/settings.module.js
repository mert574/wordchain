export const actions = {
    SET_DIFFICULTY: 'SET_DIFFICULTY',
};

export const difficultyLevels = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
};

const mutations = {
    SET_DIFFICULTY: 'SET_DIFFICULTY',
};

const base = {
    scorePerTurn: 1,
    playerRoundTimeMs: 5_000,
    computerThinkTimeRangeMs: [ 1000, 2000 ],
    computerChanceToLosePercent: 0,
};

const settings = {
    namespaced: true,
    state() {
        return {
            difficulty: difficultyLevels.EASY,
            configurations: {
                [difficultyLevels.EASY]: {
                    ...base,
                    playerRoundTimeMs: 10_000,
                    computerThinkTimeRangeMs: [ 2000, 3000 ],
                    computerChanceToLosePercent: 30,
                },
                [difficultyLevels.MEDIUM]: {
                    ...base,
                    playerRoundTimeMs: 6_000,
                    computerThinkTimeRangeMs: [ 1000, 2000 ],
                    computerChanceToLosePercent: 5,
                },
                [difficultyLevels.HARD]: {
                    ...base,
                    playerRoundTimeMs: 4_000,
                    computerThinkTimeRangeMs: [ 500, 1000 ],
                    computerChanceToLosePercent: 1,
                },
            },
        };
    },
    getters: {
        activeSettings(state) {
            return state.configurations[state.difficulty];
        },
    },
    mutations: {
        [mutations.SET_DIFFICULTY](state, difficulty) {
            state.difficulty = difficulty;
        },
    },
    actions: {
        [actions.SET_DIFFICULTY]({ commit, state }, difficulty) {
            if (!(difficulty in state.configurations)) {
                throw new Error('Unknown difficulty');
            }

            commit(mutations.SET_DIFFICULTY, difficulty);
        },
    },
};

export default settings;
