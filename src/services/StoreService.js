class StoreService {
    constructor(initialData = []) {
        this.data = initialData;
    }

    find(keyword) {
        return this.data.filter(it => it.includes(keyword));
    }

    findOne(keyword) {
        const results = this.find(keyword);
        if (!results.length) {
            throw new Error(`${ keyword } not found.`);
        }
        return results[0];
    }

    includes(keyword) {
        return this.find(keyword).length > 0;
    }
}

export default StoreService;
