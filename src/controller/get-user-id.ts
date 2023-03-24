import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser';
import inputOutputLogger from '@middy/input-output-logger';
import { Context, Handler } from 'aws-lambda';
import pino from 'pino';
import { userService } from '../config/createUserServiceConfig';

const logger = pino()

interface GetUserEvent {
    pathParameters: {
        id: string
    }
}

const lambdaHandler: Handler<GetUserEvent> = async (event, _: Context, callback) => {
    const { id } = event.pathParameters
    const user = await userService.getUser(id)

    const response = {
        statusCode: 200,
        body: JSON.stringify(user),
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
    .use(httpUrlEncodePathParser())
    .use(httpErrorHandler())


