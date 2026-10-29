import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HowItWorksButton from './HowItWorksButton';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Orientação de pré-atendimento', () => {
    it('mostra as quatro etapas e retorna o foco ao fechar por Escape ou pelo botão', () => {
        const { container } = render(<MemoryRouter><HowItWorksButton /></MemoryRouter>);
        container.id = 'root';
        const trigger = screen.getByRole('button', { name: 'Como funciona?' });
        trigger.focus();
        fireEvent.click(trigger);
        expect(screen.getByRole('dialog', { name: 'Como funciona seu atendimento?' })).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(4);
        expect(screen.getByText(/O preenchimento do formulário não confirma um agendamento/)).toBeInTheDocument();
        expect(container.inert).toBe(true);
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(container.inert).toBe(false);
        expect(trigger).toHaveFocus();
        fireEvent.click(trigger);
        fireEvent.click(screen.getByRole('button', { name: 'Fechar orientação' }));
        expect(trigger).toHaveFocus();
    });

    it('mantém a navegação por Tab dentro do modal', () => {
        render(<MemoryRouter><HowItWorksButton /></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: 'Como funciona?' }));
        const first = screen.getByRole('button', { name: 'Fechar orientação' });
        const last = screen.getByRole('button', { name: 'Solicitar meu atendimento' });
        expect(first).toHaveFocus();
        fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });
        expect(last).toHaveFocus();
        fireEvent.keyDown(last, { key: 'Tab' });
        expect(first).toHaveFocus();
    });

    it('fecha e navega para o formulário sem animação quando há redução de movimento', () => {
        vi.stubGlobal('matchMedia', () => ({ matches: true }));
        render(<MemoryRouter initialEntries={['/servicos']}><Routes>
            <Route path="/servicos" element={<HowItWorksButton />} />
            <Route path="/agendar" element={<h1>Pedido de atendimento</h1>} />
        </Routes></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: 'Como funciona?' }));
        fireEvent.click(screen.getByRole('button', { name: 'Solicitar meu atendimento' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Pedido de atendimento' })).toBeInTheDocument();
    });
});
