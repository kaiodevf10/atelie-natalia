import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { categories, portfolio } from '../data/content';
import type { PortfolioCategory } from '../data/content';
import { ButtonLink, Modal, Photo } from './ui';

export default function PortfolioGallery({ preview = false, controlsOnly = false }: { preview?: boolean; controlsOnly?: boolean }) {
    const [category, setCategory] = useState<PortfolioCategory | null>(null);
    const [active, setActive] = useState<number | null>(null);
    const items = (preview ? portfolio.slice(0, 3) : portfolio).filter(item => category === null || item.category === category);
    const item = active !== null ? items[active] : null;
    return <>
        {!preview && <div className="filter-bar" role="group" aria-label="Filtrar portfólio">
            {categories.map(option => <button type="button" key={option} className={option === category ? 'active' : ''} aria-pressed={option === category} onClick={() => { setCategory(current => current === option ? null : option); setActive(null); }}>{option}</button>)}
        </div>}
        {!preview && <p className="sr-only" role="status">{items.length} imagens. {category ? `Filtro ${category} selecionado. Selecione novamente para mostrar todas as categorias.` : 'Exibindo todas as categorias.'}</p>}
        <div className="portfolio-grid">{items.map((entry, index) => <button type="button" className="portfolio-item" key={entry.id} onClick={() => setActive(index)} aria-label={`Ampliar: ${entry.title}`}>
            <Photo src={entry.image} alt={`${entry.title}, acervo ilustrativo`} />
            <span><small>{entry.category}</small><Expand size={17} aria-hidden="true" /></span>
        </button>)}</div>
        {item && <Modal label={item.title} onClose={() => setActive(null)}>
            <Photo key={item.id} src={item.image} alt={`${item.title}, acervo ilustrativo`} />
            <div className="lightbox-caption">
                <button type="button" className="icon-button" aria-label="Imagem anterior" onClick={() => setActive(((active ?? 0) - 1 + items.length) % items.length)}><ChevronLeft /></button>
                {!controlsOnly && <div><h3>{item.title}</h3><p>Acervo ilustrativo de terceiros</p><p>{item.category}</p></div>}
                <button type="button" className="icon-button" aria-label="Próxima imagem" onClick={() => setActive(((active ?? 0) + 1) % items.length)}><ChevronRight /></button>
            </div>
            {!controlsOnly && <ButtonLink to={`/agendar?servico=${item.category === 'Noivas' ? 'noiva' : item.category === 'Penteados' ? 'penteado' : 'maquiagem'}`}>Quero uma produção nesse estilo</ButtonLink>}
        </Modal>}
    </>;
}
