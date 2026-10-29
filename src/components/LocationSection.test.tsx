import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LocationSection from './LocationSection';
import { locationLinks } from '../lib/location';

afterEach(cleanup);

describe('Localização confirmada', () => {
    it.each([null, '', '   '])('mantém apenas a cidade sem gerar mapa ou rota quando pendente (%s)', address => {
        const { container } = render(<LocationSection address={address} />);
        expect(screen.getByRole('heading', { name: 'Um lugar para o seu momento.' })).toBeInTheDocument();
        expect(screen.getByText('Endereço completo em confirmação.')).toBeInTheDocument();
        expect(container.querySelector('iframe')).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Como chegar' })).not.toBeInTheDocument();
        expect(locationLinks(address)).toBeNull();
    });

    it('usa o mesmo endereço configurado para o texto, o mapa e a direção', () => {
        // Fixture explicitamente demonstrativa; não é um endereço do ateliê.
        const address = 'Endereço de teste, 123, Niterói, RJ';
        render(<LocationSection address={address} />);
        const frame = screen.getByTitle(/Localização do Ateliê Natália Lucena/);
        const directions = screen.getByRole('link', { name: 'Como chegar' });
        expect(screen.getByText(address)).toBeInTheDocument();
        expect(new URL(frame.getAttribute('src')!).searchParams.get('q')).toBe(address);
        const url = new URL(directions.getAttribute('href')!);
        expect(url.origin).toBe('https://www.google.com');
        expect(url.pathname).toBe('/maps/dir/');
        expect(url.searchParams.get('api')).toBe('1');
        expect(url.searchParams.get('destination')).toBe(address);
        expect(directions).toHaveAttribute('target', '_blank');
    });
});
