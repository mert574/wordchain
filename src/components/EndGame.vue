<template>
  <section class="end-game">
    {{ isPlayerWon ? 'KAZANDIN' : 'KAYBETTIN' }}
    <div class="score">
      <strong>Skor:</strong>{{ score }}
    </div>
    <button @click="handleReset">Yeniden Başlat</button>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { actions, turn } from '@/store/game.module';

export default {
  name: 'EndGame',
  computed: {
    ...mapState('game', [ 'score', 'winner' ]),
    isPlayerWon() {
      return this.winner === turn.PLAYER;
    },
  },
  methods: {
    ...mapActions('game', { startGame: actions.START_GAME, resetGame: actions.RESET }),
    handleReset() {
      this.resetGame();
    },
  },
};
</script>

<style scoped>

</style>