import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Instagram, Menu, X } from 'lucide-react';
import { brand } from '../config/brand';
import { ButtonLink } from './ui';
import ContactDock from './ContactDock';
import HowItWorksButton from './HowItWorksButton';

const nav = [['/servicos', 'Serviços'], ['/sobre', 'Sobre'], ['/portfolio', 'Portfólio'], ['/cursos', 'Cursos']];
const footerNav = [['/', 'Início'], ['/servicos', 'Serviços'], ['/portfolio', 'Portfólio'], ['/cursos', 'Cursos'], ['/agendar', 'Contato']];

export default function Layout() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const menuButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
            if (target) {
                target.scrollIntoView({ block: 'start' });
                target.querySelector<HTMLElement>('h2[tabindex="-1"]')?.focus({ preventScroll: true });
            } else window.scrollTo(0, 0);
        });
        const titles: Record<string, string> = { '/': 'Beleza com identidade', '/servicos': 'Serviços', '/sobre': 'Sobre Natália', '/espaco': 'Nosso espaço', '/portfolio': 'Portfólio', '/cursos': 'Cursos', '/faq': 'Dúvidas frequentes', '/agendar': 'Solicitar atendimento' };
        const title = titles[location.pathname] ?? 'Serviços de beleza';
        document.title = `${title} | ${brand.name}`;
        document.querySelector('meta[name="description"]')?.setAttribute('content', `${title}. Maquiagem, penteados e atendimento personalizado no ${brand.name}, em Niterói, RJ.`);
        return () => cancelAnimationFrame(frame);
    }, [location.pathname, location.hash]);

    return <>
        <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
        <header className="header" onKeyDown={event => {
            if (event.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus(); }
        }}>
            <Link to="/" className="wordmark" aria-label={`${brand.name}, início`} onClick={() => setOpen(false)}><small>Ateliê</small><span>{brand.shortName}</span></Link>
            <nav className="desktop-nav" aria-label="Principal">{nav.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}<HowItWorksButton /></nav>
            <div className="header-actions">
                <ButtonLink to="/agendar">Solicitar atendimento</ButtonLink>
                <button ref={menuButton} type="button" className="icon-button menu-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
            </div>
            {open && <nav id="mobile-menu" className="mobile-menu" aria-label="Menu mobile">
                {[['/', 'Início'], ...nav, ['/faq', 'Dúvidas frequentes'], ['/agendar', 'Solicitar atendimento']].map(([to, label]) => <Link to={to} key={to} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}
                <HowItWorksButton onStart={() => setOpen(false)} />
            </nav>}
        </header>
        <main id="conteudo"><Outlet /></main>
        <footer className="site-footer">
            <div className="footer-main">
                <Link to="/" className="wordmark"><small>Ateliê</small><span>{brand.shortName}</span></Link>
                <nav className="footer-nav" aria-label="Rodapé">{footerNav.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</nav>
                <div className="footer-socials" aria-label="Redes sociais">
                    <a href={brand.instagram} target="_blank" rel="noreferrer"><Instagram size={16} aria-hidden="true" />Instagram do ateliê</a>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} {brand.name}</span>
                <span>{brand.city}</span>
                <small>Protótipo com acervo ilustrativo de terceiros.</small>
            </div>
        </footer>
        <ContactDock menuOpen={open} />
    </>;
}
