import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function createDevice(req, res) {
    // pega o uuid do usuário autenticado.
    const { uuid } = req;

    // pega os dados do body da requisição.
    const { hostname, port, username, password, typeDevice } = req.body;

    // cria um novo dispositivo.
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

async function updateDevice(req, res) {
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
            typeDevice,
            user: {
                connect: {
                    uuid
                }
            }
        }
    });

    // retorna o dispositivo atualizado.
    res.json(device);
}

async function deleteDevice(req, res) {
    // pega o uuid do usuário autenticado.
    const { uuid } = req;

    // pega o uuid do dispositivo.
    const { deviceUuid } = req.params;

    // deleta o dispositivo.
    const device = await prisma.device.delete({
        where: {
            uuid: deviceUuid
        }
    });

    // retorna o dispositivo deletado.
    res.json(device);
}

async function getDevice(req, res) {
    // pega o uuid do usuário autenticado.
    const { uuid } = req;

    // pega o uuid do dispositivo.
    const { deviceUuid } = req.params;

    // retorna o dispositivo.
    const device = await prisma.device.findUnique({
        where: {
            uuid: deviceUuid
        }
    });

    // retorna o dispositivo.
    res.json(device);
}

async function getDevices(req, res) {
    // pega o uuid do usuário autenticado.
    const { uuid } = req;

    // retorna todos os dispositivos.
    const devices = await prisma.device.findMany({
        where: {
            user: {
                uuid
            }
        }
    });

    // retorna todos os dispositivos.
    res.json(devices);
}

export { createDevice, updateDevice, deleteDevice, getDevice, getDevices };