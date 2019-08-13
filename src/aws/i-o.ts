import {ClientModel, IClientKey, IClientProps} from "../model";
import {GenericModelFactory, IModelDataAdepter, IModelError, GenericResult, success, IExecutable, IAuth, IAuthTokenResult, IError,
    failure} from "@skazska/abstract-service-model";
import {AwsApiGwProxyIO, IAwsApiGwProxyInput, IAwsApiGwProxyIOOptions} from "@skazska/abstract-aws-service-model";
import {IClientCUExecutableOptions} from "../executables";

class ClientModelIOAdapter implements IModelDataAdepter<IClientKey, IClientProps> {
    getKey (data :any) :GenericResult<IClientKey, IModelError> {
        return success({ id: data.id });
    };
    getProperties (data :any) :GenericResult<IClientProps, IModelError> {
        return success({
            locale :data.locale,
            name :data.name
        });
    };
    getData(key: IClientKey, properties: IClientProps): any {
        return {...key, ...properties}
    }
}

export class ClientModelIOFactory extends GenericModelFactory<IClientKey, IClientProps> {
    constructor() { super(ClientModel, new ClientModelIOAdapter()); };
}

export interface IClientsIOOptions extends IAwsApiGwProxyIOOptions {
    modelFactory: ClientModelIOFactory
}

export abstract class ClientsIO<EI, EO> extends AwsApiGwProxyIO<EI,EO> {
    protected options :IClientsIOOptions;

    protected constructor(executable: IExecutable, authenticator?: IAuth, options?: IAwsApiGwProxyIOOptions) {
        super(executable, authenticator, {...{successStatus: 200}, ...options});
        if (!this.options.modelFactory) this.options.modelFactory = new ClientModelIOFactory();
    };

    protected authTokens(input: IAwsApiGwProxyInput): IAuthTokenResult {
        console.log('auth tokens');
        console.dir(arguments);
        return success(input.event.headers && input.event.headers['x-auth-token']);
    }
}

export abstract class ClientsKeyIO<EO> extends ClientsIO<IClientKey,EO> {
    protected data(inputs: IAwsApiGwProxyInput): GenericResult<IClientKey, IError> {
        return success({id: inputs.event.pathParameters.id});
    }
}

export abstract class ClientsModelIO<EO> extends ClientsIO<IClientCUExecutableOptions,EO> {
    protected data(inputs: IAwsApiGwProxyInput): GenericResult<IClientCUExecutableOptions, IError> {
        console.log('post data');
        console.dir(arguments);

        try {
            let data = JSON.parse(inputs.event.body);
            return this.options.modelFactory.dataModel(data).wrap(
                model => { return {model: model}}
            );
        } catch (e) {
            console.error(e);
            return failure([e]);
        }
    }
}
