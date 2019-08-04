import {AwsApiGwProxyIO, IAwsApiGwProxyInput} from "@skazska/abstract-aws-service-model"
import {AbstractAuth, IAuthTokenResult, GenericResult, IError, IModel, success} from "@skazska/abstract-service-model";
import {IClientKey} from "../../model";
import {ClientReadExecutable} from "../../executables/read";
import {APIGatewayProxyResult} from "aws-lambda";

export class ReadIO extends AwsApiGwProxyIO<IClientKey,IModel> {
    constructor(executable: ClientReadExecutable, authenticator?: AbstractAuth) {
        super(executable, authenticator);
    };

    protected authTokens(input: IAwsApiGwProxyInput): IAuthTokenResult {
        return success(input.event.headers['x-auth-token']);
    }

    protected data(inputs: IAwsApiGwProxyInput): GenericResult<IClientKey, IError> {
        return success({id: inputs.event.pathParameters.part1});
    }

    protected success(result: IModel): APIGatewayProxyResult {
        const data = result.getData();
        return super.success(data);
    }

}
