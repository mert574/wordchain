<template>
  <div>
    <h1>WordChain</h1>
    <Game v-if="isPlaying" />
    <EndGame v-else-if="winner" />
    <div v-else class="new-game">
      <DifficultySelect />
      <hr>
      <button @click="handleStartGame" :disabled="starting">{{ buttonText }}</button>
    </div>
  </div>
</template>

<script>
import './global.css';
import Game from './views/Game.vue';
import store from './store';
import { mapActions, mapState } from 'vuex';
import turkishNameStoreService from '@/services/TurkishNameStoreService';
import { actions, turn } from '@/store/game.module';
import DifficultySelect from '@/components/DifficultySelect';
import EndGame from '@/views/EndGame';
import speechToTextService from '@/services/SpeechToTextService';
import textToSpeechService from '@/services/TextToSpeechService';

export default {
  name: 'WordChainGame',
  store,
  components: {
    EndGame,
    DifficultySelect,
    Game,
  },
  computed: {
    ...mapState('game', [ 'isPlaying', 'score', 'winner' ]),
    ...mapState('settings', [ 'difficulty' ]),
    isPlayerWon() {
      return this.winner === turn.PLAYER;
    },
    buttonText() {
      return this.starting ? 'Başlatılıyor...' : 'Oyunu Başlat';
    },
  },
  data() {
    return {
      starting: false,
    };
  },
  methods: {
    ...mapActions('game', { startGame: actions.START_GAME, resetGame: actions.RESET }),
    async handleStartGame() {
      this.starting = true;
      try {
        await speechToTextService.requestPermission();
      } catch (error) {
        this.starting = false;
        console.error('speechToTextService.requestPermission:', error);
        alert('Mikrofon izni alınırken bir hata oluştu.');
        return;
      }

      const randomName = turkishNameStoreService.getRandomName();
      textToSpeechService.speak(`ilk kelime; ${ randomName }`, 1).then(() => {
        this.startGame(randomName);
      }).finally(() => {
        this.starting = false;
      });
    },
    handleReset() {
      this.resetGame();
    },
  },
};
</script>
