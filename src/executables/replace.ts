import {CreateCRUDExecutable, IUpdateOptions} from "@skazska/abstract-service-model"
import {IClientKey, IClientProps} from "../model";
import {IClientExecutableConfig} from "../executables";
import {ClientStorage} from "../aws/storage";

const defaultStorage = ClientStorage.getInstance('clients');

export interface IClientReplaceOptions extends IUpdateOptions<IClientKey, IClientProps> {}

export class ClientReplaceExecutable extends CreateCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        props.realm = 'clients';
        props.operation = 'replace';
        super(props);
    }

    static getInstance(storage? :ClientStorage) {
        return new ClientReplaceExecutable({storage: storage || defaultStorage});
    }
}
