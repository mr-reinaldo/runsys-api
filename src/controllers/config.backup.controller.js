import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Função para criar um backup de configuração.
 * @param {object} backup - Objeto com os dados do backup.
 * @returns {object} - Objeto com os dados do backup.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o dispositivo não exista.
 * @throws {Error} - Caso o backup já exista.
 * @throws {Error} - Caso o backup não seja criado.
 */

async function createBackup(req, res) {
    const { device_uuid, config } = req.body;

    try {
        const device = await prisma.device.findUnique({
            where: {
                uuid: String(device_uuid),
            },
        });

        if (!device) {
            return res.status(404).json({ error: "Dispositivo não encontrado." });
        }

        const backup = await prisma.backup.create({
            data: {
                config,
                device: {
                    connect: {
                        uuid: device_uuid
                    }
                }
            }
        });

        return res.status(201).json(backup);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Backup já cadastrado." });
        }

        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para buscar um backup de configuração.
 * @param {string} uuid - UUID do backup.
 * @returns {object} - Objeto com os dados do backup.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o backup não exista.
 */

async function getBackup(req, res) {
    const { uuid } = req.params;

    try {
        const backup = await prisma.backup.findUnique({
            where: {
                uuid: String(uuid),
            },
        });

        if (!backup) {
            return res.status(404).json({ error: "Backup não encontrado." });
        }

        return res.status(200).json(backup);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para buscar todos os backups de configuração.
 * @returns {object} - Objeto com os dados dos backups.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso não exista nenhum backup.
 * @throws {Error} - Caso o backup não seja criado.
 */

async function getBackups(req, res) {
    try {
        const backups = await prisma.backup.findMany();

        if (!backups) {
            return res.status(404).json({ error: "Nenhum backup encontrado." });
        }

        return res.status(200).json(backups);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Função para deletar um backup de configuração.
 * @param {string} uuid - UUID do backup.
 * @returns {object} - Objeto com os dados do backup deletado.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso o backup não exista.
 */

async function deleteBackup(req, res) {
    const { uuid } = req.params;

    try {
        const backup = await prisma.backup.findUnique({
            where: {
                uuid: String(uuid),
            },
        });

        if (!backup) {
            return res.status(404).json({ error: "Backup não encontrado." });
        }

        const deletedBackup = await prisma.backup.delete({
            where: {
                uuid: String(uuid),
            },
        });

        return res.status(200).json(deletedBackup);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export { createBackup, getBackup, getBackups, deleteBackup };