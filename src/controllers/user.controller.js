import { PrismaClient } from "@prisma/client";
import { generateHash, compareHash } from "../utils/generate.hash.js";
const prisma = new PrismaClient();

/**
 * Função para criar um usuário.
 * @param {object} user - Objeto com os dados do usuário.
 * @returns {object} - Objeto com os dados do usuário criado.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o email já exista.
 */

async function createUser(req, res) {
    const { firstName, lastName, email, password, isAdmin } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: await generateHash(password),
                ...(firstName && { firstName }), // Se firstName existir, adiciona ao objeto.
                ...(lastName && { lastName }),  // Se lastName existir, adiciona ao objeto.
                ...(isAdmin && { isAdmin }),    // Se isAdmin existir, adiciona ao objeto.
            },
        });

        return res.status(201).json(user);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Email já cadastrado." });
        }

        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para atualizar um usuário.
 * @param {object} user - Objeto com os dados do usuário.
 * @returns {object} - Objeto com os dados do usuário atualizado.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o email já exista.
 * @throws {Error} - Caso o usuário não exista.
 * @throws {Error} - Caso a senha atual não seja válida.
 */

async function updateUser(req, res) {
    const { uuid } = req.params;
    const { firstName, lastName, email, password, isAdmin, oldPassword } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                uuid: String(uuid),
            },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        if (oldPassword && !(await compareHash(oldPassword, user.password))) {
            return res.status(401).json({ error: "Senha atual inválida." });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                email,
                password: await generateHash(password),
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(isAdmin && { isAdmin }),
            },
        });

        return res.status(200).json(updatedUser);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Email já cadastrado." });
        }

        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para deletar um usuário.
 * @param {string} uuid - UUID do usuário.
 * @returns {object} - Objeto com os dados do usuário deletado.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o usuário não exista.
 */

async function deleteUser(req, res) {
    const { uuid } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                uuid: String(uuid),
            },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const deletedUser = await prisma.user.delete({
            where: {
                uuid: String(uuid),
            },
        });

        return res.status(200).json(deletedUser);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para buscar um usuário.
 * @param {string} uuid - UUID do usuário.
 * @returns {object} - Objeto com os dados do usuário.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o usuário não exista.
 */

async function getUser(req, res) {
    const { uuid } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                uuid: String(uuid),
            },
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para buscar todos os usuários.
 * @returns {object} - Objeto com os dados de todos os usuários.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso não exista nenhum usuário.
 * @throws {Error} - Caso o usuário não exista.
 */

async function getUsers(req, res) {
    try {
        const users = await prisma.user.findMany(
            {
                select: {
                    uuid: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            }
        );

        if (!users) {
            return res.status(404).json({ error: "Nenhum usuário encontrado." });
        }

        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export { createUser, updateUser, deleteUser, getUser, getUsers };