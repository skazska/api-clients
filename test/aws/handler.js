const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const expect = chai.expect;

const {EventPayload} = require('./util/lambda');

describe('handler', () => {
    const methods = require('../../index');
    const methodsStub = sinon.stub(methods);
    const { apiGwProxy } = require('../../aws/handler-provider');
    const handler = apiGwProxy(methods);

    const eventPayload = new EventPayload();

    // beforeEach(() => {
    //     apiCall = sinon.fake(() => {
    //         return awsResponse({FunctionName: 'name', result: 'result'});
    //     });
    // });

    it('should call list method for GET request if no id path param provided', () => {
        methodsStub.clientList.returns([{},{}]);
        const result = handler.call({}, eventPayload.get({}));
        expect(methodsStub.clientList).to.be.calledOnce;
    })
});