import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { brand, whatsappNumber } from '../config/brand';
import { whatsappUrl } from '../features/booking/model';
import Modal from './Modal';

function WhatsAppIcon() {
    return <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
        <path d="M27.5 15.7a11.5 11.5 0 0 1-17.1 10L4 27.5l1.8-6.2a11.5 11.5 0 1 1 21.7-5.6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11.2 9.4c-.4-.8-.8-.8-1.2-.8h-.7c-.4 0-.8.2-1 .6-.6.7-1 1.7-1 2.7 0 1.8 1.3 3.6 1.5 3.9.2.3 2.6 4.1 6.5 5.6 3.2 1.2 3.9.8 4.6.7.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5l-2.7-1.3c-.4-.2-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-1.2-.5-2.2-1.2-3.1-2.1-.9-.8-1.5-1.7-1.7-2.1-.2-.4 0-.6.2-.8l.7-.8c.2-.3.3-.5.4-.7.1-.2 0-.5-.1-.7l-1.3-3Z" fill="currentColor" />
    </svg>;
}

export default function ContactDock({ menuOpen }: { menuOpen: boolean }) {
    const { pathname } = useLocation();
    const dock = useRef<HTMLDivElement>(null);
    const [obscured, setObscured] = useState(false);
    const [pending, setPending] = useState(false);
    const url = whatsappUrl(whatsappNumber, `Olá! Gostaria de conversar com a equipe do ${brand.name}.`);

    useEffect(() => {
        let frame = 0;
        function update() {
            if (!dock.current) return;
            const controls = [...dock.current.children].map(element => element.getBoundingClientRect()).filter(rect => rect.width > 0 && rect.height > 0);
            const overlaps = (element: Element) => {
                const box = element.getBoundingClientRect();
                return box.width > 0 && box.height > 0 && controls.some(rect => box.top < rect.bottom && box.bottom > rect.top && box.left < rect.right && box.right > rect.left);
            };
            const footer = document.querySelector('footer');
            const courseForm = document.querySelector('.course-form');
            const inView = (element: Element | null) => element !== null && element.getBoundingClientRect().top < window.innerHeight && element.getBoundingClientRect().bottom > 0;
            const collision = [...document.querySelectorAll('main .button,main .text-link,main .help-button,main input,main textarea,main select,main summary,main .filter-bar button,main .service-card h3 a,main .portfolio-item > span,main .location-panel')].some(overlaps);
            setObscured(inView(footer) || inView(courseForm) || collision);
        }
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
        schedule();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
        observer?.observe(document.body);
        return () => { cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
    }, [pathname]);

    if (pathname === '/agendar') return null;
    return <>
        <div ref={dock} className="contact-dock" role="group" data-obscured={obscured || menuOpen ? 'true' : undefined} aria-label="Atendimento e contato">
            {pathname !== '/cursos' && <Link className="mobile-booking" to="/agendar">Personalizar meu atendimento<ArrowUpRight size={16} aria-hidden="true" /></Link>}
            {url ? <a className="floating-whatsapp" href={url} target="_blank" rel="noreferrer" aria-label="Falar com o Ateliê pelo WhatsApp" title="Falar com o Ateliê pelo WhatsApp"><WhatsAppIcon /></a>
                : <button type="button" className="floating-whatsapp" aria-label="Falar com o Ateliê pelo WhatsApp" aria-haspopup="dialog" title="WhatsApp oficial em configuração" onClick={() => setPending(true)}><WhatsAppIcon /></button>}
        </div>
        {pending && <Modal label="WhatsApp em configuração" closeLabel="Fechar informações de contato" className="contact-dialog" animated onClose={() => setPending(false)}>
            <h2>WhatsApp em configuração</h2>
            <p>O número oficial do ateliê ainda não foi informado. Você pode preparar sua solicitação no formulário e copiar a mensagem ao final.</p>
            <Link className="button" to="/agendar" onClick={() => setPending(false)}>Personalizar meu atendimento</Link>
        </Modal>}
    </>;
}
