const AWS = require('aws-sdk');

class BalanceChecker {

    _docClient;
    constructor() {
        this._docClient = new AWS.DynamoDB.DocumentClient();
    }

    get docClient() {
        return this._docClient;
    }

    /**
     * @async
     * @function getAccount
     * @description retrieve account
     * 
     * @param {string} customerId
     * @return {object} account record 
    */
    async getAccount(customerId) {
        const payload = await this.docClient.get({
            TableName : process.env.ACCOUNT_TABLE_NAME,
            Key: {
                customerId
            }
        }).promise();
        if (payload?.Item) {
            return payload.Item;
        } else {
            throw new Error(`Account(${customerId}) not found`);
        }
    }
    /**
     * @async
     * @function getCustomerCredit
     * @description retrieve customer credit balance
     * 
     * @param {string} customerId
     * @return {float} credit balance 
    */
    async getCustomerCredit(customerId) {
        const account = await this.getAccount(customerId);
        if (account) {
            return account?.balance ?? 0;
        } else {
            throw new Error(`Customer(${customerId}) not found`);
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
        const balance = await this.getCustomerCredit(order.customerId);
        if (balance < order.totalAmount) {
            throw new Error(`Insufficient credit(${customerId}) amount`);
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
        if (BalanceChecker.instance) {
            return BalanceChecker.instance;
        }

        BalanceChecker.instance = new BalanceChecker();
        return BalanceChecker.instance;
    }
}
module.exports = BalanceChecker;
