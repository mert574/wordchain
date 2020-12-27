<template>
  <section class="end-game">
    <div class="score">
      <strong>Skor:</strong> {{ score }}
    </div>
    <div>
      {{ isPlayerWon ? 'Kazandın' : 'Kaybettin' }}.
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