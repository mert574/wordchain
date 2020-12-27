<template>
  <div class="game-turn-player">
    <Countdown
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
</template>

<script>
import { mapGetters } from 'vuex';
import textToSpeechService from '@/services/TextToSpeechService';
import speechToTextService from '@/services/SpeechToTextService';
import Countdown from '@chenfengyuan/vue-countdown';

export default {
  name: 'GameTurnPlayer',
  components: {
    Countdown,
  },
  computed: {
    ...mapGetters('settings', [ 'activeSettings' ]),
  },
  data() {
    return {
      countdownTime: 0,
      listening: false,
    };
  },
  mounted() {
    this.handlePlayerTurn();
  },
  beforeMount() {
    this.countdownTime = this.activeSettings.playerRoundTimeMs;
  },
  beforeDestroy() {
    speechToTextService.abort();
  },
  methods: {
    handlePlayerTimeout() {
      this.$emit('lost');
      textToSpeechService.speak('Süren doldu! Kaybettin.', 0);
    },
    async handlePlayerTurn() {
      try {
        this.$refs.countdown.start();
        this.listening = true;
        const name = await speechToTextService.listenForWord(this.activeSettings.playerRoundTimeMs);
        this.$emit('attempt', name);
      } catch (error) {
        this.$emit('lost');
      }
    },
  },
};
</script>

<style scoped>

</style>