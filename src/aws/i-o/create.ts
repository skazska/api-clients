import {AwsApiGwProxyIO, IAwsApiGwProxyInput} from "@skazska/abstract-aws-service-model"
import {AbstractAuth, IAuthTokenResult, GenericResult, IError, IModel, success, failure, CRUDExecutable} from "@skazska/abstract-service-model";
import {APIGatewayProxyResult} from "aws-lambda";
import {ClientCreateExecutable, IClientCreateOptions} from "../../executables/create";
import {ClientModelIOFactory} from "../i-o";

const ioModelFactory = new ClientModelIOFactory();

export class CreateIO extends AwsApiGwProxyIO<IClientCreateOptions,IModel> {
    constructor(executable: ClientCreateExecutable, authenticator?: AbstractAuth) {
        super(executable, authenticator, {successStatus: 201});
    };

    protected authTokens(input: IAwsApiGwProxyInput): IAuthTokenResult {
        return success(input.event.headers['x-auth-token']);
    }

    protected data(inputs: IAwsApiGwProxyInput): GenericResult<IClientCreateOptions, IError> {
        try {
            let data = JSON.parse(inputs.event.body);
            return ioModelFactory.dataModel(data).wrap(
                model => { return {model: model}}
            );
        } catch (e) {
            return failure([e]);
        }
    }

    protected success(result: IModel): APIGatewayProxyResult {
        const data = ioModelFactory.data(result);
        return super.success(data);
    }

    static getInstance(executable, authenticator) {
        return new CreateIO(executable, authenticator)
    }
}
