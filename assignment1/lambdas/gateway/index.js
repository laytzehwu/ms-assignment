/**
 * Lambda gateway is used to capture order(s) and return order status
*/
const { OrderController } = process.env.ON_CLOUD ? require(`/opt/nodejs/modules`) :
	require('../../lambda-layers/nodejs/modules');

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'ap-southeast-1'});

exports.handler = async (event) => {
	return await OrderController.getInstance().handle(event);
};