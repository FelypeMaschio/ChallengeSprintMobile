# 🐾 Clyvo Vet Mobile — Sprint 4

Aplicativo mobile em React Native (Expo + TypeScript) para a jornada contínua de cuidado do pet — Challenge FIAP 2026.

## 📽️ Vídeo de apresentação

▶️ **[Assista à demonstração da Sprint 4](https://youtu.be/_nO9_ch6Tgg)**

> Vídeo com narração, demonstrando o app real em execução (não protótipo/Figma): cadastro e login, CRUD de pets e consultas integrado à API, notificação de consulta, persistência da sessão, tema claro/escuro e a tela Sobre o app com o commit de referência.

## 📲 Aplicativo publicado (Firebase App Distribution)

📦 **[Instalar o app (versão 4.0.0)](https://appdistribution.firebase.google.com/testerapps/1:881309064335:android:bcf3b7efadd93781baa4fa/releases/2pn1fbbmmg04o?utm_source=firebase-console)**

- Projeto Firebase: `clyvo-vet` · App Android: `br.com.fiap.clyvovet`
- Tester cadastrado: e-mail institucional do professor (`antonio.neto@fiap.com.br`)
- Para conferir a versão instalada, abra **Sobre o app**: o commit de referência exibido corresponde a este repositório.

## 🎯 O problema

Tutores de pets não têm um lugar único para acompanhar a saúde dos seus animais. O histórico se espalha entre carteirinhas de papel, mensagens com a clínica e a memória do tutor. Vacinas atrasam, retornos são esquecidos e, quando o pet adoece, ninguém tem o histórico completo em mãos.

## 💡 A solução

O Clyvo Vet centraliza o cuidado do pet e avisa antes que o cuidado atrase:

- Cadastro completo dos pets, com foto e seleção visual de raça
- Agendamento e acompanhamento de consultas veterinárias, com controle de status
- Alertas de acompanhamento: consultas vencidas, retornos próximos, pets sem check-up recente
- Autenticação real via Firebase, com sessão persistente entre aberturas do app
- Notificações locais: confirmação ao agendar e lembrete 30 minutos antes da consulta
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
| Notificações | expo-notifications (locais) | Confirmação e lembrete de consulta |
| Build e distribuição | EAS Build + Firebase App Distribution | APK de teste entregue ao professor |
| Backend | Java + Spring Boot | API REST consumida pelo app (repositório: `api-mobile`) |

## 🏗️ Arquitetura

```
src/
├── api/           Acesso a dados — axios e um módulo por recurso (petsApi, consultasApi)
├── components/    Componentes de UI reutilizáveis
├── config/        Ambiente (env.ts) e inicialização do Firebase
├── constants/     Catálogo de raças
├── contexts/      Context API — AuthContext e ThemeContext
├── hooks/         Regra de negócio e estado de formulário — um hook por domínio/tela (usePets, useConsultas, usePetForm, useConsultaForm, useNotificacoes...)
├── navigation/    Rotas, stacks e tabs, com tipagem própria
├── screens/       Somente interface — sem chamada HTTP, validação, useState de formulário ou mutations
├── services/      Serviços do dispositivo — notificações locais
├── theme/         Design tokens (cores, tipografia, espaçamento)
├── types/         Tipos do domínio compartilhados por todas as camadas
├── utils/         Funções puras (datas, máscaras)
└── validation/    Regras de validação por domínio
```

Fluxo de dados, sempre em uma única direção:

```
Tela → Hook (valida + TanStack Query) → Módulo de API (axios) → Backend Java
```

Nenhuma tela importa axios, valida dados ou chama `.mutate`: o estado dos formulários e as mutations ficam nos hooks (Sprint 4). Cada domínio (Pet, Consulta) tem seu próprio hook — evitando o acoplamento de um hook único cuidando de todas as entidades.

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
| 10 | Sobre o app | Versão, equipe, tecnologias e **commit de referência** do build |

## 🔄 CRUD completo (duas funcionalidades dependentes da API)

| Entidade | Create | Read | Update | Delete |
|---|:---:|:---:|:---:|:---:|
| Pets | ✅ | ✅ | ✅ | ✅ |
| Consultas | ✅ | ✅ | ✅ | ✅ |

Todas as operações passam pela API HTTP via TanStack Query (`useQuery`/`useMutation`). Após qualquer `POST`, `PUT` ou `DELETE`, a interface se atualiza automaticamente por `invalidateQueries` — sem `useState` manual e sem necessidade de reiniciar o app.

## 🔐 Autenticação

- Login e cadastro via **Firebase Authentication** (e-mail/senha), serviço externo real
- Sessão persistida via AsyncStorage (`initializeAuth` + `getReactNativePersistence`): o usuário não precisa autenticar novamente ao reabrir o app
- Rotas protegidas: o stack de telas internas só é montado quando há usuário autenticado — sem sessão, essas rotas nem existem no navegador
- Logout funcional: ao sair, o acesso às telas protegidas é bloqueado imediatamente

## 🔔 Notificações (Sprint 4)

Notificações **locais** (permitidas pelo enunciado), geradas por eventos reais do app (`src/services/notificacoes.ts`):

| Evento | Notificação |
|---|---|
| Tutor agenda uma consulta | Confirmação imediata ("Consulta agendada") |
| Consulta futura com status "agendada" | Lembrete 30 minutos antes do horário |
| Consulta editada, concluída ou excluída | Lembrete reagendado ou cancelado |
| Logout | Lembretes pendentes cancelados |

Ao tocar na notificação, o app abre a consulta correspondente. Os lembretes são sincronizados com a lista de consultas vinda da API. As notificações exigem o APK (build nativo); no Expo Go o app abre normalmente, mas sem notificações.

## 📦 Build e distribuição

```bash
npm install -g eas-cli
eas login
npm run versao                                   # grava o hash do commit em src/config/versao.ts
eas build -p android --profile preview           # gera o APK
```

O APK é distribuído pelo **Firebase App Distribution** (app Android `br.com.fiap.clyvovet`, projeto `clyvo-vet`), com o e-mail institucional do professor como testador. A tela **Sobre o app** exibe o hash do commit que originou o build, para conferência com este repositório.

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

**FIAP — Análise e Desenvolvimento de Sistemas — 2TDSPI · Challenge 2026 · Sprint 4**
