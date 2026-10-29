import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Layout from './Layout';
import { Home, About, Services, Studio } from '../pages/Pages';
import BookingWizard from '../features/booking/BookingWizard';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('Navegação institucional', () => {
    it('mantém a orientação no Header e o convite compacto para o espaço no fim da Home', () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const { container } = render(<MemoryRouter><Routes><Route element={<Layout />}><Route path="/" element={<Home />} /></Route></Routes></MemoryRouter>);
        const main = container.querySelector('main')!;
        expect(within(main).queryByRole('button', { name: 'Como funciona?' })).not.toBeInTheDocument();
        expect(within(container.querySelector('header')!).getByRole('button', { name: 'Como funciona?' })).toBeInTheDocument();
        expect(container.querySelectorAll('a[href="/noivas"]')).toHaveLength(0);
        expect(main.querySelector('iframe')).toBeInTheDocument();
        expect(main.querySelector('.faq-preview')).not.toBeInTheDocument();
        expect(container.querySelector('footer a[href="https://www.instagram.com/natalialucenamaquiadora/"]')).toBeNull();
        expect(container.querySelector('footer a[href="https://www.instagram.com/atelienatalialucena/"]')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Como chegar' })).not.toBeInTheDocument();
        expect(screen.queryByText('Encontre a sua produção')).not.toBeInTheDocument();
        expect(screen.getByText('Da ocasião especial ao grande dia, uma beleza que faz sentido para você.')).toBeInTheDocument();
        expect(main.lastElementChild).toHaveAttribute('id', 'localizacao');
        expect(main.querySelectorAll('#localizacao')).toHaveLength(1);
        expect(screen.getByRole('link', { name: 'Tudo começou com uma curiosidade. Ler a história' })).toHaveAttribute('href', '/sobre');
        const about = screen.getByRole('region', { name: 'Tudo começou com uma curiosidade.' });
        expect(within(about).getAllByRole('link')).toHaveLength(1);
        expect(about.querySelector('a a, button')).toBeNull();
        expect(within(about).getByText('Foto da Natália')).toBeInTheDocument();
        expect(within(about).getByText('Natália Lucena')).toBeInTheDocument();
        expect(within(about).getByText('Sobre')).toBeInTheDocument();
        expect(within(about).getByText('Descubra como a Natália chegou até aqui.')).toBeInTheDocument();
        expect(about.querySelector('h2 em')).toHaveTextContent('curiosidade.');
        expect(about.querySelectorAll('em')).toHaveLength(1);
        expect(about.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.queryByText(/Mais do que produzir/)).not.toBeInTheDocument();
    });

    it('mantém os quatro cards da Home informativos e sem navegação', () => {
        const { container } = render(<MemoryRouter><Home /></MemoryRouter>);
        const grid = container.querySelector('.service-grid')!;
        const images = within(grid as HTMLElement).getAllByRole('img');
        expect(images).toHaveLength(4);
        expect(grid.querySelector('a.service-image,.image-arrow,button')).not.toBeInTheDocument();
        for (const image of images) {
            expect(image.closest('a')).toBeNull();
            expect(image.closest('button')).toBeNull();
        }
        expect(grid.querySelectorAll('a, button, svg, [onclick], [tabindex]')).toHaveLength(0);
        expect(grid.querySelectorAll('article > p')).toHaveLength(4);
        expect(screen.getByRole('link', { name: 'Todos os serviços' })).toHaveAttribute('href', '/servicos');
    });

    it('exibe Sobre no Header e no menu mobile preservando rota e estado ativo', () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const { container } = render(<MemoryRouter initialEntries={['/sobre']}><Routes><Route element={<Layout />}><Route path="/sobre" element={<About />} /></Route></Routes></MemoryRouter>);
        const header = within(container.querySelector('header')!);
        const about = header.getByRole('link', { name: 'Sobre' });
        expect(about).toHaveAttribute('href', '/sobre');
        expect(about).toHaveAttribute('aria-current', 'page');
        expect(about).toHaveClass('active');
        fireEvent.click(header.getByRole('button', { name: 'Abrir menu' }));
        const mobile = within(header.getByRole('navigation', { name: 'Menu mobile' }));
        expect(mobile.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/sobre');
        expect(header.queryByRole('link', { name: 'Sobre Natália' })).not.toBeInTheDocument();
        fireEvent.click(mobile.getByRole('link', { name: 'Sobre' }));
        expect(header.queryByRole('navigation', { name: 'Menu mobile' })).not.toBeInTheDocument();
    });

    it('preserva as imagens navegáveis e os serviços no catálogo', () => {
        const { container } = render(<MemoryRouter><Services /></MemoryRouter>);
        expect(container.querySelectorAll('a.service-image')).toHaveLength(4);
        expect(container.querySelector('.image-arrow')).not.toBeInTheDocument();
        for (const link of container.querySelectorAll('a.service-image')) {
            expect(link.querySelector('img')).toBeInTheDocument();
            expect(link.querySelector('svg,button')).not.toBeInTheDocument();
            expect(link).toHaveAttribute('href', expect.stringMatching(/^\/servicos\//));
        }
        expect(screen.getByRole('link', { name: 'Produção para noivas' })).toHaveAttribute('href', '/servicos/producao-para-noivas');
        for (const [text, id] of [
            ['Montar minha maquiagem', 'maquiagem'],
            ['Montar meu penteado', 'penteado'],
            ['Montar maquiagem + penteado', 'completo'],
            ['Montar produção para noivas', 'noiva'],
        ]) {
            const link = screen.getByRole('link', { name: text });
            expect(link).toHaveAttribute('href', `/agendar?servico=${id}`);
            expect(link.querySelector('svg')).toBeInTheDocument();
        }
        expect(screen.getByText('Maquiagem, penteado ou a produção completa. Escolha o que combina com a sua ocasião.')).toBeInTheDocument();
        expect(screen.getByText('Vamos conversar?')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Ainda em dúvida? Conte o que você imagina e a gente sugere o melhor caminho.' })).toBeInTheDocument();
        expect(screen.getByText('É só uma conversa para entender o que você precisa.')).toBeInTheDocument();
    });

    it('reutiliza os detalhes de localização na página do espaço sem inventar endereço', () => {
        const { container } = render(<MemoryRouter><Studio /></MemoryRouter>);
        expect(screen.getByRole('heading', { name: 'Um encontro com a sua beleza, em Niterói.' })).toBeInTheDocument();
        expect(container.querySelectorAll('.location-section')).toHaveLength(1);
        expect(screen.getByText('Endereço completo em confirmação.')).toBeInTheDocument();
        expect(container.querySelector('iframe')).not.toBeInTheDocument();
    });

    it('apresenta a Natália sem galeria de serviços ou imagens demonstrativas', () => {
        const { container } = render(<MemoryRouter><About /></MemoryRouter>);
        expect(container.querySelector('img,.portfolio-grid,.monogram-panel')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Prazer, eu sou a Natália.' })).toBeInTheDocument();
    });

    it('abre a ajuda pelo Header sem perder as preferências do formulário', async () => {
        vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const { container } = render(<MemoryRouter initialEntries={['/agendar?servico=noiva']}><Routes><Route element={<Layout />}><Route path="/agendar" element={<BookingWizard />} /></Route></Routes></MemoryRouter>);
        fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
        await screen.findByRole('heading', { name: 'Seu estilo' });
        fireEvent.click(screen.getByRole('radio', { name: 'Soft glam' }));
        expect(within(container.querySelector('main')!).queryByRole('button', { name: /ajuda|funciona/i })).not.toBeInTheDocument();
        fireEvent.click(within(container.querySelector('header')!).getByRole('button', { name: 'Como funciona?' }));
        expect(screen.getByRole('dialog', { name: 'Como funciona seu atendimento?' })).toBeInTheDocument();
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(screen.getByRole('radio', { name: 'Soft glam' })).toBeChecked();
        expect(screen.getByRole('heading', { name: 'Seu estilo' })).toBeInTheDocument();
    });
});
