import {ICRUDExecutableConfig, ReadCRUDExecutable} from "@skazska/abstract-service-model";
import {DynamodbModelStorage} from "@skazska/abstract-aws-service-model";
import {IClientKey, IClientProps} from "./model";

export interface IClientExecutableConfig extends ICRUDExecutableConfig<IClientKey, IClientProps> {
    storage :DynamodbModelStorage<IClientKey, IClientProps>
}

export class ClientReadExecutable extends ReadCRUDExecutable<IClientKey, IClientProps> {
    constructor(props :IClientExecutableConfig) {
        super(props);
    }
}
