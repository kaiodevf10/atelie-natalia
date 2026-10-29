import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import PortfolioGallery from './PortfolioGallery';
import { portfolio } from '../data/content';

afterEach(cleanup);

describe('Filtros do portfólio', () => {
    it('oculta legendas somente na instância da Home e preserva navegação e fechamento', () => {
        render(<MemoryRouter><PortfolioGallery preview controlsOnly /></MemoryRouter>);
        fireEvent.click(screen.getAllByRole('button', { name: /^Ampliar:/ })[0]);
        const dialog = screen.getByRole('dialog');
        expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
        expect(within(dialog).queryByText('Acervo ilustrativo de terceiros')).not.toBeInTheDocument();
        expect(within(dialog).queryByRole('link')).not.toBeInTheDocument();
        expect(within(dialog).getByRole('img')).toHaveAttribute('alt', `${portfolio[0].title}, acervo ilustrativo`);
        fireEvent.click(within(dialog).getByRole('button', { name: 'Próxima imagem' }));
        expect(within(screen.getByRole('dialog')).getByRole('img')).toHaveAttribute('alt', `${portfolio[1].title}, acervo ilustrativo`);
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('abre com todas as referências e somente os três filtros individuais', () => {
        render(<MemoryRouter><PortfolioGallery /></MemoryRouter>);
        expect(screen.getAllByRole('button', { name: /^Ampliar:/ })).toHaveLength(portfolio.length);
        for (const name of ['Maquiagem social', 'Noivas', 'Penteados']) {
            expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'false');
        }
        expect(screen.queryByRole('button', { name: 'Todos' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Produção completa' })).not.toBeInTheDocument();
    });

    it('seleciona, troca e desmarca o filtro para restaurar a visão geral', () => {
        render(<MemoryRouter><PortfolioGallery /></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: 'Noivas' }));
        expect(screen.getAllByRole('button', { name: /^Ampliar:/ })).toHaveLength(2);
        expect(screen.getByRole('button', { name: 'Noivas' })).toHaveAttribute('aria-pressed', 'true');
        fireEvent.click(screen.getByRole('button', { name: 'Penteados' }));
        expect(screen.getAllByRole('button', { name: /^Ampliar:/ })).toHaveLength(1);
        expect(screen.getByRole('button', { name: 'Noivas' })).toHaveAttribute('aria-pressed', 'false');
        fireEvent.click(screen.getByRole('button', { name: 'Penteados' }));
        expect(screen.getAllByRole('button', { name: /^Ampliar:/ })).toHaveLength(portfolio.length);
    });

    it('abre a ampliação e mantém o CTA para o serviço correspondente', () => {
        render(<MemoryRouter><PortfolioGallery /></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: 'Penteados' }));
        fireEvent.click(screen.getByRole('button', { name: /^Ampliar:/ }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Quero uma produção nesse estilo' })).toHaveAttribute('href', '/agendar?servico=penteado');
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
