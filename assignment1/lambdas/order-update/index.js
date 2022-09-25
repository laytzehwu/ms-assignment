/**
 * Lambda order-update receive update from SQS
*/
const { OrderService } = process.env.ON_CLOUD ? require(`/opt/nodejs/modules`) :
	require('../../lambda-layers/nodejs/modules');

const AWS = require('aws-sdk');
const LAMBDA = new AWS.Lambda({
    region: 'ap-southeast-1'
});
    
exports.handler = async (payload) => {

    const service = OrderService.getInstance();
    const records = payload?.Records ?? [];
    // Don't use Array.forEach here. It doesn't work for async loop
    for(let i = 0; i < records.length; i ++) {
        const record = records[i] || {};
        const queData = JSON.parse(record.body);
        const order = await service.getOrder(queData?.order?.orderId);

        if (order) {
            if (queData.message) {
                order.logs.push(queData.message);
            }
            if (queData?.fail) {
                order.status = 'Rejected';
            } else if (queData?.stockChecked && queData?.ok) {
                order.stockChecked = true;
            } else if (queData?.accountChecked && queData?.ok) {
                order.accountChecked = true;
            }

            if (order.stockChecked && order.accountChecked) {
                order.status = 'Ready to ship';

            }
    
            await service.updateOrder(order);

            if (order.stockChecked && order.accountChecked) {
                // Process to shipment
                await LAMBDA.invoke({
                    FunctionName: process.env.SHIP_ORDER_LAMBDA,
                    InvocationType: 'Event',
                    LogType: 'Tail',
                    Payload: JSON.stringify(order)
                }).promise();
            }
        
        } else {
            console.error(`Order not found ${queData?.order?.orderId}, we can't update!`);
        }
        
    }    
}