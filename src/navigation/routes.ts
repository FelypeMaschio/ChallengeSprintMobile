/** Rotas declaradas num lugar só. `as const` faz cada valor virar um literal de tipo. */
export const ROTAS = {
    // Fluxo público
    LOGIN: 'Login',
    CADASTRO: 'Cadastro',

    // Fluxo protegido
    TABS: 'Tabs',
    HOME: 'Home',
    PETS: 'Pets',
    CONSULTAS: 'Consultas',
    PERFIL: 'Perfil',
    PET_FORM: 'PetForm',
    PET_DETALHE: 'PetDetalhe',
    CONSULTA_FORM: 'ConsultaForm',
    SOBRE: 'Sobre',
} as const;