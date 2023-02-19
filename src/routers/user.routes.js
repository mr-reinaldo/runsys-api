import express from 'express';
import { createUser, updateUser, deleteUser, getUser, getUsers } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Rota para retornar os dados do usuário autenticado do isAuthenticated.
router.get('/me', isAuthenticated, (req, res) => {
    res.json({
        uuid: req.uuid,
        email: req.email,
    });
});

// Rota para criar um usuário.
router.post('/', createUser);

// Rota para retornar todos os usuários.
router.get('/', isAuthenticated, getUsers);

// Rota para retornar um usuário específico.
router.get('/:uuid', isAuthenticated, getUser);

// Rota para atualizar e deletar um usuário específico.
router.put('/:uuid', isAuthenticated, updateUser);

// Rota para deletar um usuário específico.
router.delete('/:uuid', isAuthenticated, deleteUser);



export default router;