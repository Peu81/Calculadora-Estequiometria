import { AppError } from '../utils/AppError.js'

export class parserService {
    constructor() {
        this.regex = /([A-Z][a-z]*)(\d*)|(\()|(\))(\d*)/g;
    }

    async parseMolecule(formula) {
        await this._validarFormula(formula);

        const stack = [{}];
        let match;

        this.regex.lastIndex = 0;

        while ((match = this.regex.exec(formula)) !== null) {
            if (match[1]) {
                const elemento = match[1];
                const quantidade = parseInt(match[2] || "1", 10)
                const contextoAtual = stack[stack.length - 1];
                
                contextoAtual[elemento] = (contextoAtual[elemento] || 0) + quantidade;
            } else if (match[3]){
                stack.push({});
            } else if (match[4]) {
                if (stack.length === 1) {
                    throw new AppError(`Fórmula mal formatada: parênteses fechados sem ter sido aberto em '${formula}'`, 400);
                }
                
                const multiplicador = parseInt(match[5] || "1", 10);
                const contexto = stack.pop();
                const contextoAtual = stack[stack.length - 1];

                for (const [elemento, quantidade] of Object.entries(contexto)) {
                    contextoAtual[elemento] = (contextoAtual[elemento]) || 0 + (quantidade * multiplicador);
                }
            }
        }
        if (stack.length > 1) {
            throw new AppError(`Fórmula mal formatada: parênteses aberto e não fechado em '${formula}'`, 400);
        }
        return stack[0];
    }

    async parseEquation(stringEquacao) {
        if (!stringEquacao || typeof stringEquacao !== 'string') {
            throw new AppError("Equação não fornecida ou inválida", 400)
        }

        const cleanStr = stringEquacao.replace(/\s+/g, "");
        const partes = cleanStr.split(/->|=/);
        
        if (partes.length !== 2) {
            throw new AppError("Equação mal formatada. Use '->' ou '=' para separar reagentes de produtos.", 400);
          }

        return {
            reagentes: await this._extraiMoleculas(partes[0]),
            produtos: await this._extraiMoleculas(partes[1])
        }
    }

    async _extraiMoleculas(str) {
        if (!str) return [];

        const moleculas = str.split("+").map(async molecula => {
          const match = molecula.match(/^(\d*)(.*)$/);
          const coeficiente = parseInt(match[1] || "1", 10);
          const formula = match[2];
    
          return {
            formula,
            coeficiente,
            elementos: await this.parseMolecule(formula)
          };
        });
    
        return Promise.all(moleculas);
      };

    async _validarFormula(formula) {
        if (!formula || typeof formula !== 'string') {
            throw new AppError("Fórmula de molécula inválida", 400)
        }
    }

}