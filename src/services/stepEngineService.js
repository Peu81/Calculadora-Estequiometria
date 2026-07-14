import { AppError } from '../utils/AppError.js';

export class stepEngineService {
    constructor(elementRepository) {
        this.repository = elementRepository;
    };

    async gerarPassos(equacaoBalanceada, dadoProblema, pergunta) {
        if (!dadoProblema || !pergunta) {
            throw new AppError("Dados do problema ou pergunta não fornecidos.", 400);
        };

        const elementosUnicos = new Set();
        const todasMoleculas = [...equacaoBalanceada.reagentes, ...equacaoBalanceada.produtos];

        todasMoleculas.forEach(mol => {
            Object.keys(mol.elementos).forEach(el => elementosUnicos.add(el));
        });

        const massasBanco = await this.repository.buscaVariosSimbolos(Array.from(elementosUnicos));

        if (massasBanco.length !== elementosUnicos.size) {
            throw new AppError("Um ou mais elementos da equação não foram encontrados no banco de dados.", 404);
        };

        const dicionarioMassas = {};
        massasBanco.forEach(el => {
            dicionarioMassas[el.simbolo] = el.massaAtomica;
        });

        const molConhecida = this._encontrarMolecula(todasMoleculas, dadoProblema.substanciaConhecida);
        const molDesejada = this._encontrarMolecula(todasMoleculas, dadoProblema.substanciaDesejada);
        const mmConhecida = this._calcularMassaMolar(molConhecida, dicionarioMassas);
        const mmDesejada = this._calcularMassaMolar(molDesejada, dicionarioMassas);

        const propMassaConhecida = molConhecida.coeficiente * mmConhecida;
        const propMassaDesejada = molDesejada.coeficiente * mmDesejada;

        const resultadoFinal = (dadoProblema.valor * propMassaDesejada) / propMassaConhecida;

        return {
            equacaoBalanceada: this._formatarEquacao(equacaoBalanceada),
            passos: [
                {
                    ordem: 1,
                    titulo: "Cálculo das massas molares",
                    descricao: `${molConhecida.formula} = ${mmConhecida.toFixed(2)} g/mol, ${molDesejada.formula} = ${mmDesejada.toFixed(2)} g/mol.`
                },
                {
                    ordem: 2,
                    titulo: "Proporção estequiométrica",
                    descricao: `${molConhecida.coeficiente} mol de ${molConhecida.formula} (${propMassaConhecida.toFixed(2)}g.) está para ${molDesejada.coeficiente} (${propMassaDesejada.toFixed(2)}g).`
                },
                {
                    ordem: 3,
                    titulo: "Regra de três",
                    descricao: `${propMassaConhecida.toFixed(2)} * x = ${dadoProblema.valor} * ${propMassaDesejada.toFixed(2)}.`
                },
                {
                    ordem: 4,
                    titulo: "Resultado Final",
                    resultado: Number(resultadoFinal.toFixed(2)),
                    unidade: pergunta.unidade || "g"
                }
            ]
        };

    }

    _encontrarMolecula(todasMoleculas, formulaBuscada) {
        return todasMoleculas.find(mol => mol.formula === formulaBuscada);
    }

    _calcularMassaMolar(molecula, dicionarioMassas) {
        if (!molecula || !molecula.elementos) {
            throw new AppError(`Não foi possível calcular a massa. A molécula ${molecula?.formula || ''} não possui a propriedade 'elementos'.`, 500);
        }

        let massaTotal = 0;
        for (const [elemento, quantidade] of Object.entries(molecula.elementos)) {
            const massaAtomica = dicionarioMassas[elemento];
            if (!massaAtomica ) {
                throw new AppError(`A massa atômica do elemento ${elemento} não foi encontrada.`, 404);                
            }
            massaTotal += massaAtomica * quantidade;
        }
        return massaTotal;
    }

    _formatarEquacao(equacao) {
        const formataLado = (lado) => lado.map(mol => `${mol.coeficiente} ${mol.formula}`).join(" + ");
        return `${formataLado(equacao.reagentes)} --> ${formataLado(equacao.produtos)}`; 
    }
}