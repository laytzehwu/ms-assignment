const OrderService = require('./order-service');

class OrderController {
    static instance;

    _service;
    constructor() {
        this._service = OrderService.getInstance();
    }

    /**
     * @getter service
     * 
     * @return {OrderService} service
    */
    get service() {
        return this._service;
    }

    async handlePost(event) {
        const path = event?.path;
        switch(path) {
            case '/order':
                const orderPayload = await this.service.addOrder(JSON.parse(event.body));
                return {
                    statusCode: 200,
                    body: JSON.stringify(orderPayload)
                };
            case '/orders':
                const ordersPayload = JSON.parse(event.body).orders;
                
                const orders = [];
                for(let i = 0; i < ordersPayload.length; i ++) {
                    const order = await this.service.addOrder(ordersPayload[i]);
                    orders.push(order);
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify({orders})
                };
        default:
                return this.makeNotFound();
        }
    }

    async handleGet(event) {
        // It is handled by API Gateway
        const resource = event?.resource;
        switch(resource) {
            case '/order/{id}/status':
                const orderId = event?.pathParameters?.id;
                if (orderId) {
                    const orderStatus = await this.service.checkOrderStatus(orderId);
                    if (orderStatus) {
                        return {
                            statusCode: 200,
                            body: JSON.stringify(orderStatus)
                        };
                    }
                    return this.makeNotFound('Order not found');
                }
                break;
        }

        return this.makeNotFound();
    }

    makeNotFound(message) {
        return {
            statusCode: 404,
            body: JSON.stringify({ code: 404, message: message ?? 'Not found' })
        };
    }

    /**
     * @function
     * @description handle REST request
     * 
     * @param {Object} event payload from API Gateway
    */
    async handle(event) {

        const method = event?.httpMethod;
        switch(method) {
            case 'POST':
                return this.handlePost(event);
            case 'GET':
                return this.handleGet(event);
        }
        return this.makeNotFound();
    }

    /**
     * @static
     * @function getInstance
     * @description return the only stance
     * 
     * @return {OrderController} instance
    */
    static getInstance() {
        if (OrderController.instance) {
            return OrderController.instance;
        }

        OrderController.instance = new OrderController();
        return OrderController.instance;
    }
};

module.exports = OrderController;