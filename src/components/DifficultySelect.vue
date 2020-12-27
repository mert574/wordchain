<template>
  <section class="difficulty-select">
    Bir zorluk seç:
    <button
        :class="{ selected: difficulty === difficultyLevels.EASY}"
        @click="setDifficulty(difficultyLevels.EASY)">
      Kolay
    </button>
    <button
        :class="{ selected: difficulty === difficultyLevels.MEDIUM}"
        @click="setDifficulty(difficultyLevels.MEDIUM)">
      Orta
    </button>
    <button
        :class="{ selected: difficulty === difficultyLevels.HARD}"
        @click="setDifficulty(difficultyLevels.HARD)">
      Zor
    </button>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { actions, difficultyLevels } from '@/store/settings.module';

export default {
  name: 'DifficultySelect',
  computed: {
    ...mapState('settings', [ 'difficulty' ]),
  },
  data() {
    return {
      difficultyLevels,
    };
  },
  methods: {
    ...mapActions('settings', { setDifficulty: actions.SET_DIFFICULTY }),
  },
};
</script>

<style scoped>
button.selected {
  border: 3px solid #ff0099;
}
</style>