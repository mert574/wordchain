import Vue from 'vue';
import Vuex from 'vuex';

import game from './game.module';
import settings from './settings.module';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        game,
        settings,
    },
});

export default store;
