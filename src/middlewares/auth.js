import jwt from 'jsonwebtoken';

function isAuthenticated(req, res, next) {
    try {
        const { authorization } = req.headers;

        const [, token] = authorization.split(' ');

        const { uuid, email } = jwt.verify(token, process.env.JWT_SECRET);

        req.uuid = uuid;
        req.email = email;

        next();
    } catch (error) {
        res.status(401).send({ auth: false, message: 'Token invalid.' });
    }
}

export { isAuthenticated };