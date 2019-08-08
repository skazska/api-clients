import {ReadIO} from "./aws/i-o/read";
import {ClientReadExecutable} from "./executables/read";
import {JWTAuth} from "./authenticator";
import {CreateIO} from "./aws/i-o/create";
import {UpdateIO} from "./aws/i-o/update";
import {ClientCreateExecutable} from "./executables/create";
import {ClientReplaceExecutable} from "./executables/replace";
import {ClientUpdateExecutable} from "./executables/update";

export interface IApiGwProxyProviderConfig {
    GET? :ReadIO,
    POST? :CreateIO,
    PUT? :UpdateIO,
    PATCH? :UpdateIO
}

export const apiGwProxyProvider = (config :IApiGwProxyProviderConfig) => {
    return async (event, context, callback) => {
        try {
            const io = config[event.httpMethod];
            const result = await io.handler({event: event, context: context, callback: callback});

            if (result.isFailure) {
                throw new Error(JSON.stringify(result.errors));
            }

            return callback(null, result.get());
        } catch (e) {
            callback(null, {
                statusCode: '500',
                body: e,
                headers: {
                    'Content-Type': 'application/json',
                },
            })

        }
    };
};

const authenticator = JWTAuth.getInstance();
const readExecutable = ClientReadExecutable.getInstance();
const getIo = new ReadIO(readExecutable, authenticator);

const createExecutable = ClientCreateExecutable.getInstance();
const postIo = new CreateIO(createExecutable, authenticator);

const replaceExecutable = ClientReplaceExecutable.getInstance();
const replaceIo = new UpdateIO(replaceExecutable, authenticator);

const updateExecutable = ClientUpdateExecutable.getInstance();
const updateIo = new UpdateIO(updateExecutable, authenticator);


export const handler = apiGwProxyProvider({
    'GET' :getIo,
    'POST' :postIo,
    'PUT' :replaceIo,
    'PATCH' :updateIo
});
