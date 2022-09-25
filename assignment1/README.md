# Asynchronous communication between micro services

# Fan-out

According to wike [Fan-out](https://en.wikipedia.org/wiki/Fan-out_(software)) is a [message pattern](https://en.wikipedia.org/wiki/Messaging_pattern) used to model an information exchange that implies the delivery (or spreading) of a message to one or multiple destinations possibile in parallel, and not halting the process that executes the message to wait for any response to that message.

## Deployment

Run [deploy.sh](./deploy.sh) which is invoking [AWS SAM](https://aws.amazon.com/serverless/sam/) to build and deploy a [CloudFormation](https://aws.amazon.com/cloudformation/) stack.

[sam-template.yaml](./aws/sam-template.yaml) CloudFormation template for deployment.



## What is missing?

Because of AWS EKS is expense, my solution is using serverless. There is no container in the solution. By the way, please refer [Assigment 4](../assignment4/README.md) for Build and Dockerized