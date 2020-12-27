import StoreService from '@/services/StoreService';
import turkishNames from '../assets/names.json';
import sample from 'lodash/sample';

class TurkishNameStoreService extends StoreService {
    constructor() {
        super(turkishNames);
    }

    getRandomName() {
        return sample(this.data);
    }

    findStartingWith(char) {
        return this.data.filter(it => it[0] === char);
    }
}

export default new TurkishNameStoreService();
