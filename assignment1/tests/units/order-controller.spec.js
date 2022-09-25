const { expect, assert } = require('chai');
const sinon = require("sinon");

const uuid = require('uuid');
const uuidVersion = uuid.version;
const uuidValidate = uuid.validate;
const uuidValidateV4 = (uuid) => uuidValidate(uuid) && uuidVersion(uuid) === 4;

const { OrderController, OrderService } = require('../../lambda-layers/nodejs/modules');

describe('OrderController', () => {
    beforeEach(() => {
        OrderController.instance = undefined;
    });

    afterEach(() => {
		sinon.restore();
	});	

    describe('contructor', () => {
        let controller;
        beforeEach(() => {
            controller = new OrderController();
        });

        it('should able to initiate', () => {
            expect(controller).not.to.be.undefined;
        });

        it('should include OrderService in property', () => {
            expect(controller.service).to.be.instanceOf(OrderService);
        });
    });

    it('should not initiate instance by default', () => {
        expect(OrderController.instance).to.be.undefined;
    });

    describe('getInstance()', () => {
        let instance;
        beforeEach(() => {
            instance = OrderController.getInstance();
        });

        it('should able to initiate an instance', () => {
            expect(instance).to.be.instanceOf(OrderController);
        });

        it('should static cache the instance', () => {
            assert.isTrue(instance == OrderController.instance);
        });

        it('should return same instance even recall again', () => {
            assert.isTrue(instance == OrderController.getInstance());
        });
    });

    describe('handle', () => {
        [
            { method: 'DELETE', path: '/order'},
            { method: 'DELETE', path: '/orders'},
            { method: 'PUT', path: '/order'},
            { method: 'PUT', path: '/orders'},
            { method: 'GET', path: '/order' },
            { method: 'GET', path: '/orders' },
        ].forEach(spec => {
            describe(`Given receive request via method ${spec.method} and path: ${spec.path}`, () => {
                let controller, event, response, body;
                beforeEach(() => {
                    event = {
                        httpMethod: spec.method,
                        path: spec.path,
                    }
                    controller = OrderController.getInstance();
                });

                beforeEach(async () => {
                    response = await controller.handle(event);
                    body = JSON.parse(response.body);
                });

                it('should response statusCode 404', () => {
                    expect(response.statusCode).to.be.equal(404);
                });

                it('should have 404 in body.code', () => {
                    expect(body.code).to.be.equal(404);
                });

                it('should have message \'Not found\'', () => {
                    expect(body.message).to.be.equal('Not found');
                });
            });

        });

        describe('Given an order has been acknowledged', () => {
            let controller, response, body;
            const mockOrderStatus = {
                status: 'Pending',
                logs: ['Sufficient stock'],
            };

            beforeEach(() => {
                controller = OrderController.getInstance();
            });

            const mockOrderId = '03231ca7-a436-4beb-800f-a55671d2b138';

            [
                { 
                    condition: 'When order status checking API is being called',
                    success: true, mockOrderStatus, statusCode: 200 
                },
                {
                    condition: 'When check status with wrong order id',
                    success: false, mockOrderStatus: undefined, statusCode: 404 
                }
            ].forEach(spec => {
                describe(spec.condition, () => {
                    beforeEach(() => {
                        sinon.replace(
                            controller.service, 'checkOrderStatus',
                            sinon.fake.returns(Promise.resolve(spec.mockOrderStatus))
                        );
                    });
    
                    beforeEach(async () => {
                        response = await controller.handle({
                            httpMethod: 'GET',
                            resource: '/order/{id}/status',
                            path: `/order/${mockOrderId}/status`,
                            pathParameters: {id: mockOrderId}
                        });
                        body = JSON.parse(response.body);
                    });
    
                    it('should call service.checkOrderStatus', () => {
                        assert.isTrue(controller.service.checkOrderStatus.called);
                    });
    
                    it('should pass order id to service.checkOrderStatus', () => {
                        assert.equal(controller.service.checkOrderStatus.firstArg, mockOrderId);
                    });

                    it(`should response statusCode ${spec.statusCode}`, () => {
                        expect(response.statusCode).to.be.equal(spec.statusCode);
                    });

                    if (spec.success) {
                        it('should return fetch order status', () => {
                            assert.equal(body.status, mockOrderStatus.status);
                        });
        
                        it('should return fetch logs', () => {
                            const logs = body.logs;
                            mockOrderStatus.logs.forEach(log => expect(logs).to.include(log));
                        });
                    } else {
                        it(`should have ${spec.statusCode} in body.code`, () => {
                            expect(body.code).to.be.equal(spec.statusCode);
                        });

                        it('should have message \'Order not found\'', () => {
                            expect(body.message).to.be.equal('Order not found');
                        });
                    }
                });
            });
        });

        describe('Given submitting an order', () => {
            const mockOrderPayload = {
                customerId: 'aaa789',
                items: [
                    {productId: 456,qty: 1},
                    {productId: 789,qty: 2},
                ],
                totalAmount: 100.50
            };
            beforeEach(() => {
                controller = OrderController.getInstance();
            });

            describe('When posting the order payload to API', () => {
                const mockOrderId = 'kjlj0ad8sf';
                beforeEach(() => {
                    sinon.replace(
                        controller.service, 'addOrder',
                        sinon.fake.returns(Promise.resolve({
                            orderId: mockOrderId,
                            ... mockOrderPayload
                        }))
                    );
                });

                beforeEach(async () => {
                    response = await controller.handle({
                        httpMethod: 'POST',
                        path: `/order`,
                        body: JSON.stringify(mockOrderPayload)
                    });
                    body = JSON.parse(response.body);
                });

                it('should call service.addOrder', () => {
                    assert.isTrue(controller.service.addOrder.called);
                });

                it('should pass-in customer id service.addOrder', () => {
                    const passInPayload = controller.service.addOrder.firstArg;
                    assert.equal(passInPayload.customerId, mockOrderPayload.customerId);
                });

                it('should pass-in total amount service.addOrder', () => {
                    const passInPayload = controller.service.addOrder.firstArg;
                    assert.equal(passInPayload.totalAmount, mockOrderPayload.totalAmount);
                });

                it('should pass-in all the items', () => {
                    const passInItems = controller.service.addOrder.firstArg.items;
                    mockOrderPayload.items.forEach(item => {
                        const matchedItem = passInItems.find(ref => ref.productId == item.productId);
                        expect(matchedItem).to.include(item);
                    });
                });

                it('should return mock order id', () => {
                    assert.equal(body.orderId, mockOrderId);
                });
            });

        });

        describe('Given submitting multiple order', () => {
            const mockOrders = [
                {
                    customerId: 'aaa789',
                    items: [
                        {productId: 456,qty: 1},
                        {productId: 789,qty: 2},
                    ],
                    totalAmount: 100.50
                },
                {
                    customerId: 'bbb653',
                    items: [
                        {productId: 456,qty: 1},
                    ],
                    totalAmount: 30.10
                },
                {
                    customerId: 'bbb653',
                    items: [
                        {productId: 789,qty: 2},
                    ],
                    totalAmount: 70.10
                },
            ];
            beforeEach(() => {
                controller = OrderController.getInstance();
            });

            describe('When posting those orders payload to API', () => {
                beforeEach(() => {
                    sinon.replace(
                        controller.service, 'addOrder',
                        sinon.fake(order => {
                            return Promise.resolve({
                                orderId: uuid.v4(),
                                ...order,
                            });
                        })
                    );
                });

                beforeEach(async () => {
                    response = await controller.handle({
                        httpMethod: 'POST',
                        path: `/orders`,
                        body: JSON.stringify({orders: mockOrders})
                    });
                    body = JSON.parse(response.body);
                });

                it(`should call service.addOrder ${mockOrders.length} time`, () => {
                    assert.equal(controller.service.addOrder.callCount, mockOrders.length);
                });

                it(`should return ${mockOrders.length} orders`, () => {
                    assert.equal(body.orders.length, mockOrders.length);
                });

                it('should has order id from the returning orders', () => {
                    body.orders.forEach(order => {
                        assert.isTrue(uuidValidateV4(order.orderId));
                    });
                });

            });

        });
    });

});