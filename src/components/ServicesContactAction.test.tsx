import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ServicesContactAction from './ServicesContactAction';
import { ContactCTA } from './ui';

const config = vi.hoisted(() => ({ number: undefined as string | undefined }));
vi.mock('../config/brand', async importOriginal => {
    const actual = await importOriginal<typeof import('../config/brand')>();
    return { ...actual, get whatsappNumber() { return config.number; } };
});
const message = 'Olá! Estou em dúvida sobre qual serviço escolher e gostaria de ajuda para decidir.';
afterEach(() => { cleanup(); config.number = undefined; vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Contato do CTA de Serviços', () => {
    it('codifica a mensagem e usa o número configurado sem abrir a conversa automaticamente', () => {
        config.number = '5521999999999';
        render(<ServicesContactAction />);
        expect(screen.getByRole('link', { name: 'Falar no WhatsApp' })).toHaveAttribute('href', `https://wa.me/${config.number}?text=${encodeURIComponent(message)}`);
        expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    });
    it('copia a mensagem somente após o clique quando falta a configuração', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { clipboard: { writeText } });
        render(<ServicesContactAction />);
        expect(writeText).not.toHaveBeenCalled();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Falar no WhatsApp' }));
        expect(await screen.findByRole('status')).toHaveTextContent('Mensagem copiada.');
        expect(writeText).toHaveBeenCalledWith(message);
    });
    it('permite copiar manualmente se o clipboard falhar', async () => {
        vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
        render(<ServicesContactAction />);
        fireEvent.click(screen.getByRole('button'));
        expect(await screen.findByRole('textbox', { name: 'Mensagem para copiar' })).toHaveValue(message);
        expect(screen.getByRole('status')).toHaveTextContent('Selecione e copie');
    });
    it('preserva o conteúdo e a rota padrão dos demais CTAs', () => {
        render(<MemoryRouter><ContactCTA /></MemoryRouter>);
        expect(screen.getByRole('heading')).toHaveTextContent('O seu próximo momentocomeça com um cuidado.');
        expect(screen.getByRole('link', { name: 'Personalizar meu atendimento' })).toHaveAttribute('href', '/agendar');
        expect(screen.queryByText('Vamos conversar?')).not.toBeInTheDocument();
    });
});
