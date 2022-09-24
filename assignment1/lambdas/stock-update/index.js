/**
 * Lambda stock-update is mainly used to update the stock quantity (balance) of product
 * API Gateway only call it via POST /stock
 * Maindatory fields:
 * productId
 * balance - integer - Stock balance in quantity
*/
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const payload = JSON.parse(event.body);
    if (!payload.productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ code: 404, message: 'productId is missing' })
        };
    }
    const productId = payload.productId;
    if (!payload.balance) {
        return {
            statusCode: 400,
            body: JSON.stringify({ code: 404, message: 'blance is missing' })
        };
    }

    const balance = parseInt(payload.balance);
    if (Number.isNaN(balance)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ code: 404, message: `Invalid balanc(${payload.balance})` })
        };
    }

    const updatedPayload = {
        productId,
        balance,
        updateTime: new Date().toISOString()
    };

    await docClient.put({
        TableName : process.env.STOCK_TABLE_NAME,
        Item: updatedPayload,
    }).promise();

    return {
        statusCode: 202,
        body: JSON.stringify({ code: 202, updatedPayload })
    };
};