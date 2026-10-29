import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, formatCourseMessage, whatsappUrl } from './model';
import type { CourseInterest } from './model';
import { courseLevels, courseOptions } from '../../data/courses';
import { whatsappNumber } from '../../config/brand';

export default function CourseForm() {
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<CourseInterest>({
        resolver: zodResolver(courseSchema), mode: 'onChange',
        defaultValues: { name: '', course: '', level: '', notes: '' },
    });

    function submit(data: CourseInterest) {
        const text = formatCourseMessage(data);
        const url = whatsappUrl(whatsappNumber, text);
        if (url) window.location.assign(url);
        else setMessage(text);
    }

    async function copyMessage() {
        try {
            await navigator.clipboard.writeText(message);
            setFeedback('Mensagem copiada. Cole na conversa com o ateliê.');
        } catch {
            setFeedback('Selecione e copie a mensagem abaixo para continuar a conversa.');
        }
    }

    return <section className="course-form course-interest-form" id="interesse" aria-labelledby="course-form-title">
        <h2 id="course-form-title" tabIndex={-1}>Quero saber mais sobre os cursos.</h2>
        <p>Responda 3 perguntas rápidas e a conversa continua pelo WhatsApp.</p>
        <form className="form-stack" onChange={() => { setMessage(''); setFeedback(''); }} onSubmit={handleSubmit(submit)} noValidate>
            <p className="course-required-hint">Os três primeiros campos são obrigatórios. As observações são opcionais.</p>
            <label className="field">
                <span>Seu nome</span>
                <input {...register('name')} required autoComplete="given-name" placeholder="Como podemos chamar você?" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'course-name-error' : undefined} />
                {errors.name && <small id="course-name-error" className="field-error" role="alert">{errors.name.message}</small>}
            </label>
            <label className="field">
                <span>Curso de interesse</span>
                <select {...register('course')} required aria-invalid={!!errors.course} aria-describedby={errors.course ? 'course-selection-error' : undefined}>
                    <option value="" disabled>Selecione</option>
                    {courseOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                {errors.course && <small id="course-selection-error" className="field-error" role="alert">{errors.course.message}</small>}
            </label>
            <fieldset className="choice-field course-experience" aria-describedby={errors.level ? 'course-level-error' : undefined}>
                <legend>Nível de experiência</legend>
                <div className="course-level-options">
                    {courseLevels.map(level => <label className="course-level-option" key={level}>
                        <input type="radio" value={level} {...register('level')} required aria-invalid={!!errors.level} />
                        <span>{level}</span>
                    </label>)}
                </div>
                {errors.level && <small id="course-level-error" className="field-error" role="alert">{errors.level.message}</small>}
            </fieldset>
            <label className="field">
                <span>Quer contar mais alguma coisa?</span>
                <textarea rows={3} {...register('notes')} placeholder="Se quiser, conte um pouco mais sobre o que procura." />
            </label>
            <button className="button course-whatsapp-button" type="submit" aria-disabled={!isValid}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.449A11.825 11.825 0 0 0 12.106 0C5.553 0 .22 5.334.22 11.893c0 2.096.547 4.142 1.588 5.945L.12 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.887-5.334 11.887-11.893 0-3.177-1.237-6.164-3.48-8.452zM12.113 21.785a9.862 9.862 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374a9.872 9.872 0 0 1-1.512-5.259c0-5.45 4.434-9.884 9.888-9.884a9.814 9.814 0 0 1 6.99 2.9 9.825 9.825 0 0 1 2.893 6.994c0 5.45-4.434 9.882-9.889 9.882zm5.424-7.403c-.297-.149-1.758-.867-2.03-.966-.272-.099-.47-.149-.668.149-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.52-.074-.149-.668-1.611-.915-2.206-.241-.579-.484-.5-.668-.51l-.57-.01c-.198 0-.52.075-.792.372-.272.298-1.04 1.017-1.04 2.479s1.065 2.875 1.214 3.073c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.711.226 1.358.194 1.87.118.57-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                Falar no WhatsApp
            </button>
            <p className="privacy">O WhatsApp abre com a mensagem pronta. A confirmação de vaga acontece na conversa.</p>
        </form>
        {message && <div className="course-message-fallback">
            <p>O WhatsApp oficial ainda não está configurado. Você pode copiar a mensagem para conversar com o ateliê.</p>
            <pre tabIndex={0}>{message}</pre>
            <button type="button" className="button secondary" onClick={copyMessage}>Copiar mensagem</button>
            <p role="status">{feedback}</p>
        </div>}
    </section>;
}
