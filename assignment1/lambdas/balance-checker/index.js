/**
 * Lambda balance-checker is invoked by SNS and receive order detail
 * It need to retrive account DynamoDB and ensure the customer has sufficient credit
*/
const { SQSTasker, BalanceChecker } = process.env.ON_CLOUD ? require(`/opt/nodejs/modules`) :
	require('../../lambda-layers/nodejs/modules');

const checker = BalanceChecker.getInstance();
exports.handler = async (payload) => {
    const records = payload?.Records ?? [];
    // Don't use Array.forEach here. It doesn't work for async loop
    for(let i = 0; i < records.length; i ++) {
        const record = records[i];
        let order;
        try {
            order = JSON.parse(record.body);
        } catch (error) {
            // Don't console.error it will fail the queue and introduce unnecessary cost
            console.log(`Error occur while parsing order payload`, error);
            // Should do anything since the data is wrong
            continue;
        }

        if (order) {
            let message;
            let fail = false;
            let ok = false;

            try {
                checker.check(order);
                // No exception raise if the stock is sufficient
                // Process to update order
                message = 'Sufficient credit amount';
                ok = true;
            } catch (error) {
                // Error raise
                // Process to update order
                message = error.message;
                fail = true;
            }
            const accountChecked = true;
            // Queue to update order
            const sqs = new SQSTasker(process.env.ORDER_UPDATE_QUEUE);
            await sqs.createTask({order, message, ok, fail, accountChecked});
        }
    }
}