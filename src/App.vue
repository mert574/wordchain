<template>
  <div id="app">
    <h1>WordChain</h1>
    <Game v-if="isPlaying" />
    <EndGame v-else-if="winner" />
    <div v-else class="new-game">
      <DifficultySelect />
      <hr>
      <button @click="handleStartGame">Oyunu Başlat</button>
    </div>
  </div>
</template>

<script>
import Game from './components/Game.vue';
import store from './store';
import { mapActions, mapState } from 'vuex';
import turkishNameStoreService from '@/services/TurkishNameStoreService';
import { actions, turn } from '@/store/game.module';
import textToSpeechService from '@/services/TextToSpeechService';
import DifficultySelect from '@/components/DifficultySelect';
import EndGame from '@/components/EndGame';

export default {
  name: 'WordChainGame',
  store,
  computed: {
    ...mapState('game', [ 'isPlaying', 'score', 'winner' ]),
    ...mapState('settings', [ 'difficulty' ]),
    isPlayerWon() {
      return this.winner === turn.PLAYER;
    },
  },
  components: {
    EndGame,
    DifficultySelect,
    Game,
  },
  methods: {
    ...mapActions('game', { startGame: actions.START_GAME, resetGame: actions.RESET }),
    handleStartGame() {
      const randomName = turkishNameStoreService.getRandomName();
      this.startGame(randomName);
      textToSpeechService.speak(`ilk isim, ${ randomName }`, 1);
    },
    handleReset() {
      this.resetGame();
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
