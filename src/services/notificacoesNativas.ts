/**
 * Carrega o expo-notifications de forma segura.
 *
 * O módulo exige código nativo (ExpoTopicSubscriptionModule no Android). Num
 * binário que não o inclui, como o Expo Go, o simples `import` derruba o app
 * inteiro com "Cannot find native module". Aqui a falha vira `null` e o resto do
 * app continua funcionando, só sem notificações. No APK gerado pelo EAS
 * (Sprint 4) o módulo está embutido e tudo funciona.
 */
type ModuloNotificacoes = typeof import('expo-notifications');

function carregar(): ModuloNotificacoes | null {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('expo-notifications') as ModuloNotificacoes;
    } catch {
        return null;
    }
}

export const Notifications: ModuloNotificacoes | null = carregar();
export const notificacoesDisponiveis = Notifications !== null;
