import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Função para criar um dispositivo.
 * @param {object} device - Objeto com os dados do dispositivo.
 * @returns {object} - Objeto com os dados do dispositivo.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o dispositivo já exista (hostname).
 */
async function createDevice(req, res) {
    try {
        // pega o uuid do usuário autenticado.
        const { uuid } = req;

        // pega os dados do body da requisição.
        const { hostname, port, username, password, typeDevice } = req.body;


        // cria o dispositivo.
        const device = await prisma.device.create({
            data: {
                hostname,
                port,
                username,
                password,
                typeDevice,
                user: {
                    connect: {
                        uuid
                    }
                }
            }
        });

        // retorna o dispositivo criado.
        res.json(device);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Dispositivo já cadastrado." });
        }

        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para atualizar um dispositivo.
 * @param {object} device - Objeto com os dados do dispositivo.
 * @returns {object} - Objeto com os dados do dispositivo.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o dispositivo não exista.
 * @throws {Error} - Caso o dispositivo já exista (hostname).
 * @throws {Error} - Caso o usuário não seja o dono do dispositivo.
 */
async function updateDevice(req, res) {
    try {
        // pega o uuid do usuário autenticado.
        const { uuid } = req;

        // pega o uuid do dispositivo.
        const { deviceUuid } = req.params;

        // pega os dados do body da requisição.
        const { hostname, port, username, password, typeDevice } = req.body;


        // atualiza o dispositivo.
        const device = await prisma.device.update({
            where: {
                uuid: deviceUuid
            },
            data: {
                hostname,
                port,
                username,
                password,
                typeDevice
            }
        });

        // retorna o dispositivo atualizado.
        res.json(device);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Dispositivo já cadastrado." });
        }

        if (error.code === "P2025") {
            return res.status(400).json({ error: "Dispositivo não cadastrado." });
        }

        if (error.code === "P2016") {
            return res.status(400).json({ error: "Usuário não é dono do dispositivo." });
        }

        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para deletar um dispositivo.
 * @async
 * @param {object} req - Objeto com os dados da requisição.
 * @param {object} res - Objeto com os dados da resposta.
 * @returns {object} - Objeto com os dados do dispositivo deletado.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o dispositivo não exista (404 - Not Found).
 * @throws {Error} - Caso o usuário não seja o dono do dispositivo (401 - Unauthorized).
 */
async function deleteDevice(req, res) {
    try {
        // pega o uuid do usuário autenticado.
        const { uuid } = req;

        // pega o uuid do dispositivo.
        const { deviceUuid } = req.params;


        // deleta o dispositivo se o uuid do usuário for igual ao uuid do usuário dono do dispositivo.
        const device = await prisma.device.findUnique({
            where: {
                uuid: deviceUuid
            }
        });

        // verifica se o dispositivo existe.
        if (!device) {
            return res.status(404).json({ error: "Dispositivo não cadastrado." });
        }

        // verifica se o usuário é o dono do dispositivo.
        if (device.userUuid !== uuid) {
            return res.status(401).json({ error: "Usuário não é dono do dispositivo." });
        }

        // deleta o dispositivo.
        await prisma.device.delete({
            where: {
                uuid: deviceUuid
            }
        });

        // retorna o dispositivo deletado.
        res.json(device);

    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


/**
 *Função para obter os dados de um dispositivo.
 * @async
 * @param {object} req - Objeto com os dados da requisição.
 * @param {object} res - Objeto com os dados da resposta.
 * @returns {object} - Objeto com os dados do dispositivo.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o dispositivo não exista.
 * @throws {Error} - Caso o usuário não seja o dono do dispositivo.
*/
async function getDevice(req, res) {
    try {
        // pega o uuid do usuário autenticado.
        const { uuid } = req;

        // pega o uuid do dispositivo.
        const { deviceUuid } = req.params;

        // busca o dispositivo.
        const device = await prisma.device.findUnique({
            where: {
                uuid: deviceUuid
            },
        });

        // verifica se o dispositivo existe.
        if (!device) {
            return res.status(404).json({ error: "Dispositivo não cadastrado." });
        }

        // verifica se o usuário é o dono do dispositivo.
        if (device.userUuid !== uuid) {
            return res.status(401).json({ error: "Usuário não é dono do dispositivo." });
        }

        // retorna o dispositivo.
        res.json(device);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

/**
 * Função para obter todos os dispositivos de um usuário.
 * @async
 * @param {object} req - Objeto com os dados da requisição.
 * @param {object} res - Objeto com os dados da resposta.
 * @returns {object} - Objeto com os dados do dispositivo.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso não exista nenhum dispositivo.
 */

async function getDevices(req, res) {
    try {
        // pega o uuid do usuário autenticado.
        const { uuid } = req;

        // busca os dispositivos.
        const devices = await prisma.device.findMany({
            where: {
                userUuid: uuid
            }
        });

        // verifica se existe algum dispositivo.
        if (devices.length === 0) {
            return res.status(404).json({ error: "Nenhum dispositivo cadastrado." });
        }

        // retorna os dispositivos.
        res.json(devices);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// exporta as funções do controller de dispositivos para serem usadas em outras partes do código.
export { createDevice, updateDevice, deleteDevice, getDevice, getDevices };