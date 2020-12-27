class TextToSpeechService {
    constructor(language = 'tr-TR') {
        this.utterance = new window.SpeechSynthesisUtterance();
        this.utterance.lang = language;
    }

    speak(sentence, actorId) {
        return new Promise(((resolve, reject) => {
            this.utterance.text = sentence;
            this.utterance.pitch = actorId;
            this.utterance.onend = resolve;
            this.utterance.onerror = reject;

            // https://bugs.chromium.org/p/chromium/issues/detail?id=509488
            window.speechSynthesis.cancel();
            this.utterance.onstart = () => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            };

            window.speechSynthesis.speak(this.utterance);
        }));
    }
}

export default new TextToSpeechService();
