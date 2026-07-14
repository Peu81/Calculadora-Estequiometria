import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { stepEngineService } from '../src/services/stepEngineService.js';
import { AppError } from '../src/utils/AppError.js';

describe('StepEngineService', () => {
    let stepEngine;
    let mockRepository;

    const equacaoAgua = {
        reagentes: [
            { formula: 'H2', coeficiente: 2, elementos: { H: 2 } },
            { formula: 'O2', coeficiente: 1, elementos: { O: 2 } }
        ],
        produtos: [
            { formula: 'H2O', coeficiente: 2, elementos: { H: 2, O: 1 } }
        ]
    };

    beforeEach(() => {
        mockRepository = {
            buscaVariosSimbolos: jest.fn()
        };
        stepEngine = new stepEngineService(mockRepository);
    });

    describe('gerarPassos()', () => {
        it('deve calcular corretamente a massa e retornar a estrutura de passos detalhada', async () => {
            mockRepository.buscaVariosSimbolos.mockResolvedValue([
                { simbolo: 'H', massaAtomica: 1 },
                { simbolo: 'O', massaAtomica: 16 }
            ]);

            const dadoProblema = {
                substanciaConhecida: 'H2',
                substanciaDesejada: 'H2O',
                valor: 4
            };

            const pergunta = { unidade: 'g' };

            const resultado = await stepEngine.gerarPassos(equacaoAgua, dadoProblema, pergunta);

            expect(mockRepository.buscaVariosSimbolos).toHaveBeenCalled();

            expect(resultado.equacaoBalanceada).toBe("2 H2 + 1 O2 --> 2 H2O");

            expect(resultado.passos).toHaveLength(4);

            const passoResultado = resultado.passos.find(p => p.ordem === 4);
            expect(passoResultado.titulo).toBe("Resultado Final");
            expect(passoResultado.resultado).toBe(36);
            expect(passoResultado.unidade).toBe("g");
        });

        it('deve lançar AppError 400 se os dados do problema não forem fornecidos', async () => {
            await expect(stepEngine.gerarPassos(equacaoAgua, null, null))
                .rejects
                .toBeInstanceOf(AppError);

            await expect(stepEngine.gerarPassos(equacaoAgua, null, null))
                .rejects
                .toThrow("Dados do problema ou pergunta não fornecidos.");
        });

        it('deve lançar AppError 404 se um elemento da equação não existir no banco de dados', async () => {
            mockRepository.buscaVariosSimbolos.mockResolvedValue([
                { simbolo: 'H', massaAtomica: 1 }
            ]);

            const dadoProblema = {
                substanciaConhecida: 'H2',
                substanciaDesejada: 'H2O',
                valor: 4
            };

            await expect(stepEngine.gerarPassos(equacaoAgua, dadoProblema, {}))
                .rejects
                .toThrow("Um ou mais elementos da equação não foram encontrados no banco de dados.");
        });

        it('deve lançar AppError 500 se pedir uma substância que não existe na equação', async () => {
            mockRepository.buscaVariosSimbolos.mockResolvedValue([
                { simbolo: 'H', massaAtomica: 1 },
                { simbolo: 'O', massaAtomica: 16 }
            ]);

            const dadoProblema = {
                substanciaConhecida: 'H2',
                substanciaDesejada: 'NaCl', 
                valor: 4
            };

            await expect(stepEngine.gerarPassos(equacaoAgua, dadoProblema, {}))
                .rejects
                .toThrow("Não foi possível calcular a massa.");
        });
    });
});