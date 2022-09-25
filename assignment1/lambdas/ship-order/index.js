/**
 * Lambda ship-order is invoked after both credit amount and stock balance check
 * It deduct customer credit balance and product quantity
*/

const { ShipService } = process.env.ON_CLOUD ? require(`/opt/nodejs/modules`) :
	require('../../lambda-layers/nodejs/modules');
    
exports.handler = async (order) => {
	const service = ShipService.getInstance();
	await service.shipOrder(order);
}