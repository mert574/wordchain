class TextToSpeechService {
    constructor(language = 'tr-TR') {
        this.synthesisUtterance = new window.SpeechSynthesisUtterance();
        this.synthesisUtterance.lang = language;
    }

    speak(sentence) {
        return new Promise((resolve, reject) => {
            this.synthesisUtterance.text = sentence;
            this.synthesisUtterance.onend = resolve;
            this.synthesisUtterance.onerror = reject;
            window.speechSynthesis.speak(this.synthesisUtterance);
        });
    }
}

export default new TextToSpeechService();
