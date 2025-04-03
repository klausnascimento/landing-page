### Aqui está um schema.prisma inicial que cobre os principais aspectos do seu sistema:

Este schema define os principais modelos do sistema, incluindo `Servidor`, `Usuario`, `Documento`, `Notificacao`, `FiltroPesquisa`, `Relatorio`, `HistoricoPerfil`, `Curso` e `IntegracaoSistema`. Ele cobre os aspectos de cadastro, gestão de perfis, permissões, notificações, pesquisa avançada, relatórios, histórico de alterações, cursos e integrações com outros sistemas.

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model Servidor {
id String @id @default(uuid())
nome String
email String @unique
cpf String @unique
cargo String
formacaoAcademica String
competencias String[]
idiomas String[]
experiencia String?
documentos Documento[]
historico HistoricoPerfil[]
usuario Usuario @relation(fields: [usuarioId], references: [id])
usuarioId String @unique
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

Notificacao Notificacao[]

Curso Curso[]
}

model Usuario {
id String @id @default(uuid())
email String @unique
senha String
perfil PerfilAcesso
servidor Servidor?

FiltroPesquisa FiltroPesquisa[]

Relatorio Relatorio[]
}

enum PerfilAcesso {
SERVIDOR
GESTOR
}

model Documento {
id String @id @default(uuid())
nome String
tipo String
url String
servidor Servidor @relation(fields: [servidorId], references: [id])
servidorId String
createdAt DateTime @default(now())
}

model Notificacao {
id String @id @default(uuid())
mensagem String
servidor Servidor @relation(fields: [servidorId], references: [id])
servidorId String
lida Boolean @default(false)
createdAt DateTime @default(now())
}

model FiltroPesquisa {
id String @id @default(uuid())
nome String
criterios Json
criadoPor Usuario @relation(fields: [usuarioId], references: [id])
usuarioId String
createdAt DateTime @default(now())
}

model Relatorio {
id String @id @default(uuid())
nome String
tipo String
conteudo Json
criadoPor Usuario @relation(fields: [usuarioId], references: [id])
usuarioId String
createdAt DateTime @default(now())
}

model HistoricoPerfil {
id String @id @default(uuid())
servidor Servidor @relation(fields: [servidorId], references: [id])
servidorId String
alteracao String
dataAlteracao DateTime @default(now())
}

model Curso {
id String @id @default(uuid())
nome String
descricao String?
dataInicio DateTime
dataFim DateTime?
servidores Servidor[]
}

model IntegracaoSistema {
id String @id @default(uuid())
nome String
descricao String?
endpoint String
ativo Boolean @default(true)
createdAt DateTime @default(now())
}

### Aqui está a rota API para o modelo `Servidor` usando Next.js com o App Router (`app/api/servidor/route.ts`). A implementação utiliza Prisma para manipulação do banco de dados.

Este código define a API para manipular os servidores no sistema, permitindo buscar todos os servidores (`GET`) e criar um novo servidor (`POST`).

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todos os servidores
export async function GET() {
try {
const servidores = await prisma.servidor.findMany({
include: {
usuario: true,
documentos: true,
historico: true,
},
});
return NextResponse.json(servidores);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar servidores" }, { status: 500 });
}
}

// POST - Cria um novo servidor
export async function POST(req: Request) {
try {
const data = await req.json();
const novoServidor = await prisma.servidor.create({
data: {
nome: data.nome,
email: data.email,
cpf: data.cpf,
cargo: data.cargo,
formacaoAcademica: data.formacaoAcademica,
competencias: data.competencias,
idiomas: data.idiomas,
experiencia: data.experiencia,
usuario: { connect: { id: data.usuarioId } },
},
});
return NextResponse.json(novoServidor, { status: 201 });
} catch (error) {
return NextResponse.json({ error: "Erro ao criar servidor" }, { status: 500 });
}
}

### Aqui está a rota API para `Usuario` em Next.js, incluindo a listagem (`GET`) e a criação de usuários (`POST`), com a senha sendo criptografada antes de ser salva no banco.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET - Lista todos os usuários
export async function GET() {
try {
const usuarios = await prisma.usuario.findMany({
include: {
servidor: true,
},
});
return NextResponse.json(usuarios);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
}
}

// POST - Cria um novo usuário
export async function POST(req: Request) {
try {
const data = await req.json();
const hashedPassword = await bcrypt.hash(data.senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        email: data.email,
        senha: hashedPassword,
        perfil: data.perfil,
      },
    });
    return NextResponse.json(novoUsuario, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
}
}

### Aqui está a rota API para `Documento` em Next.js, permitindo listar (`GET`) e criar novos documentos (`POST`).

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todos os documentos
export async function GET() {
try {
const documentos = await prisma.documento.findMany({
include: {
servidor: true,
},
});
return NextResponse.json(documentos);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 });
}
}

// POST - Cria um novo documento
export async function POST(req: Request) {
try {
const data = await req.json();

    const novoDocumento = await prisma.documento.create({
      data: {
        nome: data.nome,
        tipo: data.tipo,
        url: data.url,
        servidor: { connect: { id: data.servidorId } },
      },
    });
    return NextResponse.json(novoDocumento, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao criar documento" }, { status: 500 });
}
}

### Aqui está a rota API para `Notificacao` em Next.js, incluindo listagem (`GET`), criação (`POST`) e atualização do status de leitura (`PUT`).

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todas as notificações
export async function GET() {
try {
const notificacoes = await prisma.notificacao.findMany({
include: {
servidor: true,
},
});
return NextResponse.json(notificacoes);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 });
}
}

// POST - Cria uma nova notificação
export async function POST(req: Request) {
try {
const data = await req.json();

    const novaNotificacao = await prisma.notificacao.create({
      data: {
        mensagem: data.mensagem,
        servidor: { connect: { id: data.servidorId } },
      },
    });
    return NextResponse.json(novaNotificacao, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao criar notificação" }, { status: 500 });
}
}

// PUT - Atualiza o status de leitura da notificação
export async function PUT(req: Request) {
try {
const data = await req.json();

    const notificacaoAtualizada = await prisma.notificacao.update({
      where: { id: data.id },
      data: { lida: data.lida },
    });
    return NextResponse.json(notificacaoAtualizada);

} catch (error) {
return NextResponse.json({ error: "Erro ao atualizar notificação" }, { status: 500 });
}
}

### Aqui está a rota API para `FiltroPesquisa` em Next.js, permitindo listar (`GET`), criar (`POST`) e remover (`DELETE`) filtros de pesquisa.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todos os filtros de pesquisa
export async function GET() {
try {
const filtros = await prisma.filtroPesquisa.findMany({
include: {
criadoPor: true,
},
});
return NextResponse.json(filtros);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar filtros de pesquisa" }, { status: 500 });
}
}

// POST - Cria um novo filtro de pesquisa
export async function POST(req: Request) {
try {
const data = await req.json();

    const novoFiltro = await prisma.filtroPesquisa.create({
      data: {
        nome: data.nome,
        criterios: data.criterios,
        criadoPor: { connect: { id: data.usuarioId } },
      },
    });
    return NextResponse.json(novoFiltro, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao criar filtro de pesquisa" }, { status: 500 });
}
}

// DELETE - Remove um filtro de pesquisa
export async function DELETE(req: Request) {
try {
const data = await req.json();

    await prisma.filtroPesquisa.delete({
      where: { id: data.id },
    });
    return NextResponse.json({ message: "Filtro de pesquisa removido com sucesso" });

} catch (error) {
return NextResponse.json({ error: "Erro ao remover filtro de pesquisa" }, { status: 500 });
}
}

### Aqui está a rota API para `Relatorio` em Next.js, permitindo listar (`GET`), criar (`POST`) e remover (`DELETE`) relatórios.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todos os relatórios
export async function GET() {
try {
const relatorios = await prisma.relatorio.findMany({
include: {
criadoPor: true,
},
});
return NextResponse.json(relatorios);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
}
}

// POST - Cria um novo relatório
export async function POST(req: Request) {
try {
const data = await req.json();

    const novoRelatorio = await prisma.relatorio.create({
      data: {
        titulo: data.titulo,
        conteudo: data.conteudo,
        criadoPor: { connect: { id: data.usuarioId } },
      },
    });
    return NextResponse.json(novoRelatorio, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao criar relatório" }, { status: 500 });
}
}

// DELETE - Remove um relatório
export async function DELETE(req: Request) {
try {
const data = await req.json();

    await prisma.relatorio.delete({
      where: { id: data.id },
    });
    return NextResponse.json({ message: "Relatório removido com sucesso" });

} catch (error) {
return NextResponse.json({ error: "Erro ao remover relatório" }, { status: 500 });
}
}

### Aqui está a rota API para `HistoricoPerfil` em Next.js, permitindo listar (`GET`) e adicionar (`POST`) entradas no histórico de perfis.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todo o histórico de perfis
export async function GET() {
try {
const historico = await prisma.historicoPerfil.findMany({
include: {
servidor: true,
},
});
return NextResponse.json(historico);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar histórico de perfis" }, { status: 500 });
}
}

// POST - Adiciona uma nova entrada ao histórico de perfil
export async function POST(req: Request) {
try {
const data = await req.json();

    const novoHistorico = await prisma.historicoPerfil.create({
      data: {
        servidorId: data.servidorId,
        alteracao: data.alteracao,
        dataAlteracao: new Date(),
      },
    });
    return NextResponse.json(novoHistorico, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao adicionar histórico de perfil" }, { status: 500 });
}
}

### Aqui está a rota API para `Curso` em Next.js, permitindo listar (`GET`), criar (`POST`) e remover (`DELETE`) cursos.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todos os cursos
export async function GET() {
try {
const cursos = await prisma.curso.findMany({
include: {
ministradoPor: true,
},
});
return NextResponse.json(cursos);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar cursos" }, { status: 500 });
}
}

// POST - Cria um novo curso
export async function POST(req: Request) {
try {
const data = await req.json();

    const novoCurso = await prisma.curso.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        cargaHoraria: data.cargaHoraria,
        ministradoPor: { connect: { id: data.instrutorId } },
      },
    });
    return NextResponse.json(novoCurso, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao criar curso" }, { status: 500 });
}
}

// DELETE - Remove um curso
export async function DELETE(req: Request) {
try {
const data = await req.json();

    await prisma.curso.delete({
      where: { id: data.id },
    });
    return NextResponse.json({ message: "Curso removido com sucesso" });

} catch (error) {
return NextResponse.json({ error: "Erro ao remover curso" }, { status: 500 });
}
}

### Aqui está a rota API para `IntegracaoSistema` em Next.js, permitindo listar (`GET`), criar (`POST`) e remover (`DELETE`) integrações de sistemas.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todas as integrações de sistema
export async function GET() {
try {
const integracoes = await prisma.integracaoSistema.findMany();
return NextResponse.json(integracoes);
} catch (error) {
return NextResponse.json({ error: "Erro ao buscar integrações de sistema" }, { status: 500 });
}
}

// POST - Cria uma nova integração de sistema
export async function POST(req: Request) {
try {
const data = await req.json();

    const novaIntegracao = await prisma.integracaoSistema.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        endpoint: data.endpoint,
        chaveAPI: data.chaveAPI,
      },
    });
    return NextResponse.json(novaIntegracao, { status: 201 });

} catch (error) {
return NextResponse.json({ error: "Erro ao criar integração de sistema" }, { status: 500 });
}
}

// DELETE - Remove uma integração de sistema
export async function DELETE(req: Request) {
try {
const data = await req.json();

    await prisma.integracaoSistema.delete({
      where: { id: data.id },
    });
    return NextResponse.json({ message: "Integração de sistema removida com sucesso" });

} catch (error) {
return NextResponse.json({ error: "Erro ao remover integração de sistema" }, { status: 500 });
}
}

### A definição do modelo de dados é composta por vários elementos essenciais que estruturam a base de dados do sistema. No contexto do **Prisma ORM**, um modelo de dados é definido no arquivo `schema.prisma` e inclui:

### **1. Definição do Provedor e Configuração do Banco de Dados**

Define o banco de dados que será utilizado e como o Prisma se conectará a ele.

```prisma
datasource db {
  provider = "mysql" // ou "postgresql", "sqlite", "sqlserver"
  url      = env("DATABASE_URL")
}
```

### **2. Configuração do Cliente Prisma**

Define a saída do cliente Prisma e o gerador.

```prisma
generator client {
  provider = "prisma-client-js"
}
```

### **3. Definição dos Modelos (Entidades)**

Os modelos representam as tabelas do banco de dados e contêm campos com tipos de dados, relações e restrições.  
Exemplo de modelo `Usuario`:

```prisma
model Usuario {
  id        String  @id @default(uuid())
  nome      String
  email     String  @unique
  senha     String
  criadoEm  DateTime @default(now())
  perfis    Perfil[]
}
```

### **4. Definição de Relacionamentos**

Especifica como as entidades se relacionam entre si.  
Exemplo: Um usuário pode ter vários perfis.

```prisma
model Perfil {
  id       String   @id @default(uuid())
  nome     String
  usuario  Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId String
}
```

### **5. Definição de Restrições e Regras de Negócio**

Como `@unique`, `@default`, `@id` e `@relation`, que garantem a integridade dos dados.

```prisma
email  String  @unique // Garante que não existam e-mails duplicados
id     String  @id @default(uuid()) // Define a chave primária como UUID
```

### Aqui está o modelo para mapear as principais estruturas do Sistema de Banco de Talentos da Escola de Contas do TCE/AP, cobrindo entidades como **Usuário, Servidor, Perfil, Cargo, Competência, Formação, Documento, Notificação, Histórico, Curso e Integração com Sistemas**.

### **Arquivo `schema.prisma`**

```prisma
// Configuração do Banco de Dados
datasource db {
  provider = "postgresql" // Pode ser PostgreSQL, SQLite, SQL Server, etc.
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Modelo de Usuário (Login e Controle de Acesso)
model Usuario {
  id        String   @id @default(uuid())
  nome      String
  email     String   @unique
  senha     String
  criadoEm  DateTime @default(now())
  atualizadoEm DateTime @updatedAt
  servidores Servidor[]
}

// Modelo de Servidor (Perfil do Funcionário)
model Servidor {
  id          String       @id @default(uuid())
  usuarioId   String
  usuario     Usuario      @relation(fields: [usuarioId], references: [id])
  nome        String
  cpf         String       @unique
  dataNascimento DateTime
  cargoId     String
  cargo       Cargo        @relation(fields: [cargoId], references: [id])
  formacoes   Formacao[]
  competencias Competencia[]
  documentos  Documento[]
  historico   HistoricoPerfil[]
  criadoEm    DateTime @default(now())
  atualizadoEm DateTime @updatedAt
}

// Modelo de Cargo
model Cargo {
  id         String   @id @default(uuid())
  nome       String
  servidores Servidor[]
}

// Modelo de Formação Acadêmica
model Formacao {
  id         String   @id @default(uuid())
  servidorId String
  servidor   Servidor  @relation(fields: [servidorId], references: [id])
  instituicao String
  curso       String
  anoConclusao Int
}

// Modelo de Competências
model Competencia {
  id         String   @id @default(uuid())
  servidorId String
  servidor   Servidor  @relation(fields: [servidorId], references: [id])
  nome       String
  nivel      Int       // 1 a 5 (iniciante a especialista)
}

// Modelo de Documentos
model Documento {
  id         String   @id @default(uuid())
  servidorId String
  servidor   Servidor  @relation(fields: [servidorId], references: [id])
  nome       String
  tipo       String   // PDF, JPEG, etc.
  caminho    String
  criadoEm   DateTime @default(now())
}

// Modelo de Notificações
model Notificacao {
  id         String   @id @default(uuid())
  usuarioId  String
  usuario    Usuario  @relation(fields: [usuarioId], references: [id])
  mensagem   String
  lida       Boolean  @default(false)
  criadoEm   DateTime @default(now())
}

// Modelo de Histórico de Perfil
model HistoricoPerfil {
  id           String   @id @default(uuid())
  servidorId   String
  servidor     Servidor  @relation(fields: [servidorId], references: [id])
  alteracao    String
  dataAlteracao DateTime @default(now())
}

// Modelo de Cursos (Eventos de Treinamento)
model Curso {
  id          String   @id @default(uuid())
  titulo      String
  descricao   String
  cargaHoraria Int
  ministradoPor String
  criadoEm    DateTime @default(now())
}

// Modelo de Integração com Outros Sistemas
model IntegracaoSistema {
  id        String   @id @default(uuid())
  nome      String
  descricao String
  endpoint  String
  chaveAPI  String
  criadoEm  DateTime @default(now())
}
```

---

### **Explicação do Modelo**

✅ **Usuário**: Responsável pelo login e controle de acesso.  
✅ **Servidor**: Representa os funcionários cadastrados no sistema.  
✅ **Cargo**: Define os cargos disponíveis no TCE/AP.  
✅ **Formação**: Guarda informações acadêmicas de um servidor.  
✅ **Competência**: Representa as habilidades e níveis de proficiência do servidor.  
✅ **Documento**: Permite upload e gerenciamento de arquivos comprobatórios.  
✅ **Notificação**: Gerencia alertas e mensagens automáticas.  
✅ **Histórico de Perfil**: Registra mudanças no perfil dos servidores.  
✅ **Curso**: Mantém registros de treinamentos e eventos educacionais.  
✅ **Integração de Sistema**: Permite conexão com APIs externas.

Esse modelo mapeia a estrutura **completa** do sistema! Se precisar de ajustes, me avise. 🚀
