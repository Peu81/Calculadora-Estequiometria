# 🧪 API "Estequiometria"

Uma API RESTful desenvolvida em Node.js projetada para analisar, balancear e resolver cálculos estequiométricos passo a passo. 

Diferente de calculadoras químicas convencionais que apenas entregam o resultado final, esta API atua como um motor didático. Ela processa a equação, consulta massas atômicas e retorna o histórico completo de transformações matemáticas, permitindo que o frontend renderize a explicação detalhada do cálculo.

## 🚀 Tecnologias

* **Runtime:** Node.js
* **Framework:** Express.js
* **ORM:** Prisma
* **Banco de Dados:** SQLite (Focado em alta performance de leitura para a Tabela Periódica)

## 🏗️ Arquitetura do Sistema

O sistema foi desenhado separando a complexidade algorítmica da camada de roteamento, dividindo o motor em três serviços principais:

1. **Parser Service:** Responsável pela análise léxica. Utiliza Expressões Regulares (Regex) para quebrar strings químicas complexas (ex: `N2 + H2 -> NH3`) em uma Árvore de Sintaxe Abstrata (AST) contendo elementos e quantidades.
2. **Balancer Service:** O motor matemático. Trata o balanceamento químico computacionalmente como um sistema de equações lineares, aplicando métodos numéricos (como Eliminação de Gauss-Jordan) para encontrar os coeficientes exatos.
3. **Step Engine:** O orquestrador didático. Cruza a equação balanceada com as massas molares do banco de dados para montar a regra de três, gerando um histórico sequencial de eventos.

## 📁 Estrutura do Projeto

```text
/src
  ├── /controllers
  │   └── stoichiometryController.js  # Orquestra as requisições e respostas
  ├── /services
  │   ├── parserService.js            # Lógica de tokenização (Regex)
  │   ├── balancerService.js          # Resolução de matrizes (Balanceamento)
  │   └── stepEngineService.js        # Geração do payload "passo a passo"
  ├── /prisma
  │   ├── schema.prisma               # Modelagem do banco de dados (SQLite)
  │   └── seed.js                     # Script para popular os 118 elementos
  ├── /routes
  │   └── api.js                      # Definição dos endpoints
  └── server.js                       # Entry point da aplicação