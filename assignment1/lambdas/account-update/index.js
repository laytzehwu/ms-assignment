/**
 * Lambda account-update is mainly used to update customer balance
 * API Gateway only call it via POST /account
 * Maindatory fields:
 * customerId
 * balance - float - Customer credit amount
*/
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const payload = JSON.parse(event.body);
    if (!payload.customerId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ code: 404, message: 'customerId is missing' })
        };
    }
    const customerId = payload.customerId;
    if (!payload.balance) {
        return {
            statusCode: 400,
            body: JSON.stringify({ code: 404, message: 'blance is missing' })
        };
    }

    const balance = parseFloat(payload.balance);
    if (Number.isNaN(balance)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ code: 404, message: `Invalid balanc(${payload.balance})` })
        };
    }

    const updatedPayload = {
        customerId,
        balance,
        updateTime: new Date().toISOString()
    };

    await docClient.put({
        TableName : process.env.ACCOUNT_TABLE_NAME,
        Item: updatedPayload,
    }).promise();

    return {
        statusCode: 202,
        body: JSON.stringify({ code: 202, updatedPayload })
    };
};