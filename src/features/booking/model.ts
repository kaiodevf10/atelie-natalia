import { z } from 'zod';
import { brand } from '../../config/brand';
import { services } from '../../data/content';
import { courseLevels, courseOptions } from '../../data/courses';
export function localToday(now = new Date()) { return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; }
export function isValidPreferredDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T12:00:00`);
    return !Number.isNaN(parsed.getTime()) && localToday(parsed) === value && value >= localToday();
}
export const referenceSchema = z.string().refine(value => !value.trim() || value.split('\n').map(line => line.trim()).filter(Boolean).every(line => { try {
    const url = new URL(line.trim());
    return ['http:', 'https:'].includes(url.protocol);
}
catch {
    return false;
} }), 'Use links completos começando com https://, um por linha.');
export const bookingSchema = z.object({
    service: z.enum(['maquiagem', 'penteado', 'completo', 'noiva']), occasion: z.string(), makeup: z.string(), hair: z.string(), length: z.string(), references: referenceSchema,
    date: z.string().refine(isValidPreferredDate, 'Escolha uma data válida a partir de hoje.'), time: z.string(), ceremony: z.string(), ready: z.string(), location: z.string().min(1, 'Informe o local de preferência.'), people: z.string(), companions: z.boolean(), name: z.string().trim().min(2, 'Informe seu nome (ao menos 2 letras).'), phone: z.string().refine(v => !v || /^[+\d\s()-]{8,22}$/.test(v), 'Confira o telefone informado.'), notes: z.string(),
}).superRefine((data, ctx) => {
    if (data.service !== 'penteado' && !data.makeup)
        ctx.addIssue({ code: 'custom', path: ['makeup'], message: 'Escolha um estilo ou peça orientação.' });
    if (data.service !== 'maquiagem' && !data.hair)
        ctx.addIssue({ code: 'custom', path: ['hair'], message: 'Escolha um penteado ou peça orientação.' });
    if (data.service !== 'noiva' && data.service !== 'penteado' && !data.occasion)
        ctx.addIssue({ code: 'custom', path: ['occasion'], message: 'Selecione a ocasião.' });
    if (data.service === 'noiva' && (!/^\d+$/.test(data.people) || Number(data.people) < 1))
        ctx.addIssue({ code: 'custom', path: ['people'], message: 'Informe ao menos 1 pessoa.' });
});
export type Booking = z.infer<typeof bookingSchema>;
export const initialBooking: Booking = { service: 'maquiagem', occasion: '', makeup: '', hair: '', length: '', references: '', date: '', time: '', ceremony: '', ready: '', location: '', people: '1', companions: false, name: '', phone: '', notes: '' };
export function bookingRows(data: Booking): [
    string,
    string
][] {
    return [
        ['Serviço', services.find(s => s.id === data.service)?.name ?? data.service], ['Nome', data.name], ['Contato', data.phone],
        ['Ocasião', data.service === 'noiva' ? 'Casamento' : data.occasion], ['Maquiagem', data.service === 'penteado' ? '' : data.makeup], ['Penteado', data.service === 'maquiagem' ? '' : data.hair], ['Comprimento do cabelo', data.service === 'maquiagem' ? '' : data.length], ['Referências visuais', data.references], ['Data', data.date ? data.date.split('-').reverse().join('/') : ''], ['Horário desejado', data.time], ['Horário da cerimônia', data.service === 'noiva' ? data.ceremony : ''], ['Preciso estar pronta às', data.service === 'noiva' ? data.ready : ''], ['Local', data.location], ['Pessoas para produção', data.service === 'noiva' ? data.people : ''], ['Consultar acompanhantes', data.service === 'noiva' ? (data.companions ? 'Sim' : 'Não') : ''], ['Observações', data.notes],
    ].filter((row): row is [
        string,
        string
    ] => Boolean(row[1]));
}
export function formatBookingMessage(data: Booking) { return `Olá! Gostaria de solicitar um atendimento no ${brand.name}.\n\n${bookingRows(data).map(([label, value]) => `${label}: ${value}`).join('\n\n')}\n\nGostaria de consultar a disponibilidade e solicitar um orçamento. Entendo que esta solicitação não confirma uma reserva.`; }
export function whatsappUrl(number: string | undefined, message: string) { if (!number || !/^[1-9]\d{9,14}$/.test(number))
    return null; return `https://wa.me/${number}?text=${encodeURIComponent(message)}`; }
export const courseSchema = z.object({
    name: z.string().trim().min(1, 'Informe seu nome para continuarmos.'),
    course: z.string().refine(value => courseOptions.some(option => option === value), 'Escolha um curso ou peça orientação.'),
    level: z.string().refine(value => courseLevels.some(option => option === value), 'Selecione seu nível de experiência.'),
    notes: z.string().trim().optional(),
});
export type CourseInterest = z.infer<typeof courseSchema>;
export function formatCourseMessage(data: CourseInterest) {
    const notes = data.notes?.trim() ?? '';
    const introduction = data.course === 'Ainda não sei, quero orientação'
        ? `Olá! Meu nome é ${data.name.trim()}. Ainda não sei qual curso escolher e gostaria de orientação.`
        : `Olá! Meu nome é ${data.name.trim()} e tenho interesse no ${data.course}.`;
    return `${introduction} Meu nível: ${data.level}.${notes ? ` ${notes}` : ''}`;
}
