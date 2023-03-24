import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CdkHello from '../lib/cdk-hello-stack';

test('create DynamoDB qr_code', () => {
  const app = new cdk.App();
  const stack = new CdkHello.CdkHelloStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TableName: "qr_code"
  });

});

test('create DynamoDB user_table', () => {
    const app = new cdk.App();
    const stack = new CdkHello.CdkHelloStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: "user_table"
    });

  });


test('create User Function', () => {
  const app = new cdk.App();
  const stack = new CdkHello.CdkHelloStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: "CreateUser"
  });
});

test('create User Rest API', () => {
  const app = new cdk.App();
  const stack = new CdkHello.CdkHelloStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: "User-Service"
  });
});

test('create POST Method with Lambda Integration', () => {
  const app = new cdk.App();
  const stack = new CdkHello.CdkHelloStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::Method',{
    HttpMethod: 'POST',
    Integration: {
      IntegrationHttpMethod: "POST"
    }
  });
});

test('create GET Method with Lambda Integration', () => {
  const app = new cdk.App();
  const stack = new CdkHello.CdkHelloStack(app, 'MyTestStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ApiGateway::Method',{
    HttpMethod: 'GET',
    Integration: {
      IntegrationHttpMethod: "POST"
    }
  });
});
