const AWS = require('aws-sdk');
const uuid = require('uuid');

class OrderService {

    _docClient;
    constructor() {
        this._docClient = new AWS.DynamoDB.DocumentClient();
    }

    get docClient() {
        return this._docClient;
    }

    /**
     * @async
     * @function checkOrderStatus
     * @descrition check order status
     * 
     * @param {string} orderId
     * @return order status
    */
    async checkOrderStatus(orderId) {
        const payload = await this.docClient.get({
            TableName : process.env.ORDER_TABLE_NAME,
            Key: {
                orderId
            }
        }).promise();
        if (payload?.Item) {
            const order = payload?.Item;
            return {
                status: order.status,
                logs: order.logs,
            }
        }
    }

    /**
     * @async
     * @function addOrder
     * @descrition add order
     * 
     * @param {Object} orderPayload
     * @return {Object} order payload with order id
    */
    async addOrder(orderPayload) {
        orderPayload.orderId = uuid.v4();
        orderPayload.status = 'Pending';
        orderPayload.accountChecked = false;
        orderPayload.stockChecked = false;
        orderPayload.logs = [];
        await this.docClient.put({
            TableName : process.env.ORDER_TABLE_NAME,
            Item: orderPayload,
        }).promise();
        return orderPayload;
    }

    /**
     * @static
     * @function getInstance
     * @description return the only stance
     * 
     * @return {OrderService} instance
    */
     static getInstance() {
        if (OrderService.instance) {
            return OrderService.instance;
        }

        OrderService.instance = new OrderService();
        return OrderService.instance;
    }
	
};

module.exports = OrderService;