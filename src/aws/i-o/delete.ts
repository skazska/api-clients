import {IAuth, IExecutable} from "@skazska/abstract-service-model";
import {APIGatewayProxyResult} from "aws-lambda";
import {ClientsKeyIO, IClientsIOOptions} from "../i-o";

export class DeleteIO extends ClientsKeyIO<null> {
    constructor(executable: IExecutable, authenticator?: IAuth, options?: IClientsIOOptions) {
        super(executable, authenticator, {...{successStatus: 204}, ...options});
    };

    protected success(result: null): APIGatewayProxyResult {
        return super.success(null);
    }

    static getInstance(executable, authenticator?, options?) {
        return new DeleteIO(executable, authenticator, options)
    }
}
