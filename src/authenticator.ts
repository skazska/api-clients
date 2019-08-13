import {AbstractAuth, IAuthError, IAuthIdentity, IIdentityResult, failure, success, GenericResult} from "@skazska/abstract-service-model";
import {verify, sign} from "jsonwebtoken";

//TODO this is to implement later

export const SECRET = 'secret';

export class JWTAuthIdentity implements IAuthIdentity {
    constructor(private token :string) {}

    access(realm :string, op: string) :Promise<GenericResult<boolean, IAuthError>> {
        try {
            let re = new RegExp('^(?:.*[|:;,\\/])*' + op);
            verify(this.token, SECRET, {subject: realm, audience: re});
            return Promise.resolve(success(true));
        } catch (e) {
            return Promise.resolve(failure([AbstractAuth.error(e.message)]));
        }
    };
}

export class JWTAuth extends AbstractAuth {
    identify (token :string) :Promise<IIdentityResult> {
        try {
            verify(token, SECRET);
            return Promise.resolve(success(new JWTAuthIdentity(token)));
        } catch (e) {
            return Promise.resolve(failure([AbstractAuth.error('bad tokens')]));
        }
    }

    static grant(realm :string, ops: string) :Promise<GenericResult<string, IAuthError>> {
        let token = sign({}, SECRET, {subject: realm, audience: ops});
        return Promise.resolve(success(token));
    }

    static getInstance() {
        return new JWTAuth();
    }
}
