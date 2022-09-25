/**
 * SQSTasker create SQS task for events
*/
const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

class SQSTasker {
    
    url;
    constructor(url) {
        this.url = url;
    }

    /**
     * SQSTasker.createTask creates a SQS task
     * @return - Object - SQS response
    */
    async createTask(data) {
        const params = {
            MessageAttributes: {},
            MessageBody: JSON.stringify(data),
            QueueUrl: this.url,
        };
        return await sqs.sendMessage(params).promise();
    }

    async createOrderTask(order, data) {
        const params = {
            MessageAttributes: {},
            MessageBody: JSON.stringify({
                order,
                ...data
            }),
            MessageDeduplicationId: data.message,
            MessageGroupId: order.orderId,
            QueueUrl: this.url,
        };
        return await sqs.sendMessage(params).promise();
    }
}

module.exports = SQSTasker;