import e from 'express';
import {AppError} from './utils/AppError.js';

export class balancerService {

    async balancear(equacao) {
        const {reagentes, produtos} = equacao;
        const moleculas = [...reagentes, ...produtos];

        const elemento = new Set();
        moleculas.forEach(mol => {
            Object.keys(mol.elementos).forEach(el => elemento.add(el));
        });

        const listaElementos = Array.from(elemento);

        this._validaConservacaoDasMassas(listaElementos, reagentes, produtos);
        const matriz = this._constroiMatriz(listaElementos, reagentes, produtos);
        const solucoesFracionarias = this._resolverSistemaLinear(matriz);
        const coeficientesInteiros = this._converteParaInteiro(solucoesFracionarias);

        reagentes.forEach((mol, i) => {
            mol.coeficiente = coeficientesInteiros[i];
        });

        produtos.forEach((mol, i) => {
            const indexSolucao = reagentes.length + i;
            mol.coeficiente = coeficientesInteiros[indexSolucao];
        });

        return equacao;
    }

    async _constroiMatriz(listaElementos, reagentes, produtos) {
        const totalMoleculas = reagentes.length + produtos.length;

        return listaElementos.map(elemento => {
            const linha = [];

            reagentes.forEach(mol => {
                linha.push(mol.elementos[elemento] || 0);
            });

            produtos.forEach(mol => {
                linha.push(-(mol.elementos[elemento]) || 0);
            });

            return linha;
        });
    };

    async _resolverSistemaLinear(matriz) {
        const numLinhas = matriz.length;
        const numColunas = matriz[0].length;

        const solucoes = new Array(numColunas).fill(0);
        solucoes[numColunas - 1] = 1;

        for (let i = 0; i < numLinhas; i++) {
            matriz[i][numColunas - 1] = -matriz[i][numColunas - 1];
        };
        
        for (let i = 0; i < Math.min(numLinhas, numColunas - 1); i++) {
            let linhaPivo = i;
            while (linhaPivo < numLinhas && matriz[linhaPivo][i] === 0) {
                linhaPivo++
            };
            if (linhaPivo === numLinhas) continue;
        };

            if (linhaPivo !== i) {
                const temp = matriz[i];
                matriz[i] = matriz[linhaPivo];
                matriz[linhaPivo] = temp;
            };

            for (let j = i + 1; j < numLinhas; j++) {
                const fator = matriz[j][i] / matriz[i][i]
                for (let k = i; k < numColunas; k++) {
                    matriz[j][k] -= fator * matriz[i][k]
                }
            };
    
        for (let i = Math.min(numLinhas, numColunas-2)-1; i >= 0; i--) {
            let soma = 0;
            for (let j = i+1; j < numColunas-1; j++) {
                soma += matriz[i][j] * solucoes[j];
            };
            if (matriz[i][i] === 0) {
                if (matriz[i][numColunas-1] - soma !== 0) {
                    throw new AppError("Equação quimicamente impossível de ser balanceada.", 422);
                }
                solucoes[i] = 1;
            } else {
                solucoes[i] = (matriz[i][numColunas - 1] - soma) / matriz[i][i];
            }

        };
    return solucoes;
    };

    async _converteParaInteiro(solucoesFracionarias) {
        const precisao = 0.0001;

        for (let multiplicador = 1; multiplicador <= 100; multiplicador++) {
            const ehInteiro = solucoesFracionarias.every(valor => {
                const num = valor * multiplicador;
                return Math.abs(num - Math.round(num)) < precisao;
            });
            if (ehInteiro) {
                return solucoesFracionarias.map(valor => Math.round(valor * multiplicador));
            }
        }
        throw new AppError("Não foi possível balancear a equação (coeficientes muito complexos).", 422);
    }

    async _validaConservacaoDasMassas(listaElementos, reagentes, produtos) {
        for (const elemento of listaElementos) {
            const temNoReagente = reagentes.some(mol => mol.elementos[elemento]);
            const temNoProduto = produtos.some(mol => mol.elementos[elemento]);

            if (!temNoReagente || !temNoProduto) {
                throw new AppError(`A equação viola a Lei de Lavoisier. O elemento '${elemento}' não aparece nos dois lados.`, 400);             
            };
        };
    };
};