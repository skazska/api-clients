import {CreateCRUDExecutable, ICreateOptions} from "@skazska/abstract-service-model"
import {IClientKey, IClientProps} from "../model";
import {IClientExecutableConfig} from "../executables";
import {ClientStorage} from "../aws/storage";

const defaultStorage = ClientStorage.getInstance('clients');

export interface IClientCreateOptions extends ICreateOptions<IClientKey, IClientProps> {}

export class ClientCreateExecutable extends CreateCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        props.realm = 'clients';
        props.operation = 'create';
        super(props);
    }

    static getInstance(storage? :ClientStorage) {
        return new ClientCreateExecutable({storage: storage || defaultStorage});
    }
}
