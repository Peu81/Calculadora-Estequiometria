import 'dotenv/config';
import express from 'express';
import  router  from './routes/api.js';


const app = express();

app.use(express.json());

app.use('/api', router);

const porta = 3000;
app.listen(porta);