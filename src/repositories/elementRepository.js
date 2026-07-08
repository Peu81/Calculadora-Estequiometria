export class elementoRepository {
    constructor(prisma) {
        this.prisma = prisma;
    };
    
    async buscaPorSimbolo(simbolo) {
        return await this.prisma.elemento.findUnique({
            where: {simbolo: simbolo}
        });
    };

    async buscaVariosSimbolos(simbolos) {
        return await this.prisma.elemento.findMany({
            where: {simbolo: {in: simbolos}}
        });
    };

    async listarTodos() {
        return await this.prisma.elemento.findMany()
    }

    async criarElementos(elementos) {
        return await this.prisma.elemento.createMany({
            data: elementos,
            skipDuplicates: true
        });
        
    }
}