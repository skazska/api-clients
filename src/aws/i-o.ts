import {ClientModel, IClientKey, IClientProps} from "../model";
import {GenericModelFactory, IModelDataAdepter} from "@skazska/abstract-service-model";

class ClientModelIOAdapter implements IModelDataAdepter<IClientKey, IClientProps> {
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

class ClientModelIOFactory extends GenericModelFactory<IClientKey, IClientProps> {
    constructor() { super(ClientModel, new ClientModelIOAdapter()); };
}

