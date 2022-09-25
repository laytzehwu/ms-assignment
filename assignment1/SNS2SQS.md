# Subscribe a SQS queue to SNS topic

By referring [this article](https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html#SendMessageToSQS.sqs.permissions), simply create subscription for SQS is not enough. We need to add **Access policy** to each SQS queue.

For case of this assignment, we need to grant **sqs:SendMessage** permission to SNS topic. 

Here is the configuration of balance-checker-queue:
```
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "sns.amazonaws.com"
      },
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:ap-southeast-1:405773165933:order-capture-track-stack-balance-checker-queue",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "arn:aws:sns:ap-southeast-1:405773165933:order-capture-track-stack-order-msg"
        }
      }
    }
  ]
}
```

Another configuration for stock-checker-queue:
```
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "sns.amazonaws.com"
      },
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:ap-southeast-1:405773165933:order-capture-track-stack-stock-checker-queue",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "arn:aws:sns:ap-southeast-1:405773165933:order-capture-track-stack-order-msg"
        }
      }
    }
  ]
}
```

I really need more time to find the proper way and such policies auto attached via CloudFormation template.
