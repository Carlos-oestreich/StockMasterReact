import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Layout from './components/Layout';
import PageDashboard from './pages/PageDashboard';
import PageProdutos from './pages/PageProdutos';
import PageMovimentacoes from './pages/PageMovimentacoes';
import PageAlertas from './pages/PageAlertas';
import PageCategorias from './pages/PageCategorias';
import PageFornecedores from './pages/PageFornecedores';
import PageUsuarios from './pages/PageUsuarios';
import PageRelatorios from './pages/PageRelatorios';
import PageConfiguracoes from './pages/PageConfiguracoes';
import PageLogin from './pages/PageLogin';
import PageCadastroInicial from './pages/PageCadastroInicial';

function RotaProtegida({ children }) {
    const { session } = useAuth();
    if (!session) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<PageLogin />} />
                <Route path="/cadastro" element={<PageCadastroInicial />} />

                {/* Rotas protegidas */}
                <Route
                    element={
                        <RotaProtegida>
                            <Layout />
                        </RotaProtegida>
                    }
                >
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<PageDashboard />} />
                    <Route path="/produtos" element={<PageProdutos />} />
                    <Route path="/movimentacoes" element={<PageMovimentacoes />} />
                    <Route path="/alertas" element={<PageAlertas />} />
                    <Route path="/categorias" element={<PageCategorias />} />
                    <Route path="/fornecedores" element={<PageFornecedores />} />
                    <Route path="/usuarios" element={<PageUsuarios />} />
                    <Route path="/relatorios" element={<PageRelatorios />} />
                    <Route path="/configuracoes" element={<PageConfiguracoes />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}