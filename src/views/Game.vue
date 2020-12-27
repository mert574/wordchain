<template>
  <div class="hello">
    <div>Skor: {{ score }}</div>
    <div class="previous-name">{{ previousName }}</div>
    <GameTurnPlayer v-if="isPlayerTurn" @attempt="handleAttempt" @lost="currentPlayerLost" />
    <GameTurnComputer v-else @attempt="handleAttempt" @lost="currentPlayerLost" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { actions, turn } from '@/store/game.module';
import textToSpeechService from '@/services/TextToSpeechService';
import GameTurnPlayer from '@/views/GameTurnPlayer';
import GameTurnComputer from '@/views/GameTurnComputer';

export default {
  name: 'Game',
  components: { GameTurnComputer, GameTurnPlayer },
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
  methods: {
    ...mapActions('game', {
      attemptRound: actions.ATTEMPT_ROUND,
      startGame: actions.START_GAME,
      currentPlayerLost: actions.CURRENT_PLAYER_LOST,
    }),
    handleAttempt(name) {
      try {
        this.attemptRound(name);
      } catch (error) {
        textToSpeechService.speak(`Üzgünüm, ${ error.message }`, 0);
      }
    },
  },
};
</script>

<style scoped>
.previous-name {
  font-size: 2em;
}
</style>
