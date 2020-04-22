const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = function checkToken(userId , accessToken) {
    console.log(config.secret);
    if(accessToken) {

        try {
            const decoded = jwt.verify(accessToken, config.secret);

            console.log(accessToken + "   " + userId );
            
            return (decoded._id === userId);
        } catch(err) {
            return false;
        }
    } else {
        return false;
    }
}

/*module.exports = function authorize(req , res , next){ 

    console.log('entered')

    console.log(req.body,"body");
    const userId = req.body.id;
    const accessToken = req.header('x-access-token');
    if(accessToken) {

        try {
            const decoded = jwt.verify(accessToken, config.secret);

            console.log(accessToken + "    .............     " + userId );
            
            if(decoded._id === userId)
            {
                next();
            }
            else
            {
                res.send('Invalid Token match');
            }
        } catch(err) {
            res.send('Invalid Token err');
        }
    } else {
        return false;
    }
}*/

module.exports = function authorizeParams(req , res , next){ 

    //console.log(req.body);
    //console.log('entered')
    const userId = req.params.id;
    const accessToken = req.header('x-access-token');
    if(accessToken) {

        try {
            const decoded = jwt.verify(accessToken, config.secret);

            console.log(accessToken + "   " + userId );
            console.log(decoded._id)
            
            if(decoded._id === parseInt(userId) )
            {
                next();
            }
            else
            {
                res.send('Invalid Token k1');
            }
        } catch(err) {
            res.send('Invalid Token k2');
        }
    } else {
        return false;
    }
}
