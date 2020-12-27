<template>
  <div class="hello">
    <hr>
    <div>score: {{ score }}</div>
    <div>turn: {{ turn }}</div>
    <div>isPlaying: {{ isPlaying ? 'yes' : 'no' }}</div>
    <div>Last Name: {{ previousName }}</div>
    <hr>
    <input type="text" v-model="name" />
    <button @click="handleAttempt" :disabled="!isPlaying || !isPlayerTurn">attempt</button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { actions, turn } from '@/store/game.module';
import turkishNameStoreService from '@/services/TurkishNameStoreService';
import lastCharOfLastItemInList from '@/util/lastCharOfLastItemInList';
import textToSpeechService from '@/services/TextToSpeechService';
import random from 'lodash/random';
import sample from 'lodash/sample';

export default {
  name: 'HelloWorld',
  computed: {
    ...mapState('game', [ 'score', 'turn', 'isPlaying', 'previousNames' ]),
    ...mapGetters('settings', [ 'activeSettings' ]),
    isPlayerTurn() {
      return this.turn === turn.PLAYER;
    },
    previousName() {
      return this.previousNames[this.previousNames.length - 1];
    },
  },
  data() {
    return {
      name: '',
      playerTimeout: null,
    };
  },
  beforeDestroy() {
    clearTimeout(this.playerTimeout);
  },
  watch: {
    turn: {
      immediate: true,
      handler(curr) {
        clearTimeout(this.playerTimeout);
        if (curr === turn.COMPUTER) {
          this.handleComputerTurn();
        } else {
          this.playerTimeout = setTimeout(() => {
            this.playerLost();
            textToSpeechService.speak('Süren doldu! Kaybettin.');
          }, this.activeSettings.playerRoundTimeMs);
        }
      },
    },
  },
  methods: {
    ...mapActions('game', {
      attemptRound: actions.ATTEMPT_ROUND,
      startGame: actions.START_GAME,
      playerLost: actions.CURRENT_PLAYER_LOST,
    }),
    handleAttempt() {
      try {
        this.attemptRound(this.name);
      } catch (error) {
        textToSpeechService.speak(`Üzgünüm, ${ error.message }`);
      }
    },
    handleComputerTurn() {
      const waitTime = random(this.activeSettings.computerThinkTimeRangeMs[0], this.activeSettings.computerThinkTimeRangeMs[1]);
      setTimeout(() => {
        const previousLastChar = lastCharOfLastItemInList(this.previousNames);
        const suitableNames = turkishNameStoreService.findStartingWith(previousLastChar);
        const selectedName = sample(suitableNames.filter(it => !this.previousNames.includes(it)));
        try {
          this.attemptRound(selectedName);
          textToSpeechService.speak(selectedName);
        } catch (error) {
          textToSpeechService.speak(`Tebrikler! kazandın. Skorun: ${ this.score }`);
          console.info('KAZANDIN!', error);
        }
      }, waitTime);
    },
  },
};
</script>

<style scoped>
</style>
