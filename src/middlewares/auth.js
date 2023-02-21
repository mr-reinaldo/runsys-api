import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar se o usuário está autenticado.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 * @throws {Error} Caso o token seja inválido.
 */
function isAuthenticated(req, res, next) {
    try {
        const { authorization } = req.headers;

        const [, token] = authorization.split(' ');

        const { uuid, email } = jwt.verify(token, process.env.JWT_SECRET);

        req.uuid = uuid; // Adiciona o uuid do usuário na requisição.
        req.email = email; // Adiciona o email do usuário na requisição.

        next();
    } catch (error) {
        res.status(401).send({ auth: false, message: 'Token invalid.' });
    }
}

export { isAuthenticated };