# Asynchronous communication between micro services

![Scope of assignment](./assets/scope.jpg)

My apology, difficulis to budget, [AWS EKS](https://aws.amazon.com/eks/) is too expensive and timeframe it is too short for me to pick another cloud technology. I don't provide a solution of microservices.

By the way, it didn't stop me to commit this assignment. I would like to show another idea to meet the goals which is **serverless**. 

## Test it

You may refer [swagger.yaml](./swagger.yaml). Unfortunately, my company laptop only allow me to run it in localhost ( see my [poc-swagger-js](https://github.com/laytzehwu/poc-swagger-js) ). By the way, [postman](./Order%20capture.postman_collection.json) is working with the testing site.

## System design

![system design](./assets/order-capture.jpg)

By referring [sam-template.yaml], you may see above design.

### Rest Api

![Rest Api](./assets/REST%20Api.jpg)

- [ApiGatewayApi] is a [AWS Api Gateway](https://aws.amazon.com/api-gateway/), it receives Rest calls from the client and distributes the work to [AWS Lambda].

- [OrderAPIGatewayFuntion], a [AWS Lambda] receives Rest calls from [ApiGatewayApi] and handles below requests:

| Method |  Path  | Remarks |
|--------|--------|---------|
|  POST  | /order | Create an order and store in [OrderDynamoDBTable](#orderdynamodbtable) |
|  POST  | /orders| Receives multiple orders with different customers |

- [AccountUpdateFunction](./aws/sam-template.yaml#L452-L473) a [AWS Lambda] receives Rest calls from [ApiGatewayApi] and handles below requests:

| Method |  Path  | Remarks |
|--------|--------|---------|
|  POST  | /account | Update customer credit balance in [AccountDynamoDBTable](#accountdynamodbtable)|

- [StockUpdateFunction](./aws/sam-template.yaml#L501-L522) a [AWS Lambda] receives Rest calls from [ApiGatewayApi] and handles below requests:

| Method |  Path  | Remarks |
|--------|--------|---------|
|  POST  | /stock   | Update product stock balance in [StockDynamoDBTable](#stockdynamodbtable) |

### Fan-out

![fan-out](./assets/fan-out.jpg)

[OrderAPIGatewayFuntion] received the order(s), it just only stores it(them) to [OrderDynamoDBTable](#orderdynamodbtable) then trigger [AWS Simple Notification Service (SNS)].

In this assignment, [OrderTopic] was created and distributes the work to [BalanceCheckerQueue] and [StockCheckerQueue]:

- [OrderTopic] is an [AWS Simple Notification Service (SNS)], not only send email, it also can makes http/https call. Most important is able to trigger [AWS Lambda].

- [BalanceCheckerQueue] is an [AWS Simple Queue Service (SQS)], it is a queue to keep input and trigger [BalanceCheckerFunction] smoothly 

- [StockCheckerQueue] is an [AWS Simple Queue Service (SQS)], it is a queue to keep input and trigger [StockCheckerFunction] smoothly

- [BalanceCheckerFunction] is [AWS Lambda], it received order and check customer credit balance from [AccountDynamoDBTable](#accountdynamodbtable) and trigger [OrderUpdateQueue] after job done.

- [StockCheckerFunction] is [AWS Lambda], it received order and check stock balance from [StockDynamoDBTable](#stockdynamodbtable) and trigger [OrderUpdateQueue] after job done.


### Shipment queue

Beside the checkers, there is shipment:

![shipment](./assets/shipment.jpg)

- [OrderUpdateQueue] is the starting point of shipment process. It is receiving order status update then 'queue', trigger [OrderUpdateFunction]. 

- [OrderUpdateFunction] receive status and update [OrderDynamoDBTable](#orderdynamodbtable). It ensure all the checkers finished their work at the end, trigger []. 

- [ShipOrderFunction] get confirm from [OrderUpdateFunction], it update [AccountDynamoDBTable](#accountdynamodbtable) and [StockDynamoDBTable](#stockdynamodbtable) for account & stock balance.

## Logic



## Storage

By using [DynamoDB] and creates tables as below:

### OrderDynamoDBTable

[OrderDynamoDBTable](./aws/sam-template.yaml#L596-L607) stores orders.

### AccountDynamoDBTable

[AccountDynamoDBTable](./aws/sam-template.yaml#L609-L620) stores credit balance as field *balance* with field *customerId*. Just simple design to tell how credit that the customer has.

### StockDynamoDBTable

[StockDynamoDBTable](./aws/sam-template.yaml#L622-L633) stores stock balance as field *balance* with field *productId*. It represent how of that specific product can be sold.

## Deployment

Run [deploy.sh](./deploy.sh) which is invoking [AWS SAM] to build and deploy a [CloudFormation] stack by referring [sam-template.yaml] CloudFormation template for deployment.



## What is missing?

### Docker container

Because of AWS EKS is expense, my solution is using serverless. There is no container in the solution. By the way, please refer [Assigment 4](../assignment4/README.md#build--dockerized) for Build and Dockerized

### Code coverage

Low code coverage :(, there is better coverage and report in [Assigment 4](../assignment4/README.md#about-unit).


[CloudFormation]: https://aws.amazon.com/cloudformation/
[AWS SAM]: https://aws.amazon.com/serverless/sam/
[sam-template.yaml]: ./aws/sam-template.yaml
[AWS Lambda]: https://aws.amazon.com/lambda/
[DynamoDB]: https://aws.amazon.com/dynamodb
[AWS Simple Notification Service (SNS)]: https://aws.amazon.com/sns/ 
[AWS Simple Queue Service (SQS)]: https://aws.amazon.com/sqs/

[ApiGatewayApi]: ./aws/sam-template.yaml#L330-L350
[OrderTopic]: ./aws/sam-template.yamll#L374-L398
[OrderAPIGatewayFuntion]: ./aws/sam-template.yaml#L414-L450
[BalanceCheckerQueue]: ./aws/sam-template.yaml#L353-L358
[StockCheckerQueue]: ./aws/sam-template.yaml#L360-L365
[BalanceCheckerFunction]: ./aws/sam-template.yaml#L475-L499
[StockCheckerFunction]: ./aws/sam-template.yaml#L524-L548

[OrderUpdateQueue]: ./aws/sam-template.yaml#L367-L372
[OrderUpdateFunction]: ./aws/sam-template.yaml#L550-L573
[ShipOrderFunction]:  ./aws/sam-template.yaml#L575-L593

