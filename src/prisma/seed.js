import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tabelaPeriodica = [
    { simbolo: 'H', nome: 'Hidrogênio', massaAtomica: 1.008 },
    { simbolo: 'He', nome: 'Hélio', massaAtomica: 4.0026 },
    { simbolo: 'Li', nome: 'Lítio', massaAtomica: 6.94 },
    { simbolo: 'Be', nome: 'Berílio', massaAtomica: 9.0122 },
    { simbolo: 'B', nome: 'Boro', massaAtomica: 10.81 },
    { simbolo: 'C', nome: 'Carbono', massaAtomica: 12.011 },
    { simbolo: 'N', nome: 'Nitrogênio', massaAtomica: 14.007 },
    { simbolo: 'O', nome: 'Oxigênio', massaAtomica: 15.999 },
    { simbolo: 'F', nome: 'Flúor', massaAtomica: 18.998 },
    { simbolo: 'Ne', nome: 'Neônio', massaAtomica: 20.180 },
    { simbolo: 'Na', nome: 'Sódio', massaAtomica: 22.990 },
    { simbolo: 'Mg', nome: 'Magnésio', massaAtomica: 24.305 },
    { simbolo: 'Al', nome: 'Alumínio', massaAtomica: 26.982 },
    { simbolo: 'Si', nome: 'Silício', massaAtomica: 28.085 },
    { simbolo: 'P', nome: 'Fósforo', massaAtomica: 30.974 },
    { simbolo: 'S', nome: 'Enxofre', massaAtomica: 32.06 },
    { simbolo: 'Cl', nome: 'Cloro', massaAtomica: 35.45 },
    { simbolo: 'Ar', nome: 'Argônio', massaAtomica: 39.95 },
    { simbolo: 'K', nome: 'Potássio', massaAtomica: 39.098 },
    { simbolo: 'Ca', nome: 'Cálcio', massaAtomica: 40.078 },
    { simbolo: 'Sc', nome: 'Escândio', massaAtomica: 44.956 },
    { simbolo: 'Ti', nome: 'Titânio', massaAtomica: 47.867 },
    { simbolo: 'V', nome: 'Vanádio', massaAtomica: 50.942 },
    { simbolo: 'Cr', nome: 'Cromo', massaAtomica: 51.996 },
    { simbolo: 'Mn', nome: 'Manganês', massaAtomica: 54.938 },
    { simbolo: 'Fe', nome: 'Ferro', massaAtomica: 55.845 },
    { simbolo: 'Co', nome: 'Cobalto', massaAtomica: 58.933 },
    { simbolo: 'Ni', nome: 'Níquel', massaAtomica: 58.693 },
    { simbolo: 'Cu', nome: 'Cobre', massaAtomica: 63.546 },
    { simbolo: 'Zn', nome: 'Zinco', massaAtomica: 65.38 },
    { simbolo: 'Ga', nome: 'Gálio', massaAtomica: 69.723 },
    { simbolo: 'Ge', nome: 'Germânio', massaAtomica: 72.630 },
    { simbolo: 'As', nome: 'Arsênio', massaAtomica: 74.922 },
    { simbolo: 'Se', nome: 'Selênio', massaAtomica: 78.971 },
    { simbolo: 'Br', nome: 'Bromo', massaAtomica: 79.904 },
    { simbolo: 'Kr', nome: 'Criptônio', massaAtomica: 83.798 },
    { simbolo: 'Rb', nome: 'Rubídio', massaAtomica: 85.468 },
    { simbolo: 'Sr', nome: 'Estrôncio', massaAtomica: 87.62 },
    { simbolo: 'Y', nome: 'Ítrio', massaAtomica: 88.906 },
    { simbolo: 'Zr', nome: 'Zircônio', massaAtomica: 91.224 },
    { simbolo: 'Nb', nome: 'Nióbio', massaAtomica: 92.906 },
    { simbolo: 'Mo', nome: 'Molibdênio', massaAtomica: 95.95 },
    { simbolo: 'Tc', nome: 'Tecnécio', massaAtomica: 98 },
    { simbolo: 'Ru', nome: 'Rutênio', massaAtomica: 101.07 },
    { simbolo: 'Rh', nome: 'Ródio', massaAtomica: 102.91 },
    { simbolo: 'Pd', nome: 'Paládio', massaAtomica: 106.42 },
    { simbolo: 'Ag', nome: 'Prata', massaAtomica: 107.87 },
    { simbolo: 'Cd', nome: 'Cádmio', massaAtomica: 112.41 },
    { simbolo: 'In', nome: 'Índio', massaAtomica: 114.82 },
    { simbolo: 'Sn', nome: 'Estanho', massaAtomica: 118.71 },
    { simbolo: 'Sb', nome: 'Antimônio', massaAtomica: 121.76 },
    { simbolo: 'Te', nome: 'Telúrio', massaAtomica: 127.60 },
    { simbolo: 'I', nome: 'Iodo', massaAtomica: 126.90 },
    { simbolo: 'Xe', nome: 'Xenônio', massaAtomica: 131.29 },
    { simbolo: 'Cs', nome: 'Césio', massaAtomica: 132.91 },
    { simbolo: 'Ba', nome: 'Bário', massaAtomica: 137.33 },
    { simbolo: 'La', nome: 'Lantânio', massaAtomica: 138.91 },
    { simbolo: 'Ce', nome: 'Cério', massaAtomica: 140.12 },
    { simbolo: 'Pr', nome: 'Praseodímio', massaAtomica: 140.91 },
    { simbolo: 'Nd', nome: 'Neodímio', massaAtomica: 144.24 },
    { simbolo: 'Pm', nome: 'Promécio', massaAtomica: 145 },
    { simbolo: 'Sm', nome: 'Samário', massaAtomica: 150.36 },
    { simbolo: 'Eu', nome: 'Európio', massaAtomica: 151.96 },
    { simbolo: 'Gd', nome: 'Gadolínio', massaAtomica: 157.25 },
    { simbolo: 'Tb', nome: 'Térbio', massaAtomica: 158.93 },
    { simbolo: 'Dy', nome: 'Disprósio', massaAtomica: 162.50 },
    { simbolo: 'Ho', nome: 'Hólmio', massaAtomica: 164.93 },
    { simbolo: 'Er', nome: 'Érbio', massaAtomica: 167.26 },
    { simbolo: 'Tm', nome: 'Túlio', massaAtomica: 168.93 },
    { simbolo: 'Yb', nome: 'Itérbio', massaAtomica: 173.05 },
    { simbolo: 'Lu', nome: 'Lutécio', massaAtomica: 174.97 },
    { simbolo: 'Hf', nome: 'Háfnio', massaAtomica: 178.49 },
    { simbolo: 'Ta', nome: 'Tântalo', massaAtomica: 180.95 },
    { simbolo: 'W', nome: 'Tungstênio', massaAtomica: 183.84 },
    { simbolo: 'Re', nome: 'Rênio', massaAtomica: 186.21 },
    { simbolo: 'Os', nome: 'Ósmio', massaAtomica: 190.23 },
    { simbolo: 'Ir', nome: 'Irídio', massaAtomica: 192.22 },
    { simbolo: 'Pt', nome: 'Platina', massaAtomica: 195.08 },
    { simbolo: 'Au', nome: 'Ouro', massaAtomica: 196.97 },
    { simbolo: 'Hg', nome: 'Mercúrio', massaAtomica: 200.59 },
    { simbolo: 'Tl', nome: 'Tálio', massaAtomica: 204.38 },
    { simbolo: 'Pb', nome: 'Chumbo', massaAtomica: 207.2 },
    { simbolo: 'Bi', nome: 'Bismuto', massaAtomica: 208.98 },
    { simbolo: 'Po', nome: 'Polônio', massaAtomica: 209 },
    { simbolo: 'At', nome: 'Astato', massaAtomica: 210 },
    { simbolo: 'Rn', nome: 'Radônio', massaAtomica: 222 },
    { simbolo: 'Fr', nome: 'Frâncio', massaAtomica: 223 },
    { simbolo: 'Ra', nome: 'Rádio', massaAtomica: 226 },
    { simbolo: 'Ac', nome: 'Actínio', massaAtomica: 227 },
    { simbolo: 'Th', nome: 'Tório', massaAtomica: 232.04 },
    { simbolo: 'Pa', nome: 'Protactínio', massaAtomica: 231.04 },
    { simbolo: 'U', nome: 'Urânio', massaAtomica: 238.03 },
    { simbolo: 'Np', nome: 'Netúnio', massaAtomica: 237 },
    { simbolo: 'Pu', nome: 'Plutônio', massaAtomica: 244 },
    { simbolo: 'Am', nome: 'Amerício', massaAtomica: 243 },
    { simbolo: 'Cm', nome: 'Cúrio', massaAtomica: 247 },
    { simbolo: 'Bk', nome: 'Berquélio', massaAtomica: 247 },
    { simbolo: 'Cf', nome: 'Califórnio', massaAtomica: 251 },
    { simbolo: 'Es', nome: 'Einstênio', massaAtomica: 252 },
    { simbolo: 'Fm', nome: 'Férmio', massaAtomica: 257 },
    { simbolo: 'Md', nome: 'Mendelévio', massaAtomica: 258 },
    { simbolo: 'No', nome: 'Nobélio', massaAtomica: 259 },
    { simbolo: 'Lr', nome: 'Laurêncio', massaAtomica: 266 },
    { simbolo: 'Rf', nome: 'Rutherfórdio', massaAtomica: 267 },
    { simbolo: 'Db', nome: 'Dúbnio', massaAtomica: 268 },
    { simbolo: 'Sg', nome: 'Seabórgio', massaAtomica: 269 },
    { simbolo: 'Bh', nome: 'Bóhrio', massaAtomica: 270 },
    { simbolo: 'Hs', nome: 'Hássio', massaAtomica: 277 },
    { simbolo: 'Mt', nome: 'Meitnério', massaAtomica: 278 },
    { simbolo: 'Ds', nome: 'Darmstádtio', massaAtomica: 281 },
    { simbolo: 'Rg', nome: 'Roentgênio', massaAtomica: 282 },
    { simbolo: 'Cn', nome: 'Copernício', massaAtomica: 285 },
    { simbolo: 'Nh', nome: 'Nihônio', massaAtomica: 286 },
    { simbolo: 'Fl', nome: 'Fleróvio', massaAtomica: 289 },
    { simbolo: 'Mc', nome: 'Moscóvio', massaAtomica: 290 },
    { simbolo: 'Lv', nome: 'Livermório', massaAtomica: 293 },
    { simbolo: 'Ts', nome: 'Tenessino', massaAtomica: 294 },
    { simbolo: 'Og', nome: 'Oganessônio', massaAtomica: 294 }
];

async function main() {
    console.log('🌱 Iniciando o seed da Tabela Periódica...');

    for (const elemento of tabelaPeriodica) {
        // O upsert cria se não existir, ou atualiza se já existir (evita duplicidade)
        await prisma.elemento.upsert({
            where: { simbolo: elemento.simbolo },
            update: elemento,
            create: elemento,
        });
    }

    console.log(`✅ Seed concluído! ${tabelaPeriodica.length} elementos cadastrados.`);
}

main()
    .catch((e) => {
        console.error('❌ Erro ao popular banco de dados:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });