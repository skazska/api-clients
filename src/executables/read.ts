import {ReadCRUDExecutable, ICRUDExecutableConfig} from "@skazska/abstract-service-model"
import {IClientKey, IClientProps} from "../model";
import {ClientStorage} from "../aws/storage";

export interface IClientExecutableConfig extends ICRUDExecutableConfig<IClientKey, IClientProps> {
    storage :ClientStorage
}

export class ClientReadExecutable extends ReadCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        super(props);
    }
}
