import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Função para logar um usuário.
 * @param {object} user - Objeto com os dados do usuário.
 * @returns {object} - Objeto com os dados do usuário.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o usuário não exista.
 * @throws {Error} - Caso a senha não seja válida.
 * @throws {Error} - Caso o token não seja gerado.
 * @throws {Error} - Caso o usuário não seja logado.
 */

async function login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            uuid: true,
            email: true,
            password: true,
        },
    });

    if (!user) {
        throw new Error('Usuário não encontrado!');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Senha inválida!');
    }

    const token = jwt.sign({ uuid: user.uuid, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });

    if (!token) {
        throw new Error('Token não gerado!');
    }

    res.json({
        auth: true,
        token,
    });
}

export { login };