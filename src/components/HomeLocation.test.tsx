import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HomeLocation from './HomeLocation';
import { brand } from '../config/brand';

const originalAddress = brand.address;
afterEach(() => { cleanup(); brand.address = originalAddress; vi.restoreAllMocks(); });

describe('Localização da Home', () => {
    it('exibe Google Maps regional sem oferecer rota exata nem dados não confirmados', () => {
        const { container } = render(<HomeLocation />);
        expect(screen.getByRole('heading', { name: 'Um lugar para o seu momento' })).toBeInTheDocument();
        expect(container.querySelectorAll('#localizacao')).toHaveLength(1);
        if (!brand.address) {
            expect(screen.getByRole('button', { name: 'Como chegar' })).toBeDisabled();
            expect(container.querySelector('address')).toHaveTextContent(brand.city);
            expect(screen.getByTitle(`Google Maps — referência regional de ${brand.city}`)).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(brand.city)));
        }
        expect(container.querySelector('iframe')).toHaveAttribute('loading', 'lazy');
        expect(screen.queryByText('Onde estamos')).not.toBeInTheDocument();
        expect(container.querySelector('figcaption')).toBeNull();
        expect(screen.queryByRole('link', { name: 'Abrir no Google Maps' })).not.toBeInTheDocument();
        expect(container.querySelector('.home-location-map svg')).toBeNull();
        expect(screen.queryByText(/Endereço completo em confirmação|Chamar no WhatsApp|WhatsApp oficial em configuração|Mapa do Google embutido aqui/)).not.toBeInTheDocument();
        if (!brand.hours) expect(screen.queryByText('[Dias e horários, com agendamento]')).not.toBeInTheDocument();
    });

    it('usa somente o endereço confirmado para a rota', () => {
        brand.address = 'Endereço oficial de teste';
        render(<HomeLocation />);
        expect(screen.getByRole('link', { name: 'Como chegar' })).toHaveAttribute('href', expect.stringContaining(encodeURIComponent('Endereço oficial de teste')));
    });

    it('oferece uma alternativa discreta quando o iframe sinaliza erro', () => {
        const { container } = render(<HomeLocation />);
        fireEvent.error(container.querySelector('iframe')!);
        expect(screen.getByRole('status')).toHaveTextContent('Não foi possível carregar o mapa.');
        expect(container.querySelector('iframe')).toBeNull();
    });
});

