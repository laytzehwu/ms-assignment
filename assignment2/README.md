# Review and Improvement Asynchronous communication project

Some idea to improve usability, reliabilty, performance, scalability, maintainability and security.

## Usability

[Assignment1] is just a MVP. Although I can use [postman](https://www.postman.com/) to test the testing site. But it is not yet to meet production expectation. We need to think more on the following areas.

## Performance

[AWS Api Gateway](https://aws.amazon.com/api-gateway/) has been used where integrate with load balancer, it is an application load balancer can handle protocol HTTP, HTTPS and Websocket (I have used it :) ).

### Fan-out

According to wike [Fan-out](https://en.wikipedia.org/wiki/Fan-out_(software)) is a [message pattern](https://en.wikipedia.org/wiki/Messaging_pattern) used to model an information exchange that implies the delivery (or spreading) of a message to one or multiple destinations possibile in parallel, and not halting the process that executes the message to wait for any response to that message.

The work can be distributed to other services and handle parrellary.

## Scalability

Compare to servers, serverless solution does not really concern of scalability. It is handled by cloud platform. [Assignment1] is using [AWS Api Gateway], [AWS Lambda] and [DynamoDB]:

 - [AWS Api Gateway] take part of load balancer it listen to REST calls and trigger [AWS Lambda]
 - [AWS Lambda] mostly take the job of service. By the way, it is a process instead of server. From the concurrent issue in [Assignment1], I am sure the process was loaded by multiple instance (VM).

## Maintainability

Most of the performance related stuff in [Assignment1] has been offloaded to [AWS Simple Notification Service (SNS)] and [AWS Simple Queue Service (SQS)]. [DynamoDB] is serverless, we are not really worry manage it. 

These services are provided by AWS, we are not really need a lot effort to take care of them.

## Security

Aplogy, [Assignment1] is just a MVP. Because of time limit, security is not in the scope. But it is really important for any implementation in production. At the minimum, we should at least include API key.

### API Key

A scret key may share to front-end apps or another back-end services. It is easily to be hacked if the key leak.

### OAuth

[OAuth](https://en.wikipedia.org/wiki/OAuth), we can offer login including user login or system autheticate. So that short life access token will be generated and used by the following API calls.

We can easily implement OAuth by using [AWS Cognito](https://aws.amazon.com/cognito/). I have used its user pool where can generate JWT to the user and implement authoriser for my API without any coding.

[AWS Api Gateway]: https://aws.amazon.com/api-gateway/
[AWS Lambda]: https://aws.amazon.com/lambda/
[DynamoDB]: https://aws.amazon.com/dynamodb
[AWS Simple Notification Service (SNS)]: https://aws.amazon.com/sns/ 
[AWS Simple Queue Service (SQS)]: https://aws.amazon.com/sqs/

[Assignment1]: ../assignment1/