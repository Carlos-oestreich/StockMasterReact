// src/data/navigation.js

export const NAV_ITEMS = [
    { path: '/dashboard',    label: 'Dashboard',       icon: 'bi-speedometer2', admin: false },
    { path: '/produtos',     label: 'Produtos',        icon: 'bi-box-seam',     admin: false },
    { path: '/movimentacoes',label: 'Movimentações',   icon: 'bi-arrow-left-right', admin: false },
    { path: '/alertas',      label: 'Alertas',         icon: 'bi-exclamation-triangle', admin: false },
    { path: '/categorias',   label: 'Categorias',      icon: 'bi-tags',         admin: true  },
    { path: '/fornecedores', label: 'Fornecedores',    icon: 'bi-truck',        admin: true  },
    { path: '/usuarios',     label: 'Usuários',        icon: 'bi-people',       admin: true  },
    { path: '/relatorios',   label: 'Relatórios',      icon: 'bi-bar-chart',    admin: true  },
    { path: '/configuracoes',label: 'Configurações',   icon: 'bi-gear',         admin: true  },
];

export const PAGE_TITLES = {
    '/dashboard':     'Dashboard',
    '/produtos':      'Produtos',
    '/movimentacoes': 'Movimentações',
    '/alertas':       'Alertas de Estoque',
    '/categorias':    'Categorias',
    '/fornecedores':  'Fornecedores',
    '/usuarios':      'Usuários',
    '/relatorios':    'Relatórios',
    '/configuracoes': 'Configurações',
};
