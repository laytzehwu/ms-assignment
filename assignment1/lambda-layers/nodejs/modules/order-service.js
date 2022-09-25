const AWS = require('aws-sdk');
const uuid = require('uuid');

class OrderService {

    _docClient;
    _sns;
    constructor() {
        this._docClient = new AWS.DynamoDB.DocumentClient();
        this._sns = new AWS.SNS({
            apiVersion: '2010-03-31'
        });
    }

    get docClient() {
        return this._docClient;
    }

    get sns() {
        return this._sns;
    }

    /**
     * @async
     * @function getOrder
     * @description retrieve order record
     * 
     * @param {string} orderId
     * @return {object} order record
    */
    async getOrder(orderId) {
        const payload = await this.docClient.get({
            TableName : process.env.ORDER_TABLE_NAME,
            Key: {
                orderId
            }
        }).promise();
        if (payload?.Item) {
            return payload.Item;
        } else {
            console.log(`Order(${orderId}) not found`);
        }
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
        const order = await this.getOrder(orderId);
        if (order) {
            return {
                status: order.status,
                logs: order.logs,
            }
        }
    }

    async pushSNS(order) {
        const {orderId, customerId, items, totalAmount } = order;
        let message = JSON.stringify({
            orderId, customerId, items, totalAmount
        });
        const params = {
            Message: message,
            Subject: `Order ${orderId}`,
            TopicArn: process.env.SNS_TOPIC
        }
        const snsResult = await this.sns.publish(params).promise();
        console.log(`snsResult: ${JSON.stringify(snsResult)}`);
    }

    /**
     * @async
     * @function updateOrder
     * @decription update order to DynamoDB
     * 
     * @param {object} order
    */
    async updateOrder(order) {
        await this.docClient.put({
            TableName : process.env.ORDER_TABLE_NAME,
            Item: order,
        }).promise();
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
        await this.updateOrder(orderPayload);
        await this.pushSNS(orderPayload);
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