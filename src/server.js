import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import userRoutes from './routers/user.routes.js';
import deviceRoutes from './routers/device.routes.js';
import configBackupRoutes from './routers/config.backup.routes.js';
import signinRoutes from './routers/signin.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);
app.use('/devices', deviceRoutes);
app.use('/backups', configBackupRoutes);
app.use('/signin', signinRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
}).on('error', (error) => {
    console.log(error);
});
