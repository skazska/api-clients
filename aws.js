const { clientList } = require('./index');

module.exports.handler = async (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    try {
        let result = await clientList();
        done(null, result);
    } catch (e) {
        done(e);
    }

};