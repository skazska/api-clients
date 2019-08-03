import {ReadIO} from "./aws/i-o/read";
import {ClientReadExecutable} from "./executables/read";

const executable = ClientReadExecutable.getInstance();
const io = new ReadIO(executable);

export const handler = async (event, context, callback) => {
    try {
        const result = await io.handler({event: event, context: context, callback: callback});

        if (result.isFailure) {
            throw new Error(JSON.stringify(result.errors));
        }

        return callback(null, result);
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
