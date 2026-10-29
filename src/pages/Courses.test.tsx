import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Courses, Home } from './Pages';
import { courses, courseFAQs, courseDisclaimer } from '../data/courses';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('Página de Cursos', () => {
    it('mantém a composição geométrica na Home e navega para o Hero original dos cursos', () => {
        const { container } = render(<MemoryRouter><Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<Courses />} />
        </Routes></MemoryRouter>);
        expect(screen.getByRole('heading', { name: 'Aprenda maquiagem com quem vive disso' })).toBeInTheDocument();
        expect(screen.queryByText('Seu interesse por beleza pode ir mais longe.')).not.toBeInTheDocument();
        expect(container.querySelectorAll('.home-courses')).toHaveLength(1);
        expect(container.querySelectorAll('.home-courses-swatch')).toHaveLength(3);
        expect(screen.queryByText('Paleta de sombras')).not.toBeInTheDocument();
        expect(container.querySelector('.home-courses img')).toBeNull();
        fireEvent.click(screen.getByRole('link', { name: 'Conhecer os cursos' }));
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Aprenda maquiagem com quem vive a beleza todos os dias.');
        expect(screen.getByRole('link', { name: 'Quero saber mais' })).toHaveAttribute('href', '#interesse');
        expect(screen.queryByText('Paleta de sombras')).not.toBeInTheDocument();
    });

    it('apresenta os dois cursos completos e a FAQ demonstrativa sem o bloco antigo', () => {
        const { container } = render(<MemoryRouter><Courses /></MemoryRouter>);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Aprenda maquiagem com quem vive a beleza todos os dias.');
        expect(screen.getAllByRole('article')).toHaveLength(2);
        for (const course of courses) {
            expect(screen.getByRole('heading', { name: course.title })).toBeInTheDocument();
            for (const value of [course.duration, course.classSize, course.certificate, course.material, course.price, course.payment]) {
                expect(screen.getByText(value)).toBeInTheDocument();
            }
        }
        expect(screen.getByText(courseDisclaimer)).toBeInTheDocument();
        expect(container.querySelectorAll('details')).toHaveLength(3);
        for (const item of courseFAQs) {
            expect(screen.getByText(item.q)).toBeInTheDocument();
            expect(screen.getByText(item.a)).toBeInTheDocument();
        }
        expect(screen.queryByText('Conhecimento para os seus próximos passos.')).not.toBeInTheDocument();
        expect(screen.queryByText('Como recebo informações sobre os cursos?')).not.toBeInTheDocument();
    });

    it.each([false, true])('rola ao formulário e respeita movimento reduzido: %s', reducedMotion => {
        vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reducedMotion })));
        render(<MemoryRouter><Courses /></MemoryRouter>);
        const form = document.getElementById('interesse')!;
        const scroll = vi.fn();
        form.scrollIntoView = scroll;
        fireEvent.click(screen.getByRole('link', { name: 'Quero saber mais' }));
        expect(scroll).toHaveBeenCalledWith({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
        expect(screen.getByRole('heading', { name: 'Quero saber mais sobre os cursos.' })).toHaveFocus();
    });
});
