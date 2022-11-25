# Serverless with typescript

## dependencies

- "@aws-sdk/client-s3"
- "@aws-sdk/credential-providers"
- "@middy/core"
- "@middy/http-json-body-parser"
- "@middy/validator"
- "aws-lambda"
- "aws-sdk"
- "axios"

## dev-dependencies

- "@types/aws-lambda"
- "@types/aws-sdk"
- "esbuild"
- "nodemon"
- "serverless-dotenv-plugin"
- "serverless-esbuild"
- "serverless-offline"
- "serverless-offline-local-authorizers-plugin"
- "serverless-plugin-typescript"
- "typescript"
- "webpack-cli"

## Scripts

### Dependencies
It's required to have serverless

### Commands
Run in development (localhost)
```bash
npm run dev
```

Deploy to server
```bash
sls deploy --stage [stage]
```