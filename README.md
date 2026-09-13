# 🐾 Clyvo Vet Mobile — Sprint 3

Aplicativo mobile em React Native (Expo + TypeScript) para a jornada contínua de cuidado do pet — Challenge FIAP 2026.

## 📽️ Vídeo de apresentação

▶️ **[Assista à demonstração](https://youtu.be/l0x_7iouILw)**

> Vídeo com narração, demonstrando o app real em execução (não protótipo/Figma), com no máximo 5 minutos, mostrando navegação, autenticação, integração com a API e uso em dispositivo real.

## 🎯 O problema

Tutores de pets não têm um lugar único para acompanhar a saúde dos seus animais. O histórico se espalha entre carteirinhas de papel, mensagens com a clínica e a memória do tutor. Vacinas atrasam, retornos são esquecidos e, quando o pet adoece, ninguém tem o histórico completo em mãos.

## 💡 A solução

O Clyvo Vet centraliza o cuidado do pet e avisa antes que o cuidado atrase:

- Cadastro completo dos pets, com foto e seleção visual de raça
- Agendamento e acompanhamento de consultas veterinárias, com controle de status
- Alertas de acompanhamento: consultas vencidas, retornos próximos, pets sem check-up recente
- Autenticação real via Firebase, com sessão persistente entre aberturas do app
- Tema claro e escuro

## 🛠️ Tecnologias

| Camada | Tecnologia | Papel |
|---|---|---|
| Linguagem | TypeScript (modo strict) | Segurança de tipos em todo o projeto |
| Framework | React Native + Expo | Base do aplicativo |
| Navegação | React Navigation (Native Stack + Bottom Tabs) | Rotas declaradas e proteção por autenticação |
| Estado do servidor | TanStack Query | Cache, loading e atualização automática após requisições |
| HTTP | Axios | Cliente HTTP com interceptors |
| Estado global do cliente | Context API | Sessão do usuário e tema |
| Autenticação | Firebase Authentication | Login e cadastro reais |
| Persistência local | AsyncStorage | Sessão e preferência de tema |
| Backend | Java + Spring Boot | API REST consumida pelo app (repositório: `api-mobile`) |

## 🏗️ Arquitetura

```
src/
├── api/           Acesso a dados — axios e um módulo por recurso (petsApi, consultasApi)
├── components/    Componentes de UI reutilizáveis
├── config/        Ambiente (env.ts) e inicialização do Firebase
├── constants/     Catálogo de raças
├── contexts/      Context API — AuthContext e ThemeContext
├── hooks/         Regra de negócio — um hook por domínio (usePets, useConsultas, useAlertas)
├── navigation/    Rotas, stacks e tabs, com tipagem própria
├── screens/       Somente interface — nenhuma chamada HTTP, nenhuma validação
├── theme/         Design tokens (cores, tipografia, espaçamento)
├── types/         Tipos do domínio compartilhados por todas as camadas
├── utils/         Funções puras (datas, máscaras)
└── validation/    Regras de validação por domínio
```

Fluxo de dados, sempre em uma única direção:

```
Tela → Hook (valida + TanStack Query) → Módulo de API (axios) → Backend Java
```

Nenhuma tela importa axios. Nenhuma tela contém lógica de validação. Cada domínio (Pet, Consulta) tem seu próprio hook — evitando o acoplamento de um hook único cuidando de todas as entidades.

## 📱 Telas (10 no total — mínimo exigido: 6)

| # | Tela | Função |
|---|---|---|
| 1 | Login | Autenticação do tutor |
| 2 | Cadastro | Criação de conta |
| 3 | Home | Dashboard com métricas, alertas e próximas consultas |
| 4 | Meus Pets | Listagem dos pets (READ) |
| 5 | Novo/Editar Pet | Formulário (CREATE / UPDATE) |
| 6 | Detalhe do Pet | Ficha completa e exclusão (READ por id / DELETE) |
| 7 | Consultas | Listagem com filtros por status |
| 8 | Nova/Editar Consulta | Formulário (CREATE / UPDATE) |
| 9 | Perfil | Dados do tutor, alternância de tema e logout |
| 10 | Sobre o app | Versão, equipe e tecnologias |

## 🔄 CRUD completo (duas funcionalidades dependentes da API)

| Entidade | Create | Read | Update | Delete |
|---|:---:|:---:|:---:|:---:|
| Pets | ✅ | ✅ | ✅ | ✅ |
| Consultas | ✅ | ✅ | ✅ | ✅ |

Todas as operações passam pela API HTTP via TanStack Query (`useQuery`/`useMutation`). Após qualquer `POST`, `PUT` ou `DELETE`, a interface se atualiza automaticamente por `invalidateQueries` — sem `useState` manual e sem necessidade de reiniciar o app.

## 🔐 Autenticação

- Login e cadastro via **Firebase Authentication** (e-mail/senha), serviço externo real
- Sessão persistida via AsyncStorage: o usuário não precisa autenticar novamente ao reabrir o app
- Rotas protegidas: o stack de telas internas só é montado quando há usuário autenticado — sem sessão, essas rotas nem existem no navegador
- Logout funcional: ao sair, o acesso às telas protegidas é bloqueado imediatamente

## 🚀 Como executar

### Pré-requisitos
- Node.js 18 ou superior
- Expo Go instalado no celular (ou emulador Android/iOS)

### Passos

```bash
git clone https://github.com/FelypeMaschio/ChallengeSprintMobile.git
cd ChallengeSprintMobile
npm install
npx expo start
```

Leia o QR Code com o Expo Go, ou pressione `a` (Android), `i` (iOS) ou `w` (navegador) no terminal do Metro.

**Não é necessário nenhum ajuste manual de configuração** — a URL da API e as credenciais do Firebase já estão definidas no código-fonte (`src/config/env.ts` e `src/config/firebase.ts`), prontas para uso imediato.

### Backend

O app consome a API REST do backend Java (Spring Boot), publicada em produção. Código-fonte do backend: `github.com/FellipeCostaOliveira/api-mobile`.

A API expõe `/api/v1/pets` e `/api/v1/consultas` com os métodos `GET`, `POST`, `PUT` e `DELETE`, autenticados via token do Firebase (`Authorization: Bearer <token>`).

## 👥 Integrantes

| RM | Nome |
|---|---|
| 562156 | Pedro Henrique dos Santos Costa |
| 565269 | Eduardo Augusto de Oliveira Souza |
| 564673 | Fellipe Costa de Oliveira |
| 563009 | Felype Ferreira Maschio |
| 563304 | Gustavo Vieira de Matos |

**FIAP — Análise e Desenvolvimento de Sistemas — 2TDS · Challenge 2026 · Sprint 3**
