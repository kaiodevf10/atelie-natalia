import { describe, expect, it } from 'vitest';
import { bookingSchema, initialBooking, localToday, referenceSchema, formatBookingMessage, whatsappUrl, courseSchema, formatCourseMessage } from './model';
const valid = { ...initialBooking, name: 'Ana Oliveira', date: '2099-12-12', location: 'No ateliê', makeup: 'Soft glam', occasion: 'Festa' };
describe('Validação do pré-atendimento', () => {
    it('aceita um pedido social completo', () => expect(bookingSchema.safeParse(valid).success).toBe(true));
    it('exige nome, data, local e estilo', () => { const result = bookingSchema.safeParse(initialBooking); expect(result.success).toBe(false); if (!result.success)
        expect(result.error.issues.map(x => x.path[0])).toEqual(expect.arrayContaining(['name', 'date', 'location', 'makeup', 'occasion'])); });
    it('recusa datas passadas', () => expect(bookingSchema.safeParse({ ...valid, date: '2000-01-01' }).success).toBe(false));
    it('usa data local sem conversão para UTC', () => expect(localToday(new Date(2026, 0, 2, 23, 50))).toBe('2026-01-02'));
    it('valida referências em múltiplas linhas e bloqueia protocolos inseguros', () => { expect(referenceSchema.safeParse('https://pinterest.com/a\nhttps://instagram.com/b').success).toBe(true); expect(referenceSchema.safeParse('javascript:alert(1)').success).toBe(false); expect(referenceSchema.safeParse('isso não é um link').success).toBe(false); expect(referenceSchema.safeParse('').success).toBe(true); });
    it('exige penteado para produção de noiva e ao menos uma pessoa', () => { expect(bookingSchema.safeParse({ ...valid, service: 'noiva', hair: '' }).success).toBe(false); expect(bookingSchema.safeParse({ ...valid, service: 'noiva', hair: 'Preso', people: '0' }).success).toBe(false); expect(bookingSchema.safeParse({ ...valid, service: 'noiva', hair: 'Preso', people: '3' }).success).toBe(true); });
    it('não exige maquiagem para penteado', () => expect(bookingSchema.safeParse({ ...valid, service: 'penteado', makeup: '', occasion: '', hair: 'Ondas' }).success).toBe(true));
});
describe('Mensagens e transporte', () => {
    it('inclui detalhes da noiva sem inventar uma reserva', () => { const msg = formatBookingMessage({ ...valid, service: 'noiva', hair: 'Preso', ready: '14:00', ceremony: '16:00', people: '3', companions: true, references: 'https://pinterest.com/a', notes: 'Pele iluminada' }); for (const text of ['Ana Oliveira', '12/12/2099', '14:00', '16:00', 'Pessoas para produção: 3', 'Consultar acompanhantes: Sim', 'https://pinterest.com/a', 'Pele iluminada', 'não confirma uma reserva'])
        expect(msg).toContain(text); });
    it('omite campos que não pertencem ao serviço', () => { const msg = formatBookingMessage({ ...valid, hair: 'Preso', people: '4' }); expect(msg).not.toContain('Penteado:'); expect(msg).not.toContain('Pessoas para produção:'); });
    it('não gera URL para número ausente ou inválido', () => { for (const number of [undefined, '', '00000000000', '+55 (21) 99999-9999', '123'])
        expect(whatsappUrl(number, 'Olá')).toBeNull(); });
    it('codifica a mensagem sem perder acentos e quebras de linha', () => { const message = 'Olá!\nNome: Natália & Ana'; const url = whatsappUrl('5521999999999', message); expect(url).toBe(`https://wa.me/5521999999999?text=${encodeURIComponent(message)}`); });
    it('valida somente os três campos obrigatórios do curso e remove espaços', () => {
        const data = { name: '  Ana  ', course: 'Curso de automaquiagem', level: 'Nunca maquiei', notes: '  ' };
        expect(courseSchema.safeParse({}).success).toBe(false);
        expect(courseSchema.parse(data)).toEqual({ ...data, name: 'Ana', notes: '' });
        expect(courseSchema.safeParse({ name: 'Ana', course: data.course, level: data.level }).success).toBe(true);
        for (const change of [{ name: '   ' }, { course: '' }, { level: '' }, { course: 'Outro' }, { level: 'Outro' }]) {
            expect(courseSchema.safeParse({ ...data, ...change }).success).toBe(false);
        }
    });
    it('formata os dois cursos e omite observações vazias sem espaços extras', () => {
        for (const course of ['Curso de automaquiagem', 'Curso profissional de maquiagem']) {
            expect(formatCourseMessage({ name: '  Ana  ', course, level: 'Nunca maquiei', notes: '  ' }))
                .toBe(`Olá! Meu nome é Ana e tenho interesse no ${course}. Meu nível: Nunca maquiei.`);
        }
    });
    it('inclui a observação e trata a opção de orientação especificamente', () => {
        expect(formatCourseMessage({ name: 'Ana', course: 'Curso de automaquiagem', level: 'Nunca maquiei', notes: ' Gostaria de saber quando será a próxima turma. ' }))
            .toBe('Olá! Meu nome é Ana e tenho interesse no Curso de automaquiagem. Meu nível: Nunca maquiei. Gostaria de saber quando será a próxima turma.');
        expect(formatCourseMessage({ name: 'Ana', course: 'Ainda não sei, quero orientação', level: 'Já me maquio', notes: '' }))
            .toBe('Olá! Meu nome é Ana. Ainda não sei qual curso escolher e gostaria de orientação. Meu nível: Já me maquio.');
    });
});
