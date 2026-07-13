import { describe, it, expect, beforeEach } from '@jest/globals';
import { balancerService } from '../src/services/balancerService.js';
import { AppError } from '../src/utils/AppError.js';

describe('BalancerService', () => {
  let balancer;

  beforeEach(() => {
    // Note que aqui estamos usando letra minúscula "balancerService" 
    // porque foi assim que a classe foi exportada no seu arquivo.
    balancer = new balancerService();
  });

  describe('Validação de Lavoisier', () => {
    it('deve lançar AppError se a equação tiver elementos mágicos surgindo ou sumindo', async () => {
      // Tentando fazer H2 + O2 -> NaCl
      const equacaoImpossivel = {
        reagentes: [
          { formula: 'H2', elementos: { H: 2 } },
          { formula: 'O2', elementos: { O: 2 } }
        ],
        produtos: [
          { formula: 'NaCl', elementos: { Na: 1, Cl: 1 } }
        ]
      };

      // Como o método balancear chama a validação, esperamos que estoure erro
      await expect(balancer.balancear(equacaoImpossivel))
        .rejects
        .toBeInstanceOf(AppError);

      await expect(balancer.balancear(equacaoImpossivel))
        .rejects
        .toThrow("viola a Lei de Lavoisier");
    });
  });

  describe('Algoritmo de Balanceamento (Matrizes)', () => {
    it('deve balancear a síntese da Amônia: N2 + H2 -> NH3', async () => {
      const equacaoNaoBalanceada = {
        reagentes: [
          { formula: 'N2', coeficiente: 1, elementos: { N: 2 } },
          { formula: 'H2', coeficiente: 1, elementos: { H: 2 } }
        ],
        produtos: [
          { formula: 'NH3', coeficiente: 1, elementos: { N: 1, H: 3 } }
        ]
      };

      const resultado = await balancer.balancear(equacaoNaoBalanceada);

      // Esperamos a proporção 1 N2 + 3 H2 -> 2 NH3
      expect(resultado.reagentes[0].coeficiente).toBe(1); // N2
      expect(resultado.reagentes[1].coeficiente).toBe(3); // H2
      expect(resultado.produtos[0].coeficiente).toBe(2);  // NH3
    });

    it('deve balancear a formação da Água: H2 + O2 -> H2O', async () => {
      const equacaoNaoBalanceada = {
        reagentes: [
          { formula: 'H2', coeficiente: 1, elementos: { H: 2 } },
          { formula: 'O2', coeficiente: 1, elementos: { O: 2 } }
        ],
        produtos: [
          { formula: 'H2O', coeficiente: 1, elementos: { H: 2, O: 1 } }
        ]
      };

      const resultado = await balancer.balancear(equacaoNaoBalanceada);

      // Esperamos a proporção 2 H2 + 1 O2 -> 2 H2O
      expect(resultado.reagentes[0].coeficiente).toBe(2); // H2
      expect(resultado.reagentes[1].coeficiente).toBe(1); // O2
      expect(resultado.produtos[0].coeficiente).toBe(2);  // H2O
    });
  });

  describe('_converteParaInteiro()', () => {
    it('deve multiplicar frações para encontrar os menores coeficientes inteiros', async () => {
      // 0.5 e 1.5 podem ser normalizados multiplicando por 2 -> viram 1 e 3.
      const solucoes = [0.5, 1.5, 1];
      const inteiros = await balancer._converteParaInteiro(solucoes);
      
      expect(inteiros).toEqual([1, 3, 2]);
    });

    it('deve lidar com dízimas periódicas (1/3)', async () => {
      // 0.3333333 e 0.6666666 multiplicados por 3 -> viram 1, 2 e 3.
      const solucoes = [1/3, 2/3, 1];
      const inteiros = await balancer._converteParaInteiro(solucoes);
      
      expect(inteiros).toEqual([1, 2, 3]);
    });
  });
});
