const AWS = require('aws-sdk');
const BalanceChecker = require('./balance-checker');
const StockChecker = require('./stock-checker');

class ShipService {
    static instance;
    _docClient;
    constructor() {
        this._docClient = new AWS.DynamoDB.DocumentClient();
        this._balanceChecker = BalanceChecker.getInstance();
        this._stockChecker = StockChecker.getInstance();
    }

    get docClient() {
        return this._docClient;
    }

    async updateAccount(account) {
        await this.docClient.put({
            TableName : process.env.ACCOUNT_TABLE_NAME,
            Item: account,
        }).promise();
    }

    async updateStock(stock) {
        await this.docClient.put({
            TableName : process.env.STOCK_TABLE_NAME,
            Item: stock,
        }).promise();
    
    }

    /**
     * @async
     * @function shipOrder
     * @description ship order to update credit & stock balance
    */
    async shipOrder(order) {
        const customerId = order.customerId;
        const totalAmount = order.totalAmount;
        const account = this._balanceChecker.getAccount(customerId);
        account.balance -= totalAmount;
        await this.updateAccount(account);

        const numItem = order?.items ?? 0;
        const items = order?.items;
        for(let i=0;i < numItem; i++) {
            const item = items[i];
            const stock = await this._stockChecker.getStock(item.productId);
            stock.balance -= item.qty;
            await this.updateStock(stock);
        }
    }

    /**
     * @static
     * @function getInstance
     * @description return a uniq instance
     * 
     * @return {ShipService}
    */
     static getInstance() {
        if (ShipService.instance) {
            return ShipService.instance;
        }

        ShipService.instance = new ShipService();
        return ShipService.instance;
    }

}

module.exports = ShipService;