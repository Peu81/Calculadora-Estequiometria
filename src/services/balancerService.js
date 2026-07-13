import { AppError } from '../utils/AppError.js';

export class balancerService {
    async balancear(equacao) {
        if (!equacao || !equacao.reagentes || !equacao.produtos) {
            throw new AppError("Equação inválida: faltam reagentes ou produtos.", 400);
        }

        const { reagentes, produtos } = equacao;
        const moleculas = [...reagentes, ...produtos];

        const elementoSet = new Set();
        moleculas.forEach(mol => {
            if (mol.elementos) {
                Object.keys(mol.elementos).forEach(el => elementoSet.add(el));
            }
        });

        const listaElementos = Array.from(elementoSet);

        if (listaElementos.length === 0) {
            throw new AppError("A equação não contém elementos químicos reconhecíveis.", 400);
        }

        await this._validaConservacaoDasMassas(listaElementos, reagentes, produtos);
        const matriz = await this._constroiMatriz(listaElementos, reagentes, produtos);
        const solucoesFracionarias = await this._resolverSistemaLinear(matriz);
        const coeficientesInteiros = await this._converteParaInteiro(solucoesFracionarias);

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
        return listaElementos.map(elemento => {
            const linha = [];
            reagentes.forEach(mol => {
                linha.push(mol.elementos[elemento] || 0);
            });
            produtos.forEach(mol => {
                linha.push(-(mol.elementos[elemento] || 0));
            });
            return linha;
        });
    }

    async _resolverSistemaLinear(matriz) {
        const numLinhas = matriz.length;
        const numColunas = matriz[0].length;

        const solucoes = new Array(numColunas).fill(0);
        solucoes[numColunas - 1] = 1;

        const RHS = [];
        for (let i = 0; i < numLinhas; i++) {
            RHS[i] = -matriz[i][numColunas - 1];
        }


        const n = numColunas - 1;
        const A = matriz.map(linha => linha.slice(0, n));


        for (let i = 0; i < Math.min(numLinhas, n); i++) {
            let linhaPivo = i;
            while (linhaPivo < numLinhas && Math.abs(A[linhaPivo][i]) < 1e-10) {
                linhaPivo++;
            }
            if (linhaPivo === numLinhas) continue;

            [A[i], A[linhaPivo]] = [A[linhaPivo], A[i]];
            [RHS[i], RHS[linhaPivo]] = [RHS[linhaPivo], RHS[i]];

            for (let j = 0; j < numLinhas; j++) {
                if (i !== j) {
                    const fator = A[j][i] / A[i][i];
                    for (let k = i; k < n; k++) {
                        A[j][k] -= fator * A[i][k];
                    }
                    RHS[j] -= fator * RHS[i];
                }
            }
        }


        for (let i = 0; i < n; i++) {
            if (Math.abs(A[i][i]) > 1e-10) {
                solucoes[i] = RHS[i] / A[i][i];
            } else {
                solucoes[i] = 1; 
            }
        }

        return solucoes;
    }

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
        throw new AppError("Coeficientes muito complexos.", 422);
    }

    async _validaConservacaoDasMassas(listaElementos, reagentes, produtos) {
        for (const elemento of listaElementos) {
            const temNoReagente = reagentes.some(mol => mol.elementos && mol.elementos[elemento]);
            const temNoProduto = produtos.some(mol => mol.elementos && mol.elementos[elemento]);

            if (!temNoReagente || !temNoProduto) {
                throw new AppError(`A equação viola a Lei de Lavoisier. O elemento '${elemento}' não aparece nos dois lados.`, 400);
            }
        }
    }
}