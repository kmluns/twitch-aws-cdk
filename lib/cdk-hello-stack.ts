import { aws_apigateway, aws_dynamodb, aws_lambda, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodeJSLambdaFunction } from './NodeJSLambdaFunction';
import path = require('path');



function getDefaultLambdaIntegration(handler: aws_lambda.Function): aws_apigateway.LambdaIntegration {
  return new aws_apigateway.LambdaIntegration(handler, {
    requestTemplates: { "application/json": '{ "statusCode": "200" }' }
  });
}


export class CdkHelloStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new aws_dynamodb.Table(this, 'QRCodeTable', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      tableName: "qr_code",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const userTable = new aws_dynamodb.Table(this, 'User', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
      tableName: 'user',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const userEmailIndex: aws_dynamodb.GlobalSecondaryIndexProps = {
      indexName: 'emailIndex',
      partitionKey: {
        name: 'email',
        type: aws_dynamodb.AttributeType.STRING,
      },
      projectionType: aws_dynamodb.ProjectionType.ALL,
    };

    const userUsernameIndex: aws_dynamodb.GlobalSecondaryIndexProps = {
      indexName: 'usernameIndex',
      partitionKey: {
        name: 'username',
        type: aws_dynamodb.AttributeType.STRING,
      },
      projectionType: aws_dynamodb.ProjectionType.ALL,
    };

    userTable.addGlobalSecondaryIndex(userEmailIndex)
    userTable.addGlobalSecondaryIndex(userUsernameIndex)

    // create user lambda function
    const createUserFunction = new NodeJSLambdaFunction(this, "CreateUserFunction", {
      entry: path.resolve(__dirname, '../src/controller/create-user.ts'),
      handler: "handler",
      functionName: "CreateUser",
      environment: {
        USER_TABLE_NAME: userTable.tableName
      },
    });
    userTable.grantReadWriteData(createUserFunction)

    // update user lambda function
    const updateUserFunction = new NodeJSLambdaFunction(this, "UpdateUserFunction", {
      entry: path.resolve(__dirname, '../src/controller/update-user.ts'),
      handler: "handler",
      functionName: "UpdateUser",
      environment: {
        USER_TABLE_NAME: userTable.tableName
      },
    });
    userTable.grantReadWriteData(updateUserFunction)

    // get user by id lambda function
    const getUserByIdFunction = new NodeJSLambdaFunction(this, "GetUserByIdFunction", {
      entry: path.resolve(__dirname, '../src/controller/get-user-id.ts'),
      handler: "handler",
      functionName: "GetUserById",
      environment: {
        USER_TABLE_NAME: userTable.tableName
      },
    });

    userTable.grantReadData(getUserByIdFunction)

    // get user by username lambda function
    const getUserByUsernameFunction = new NodeJSLambdaFunction(this, "GetUserByUsernameFunction", {
      entry: path.resolve(__dirname, '../src/controller/get-user-username.ts'),
      handler: "handler",
      functionName: "GetUserByUsername",
      environment: {
        USER_TABLE_NAME: userTable.tableName
      },
    });

    userTable.grantReadData(getUserByUsernameFunction)

    // get user by email lambda function
    const getUserByEmailFunction = new NodeJSLambdaFunction(this, "GetUserByEmailFunction", {
      entry: path.resolve(__dirname, '../src/controller/get-user-email.ts'),
      handler: "handler",
      functionName: "GetUserByEmail",
      environment: {
        USER_TABLE_NAME: userTable.tableName
      },
    });

    userTable.grantReadData(getUserByEmailFunction)


    const api = new aws_apigateway.RestApi(this, "User-RestAPI", {
      restApiName: "User-Service",
      description: "This service manage the users.",
    });

    // domain.com/user
    const userResource = api.root.addResource('user')
    userResource.addMethod("POST", getDefaultLambdaIntegration(createUserFunction));

    // domain.com/user/{id}
    const userPathIdResource = userResource.addResource('{id}')
    userPathIdResource.addMethod("GET", getDefaultLambdaIntegration(getUserByIdFunction));
    userPathIdResource.addMethod("PUT", getDefaultLambdaIntegration(updateUserFunction));

    // domain.com/user/username/{username}
    const userUsernameResource = userResource.addResource('username')
    userUsernameResource.addResource('{username}').addMethod("GET", getDefaultLambdaIntegration(getUserByUsernameFunction));

    // domain.com/user/email/{email}
    const userEmailResource = userResource.addResource('email')
    userEmailResource.addResource('{email}').addMethod("GET", getDefaultLambdaIntegration(getUserByEmailFunction));

  }
}
