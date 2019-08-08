import {ClientModel, IClientKey, IClientProps} from "../model";
import {GenericModelFactory, IModelDataAdepter, IModelError, GenericResult, success} from "@skazska/abstract-service-model";

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

