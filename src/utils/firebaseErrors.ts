const MENSAGENS: Record<string, string> = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Não encontramos uma conta com este e-mail.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha precisa ter no mínimo 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'auth/operation-not-allowed': 'Login por e-mail/senha não está habilitado.',
};

export function traduzirErroFirebase(erro: unknown): string {
    const codigo = typeof erro === 'object' && erro !== null && 'code' in erro
        ? String((erro as { code: unknown }).code)
        : '';
    return MENSAGENS[codigo] ?? 'Não foi possível concluir. Tente novamente.';
}