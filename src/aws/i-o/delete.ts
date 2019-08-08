import {AwsApiGwProxyIO, IAwsApiGwProxyInput} from "@skazska/abstract-aws-service-model"
import {AbstractAuth, IAuthTokenResult, GenericResult, IError, IModel, success} from "@skazska/abstract-service-model";
import {IClientKey} from "../../model";
import {ClientReadExecutable} from "../../executables/read";
import {APIGatewayProxyResult} from "aws-lambda";
import {ClientModelIOFactory} from "../i-o";

const ioModelFactory = new ClientModelIOFactory();

export class DeleteIO extends AwsApiGwProxyIO<IClientKey,null> {
    constructor(executable: ClientReadExecutable, authenticator?: AbstractAuth) {
        super(executable, authenticator, {successStatus: 204});
    };

    protected authTokens(input: IAwsApiGwProxyInput): IAuthTokenResult {
        return success(input.event.headers['x-auth-token']);
    }

    protected data(inputs: IAwsApiGwProxyInput): GenericResult<IClientKey, IError> {
        return success({id: inputs.event.pathParameters.id});
    }

    protected success(result: null): APIGatewayProxyResult {
        return super.success(null);
    }

    static getInstance(executable, authenticator) {
        return new DeleteIO(executable, authenticator)
    }
}
