let seeded = false;

export const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockDb = {
    empresa: null,
    usuarios: [],
    categorias: [],
    fornecedores: [],
    produtos: [],
    movimentacoes: [],
};

const createId = (collection) => {
    const maxId = collection.reduce((max, item) => Math.max(max, item.id || 0), 0);
    return maxId + 1;
};

const createMovimentacao = (id, tipo, quantidade, produto, usuario, saldoAnterior, saldoAtual, date) => ({
    id,
    tipo,
    quantidade,
    observacao: '',
    dataMovimentacao: date,
    saldoAnterior,
    saldoAtual,
    produto,
    usuario,
});

export const seedMockDb = () => {
    if (seeded) return;
    seeded = true;

    mockDb.empresa = {
        id: 1,
        nome: 'StockMaster Global',
        nomeFantasia: 'StockMaster',
        cnpj: '00.111.222/0001-33',
        email: 'contato@stockmaster.com',
        telefone: '(41) 99999-0000',
        endereco: 'Rua Central, 123 - Curitiba/PR',
        suporte: 'suporte@stockmaster.com',
        ativa: true,
    };

    mockDb.usuarios = [
        { id: 1, nome: 'Carla Martins', email: 'admin@stockmaster.com', perfil: 'ADM', matricula: 'ADM-001', ativo: true },
        { id: 2, nome: 'Bruno Lima', email: 'operador@stockmaster.com', perfil: 'OPERADOR', matricula: 'OP-021', ativo: true },
        { id: 3, nome: 'Dona Silva', email: 'dono@stockmaster.com', perfil: 'DONO', matricula: 'DN-010', ativo: true },
    ];

    mockDb.categorias = [
        { id: 1, nome: 'Eletronicos', descricao: 'Itens de tecnologia', setor: 'Tecnologia', codigoInterno: 'TEC-01', ativo: true },
        { id: 2, nome: 'Limpeza', descricao: 'Produtos de limpeza', setor: 'Higiene', codigoInterno: 'HIG-10', ativo: true },
        { id: 3, nome: 'Copa', descricao: 'Itens de copa', setor: 'Interno', codigoInterno: 'COP-05', ativo: true },
    ];

    mockDb.fornecedores = [
        { id: 1, nome: 'Fornecedor Alfa', cnpj: '12.345.678/0001-90', email: 'alfa@email.com', telefone: '(11) 98888-0001', ativo: true },
        { id: 2, nome: 'Fornecedor Beta', cnpj: '98.765.432/0001-10', email: 'beta@email.com', telefone: '(11) 97777-0002', ativo: true },
        { id: 3, nome: 'Fornecedor Sigma', cnpj: '72.345.678/0001-00', email: 'sigma@email.com', telefone: '(11) 95555-0003', ativo: true },
    ];

    const categoriaResumo = (id) => {
        const categoria = mockDb.categorias.find((item) => item.id === id);
        return categoria ? { id: categoria.id, nome: categoria.nome, setor: categoria.setor, ativo: categoria.ativo } : null;
    };

    const fornecedorResumo = (id) => {
        const fornecedor = mockDb.fornecedores.find((item) => item.id === id);
        return fornecedor ? { id: fornecedor.id, nome: fornecedor.nome, cnpj: fornecedor.cnpj, email: fornecedor.email, ativo: fornecedor.ativo } : null;
    };

    mockDb.produtos = [
        { id: 1, sku: 'ELT-001', nome: 'Notebook Pro 15', descricao: 'Notebook corporativo', preco: 6500, marca: 'Dell', quantidadeEstoque: 12, quantidadeMinima: 5, dataCadastro: new Date(), categoria: categoriaResumo(1), fornecedor: fornecedorResumo(1) },
        { id: 2, sku: 'ELT-002', nome: 'Monitor Ultra 27', descricao: 'Monitor 4K', preco: 1850, marca: 'LG', quantidadeEstoque: 4, quantidadeMinima: 6, dataCadastro: new Date(), categoria: categoriaResumo(1), fornecedor: fornecedorResumo(2) },
        { id: 3, sku: 'HIG-010', nome: 'Detergente Neutro', descricao: 'Limpeza geral', preco: 12.5, marca: 'Ype', quantidadeEstoque: 0, quantidadeMinima: 12, dataCadastro: new Date(), categoria: categoriaResumo(2), fornecedor: fornecedorResumo(3) },
        { id: 4, sku: 'COP-005', nome: 'Cafe Premium', descricao: 'Cafe para copa', preco: 35, marca: '3 Corações', quantidadeEstoque: 18, quantidadeMinima: 10, dataCadastro: new Date(), categoria: categoriaResumo(3), fornecedor: fornecedorResumo(1) },
        { id: 5, sku: 'ELT-010', nome: 'Teclado Sem Fio', descricao: 'Teclado Bluetooth', preco: 210, marca: 'Logitech', quantidadeEstoque: 9, quantidadeMinima: 8, dataCadastro: new Date(), categoria: categoriaResumo(1), fornecedor: fornecedorResumo(2) },
    ];

    const usuarioResumo = (id) => {
        const usuario = mockDb.usuarios.find((item) => item.id === id);
        return usuario ? { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, ativo: usuario.ativo } : null;
    };

    const produtoResumo = (id) => {
        const produto = mockDb.produtos.find((item) => item.id === id);
        return produto
            ? {
                id: produto.id,
                sku: produto.sku,
                nome: produto.nome,
                preco: produto.preco,
                marca: produto.marca,
                quantidadeEstoque: produto.quantidadeEstoque,
                categoria: produto.categoria,
                fornecedor: produto.fornecedor,
            }
            : null;
    };

    const now = new Date();
    mockDb.movimentacoes = [
        createMovimentacao(1, 'ENTRADA', 20, produtoResumo(1), usuarioResumo(1), 0, 20, new Date(now.getTime() - 86400000 * 2)),
        createMovimentacao(2, 'SAIDA', 5, produtoResumo(1), usuarioResumo(2), 20, 15, new Date(now.getTime() - 86400000)),
        createMovimentacao(3, 'SAIDA', 4, produtoResumo(2), usuarioResumo(1), 10, 6, new Date(now.getTime() - 3600000 * 8)),
        createMovimentacao(4, 'ENTRADA', 12, produtoResumo(4), usuarioResumo(3), 6, 18, new Date(now.getTime() - 3600000 * 6)),
    ];

    mockDb.createId = createId;
};
