import {CreateCRUDExecutable, IUpdateOptions} from "@skazska/abstract-service-model"
import {IClientKey, IClientProps} from "../model";
import {IClientExecutableConfig} from "../executables";
import {ClientStorage} from "../aws/storage";

const defaultStorage = ClientStorage.getInstance('clients');

export interface IClientUpdateOptions extends IUpdateOptions<IClientKey, IClientProps> {}

export class ClientUpdateExecutable extends CreateCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        props.realm = 'clients';
        props.operation = 'update';
        super(props);
    }

    static getInstance(storage? :ClientStorage) {
        return new ClientUpdateExecutable({storage: storage || defaultStorage});
    }
}
