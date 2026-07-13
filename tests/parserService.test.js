import { parserService } from '../src/services/parserService.js';
import { AppError } from '../src/utils/AppError.js';

describe('ParserService', () => {
  let parseService;

  // Instancia um novo serviço antes de cada teste para garantir isolamento
  beforeEach(() => {
    parseService = new parserService();
  });

  describe('parseMolecule()', () => {
    it('deve parsear uma molécula simples sem números (NaCl)', async () => {
      const result = await parseService.parseMolecule('NaCl');
      expect(result).toEqual({ Na: 1, Cl: 1 });
    });

    it('deve parsear uma molécula com números de atomicidade (H2O)', async () => {
      const result = await parseService.parseMolecule('H2O');
      expect(result).toEqual({ H: 2, O: 1 });
    });

    it('deve lidar corretamente com parênteses simples (multiplicação distributiva)', async () => {
      const result = await parseService.parseMolecule('Ca(OH)2');
      expect(result).toEqual({ Ca: 1, O: 2, H: 2 });
    });

    it('deve lidar com parênteses mais complexos', async () => {
      const result = await parseService.parseMolecule('Al2(SO4)3');
      expect(result).toEqual({ Al: 2, S: 3, O: 12 });
    });

    it('deve lançar AppError se os parênteses não forem fechados corretamente', async () => {
      // No Jest, para testar erros em funções async, usamos reject
      await expect(parseService.parseMolecule('Ca(OH2'))
        .rejects
        .toBeInstanceOf(AppError);
        
      await expect(parseService.parseMolecule('Ca(OH2'))
        .rejects
        .toThrow("parênteses aberto e não fechado");
    });
  });

  describe('parseEquation()', () => {
    it('deve quebrar a equação identificando os coeficientes corretamente', async () => {
      const result = await parseService.parseEquation('1N2 + 3H2 -> 2NH3');
      
      expect(result.reagentes).toHaveLength(2);
      expect(result.produtos).toHaveLength(1);
      
      // Valida o reagente 3H2
      expect(result.reagentes[1].coeficiente).toBe(3);
      expect(result.reagentes[1].formula).toBe('H2');
      expect(result.reagentes[1].elementos).toEqual({ H: 2 });

      // Valida o produto 2NH3
      expect(result.produtos[0].coeficiente).toBe(2);
      expect(result.produtos[0].formula).toBe('NH3');
      expect(result.produtos[0].elementos).toEqual({ N: 1, H: 3 });
    });

    it('deve lidar com moléculas que não possuem coeficientes explícitos', async () => {
      const result = await parseService.parseEquation('N2 + O2 -> 2NO');
      
      // Quando não tem número na frente (N2), o coeficiente deve ser 1
      expect(result.reagentes[0].coeficiente).toBe(1);
      expect(result.reagentes[0].formula).toBe('N2');
    });

    it('deve lançar AppError se faltar o sinal de -> ou =', async () => {
      await expect(parseService.parseEquation('H2 + O2 H2O'))
        .rejects
        .toBeInstanceOf(AppError);
    });
  });
});