const AWS = require("aws-sdk");
const jwt = require('jsonwebtoken');
const Logger = require('./src/utils/Logger').default;
const {
    LoggerLevel
} = require('./src/enums/LoggerLevelEnum');

const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * Authorization middleware
 * 
 * @param {import('aws-lambda').APIGatewayProxyEvent} event 
 * @param {import('aws-lambda').Context} context
 * 
 * @returns {Promise<import('aws-lambda').APIGatewayAuthorizerResult>}
 */
const mylocalAuthProxyFn = async (event, context) => {
    const authorization = event.headers['Authorization'] || event.headers['authorization'];
    const logger = Logger.getInstance();

    logger.writeLogger(context.functionName, LoggerLevel.info, "Try authorizer");

    if (authorization) {
        const token = authorization.split(' ').pop();
        const decode = jwt.decode(token);

        await cognito.adminGetUser({
            Username: decode['cognito:username'],
            UserPoolId: process.env.user_pool_id
        });

        logger.writeLogger(context.functionName, LoggerLevel.info, "Authorizer", { username: decode['cognito:username'] });

        return {
            principalId: decode['sub'],
            policyDocument: {
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: '*'
                }],
                Version: '2012-10-17'
            }
        }
    }

    logger.writeLogger(
        context.functionName,
        LoggerLevel.info,
        "Authorizer fail"
    )
    throw new Error("Authorizer error");
};

module.exports = { mylocalAuthProxyFn }
