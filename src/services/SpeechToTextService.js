class SpeechToTextService {
    constructor() {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'tr-TR';
        this.handle = recognition;
    }

    requestPermission() {
        return new Promise(((resolve, reject) => {
            this.handle.onerror = (event) => {
                if (event.error !== 'no-speech') {
                    console.error('onerror', event.error);
                    reject();
                    return;
                }
                resolve();
            };
            this.handle.onend = resolve;
            this.handle.onstart = () => this.stop();
            this.handle.start();
        }));
    }

    stop() {
        this.handle.stop();
    }

    start() {
        this.handle.start();
    }

    abort() {
        this.handle.abort();
    }

    listenForWord(timeoutMs) {
        return new Promise(((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.abort();
                reject();
            }, timeoutMs);

            this.handle.onerror = (error) => {
                clearTimeout(timeout);
                this.abort();
                reject(error);
            };

            this.start();

            this.handle.onresult = (event) => {
                let result = event.results[0][0].transcript.toLocaleLowerCase('tr-TR');
                if (result.includes(' ')) {
                    const split = result.split(' ');
                    result = split[split.length - 1];
                }
                console.debug('received', result);
                clearTimeout(timeout);
                resolve(result);
                this.handle.stop();
            };
            this.handle.onend = () => {
                clearTimeout(timeout);
            };
        }));
    }
}

export default new SpeechToTextService();
