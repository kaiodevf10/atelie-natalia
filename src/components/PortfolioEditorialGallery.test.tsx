import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PortfolioEditorialGallery from './PortfolioEditorialGallery';
import { categories } from '../data/content';
import { portfolioReferences } from '../data/portfolio';

afterEach(cleanup);

describe('Galeria editorial exclusiva do Portfólio', () => {
    it('mantém quinze fotografias distintas e cinco por categoria, sem filtro geral', () => {
        expect(portfolioReferences).toHaveLength(15);
        expect(new Set(portfolioReferences.map(item => item.image)).size).toBe(15);
        render(<PortfolioEditorialGallery />);
        expect(within(screen.getByRole('group')).getAllByRole('button')).toHaveLength(3);
        for (const category of categories) {
            expect(portfolioReferences.filter(item => item.category === category)).toHaveLength(5);
            fireEvent.click(screen.getByRole('button', { name: category }));
            expect(screen.getAllByRole('button', { name: /^Ampliar:/ })).toHaveLength(5);
            expect(screen.getByRole('button', { name: category })).toHaveAttribute('aria-pressed', 'true');
            fireEvent.click(screen.getByRole('button', { name: category }));
            expect(screen.getAllByRole('img')).toHaveLength(5);
        }
    });

    it('preserva ampliação, navegação, X, Escape e retorno do foco sem legendas', () => {
        render(<PortfolioEditorialGallery />);
        const trigger = screen.getAllByRole('button', { name: /^Ampliar:/ })[0];
        trigger.focus();
        fireEvent.click(trigger);
        const dialog = screen.getByRole('dialog');
        const firstSource = within(dialog).getByRole('img').getAttribute('src');
        expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
        expect(within(dialog).getByRole('img')).toHaveAccessibleName(/referência ilustrativa de terceiros/);
        fireEvent.click(within(dialog).getByRole('button', { name: 'Próxima imagem' }));
        expect(within(dialog).getByRole('img').getAttribute('src')).not.toBe(firstSource);
        fireEvent.click(within(dialog).getByRole('button', { name: 'Fechar imagem ampliada' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
        fireEvent.click(trigger);
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
