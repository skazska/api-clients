import {ReadCRUDExecutable, ICRUDExecutableConfig} from "@skazska/abstract-service-model"
import {IClientKey, IClientProps} from "../model";
import {IClientExecutableConfig} from "../executables";
import {ClientStorage} from "../aws/storage";

const defaultStorage = ClientStorage.getInstance('clients');

export class ClientReadExecutable extends ReadCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        props.realm = 'clients';
        props.operation = 'read';
        super(props);
    }
    static getInstance(storage? :ClientStorage) {
        return new ClientReadExecutable({storage: storage || defaultStorage});
    }
}
