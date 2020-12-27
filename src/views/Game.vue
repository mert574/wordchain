<template>
  <div class="hello">
    <hr>
    <div>Skor: {{ score }}</div>
    <div class="previous-name">{{ previousName }}</div>
    <div v-show="isPlayerTurn" class="player-turn">
      <Countdown
          v-if="isPlayerTurn"
          :time="countdownTime"
          :interval="100"
          :auto-start="false"
          ref="countdown"
          @end="handlePlayerTimeout">
        <template slot-scope="props">
          {{ (props.totalMilliseconds / 1000).toFixed(1) }} saniye süren kaldı.
        </template>
      </Countdown>
      <hr>
      {{ listening ? 'şimdi konuş' : 'bekle' }}
    </div>
    <div v-show="!isPlayerTurn" class="computer-turn">
      Sıra bilgisayarda...
    </div>
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
import speechToTextService from '@/services/SpeechToTextService';

export default {
  name: 'Game',
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
      listening: false,
    };
  },
  beforeMount() {
    this.countdownTime = this.activeSettings.playerRoundTimeMs;
  },
  watch: {
    turn: {
      immediate: true,
      async handler(curr) {
        this.listening = false;
        if (curr === turn.COMPUTER) {
          this.handleComputerTurn();
        } else {
          this.handlePlayerTurn();
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
          this.currentPlayerLost();
          this.playerWins();
        }
      }, waitTime);
    },
    async handlePlayerTurn() {
      try {
        await textToSpeechService.speak(this.previousName, 1);
        this.listening = true;
        this.$refs.countdown.start();
        this.name = await speechToTextService.listenForWord(this.activeSettings.playerRoundTimeMs);
        this.handleAttempt();
      } catch (error) {
        this.currentPlayerLost();
      }
    },
    playerWins() {
      textToSpeechService.speak(`Tebrikler! kazandın. Skorun: ${ this.score }`, 0);
    },
  },
};
</script>

<style scoped>
.previous-name {
  font-size: 2em;
}
</style>
