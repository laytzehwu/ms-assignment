const AWS = require('aws-sdk');

class StockChecker {
    static instance;

    _docClient;
    constructor() {
        this._docClient = new AWS.DynamoDB.DocumentClient();
    }

    get docClient() {
        return this._docClient;
    }

    /**
     * @aync
     * @function getStock
     * @description retrieve stock
     * 
     * @param {String} productId
     * @return {object} stock
    */
     async getStock(productId) {
        const payload = await this.docClient.get({
            TableName : process.env.STOCK_TABLE_NAME,
            Key: {
                productId
            }
        }).promise();
        if (payload?.Item) {
            return payload.Item;
        } else {
            throw new Error(`Product(${productId}) not found`);
        }
    }

    /**
     * @aync
     * @function getProductQty
     * @description retrieve product quantity
     * 
     * @param {String} productId
     * @return {int} stock balance
    */
    async getProductBalance(productId) {
        const stock = await this.getStock(productId);
        if (stock) {
            return stock?.balance ?? 0;
        } else {
            throw new Error(`Product(${productId}) not found`);
        }
    }

    /**
     * @async
     * @function check
     * @description check stock available
     * 
     * @param {object} order
    */
    async check(order) {
        const numItem = order?.items ?? 0;
        const items = order?.items;
        for(let i=0;i < numItem; i++) {
            const item = items[i];
            const stockBalance = await this.getProductBalance(item.productId);
            if (stockBalance < item.qty) {
                throw new Error(`Insufficient product(${productId}) stock`);
            }
        }
    }

    /**
     * @static
     * @function getInstance
     * @description return a uniq instance
     * 
     * @return {StockChecker}
    */
    static getInstance() {
        if (StockChecker.instance) {
            return StockChecker.instance;
        }

        StockChecker.instance = new StockChecker();
        return StockChecker.instance;
    }
}

module.exports = StockChecker;
