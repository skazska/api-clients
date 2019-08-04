import {ReadIO} from "./aws/i-o/read";
import {ClientReadExecutable} from "./executables/read";
import {JWTAuth} from "./authenticator";

export interface IApiGwProxyProviderConfig {
    'GET' :ReadIO,
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
const executable = ClientReadExecutable.getInstance();
const getIo = new ReadIO(executable, authenticator);

export const handler = apiGwProxyProvider({
    'GET' :getIo,
});
