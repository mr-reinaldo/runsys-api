import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';


import userRoutes from './routers/user.routes.js';
import deviceRoutes from './routers/device.routes.js';
import configBackupRoutes from './routers/config.backup.routes.js';
import signinRoutes from './routers/signin.routes.js';

import swaggerFile from './swagger.json' assert { type: 'json' };

// Configuração do dotenv.
dotenv.config();

// Configuração do express.
const app = express();

// Configuração do CORS.
app.use(cors());
// Configuração do morgan.
app.use(morgan('dev'));
// Configuração do express para receber JSON.
app.use(express.json());
// Configuração do express para receber dados de formulário.
app.use(express.urlencoded({ extended: true }));

// Rota para documentação da API.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    customSiteTitle: 'API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
}));

// Definição da versão da API. (pode ser movido para um arquivo de configuração futuramente).
const API_VERSION = '/api/v1';

// Rotas da API.
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/devices`, deviceRoutes);
app.use(`${API_VERSION}/config-backups`, configBackupRoutes);
app.use(`${API_VERSION}/signin`, signinRoutes);



app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
}).on('error', (error) => {
    console.log(error);
});
