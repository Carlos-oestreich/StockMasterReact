import Button from './Button.jsx';

export default function PdfButton({ onClick, label = 'Exportar PDF', className = '' }) {
    return (
        <Button onClick={onClick} variant="secondary" className={className}>
            <i className="bi bi-printer" />
            {label}
        </Button>
    );
}
