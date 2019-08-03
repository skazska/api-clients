import {IModelDataAdepter, GenericModelFactory} from '@skazska/abstract-service-model';
import {DynamodbModelStorage, IDynamodbModelStorageConfig} from '@skazska/abstract-aws-service-model'
import {ClientModel, IClientKey, IClientProps} from "../model";

class ClientModelStorageAdapter implements IModelDataAdepter<IClientKey, IClientProps> {
    getKey (data :any) :IClientKey {
        return { id: data.clientId };
    };
    getProperties (data :any) :IClientProps {
        return {
            locale :data.clientLocale,
            name :data.clientName
        }
    };
}

class ClientModelStorageFactory extends GenericModelFactory<IClientKey, IClientProps> {
    constructor() { super(ClientModel, new ClientModelStorageAdapter()); };
}

export class ClientStorage extends DynamodbModelStorage<IClientKey, IClientProps> {
    constructor(props :IDynamodbModelStorageConfig<IClientKey, IClientProps>) {
        super(props);
    }

    // returns new instance with default options
    static getInstance (table? :string) :ClientStorage {
        return new ClientStorage({
            modelFactory: new ClientModelStorageFactory(),
            table: table || 'clients',
            client: DynamodbModelStorage.getDefaultClient()
        });
    }

}
