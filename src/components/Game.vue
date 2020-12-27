<template>
  <div class="hello">
    <hr>
    <div>score: {{ score }}</div>
    <div>turn: {{ turn }}</div>
    <div>Last Name: {{ previousName }}</div>
    <Countdown
        v-if="isPlayerTurn"
        :time="countdownTime"
        :interval="100"
        @end="handlePlayerTimeout">
      <template slot-scope="props">
        {{ (props.totalMilliseconds / 1000).toFixed(1) }} seconds.
      </template>
    </Countdown>
    <hr>
    <input type="text" v-model="name" @keyup.enter="handleAttempt" />
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
import Countdown from '@chenfengyuan/vue-countdown';

export default {
  name: 'HelloWorld',
  components: {
    Countdown,
  },
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
      countdownTime: 0,
    };
  },
  beforeMount() {
    this.countdownTime = this.activeSettings.playerRoundTimeMs;
  },
  watch: {
    turn: {
      immediate: true,
      handler(curr) {
        if (curr === turn.COMPUTER) {
          this.handleComputerTurn();
        }
      },
    },
  },
  methods: {
    ...mapActions('game', {
      attemptRound: actions.ATTEMPT_ROUND,
      startGame: actions.START_GAME,
      currentPlayerLost: actions.CURRENT_PLAYER_LOST,
    }),
    handlePlayerTimeout() {
      this.currentPlayerLost();
      textToSpeechService.speak('Süren doldu! Kaybettin.', 0);
    },
    handleAttempt() {
      if (!this.isPlayerTurn || !this.isPlaying) {
        return;
      }
      try {
        this.attemptRound(this.name);
        this.name = '';
      } catch (error) {
        textToSpeechService.speak(`Üzgünüm, ${ error.message }`, 0);
      }
    },
    handleComputerTurn() {
      const waitTime = random(this.activeSettings.computerThinkTimeRangeMs[0], this.activeSettings.computerThinkTimeRangeMs[1]);
      const previousLastChar = lastCharOfLastItemInList(this.previousNames);
      const suitableNames = turkishNameStoreService
          .findStartingWith(previousLastChar)
          .filter(it => !this.previousNames.includes(it));

      setTimeout(() => {
        const shouldLose = random(0, 100) <= this.activeSettings.computerChanceToLosePercent;
        if (shouldLose) {
          this.currentPlayerLost();
          this.playerWins();
          return;
        }

        try {
          const selectedName = sample(suitableNames);
          this.attemptRound(selectedName);
          textToSpeechService.speak(selectedName, 1);
        } catch (error) {
          this.playerWins();
        }
      }, waitTime);
    },
    playerWins() {
      textToSpeechService.speak(`Tebrikler! kazandın. Skorun: ${ this.score }`, 0);
    },
  },
};
</script>

<style scoped>
</style>
