import {AwsApiGwProxyIO, IAwsApiGwProxyInput} from "@skazska/abstract-aws-service-model"
import {AbstractAuth, IAuthTokenResult, GenericResult, IError, IModel} from "@skazska/abstract-service-model";
import {IClientKey} from "../../model";
import {ClientReadExecutable} from "../../executables/read";

export class ReadIO extends AwsApiGwProxyIO<IClientKey,IModel> {
    constructor(executable: ClientReadExecutable, authenticator?: AbstractAuth) {
        super(executable, authenticator);
    };

    protected authTokens(input: IAwsApiGwProxyInput): IAuthTokenResult {
        return undefined;
    }

    protected data(inputs: IAwsApiGwProxyInput): GenericResult<IClientKey, IError> {
        return undefined;
    }

}
