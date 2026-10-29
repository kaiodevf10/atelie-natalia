import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../data/content';
import type { PortfolioCategory } from '../data/content';
import { portfolioReferences } from '../data/portfolio';
import { Modal, Photo } from './ui';
import './PortfolioEditorialGallery.css';

export default function PortfolioEditorialGallery() {
    const [category, setCategory] = useState<PortfolioCategory>(categories[0]);
    const [active, setActive] = useState<number | null>(null);
    const items = portfolioReferences.filter(entry => entry.category === category);
    const item = active !== null ? items[active] : null;

    return <>
        <div className="filter-bar" role="group" aria-label="Filtrar portfólio">
            {categories.map(option => <button type="button" key={option} className={option === category ? 'active' : ''} aria-pressed={option === category} onClick={() => { setCategory(option); setActive(null); }}>{option}</button>)}
        </div>
        <p className="portfolio-disclosure">Imagens ilustrativas de terceiros para inspiração; não são trabalhos do Ateliê Natália Lucena.</p>
        <p className="sr-only" role="status">5 imagens. Filtro {category} selecionado.</p>
        <div className="portfolio-editorial-gallery">
            <div className="portfolio-editorial-frame" key={category}>
                {items.map((entry, index) => <button type="button" className="portfolio-editorial-image" style={{ '--portfolio-position': entry.position ?? 'center' } as CSSProperties} key={entry.id} onClick={() => setActive(index)} aria-label={`Ampliar: ${entry.title}`}>
                    <Photo src={entry.image} alt={`${entry.title}, referência ilustrativa de terceiros`} />
                </button>)}
            </div>
        </div>
        {item && <Modal className="portfolio-editorial-lightbox" label={`Referência ilustrativa: ${item.title}`} onClose={() => setActive(null)}>
            <Photo key={item.id} src={item.image} alt={`${item.title}, referência ilustrativa de terceiros`} eager />
            <div className="portfolio-editorial-controls">
                <button type="button" className="icon-button" aria-label="Imagem anterior" onClick={() => setActive(((active ?? 0) - 1 + items.length) % items.length)}><ChevronLeft aria-hidden="true" /></button>
                <button type="button" className="icon-button" aria-label="Próxima imagem" onClick={() => setActive(((active ?? 0) + 1) % items.length)}><ChevronRight aria-hidden="true" /></button>
            </div>
        </Modal>}
    </>;
}
