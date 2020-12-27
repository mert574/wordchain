class TextToSpeechService {
    constructor(language = 'tr-TR') {
        this.utterance = new window.SpeechSynthesisUtterance();
        this.utterance.lang = language;
    }

    speak(sentence, actorId = 0) {
        this.utterance.text = sentence;
        this.utterance.pitch = actorId;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(this.utterance);
    }
}

export default new TextToSpeechService();
