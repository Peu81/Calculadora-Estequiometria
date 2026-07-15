export class stoichiometryController {
    constructor(parserService, balancerService, stepEngineService) {
        this.parser = parserService;
        this.balancer = balancerService;
        this.stepEngine = stepEngineService;
    }

    async calcular(req, res) {
        try {
            const {equacao, dadoProblema, pergunta} = req.body;

            if (!equacao || !dadoProblema || !pergunta) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Dados incompletos. Envie 'equacao', 'dadoProblema' e 'pergunta'."
                });
            }
    
            const equacaoParseada = await this.parser.parseEquation(equacao);
            const equacaoBalanceada = await this.balancer.balancear(equacaoParseada);
            const resultadoFinal = await this.stepEngine.gerarPassos(equacaoBalanceada, dadoProblema, pergunta);
    
            return res.status(200).json({
                sucesso: true,
                dados: resultadoFinal
            });

        } catch (error) {
            const statusCode = error.statusCode || 500;

            if (statusCode === 500) {
                console.error("Erro interno:", error);
            }
            
            return res.status(statusCode).json({
                sucesso: false,
                erro: error.message || "Erro interno do servidor."
            });
        }

    }
}