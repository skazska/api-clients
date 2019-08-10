import {CreateCRUDExecutable} from "@skazska/abstract-service-model"
import {IClientKey, IClientProps} from "../model";
import {IClientExecutableConfig} from "../executables";
import {ClientStorage} from "../aws/storage";

const defaultStorage = ClientStorage.getInstance('clients');

export class ClientSaveExecutable extends CreateCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        props.realm = 'clients';
        super(props);
    }

    static getInstance(operation: string, storage? :ClientStorage) {
        return new ClientSaveExecutable({operation: operation, storage: storage || defaultStorage});
    }
}
