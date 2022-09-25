# Asynchronous communication between micro services

![Scope of assignment](./assets/scope.jpg)

My apology, difficulis to budget, [AWS EKS](https://aws.amazon.com/eks/) is too expensive and timeframe it is too short for me to pick another cloud technology. I don't provide a solution of microservices.

By the way, it didn't stop me to commit this assignment. I would like to show another idea to meet the goals which is **serverless**. 

## Test it

You may refer [swagger.yaml](./swagger.yaml). Unfortunately, my company laptop only allow me to run it in localhost ( see my [poc-swagger-js](https://github.com/laytzehwu/poc-swagger-js) ). By the way, [postman](./Order%20capture.postman_collection.json) is working with the testing site.

## System design

By referring [sam-template.yaml], you may see above design.


### Rest Api

[ApiGatewayApi](./aws/sam-template.yaml#L330-L350) receives Rest calls from the client and distributes the work to [AWS Lambda].

### Fan-out

According to wike [Fan-out](https://en.wikipedia.org/wiki/Fan-out_(software)) is a [message pattern](https://en.wikipedia.org/wiki/Messaging_pattern) used to model an information exchange that implies the delivery (or spreading) of a message to one or multiple destinations possibile in parallel, and not halting the process that executes the message to wait for any response to that message.



## Deployment

Run [deploy.sh](./deploy.sh) which is invoking [AWS SAM] to build and deploy a [CloudFormation] stack by referring [sam-template.yaml] CloudFormation template for deployment.



## What is missing?

Because of AWS EKS is expense, my solution is using serverless. There is no container in the solution. By the way, please refer [Assigment 4](../assignment4/README.md) for Build and Dockerized





[CloudFormation]: https://aws.amazon.com/cloudformation/
[AWS SAM]: https://aws.amazon.com/serverless/sam/
[sam-template.yaml]: ./aws/sam-template.yaml
[AWS Lambda]: https://aws.amazon.com/lambda/ 
