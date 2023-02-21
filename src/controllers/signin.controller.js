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

    // Verifica se o usuário existe.
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            uuid: true, // Seleciona o uuid do usuário.
            email: true, // Seleciona o email do usuário.
            password: true, // Seleciona a senha do usuário.
        },
    });

    if (!user) {
        throw new Error('Usuário não encontrado!');
    }

    // Verifica se a senha é válida, comparando a senha informada com a senha do usuário.
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Senha inválida!');
    }

    // Gera o token de autenticação, com o uuid e o email do usuário e a chave secreta, e o tempo de expiração.
    const token = jwt.sign({ uuid: user.uuid, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });

    if (!token) {
        throw new Error('Token não gerado!');
    }

    // Retorna o token de autenticação e se o usuário está autenticado.
    res.json({
        auth: true,
        token,
    });
}

export { login };