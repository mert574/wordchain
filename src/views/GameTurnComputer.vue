<template>
  <div class="game-turn-computer">
    Sıra bilgisayarda...
  </div>
</template>

<script>
import random from 'lodash/random';
import lastCharOfLastItemInList from '@/util/lastCharOfLastItemInList';
import turkishNameStoreService from '@/services/TurkishNameStoreService';
import sample from 'lodash/sample';
import textToSpeechService from '@/services/TextToSpeechService';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'GameTurnComputer',
  mounted() {
    this.handleComputerTurn();
  },
  computed: {
    ...mapState('game', [ 'score', 'turn', 'isPlaying', 'previousNames' ]),
    ...mapGetters('settings', [ 'activeSettings' ]),
  },
  methods: {
    handleComputerTurn() {
      const waitTime = random(this.activeSettings.computerThinkTimeRangeMs[0], this.activeSettings.computerThinkTimeRangeMs[1]);
      const previousLastChar = lastCharOfLastItemInList(this.previousNames);
      const suitableNames = turkishNameStoreService
          .findStartingWith(previousLastChar)
          .filter(it => !this.previousNames.includes(it));

      setTimeout(() => {
        const shouldLose = random(0, 100) <= this.activeSettings.computerChanceToLosePercent;
        if (shouldLose) {
          this.$emit('lost');
          this.playerWins();
          return;
        }

        try {
          const selectedName = sample(suitableNames);
          this.$emit('attempt', selectedName);
          textToSpeechService.speak(selectedName, 1);
        } catch (error) {
          this.$emit('lost');
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