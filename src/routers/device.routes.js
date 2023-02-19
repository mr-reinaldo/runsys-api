import express from 'express';
import { createDevice, updateDevice, deleteDevice, getDevice, getDevices } from '../controllers/device.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';
const router = express.Router();

// Rota para criar um dispositivo.
router.post('/', isAuthenticated, createDevice);

// Rota para atualizar um dispositivo.
router.put('/:uuid', isAuthenticated, updateDevice);

// Rota para deletar um dispositivo.
router.delete('/:uuid', isAuthenticated, deleteDevice);

// Rota para buscar um dispositivo.
router.get('/:uuid', isAuthenticated, getDevice);

// Rota para buscar todos os dispositivos.
router.get('/', isAuthenticated, getDevices);

export default router;