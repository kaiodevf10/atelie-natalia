import { useState } from 'react';
import { whatsappNumber } from '../config/brand';
import { whatsappUrl } from '../features/booking/model';

const message = 'Olá! Estou em dúvida sobre qual serviço escolher e gostaria de ajuda para decidir.';

export default function ServicesContactAction() {
    const url = whatsappUrl(whatsappNumber, message);
    const [feedback, setFeedback] = useState('');
    async function copyMessage() {
        try {
            await navigator.clipboard.writeText(message);
            setFeedback('O WhatsApp oficial ainda não foi configurado. Mensagem copiada.');
        } catch {
            setFeedback('O WhatsApp oficial ainda não foi configurado. Selecione e copie a mensagem abaixo.');
        }
    }
    const icon = <svg viewBox="0 0 32 32" width="20" height="20" fill="none" aria-hidden="true">
        <path d="M27.5 15.7a11.5 11.5 0 0 1-17.1 10L4 27.5l1.8-6.2a11.5 11.5 0 1 1 21.7-5.6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11.2 9.4c-.4-.8-.8-.8-1.2-.8h-.7c-.4 0-.8.2-1 .6-.6.7-1 1.7-1 2.7 0 1.8 1.3 3.6 1.5 3.9.2.3 2.6 4.1 6.5 5.6 3.2 1.2 3.9.8 4.6.7.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5l-2.7-1.3c-.4-.2-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.5.3-.9.1-1.2-.5-2.2-1.2-3.1-2.1-.9-.8-1.5-1.7-1.7-2.1-.2-.4 0-.6.2-.8l.7-.8c.2-.3.3-.5.4-.7.1-.2 0-.5-.1-.7l-1.3-3Z" fill="currentColor" />
    </svg>;
    return <div className="services-contact-action">
        {url ? <a className="button" href={url} target="_blank" rel="noreferrer">Falar no WhatsApp{icon}</a>
            : <button className="button" type="button" onClick={copyMessage}>Falar no WhatsApp{icon}</button>}
        {!url && feedback && <><p role="status">{feedback}</p><textarea aria-label="Mensagem para copiar" readOnly value={message} rows={3} onFocus={event => event.currentTarget.select()} /></>}
    </div>;
}
