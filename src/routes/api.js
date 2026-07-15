import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import {Router} from 'express';
import {parserService} from '../services/parserService.js';
import {balancerService} from '../services/balancerService.js'; 
import {stepEngineService} from '../services/stepEngineService.js'; 
import {stoichiometryController} from '../controllers/stoichiometryController.js';
import {elementoRepository} from '../repositories/elementRepository.js';

const router = Router();

const repository = new elementoRepository(prisma);
const parser = new parserService();
const balancer = new balancerService();
const stepEngine = new stepEngineService(repository);

const calculatorController = new stoichiometryController(parser, balancer, stepEngine);

router.post('/calcular', calculatorController.calcular.bind(calculatorController));

export default router;

