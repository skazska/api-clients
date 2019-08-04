import "mocha";
import {expect, use}  from 'chai';

// import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

import {ClientReadExecutable} from "../../src/executables/read";
import {ReadIO} from "../../src/aws/i-o/read";
import {ClientStorage} from "../../src/aws/storage";
import {apiGwProxyProvider} from "../../src/aws";
import {EventPayload} from './util/lambda';
import {DynamodbModelStorage} from "@skazska/abstract-aws-service-model";

import sinon from "sinon";
import {JWTAuth} from "../../src/authenticator";
import {APIGatewayProxyResult} from "aws-lambda";
// import sinonChai = require("sinon-chai");
// use(sinonChai);


describe('handler general tests', () => {
    let authenticator;
    let storage;
    let executable;
    let eventInput;
    let eventContext;
    let client;
    let clientStub;

    before(() => {
        authenticator = JWTAuth.getInstance();
        client = DynamodbModelStorage.getDefaultClient();
        storage = ClientStorage.getInstance('clients', client);
        executable = ClientReadExecutable.getInstance(storage);

        eventInput = new EventPayload(null, 'input');
        eventContext = new EventPayload(null, 'context');

        clientStub = sinon.stub(client);
    });

    it('#get', async () => {
        let io = new ReadIO(executable, authenticator);
        let handler = apiGwProxyProvider({ 'GET': io });

        clientStub.get.yieldsRightAsync(null, {Item: {id: 'client', name: 'name', locale: 'en-US'}});

        const token = await JWTAuth.grant('clients', 'read');
        const event = eventInput.get({
            httpMethod: 'GET',
            headers: {'x-auth-token': token.get()},
            pathParameters: {id: 'client'}
        });
        const context = eventContext.get({});

        const result :APIGatewayProxyResult = await new Promise((resolve, reject) => {
            handler.call({}, event, context, (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            });
        });

        expect(result.statusCode).eql(200);
        expect(result.headers).eql({
            "Content-Type": "application/json"
        });
        expect(result.body).eql('{"locale":"en-US","name":"name","id":"client"}');
        expect(client.get.args.length).eql(1);

        return true;
    })
});
