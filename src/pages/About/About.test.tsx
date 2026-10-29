import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import About from './About';
import { aboutPage } from '../../data/about-page';

afterEach(cleanup);

describe('Apresentação da Natália', () => {
    it('apresenta a biografia fornecida, o placeholder identificado e o selo configurável', () => {
        render(<MemoryRouter><About /></MemoryRouter>);
        for (const paragraph of aboutPage.paragraphs) expect(screen.getByText(paragraph)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Foto da Natália (ilustrativa)' })).toBeInTheDocument();
        expect(screen.getByText(String(aboutPage.experienceYears))).toBeInTheDocument();
        expect(screen.getByText('anos de experiência')).toBeInTheDocument();
    });
    it('remove o atendimento e termina com os dois caminhos de navegação', () => {
        const { container } = render(<MemoryRouter><About /></MemoryRouter>);
        expect(container.querySelector('.contact-cta')).not.toBeInTheDocument();
        expect(screen.queryByText('Conversar sobre meu atendimento')).not.toBeInTheDocument();
        expect(screen.queryByText('Maquiagem, produções para noivas e ensino profissionalizante se encontram em uma abordagem que valoriza a individualidade.')).not.toBeInTheDocument();
        const explore = screen.getByRole('region', { name: 'Continue conhecendo' });
        expect(container.firstElementChild?.lastElementChild).toBe(explore);
        expect(within(explore).getByRole('link', { name: 'Conhecer os cursos' })).toHaveAttribute('href', '/cursos');
        expect(within(explore).getByRole('link', { name: 'Ver portfólio' })).toHaveAttribute('href', '/portfolio');
        expect(screen.getAllByRole('link')).toHaveLength(2);
    });
    it('organiza os três pilares com títulos e descrições completos', () => {
        render(<MemoryRouter><About /></MemoryRouter>);
        const pillars = screen.getByRole('region', { name: 'Escuta, identidade e cuidado.' });
        expect(within(pillars).getAllByRole('listitem')).toHaveLength(3);
        for (const pillar of aboutPage.pillars) {
            expect(within(pillars).getByRole('heading', { name: pillar.title })).toBeInTheDocument();
            expect(within(pillars).getByText(pillar.description)).toBeInTheDocument();
        }
    });
});
