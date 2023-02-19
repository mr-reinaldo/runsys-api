import express from 'express';
import { login } from '../controllers/signin.controller.js';


const router = express.Router();

router.post('/', login);

export default router;