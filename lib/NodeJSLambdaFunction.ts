import { aws_lambda, aws_lambda_nodejs } from "aws-cdk-lib";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface NodeJSLambdaFunctionProps extends NodejsFunctionProps {
}

class NodeJSLambdaFunction extends NodejsFunction {
    constructor(scope: Construct, id: string, props?: NodeJSLambdaFunctionProps){
        const nodejsFunctionProps: NodejsFunctionProps = {
            runtime: aws_lambda.Runtime.NODEJS_18_X,
            bundling: {
              nodeModules: ['aws-sdk', 'env-var'],
              minify: true, // minify code, defaults to false
              sourceMap: true, // include source map, defaults to false
              sourceMapMode: aws_lambda_nodejs.SourceMapMode.INLINE, // defaults to SourceMapMode.DEFAULT
              sourcesContent: false, // do not include original source into source map, defaults to true
              target: 'es2020', // target environment for the generated JavaScript code
              // loader: { // Use the 'dataurl' loader for '.png' files
              //   '.png': 'dataurl',
              // },
              // define: { // Replace strings during build time
              //   'process.env.API_KEY': JSON.stringify('xxx-xxxx-xxx'),
              //   'process.env.PRODUCTION': JSON.stringify(true),
              //   'process.env.NUMBER': JSON.stringify(123),
              // },
              // preCompilation: true,
              logLevel: aws_lambda_nodejs.LogLevel.WARNING, // defaults to LogLevel.WARNING
              keepNames: true, // defaults to false
              // tsconfig: 'custom-tsconfig.json', // use custom-tsconfig.json instead of default,
            //   metafile: true, // include meta file, defaults to false
              // banner: '/* comments */', // requires esbuild >= 0.9.0, defaults to none
              // footer: '/* comments */', // requires esbuild >= 0.9.0, defaults to none
              charset: aws_lambda_nodejs.Charset.UTF8, // do not escape non-ASCII characters, defaults to Charset.ASCII
              format: aws_lambda_nodejs.OutputFormat.CJS, // ECMAScript module output format, defaults to OutputFormat.CJS (OutputFormat.ESM requires Node.js 14.x)
            //   mainFields: ['module', 'main'], // prefer ECMAScript versions of dependencies
              // inject: ['./my-shim.js', './other-shim.js'], // allows to automatically replace a global variable with an import from another file
              esbuildArgs: { // Pass additional arguments to esbuild
                "--log-limit": "0",
                // "--splitting": true,
                // "--outdir": "dist"
              },
            },
            ...props,
          }
        super(scope, id, nodejsFunctionProps)
    }

}


export {
  NodeJSLambdaFunction,
  NodeJSLambdaFunctionProps
};

