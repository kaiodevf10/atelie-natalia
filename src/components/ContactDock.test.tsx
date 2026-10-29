import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ContactDock from './ContactDock';

const config = vi.hoisted(() => ({ number: undefined as string | undefined }));
vi.mock('../config/brand', async importOriginal => {
    const actual = await importOriginal<typeof import('../config/brand')>();
    return { ...actual, get whatsappNumber() { return config.number; } };
});
afterEach(() => { cleanup(); config.number = undefined; });

describe('Contato direto com o ateliê', () => {
    it.each([undefined, 'configuracao-pendente'])('informa a pendência sem gerar link inválido (%s)', number => {
        config.number = number;
        render(<MemoryRouter><ContactDock menuOpen={false} /></MemoryRouter>);
        expect(screen.queryByRole('link', { name: 'Falar com o Ateliê pelo WhatsApp' })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Falar com o Ateliê pelo WhatsApp' }));
        expect(screen.getByRole('dialog', { name: 'WhatsApp em configuração' })).toBeInTheDocument();
        expect(within(screen.getByRole('dialog')).getByRole('link', { name: 'Personalizar meu atendimento' })).toHaveAttribute('href', '/agendar');
        fireEvent.click(screen.getByRole('button', { name: 'Fechar informações de contato' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('usa somente o número configurado para o link oficial', () => {
        config.number = '5521999999999';
        render(<MemoryRouter><ContactDock menuOpen={false} /></MemoryRouter>);
        const link = screen.getByRole('link', { name: 'Falar com o Ateliê pelo WhatsApp' });
        expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5521999999999\?text=/);
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('não ocupa a área do formulário de atendimento', () => {
        render(<MemoryRouter initialEntries={['/agendar']}><ContactDock menuOpen={false} /></MemoryRouter>);
        expect(screen.queryByRole('button', { name: 'Falar com o Ateliê pelo WhatsApp' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Personalizar meu atendimento' })).not.toBeInTheDocument();
    });
});
