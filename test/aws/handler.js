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

    const eventInput = new EventPayload(null, 'input');
    const eventContext = new EventPayload(null, 'context');

    it('should call list method for GET request if no id path param provided', (done) => {
        methodsStub.clientList.returns([{},{}]);
        const result = handler.call({}, eventInput.get({}), eventContext.get({}), (err, result) => {
            expect(result.statusCode).eql('200');
            expect(result.headers).eql({
                "Content-Type": "application/json"
            });
            expect(result.body).eql('[{},{}]');
            expect(methodsStub.clientList).to.be.calledOnce;
            done();
        });
    })
});