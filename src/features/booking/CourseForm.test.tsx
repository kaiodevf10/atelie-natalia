import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CourseForm from './CourseForm';

vi.mock('../../config/brand', () => ({ brand: { name: 'Ateliê Natália Lucena' }, whatsappNumber: undefined }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function fillForm() {
    fireEvent.change(screen.getByPlaceholderText('Como podemos chamar você?'), { target: { value: '  Ana  ' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Curso de automaquiagem' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Nunca maquiei' }));
}

describe('Interesse em cursos', () => {
    it('mantém três perguntas obrigatórias e observação opcional; impede submissão inválida', async () => {
        const { container } = render(<CourseForm />);
        expect(container.querySelectorAll('input[type="text"],input:not([type]),select,textarea')).toHaveLength(3);
        expect(screen.getAllByRole('radio')).toHaveLength(3);
        expect(screen.getByRole('textbox', { name: 'Quer contar mais alguma coisa?' })).not.toBeRequired();
        const button = screen.getByRole('button', { name: 'Falar no WhatsApp' });
        expect(button).toHaveAttribute('aria-disabled', 'true');
        fireEvent.click(button);
        expect(await screen.findAllByRole('alert')).toHaveLength(3);
        expect(screen.queryByRole('button', { name: 'Copiar mensagem' })).not.toBeInTheDocument();
        expect(screen.queryByText('Contato (opcional)')).not.toBeInTheDocument();
        expect(screen.queryByText(/Seu objetivo/)).not.toBeInTheDocument();
    });

    it('seleciona apenas um nível e permite copiar a mensagem se não houver número oficial', async () => {
        render(<CourseForm />);
        fillForm();
        fireEvent.click(screen.getByRole('radio', { name: 'Já me maquio' }));
        expect(screen.getByRole('radio', { name: 'Nunca maquiei' })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Já me maquio' })).toBeChecked();
        const button = screen.getByRole('button', { name: 'Falar no WhatsApp' });
        await waitFor(() => expect(button).toHaveAttribute('aria-disabled', 'false'));
        fireEvent.click(button);
        expect(await screen.findByText('Olá! Meu nome é Ana e tenho interesse no Curso de automaquiagem. Meu nível: Já me maquio.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Copiar mensagem' })).toBeInTheDocument();
        fireEvent.change(screen.getByRole('textbox', { name: 'Seu nome' }), { target: { value: 'Maria' } });
        expect(screen.queryByRole('button', { name: 'Copiar mensagem' })).not.toBeInTheDocument();
    });

    it('recusa nome composto somente de espaços e aceita orientação sem observações', async () => {
        render(<CourseForm />);
        fillForm();
        fireEvent.change(screen.getByRole('textbox', { name: 'Seu nome' }), { target: { value: '   ' } });
        fireEvent.click(screen.getByRole('button', { name: 'Falar no WhatsApp' }));
        expect(await screen.findByText('Informe seu nome para continuarmos.')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('textbox', { name: /Seu nome/ }), { target: { value: 'Ana' } });
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Ainda não sei, quero orientação' } });
        fireEvent.click(screen.getByRole('button', { name: 'Falar no WhatsApp' }));
        expect(await screen.findByText('Olá! Meu nome é Ana. Ainda não sei qual curso escolher e gostaria de orientação. Meu nível: Nunca maquiei.')).toBeInTheDocument();
    });
});
