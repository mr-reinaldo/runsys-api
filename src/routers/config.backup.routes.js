import express from 'express';
import { createBackup, deleteBackup, getBackup, getBackups } from '../controllers/config.backup.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();


// Rota para criar um backup.
router.post('/', isAuthenticated, createBackup);

// Rota para deletar um backup.
router.delete('/:uuid', isAuthenticated, deleteBackup);

// Rota para buscar um backup.
router.get('/:uuid', isAuthenticated, getBackup);

// Rota para buscar todos os backups.
router.get('/', isAuthenticated, getBackups);

export default router;
