import {DeleteCRUDExecutable} from "@skazska/abstract-service-model"
import {IClientKey, IClientProps} from "../model";
import {IClientExecutableConfig} from "../executables";
import {ClientStorage} from "../aws/storage";

const defaultStorage = ClientStorage.getInstance('clients');

export class ClientDeleteExecutable extends DeleteCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        props.realm = 'clients';
        props.operation = 'delete';
        super(props);
    }

    static getInstance(storage? :ClientStorage) {
        return new ClientDeleteExecutable({storage: storage || defaultStorage});
    }
}
