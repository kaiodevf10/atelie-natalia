import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Copy, MessageCircle } from 'lucide-react';
import { whatsappNumber } from '../config/brand';
import { whatsappUrl } from '../features/booking/model';
import { faqs } from '../data/content';
export function ButtonLink({ to, children, secondary = false }: {
    to: string;
    children: ReactNode;
    secondary?: boolean;
}) { return <Link className={`button ${secondary ? 'secondary' : ''}`} to={to}>{children}<ArrowUpRight size={16}/></Link>; }
export function Heading({ title, text, kicker }: {
    title: string;
    text?: string;
    kicker?: string;
}) { return <div className="section-heading">{kicker && <span className="eyebrow">{kicker}</span>}<h2>{title}</h2>{text && <p>{text}</p>}</div>; }
export function Photo({ src, alt, className = '', eager = false }: {
    src: string;
    alt: string;
    className?: string;
    eager?: boolean;
}) { const [failed, setFailed] = useState(false); return <div className={`photo ${className}`}>{failed ? <div className="image-fallback"><span>NL</span><p>Referência visual indisponível</p></div> : <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)}/>}</div>; }
export function FAQAccordion({ items = faqs }: {
    items?: typeof faqs;
}) { return <div className="accordion">{items.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>; }
export function ContactCTA({ centered = true, eyebrow, title, description, action, className = '' }: {
    centered?: boolean;
    eyebrow?: string;
    title?: ReactNode;
    description?: string;
    action?: ReactNode;
    className?: string;
}) { return <section className={`contact-cta${centered ? ' contact-cta--centered' : ''} ${className}`}><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title ?? <>O seu próximo momento<br />começa com um cuidado.</>}</h2><p>{description ?? 'Conte o que você imagina. Vamos construir sua solicitação juntas.'}</p></div>{action ?? <ButtonLink to="/agendar">Personalizar meu atendimento</ButtonLink>}</section>; }
export function WhatsAppCTA({ message }: {
    message: string;
}) { const [feedback, setFeedback] = useState(''); const url = whatsappUrl(whatsappNumber, message); async function copy() { try {
    await navigator.clipboard.writeText(message);
    setFeedback('Mensagem copiada. Você já pode colá-la na conversa.');
}
catch {
    setFeedback('Não foi possível copiar. Selecione o texto da mensagem abaixo e copie manualmente.');
} } return <div className="whatsapp-output"><h3>Sua mensagem está pronta.</h3><p>Revise as informações. O envio é feito por você, na conversa do WhatsApp.</p><pre tabIndex={0}>{message}</pre><div className="flex flex-wrap gap-3">{url ? <a className="button" href={url} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Enviar solicitação pelo WhatsApp</a> : <p className="notice">O WhatsApp oficial ainda não foi configurado. Nesta demonstração, você pode copiar sua mensagem.</p>}<button type="button" className="button secondary" onClick={copy}>{feedback.startsWith('Mensagem') ? <Check size={16}/> : <Copy size={16}/>}Copiar mensagem</button></div><p role="status">{feedback}</p></div>; }
export { default as Modal } from './Modal';
