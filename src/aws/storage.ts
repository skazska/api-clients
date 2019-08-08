import {IModelDataAdepter, GenericModelFactory, GenericResult, IStorageError, AbstractModelStorage, IStorage, success,
    IModelError} from '@skazska/abstract-service-model';
import {
    DynamodbModelStorage,
    IDynamodbModelStorageConfig,
    IDynamodbStorageDelOptions,
    IDynamodbStorageGetOptions,
    IDynamodbStorageSaveOptions
} from '@skazska/abstract-aws-service-model'
import {ClientModel, IClientKey, IClientProps} from "../model";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

class ClientModelStorageAdapter implements IModelDataAdepter<IClientKey, IClientProps> {
    getKey (data :any) :GenericResult<IClientKey, IModelError>{
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

class ClientModelStorageFactory extends GenericModelFactory<IClientKey, IClientProps> {
    constructor() { super(ClientModel, new ClientModelStorageAdapter()); };
}

export class ClientStorage implements IStorage<IClientKey, IClientProps, ClientModel> {
    private storage :DynamodbModelStorage<IClientKey, IClientProps>;
    constructor(props :IDynamodbModelStorageConfig<IClientKey, IClientProps>) {
        this.storage = new DynamodbModelStorage<IClientKey, IClientProps>(props);
    }

    newKey(): Promise<GenericResult<IClientKey, IStorageError>> {
        return undefined;
    }

    async load(key :IClientKey, options?: IDynamodbStorageGetOptions) :Promise<GenericResult<ClientModel, IStorageError>> {
        return (await this.storage.load(key, options)).wrap((result) => {
            return <ClientModel>result;
        });
    }

    async save(data :ClientModel, options: IDynamodbStorageSaveOptions): Promise<GenericResult<ClientModel, IStorageError>> {
        return (await this.storage.save(data, options)).wrap((result) => {
            return data;
        });
    }

    async erase(key :IClientKey, options?: IDynamodbStorageDelOptions) :Promise<GenericResult<boolean, IStorageError>> {
        return (await this.storage.erase(key, options)).wrap((result) => {
            return true;
        });
    }

    // returns new instance with default options
    static getInstance (table? :string, client? :DocumentClient) :ClientStorage {
        return new ClientStorage({
            modelFactory: new ClientModelStorageFactory(),
            table: table || 'clients',
            client: client || DynamodbModelStorage.getDefaultClient()
        });
    }

}
