#!/bin/bash
printSeparator() {
    echo -e ""
    echo -e ""
}

printColored() {
    TEXT="${1}";

    printf "\e[38;2;248;138;0m${TEXT} \e[0m\n";
}

printError() {
    TEXT="${1}";

    printf "\e[38;2;255;0;0m${TEXT}\e[0m\n";
}

printListItem() {
    TEXT="${1}";
    CHECK_MARK="\e[38;2;0;255;0m\xE2\x9C\x94\e[0m";

    echo -e "${CHECK_MARK} ${TEXT}";
}

getVar() {
    VAR=$(grep $1 "./settings.env" | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

ARTIFACT_STORE=$(getVar ARTIFACT_STORE);
ARTIFACT_PATH=$(getVar ARTIFACT_PATH);

AWS_CLI_PROFILE=$(getVar AWS_CLI_PROFILE);
AWS_REGION=$(getVar AWS_REGION);

ORDER_TABLE_NAME=$(getVar ORDER_TABLE_NAME)

STACK_NAME="order-capture-track-stack"

verifyInstallation() {

  printColored "Capture Order API deployment";
  printSeparator;

  printListItem "ARTIFACT_STORE = ${ARTIFACT_STORE}";
  printListItem "ARTIFACT_PATH = ${ARTIFACT_PATH}";

  printListItem "AWS_CLI_PROFILE = ${AWS_CLI_PROFILE}";
  printListItem "AWS_REGION = ${AWS_REGION}";

  printListItem "STACK_NAME = ${STACK_NAME}"

  printSeparator;

  printListItem "ORDER_TABLE_NAME = ${ORDER_TABLE_NAME}";

  printSeparator;
  echo -n "2). Do you want to continue? ([Y]es, [N]o): "
  read CONFIRM_CODE

}

while true; do
  verifyInstallation

  if [[ $CONFIRM_CODE == "Y" ]] || [[ $CONFIRM_CODE == "N" ]] || [[ $CONFIRM_CODE == "y" ]] || [[ $CONFIRM_CODE == "n" ]]
  then
    break
  else
    printError "Invalid value."
    sleep 1
    printSeparator
  fi
done

if [[ $CONFIRM_CODE == "Y" ]] || [[ $CONFIRM_CODE == "y" ]]
then
  clear;
  printSeparator
  printColored "Capture Order API deployment";
  printSeparator
else
  clear;

  printSeparator
  printError "Aborting deployment in 3 seconds... ";
  sleep 1;
  printError "Aborting deployment in 2 seconds... ";
  sleep 1;
  printError "Aborting deployment in 1 seconds... ";
  sleep 1;
  printSeparator
  clear;
	exit 1
fi

cd ./aws

printColored "Deploy message salesforce stack ${STACK_NAME}"
printSeparator

sam package --template-file ./sam-template.yaml \
    --s3-bucket "${ARTIFACT_STORE}" \
    --s3-prefix "${ARTIFACT_PATH}" \
    --output-template-file ./sam-template-packaged.yaml \
    --profile "${AWS_CLI_PROFILE}" \
    --region "$AWS_REGION"

sam deploy --template-file ./sam-template-packaged.yaml \
    --s3-bucket "${ARTIFACT_STORE}" \
    --s3-prefix "${ARTIFACT_PATH}" \
    --stack-name $STACK_NAME \
    --parameter-overrides ParameterKey=OrderTableName,ParameterValue=$ORDER_TABLE_NAME \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --profile "${AWS_CLI_PROFILE}" \
    --region "$AWS_REGION"

# Done
printSeparator;
echo -n "Deployment complete!";
printSeparator;
read -n 1 -s -r -p "Press any key to continue....";
clear;
