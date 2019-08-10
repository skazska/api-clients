import "mocha";
import {expect, use}  from 'chai';

import {JWTAuth} from "../../src/authenticator";
import {APIGatewayProxyResult} from "aws-lambda";
import {EditIO} from "../../src/aws/i-o/edit";
import {ClientSaveExecutable} from "../../src/executables/save";

import {ClientReadExecutable} from "../../src/executables/read";
import {GetIO} from "../../src/aws/i-o/get";
import {ClientStorage} from "../../src/aws/storage";
import {apiGwProxyProvider} from "../../src/aws";
import {EventPayload} from './util/lambda';
import {DynamodbModelStorage} from "@skazska/abstract-aws-service-model";

import sinon from "sinon";
import {DeleteIO} from "../../src/aws/i-o/delete";
import {ClientDeleteExecutable} from "../../src/executables/delete";
// import sinonChai = require("sinon-chai");
// use(sinonChai);

const tests = [
    {
        httpMethod: 'GET',
        authRealm: 'clients',
        authOps: 'read',
        storageMethod: 'get',
        storageResponse: {Item: {id: 'client', name: 'name', locale: 'en-US'}},
        storageError: null,
        executableClass: () => ClientReadExecutable,
        ioConstructor: () => GetIO,
        eventPart: {
            pathParameters: {id: 'client'}
        },

        expectedResultBody: {"locale":"en-US","name":"name","id":"client"},
        expectedResultStatus: 200,
        expectedStorageCallParams: {TableName: 'clients', Key: {id: 'client'}}
    },
    {
        httpMethod: 'POST',
        authRealm: 'clients',
        authOps: 'create',
        storageMethod: 'put',
        storageResponse: {Attributes: {id: 'client', name: 'executable expected to return passed model at the moment', locale: 'en-US'}},
        storageError: null,
        executableClass: () => ClientSaveExecutable,
        ioConstructor: () => EditIO,
        eventPart: {
            body: JSON.stringify({id: 'client', name: 'name', locale: 'en-US'})
        },

        expectedResultBody: {"locale":"en-US","name":"name","id":"client"},
        expectedResultStatus: 201,
        expectedStorageCallParams: {TableName: 'clients', Item: {"id": "client", "locale": "en-US", "name": "name"}}
    },
    {
        httpMethod: 'PUT',
        authRealm: 'clients',
        authOps: 'replace',
        storageMethod: 'put',
        storageResponse: {Attributes: {id: 'client', name: 'executable expected to return passed model at the moment', locale: 'en-US'}},
        storageError: null,
        executableClass: () => ClientSaveExecutable,
        ioConstructor: () => EditIO,
        ioConstructorOptions: {successStatus: 202},
        eventPart: {
            body: JSON.stringify({id: 'client', name: 'name', locale: 'en-US'})
        },

        expectedResultBody: {"locale":"en-US","name":"name","id":"client"},
        expectedResultStatus: 202,
        expectedStorageCallParams: {TableName: 'clients', Item: {"id": "client", "locale": "en-US", "name": "name"}}
    },
    {
        httpMethod: 'DELETE',
        authRealm: 'clients',
        authOps: 'delete',
        storageMethod: 'delete',
        storageResponse: {Attributes: {}},
        storageError: null,
        executableClass: () => ClientDeleteExecutable,
        ioConstructor: () => DeleteIO,
        eventPart: {
            pathParameters: {id: 'client'}
        },

        expectedResultBody: null,
        expectedResultStatus: 204,
        expectedStorageCallParams: {TableName: 'clients', Key: {"id": "client"}}
    }
];


describe('handler general tests', () => {
    let authenticator;
    let storage;
    let eventInput;
    let eventContext;
    let client;
    let clientStub;

    const testRun = test => {
        it(`#${test.httpMethod} calls storage client's ${test.storageMethod} method with ${JSON.stringify(test.expectedStorageCallParams)} and results with status ${test.expectedResultStatus} with ${JSON.stringify(test.expectedResultBody)}`, async () => {
            const executable = test.executableClass().getInstance(test.authOps, storage);
            const io = test.ioConstructor().getInstance(executable, authenticator, test.ioConstructorOptions);
            const handler = apiGwProxyProvider({ [test.httpMethod]: io });

            // prepare auth token and event object
            const token = await JWTAuth.grant(test.authRealm, test.authOps);
            const event = eventInput.get(Object.assign({
                httpMethod: test.httpMethod,
                headers: {'x-auth-token': token.get()}
            }, test.eventPart));
            const context = eventContext.get({});

            // stub storage client method with expected response
            clientStub[test.storageMethod].yieldsRightAsync(test.storageError, test.storageResponse);

            // run handler
            const result :APIGatewayProxyResult = await new Promise((resolve, reject) => {
                handler.call({}, event, context, (err, result) => {
                    if (err) return reject(err);
                    return resolve(result);
                });
            });

            // check result
            expect(result.statusCode).eql(test.expectedResultStatus);
            expect(result.headers).eql({
                "Content-Type": "application/json"
            });
            if (test.expectedResultBody) {
                expect(JSON.parse(result.body)).eql(test.expectedResultBody);
            } else {
                expect(result).not.to.have.property('body');
            }

            // check if correct storage method is called
            expect(client[test.storageMethod].args.length).eql(1);

            // check if storage method is called with expected params
            expect(client[test.storageMethod].args[0][0]).eql(test.expectedStorageCallParams);


            return true;
        });

    };

    beforeEach(() => {
        authenticator = JWTAuth.getInstance();
        client = DynamodbModelStorage.getDefaultClient();
        storage = ClientStorage.getInstance('clients', client);

        eventInput = new EventPayload(null, 'input');
        eventContext = new EventPayload(null, 'context');

        clientStub = sinon.stub(client);
    });

    afterEach(() => {
        sinon.restore();
    });

    tests.forEach(testRun);
    // testRun(tests[2]);
});
