import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import inputOutputLogger from '@middy/input-output-logger';
import validator from "@middy/validator";
import { transpileSchema } from '@middy/validator/transpile';
import { Handler } from 'aws-lambda';
import pino from 'pino';
import { userService } from '../config/createUserServiceConfig';
import { UserUpdateDTO } from '../dto/UserUpdateDTO';

const logger = pino()

const userUpdateDTOSchema = transpileSchema({
    type: 'object',
    required: ['body'],
    properties: {
        body : {
            type: 'object',
            properties: {
                  phone: {
                    type: 'string'
                  },
                  name: {
                    type: 'string'
                  }
            },
            additionalProperties: false
        },
        pathParameters: {
            type: 'object',
            required: ['id'],
            properties: {
                id: {
                    type: 'string'
                }
            },
            additionalProperties: false
        }
    }
  })

interface CreateUserHandler {
    pathParameters: {
        id: string
    }
    body: UserUpdateDTO
}

export const lambdaHandler:Handler<CreateUserHandler> = async (event, _) => {
    const { body } = event
    const { id } = event.pathParameters

    await userService.updateUser(id, body)
    const response = {
        statusCode: 201,
        body: 'OK',
    }
    return response
}

export const handler = middy(lambdaHandler)
    .use(
        inputOutputLogger({
            logger: (request) => {
                const child = logger.child(request.context)
                child.info(request.event ?? request.response)
            },
            awsContext: true
        })
    )
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .use(validator({eventSchema: userUpdateDTOSchema}))
    .use(httpErrorHandler())
