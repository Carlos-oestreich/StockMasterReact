import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PRIMARY = [79, 70, 229];
const WHITE = [255, 255, 255];
const DARK = [15, 23, 42];
const GRAY = [100, 116, 139];

function drawDefaultLogo(doc, x, y, size) {
    doc.setFillColor(...PRIMARY);
    doc.setDrawColor(...WHITE);
    doc.roundedRect(x, y, size, size, 3, 3, 'FD');
    doc.setTextColor(...WHITE);
    doc.setFontSize(size * 0.45);
    doc.setFont('helvetica', 'bold');
    doc.text('SM', x + size / 2, y + size * 0.65, { align: 'center' });
}

export function buildPdf({ title, columns, rows, empresa }) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // ── CABEÇALHO AZUL ──
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, pageW, 48, 'F');

    // Logo
    if (empresa?.logo && empresa.logo.startsWith('data:')) {
        try {
            doc.addImage(empresa.logo, 'PNG', 8, 6, 26, 26);
        } catch {
            drawDefaultLogo(doc, 8, 7, 24);
        }
    } else {
        drawDefaultLogo(doc, 8, 7, 24);
    }

    // Título e empresa
    doc.setTextColor(...WHITE);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 38, 16);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(empresa?.nome || 'StockMaster', 38, 23);

    // Dados da empresa dentro do cabeçalho
    doc.setFontSize(7.5);
    const infos = [];
    if (empresa?.cnpj)     infos.push(`CNPJ: ${empresa.cnpj}`);
    if (empresa?.email)    infos.push(`Email: ${empresa.email}`);
    if (empresa?.telefone) infos.push(`Tel: ${empresa.telefone}`);
    if (empresa?.endereco) infos.push(`Endereço: ${empresa.endereco}`);
    if (empresa?.suporte)  infos.push(`Suporte: ${empresa.suporte}`);

    const linha1 = infos.slice(0, 3).join(' | ');
    const linha2 = infos.slice(3).join(' | ');

    if (linha1) doc.text(linha1, 38, 31);
    if (linha2) doc.text(linha2, 38, 37);

    // Data geração canto direito
    doc.setFontSize(8);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageW - 8, 10, { align: 'right' });

    // ── TABELA ──
    autoTable(doc, {
        startY: 55,
        head: [columns],
        body: rows,
        styles: {
            fontSize: 8,
            cellPadding: 3,
            textColor: DARK,
        },
        headStyles: {
            fillColor: PRIMARY,
            textColor: WHITE,
            fontStyle: 'bold',
            fontSize: 8,
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252],
        },
        tableLineColor: [226, 232, 240],
        tableLineWidth: 0.1,
        margin: { left: 8, right: 8 },
        didDrawPage: () => {
            const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
            const totalPages = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(...GRAY);
            doc.setDrawColor(...PRIMARY);
            doc.setLineWidth(0.4);
            doc.line(8, pageH - 12, pageW - 8, pageH - 12);
            doc.text(
                `StockMaster – ${empresa?.nome || 'Sistema'} | Página ${pageNum} de ${totalPages}`,
                8,
                pageH - 7
            );
        },
    });

    return doc;
}

export function savePdf(doc, filename) {
    const data = new Date().toISOString().slice(0, 10);
    doc.save(`${filename}_${data}.pdf`);
}

export function buildRelatorio({ relatorio, empresa, secoes, dataInicio, dataFim }) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const fmt = (v) => v ? Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';

    const rodape = () => {
        const n = doc.internal.getCurrentPageInfo().pageNumber;
        const t = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(0.4);
        doc.line(8, pageH - 12, pageW - 8, pageH - 12);
        doc.text(`StockMaster – ${empresa?.nome || 'Sistema'} | Página ${n} de ${t}`, 8, pageH - 7);
    };

    // ── CABEÇALHO ──
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, pageW, 48, 'F');
    drawDefaultLogo(doc, 8, 7, 24);
    doc.setTextColor(...WHITE);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Gerencial', 38, 16);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(empresa?.nome || 'StockMaster', 38, 23);
    doc.setFontSize(7.5);
    const l1 = [empresa?.cnpj ? `CNPJ: ${empresa.cnpj}` : null, empresa?.email ? `Email: ${empresa.email}` : null, empresa?.telefone ? `Tel: ${empresa.telefone}` : null].filter(Boolean).join(' | ');
    const l2 = [empresa?.endereco ? `Endereço: ${empresa.endereco}` : null, empresa?.suporte ? `Suporte: ${empresa.suporte}` : null].filter(Boolean).join(' | ');
    if (l1) doc.text(l1, 38, 31);
    if (l2) doc.text(l2, 38, 37);
    doc.setFontSize(8);
    doc.text(`Período: ${dataInicio} a ${dataFim}`, pageW - 8, 16, { align: 'right' });
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageW - 8, 22, { align: 'right' });

    const tableStyle = {
        styles: { fontSize: 8, cellPadding: 3, textColor: DARK },
        headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 8, right: 8 },
        didDrawPage: rodape,
    };

    let startY = 55;

    // ── RESUMO ──
    if (secoes.resumo) {
        autoTable(doc, {
            ...tableStyle,
            startY,
            head: [['Indicador', 'Valor']],
            body: [
                ['Total de Entradas', relatorio.qtdEntradas],
                ['Total de Saídas', relatorio.qtdSaidas],
                ['SKUs Cadastrados', relatorio.totalSkus],
                ['Valor Total do Estoque', fmt(relatorio.valorTotalEstoque)],
                ['Valor de Entrada (período)', fmt(relatorio.valorEntradas30dias)],
                ['Valor de Saída (período)', fmt(relatorio.valorSaidas30dias)],
            ],
        });
        startY = doc.lastAutoTable.finalY + 10;
    }

    // ── TOP 5 ──
    if (secoes.top5 && relatorio.topProdutos?.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text('Top 5 Produtos Mais Vendidos', 8, startY);
        startY += 5;
        autoTable(doc, {
            ...tableStyle,
            startY,
            head: [['Produto', 'Qtd Vendida', 'Valor']],
            body: relatorio.topProdutos.map((i) => [i.nome, i.quantidade, fmt(i.valor)]),
        });
        startY = doc.lastAutoTable.finalY + 10;
    }

    // ── VALOR POR CATEGORIA ──
    if (secoes.porCategoria && relatorio.valorPorCategoria?.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text('Valor Vendido por Categoria', 8, startY);
        startY += 5;
        autoTable(doc, {
            ...tableStyle,
            startY,
            head: [['Categoria', 'Valor Vendido']],
            body: relatorio.valorPorCategoria.map((i) => [i.categoria, fmt(i.valorVendido)]),
        });
        startY = doc.lastAutoTable.finalY + 10;
    }

    // ── TOP POR CATEGORIA ──
    if (secoes.topCategoria && relatorio.topPorCategoria?.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text('Itens Mais Vendidos por Categoria', 8, startY);
        startY += 5;
        autoTable(doc, {
            ...tableStyle,
            startY,
            head: [['Categoria', 'Produto', 'Qtd Vendida', 'Valor']],
            body: relatorio.topPorCategoria.map((i) => [i.categoria, i.produto, i.quantidade, fmt(i.valor)]),
        });
        startY = doc.lastAutoTable.finalY + 10;
    }

    // ── POSIÇÃO ATUAL ──
    if (secoes.estoque && relatorio.estoque?.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text('Posição Atual do Estoque', 8, startY);
        startY += 5;
        autoTable(doc, {
            ...tableStyle,
            startY,
            head: [['Produto', 'SKU', 'Categoria', 'Fornecedor', 'Qtd', 'Valor Unit.', 'Valor Total']],
            body: relatorio.estoque.map((i) => [i.nome, i.sku, i.categoria, i.fornecedor, i.quantidade, fmt(i.valorUnitario), fmt(i.valorTotal)]),
        });
    }

    savePdf(doc, 'relatorio_gerencial');
}