const { expect, assert } = require('chai');
const sinon = require("sinon");

const uuid = require('uuid');
const uuidVersion = uuid.version;
const uuidValidate = uuid.validate;
const uuidValidateV4 = (uuid) => uuidValidate(uuid) && uuidVersion(uuid) === 4;

const OrderService = require('../../lambda-layers/nodejs/modules/order-service');

describe('OrderService', () => {
    const oriTableName = process.env.ORDER_TABLE_NAME;
    beforeEach(() => {
        OrderService.instance = undefined;
        process.env.ORDER_TABLE_NAME = 'ORDER_TABLE_NAME';
    });
    afterEach(() => {
		sinon.restore();
        process.env.ORDER_TABLE_NAME = oriTableName;
	});	

    describe('contructor', () => {
        let service;
        beforeEach(() => {
            service = new OrderService();
        });

        it('should able to initiate', () => {
            expect(service).not.to.be.undefined;
        });
    });

    it('should not initiate instance by default', () => {
        expect(OrderService.instance).to.be.undefined;
    });

    describe('getInstance()', () => {
        let instance;
        beforeEach(() => {
            instance = OrderService.getInstance();
        });

        it('should able to initiate an instance', () => {
            expect(instance).to.be.instanceOf(OrderService);
        });

        it('should static cache the instance', () => {
            assert.isTrue(instance == OrderService.instance);
        });

        it('should return same instance even recall again', () => {
            assert.isTrue(instance == OrderService.getInstance());
        });
    });

    describe('checkOrderStatus', () => {
        let service;
        beforeEach(() => {
            service = OrderService.getInstance();
        });

        const mockOrderId = 'ABC123';
        const mockOrder = {
            orderId: mockOrderId,
            customerId: 'aaa789',
            items: [
                {productId: 456,qty: 1},
                {productId: 789,qty: 2},
            ],
            totalAmout: 100.50,
            status: 'Pending',
            accountChecked: false,
            stockChecked: false,
            logs: []
        };

        beforeEach(() => {
            sinon.replace(
                service.docClient, 'get',
                sinon.fake.returns({
                    promise: () => Promise.resolve({Item: mockOrder})
                })
            );
        });

        let orderStatus;
        beforeEach(async () => {
            orderStatus = await service.checkOrderStatus(mockOrderId);
        });

        it('should retrieve order from DynamoDB table', () => {
            assert.isTrue(service.docClient.get.called);
        });

        it(`should retrieve order via order id ${mockOrderId}`, () => {
            const orderId = service.docClient.get.firstArg.Key.orderId;
            assert.equal(orderId, mockOrderId);
        });

        it('should retrieve from order table', () => {
            const TableName = service.docClient.get.firstArg.TableName;
            assert.equal(TableName, process.env.ORDER_TABLE_NAME);
        });

        it(`should has status ${mockOrder.status}`, () => {
            assert.equal(orderStatus.status, mockOrder.status);
        });

        it('should return logs as array', () => {
            assert.isArray(orderStatus.logs);
        });

    });

    describe('addOrder', () => {
        let service;
        beforeEach(() => {
            service = OrderService.getInstance();
        });
        let mockOrder;
        beforeEach(() => {
            mockOrder = {
                customerId: 'aaa789',
                items: [
                    {productId: 456,qty: 1},
                    {productId: 789,qty: 2},
                ],
                totalAmout: 100.50,
            };
        });

        beforeEach(() => {
            sinon.replace(
                service.docClient, 'put',
                sinon.fake.returns({
                    promise: () => Promise.resolve({})
                })
            );
        });

        beforeEach(async () => {
            orderStatus = await service.addOrder(mockOrder);
        });

        it('should call DynamoDB API put', () => {
            assert.isTrue(service.docClient.put.called);
        });

        it('should to order table', () => {
            const TableName = service.docClient.put.firstArg.TableName;
            assert.equal(TableName, process.env.ORDER_TABLE_NAME);
        });

        it('should put order payload to order table', () => {
            const Item = service.docClient.put.firstArg.Item;
            assert.equal(Item, mockOrder);
        });
    });

});