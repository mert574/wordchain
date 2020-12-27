class StoreService {
    constructor(initialData = []) {
        this.data = initialData;
    }

    find(keyword) {
        return this.data.filter(it => it.includes(keyword));
    }

    exists(keyword) {
        return this.find(keyword).length > 0;
    }
}

export default StoreService;
