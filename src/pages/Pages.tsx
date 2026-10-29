import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { services, photos, faqs } from '../data/content';
import { ButtonLink, ContactCTA, FAQAccordion, Heading, Photo } from '../components/ui';
import PortfolioGallery from '../components/PortfolioGallery';
import PortfolioEditorialGallery from '../components/PortfolioEditorialGallery';
import CourseForm from '../features/booking/CourseForm';
import { courses, courseFAQs, courseDisclaimer } from '../data/courses';
import './Courses.css';
import './HomeCourses.css';
import BookingWizard from '../features/booking/BookingWizard';
import LocationSection from '../components/LocationSection';
import HomeLocation from '../components/HomeLocation';
import HomeAbout from '../components/HomeAbout';
import ServicesContactAction from '../components/ServicesContactAction';

const catalogCopy = {
    maquiagem: { description: 'Para festas, formaturas e eventos. Do natural ao marcante, uma maquiagem que valoriza o seu rosto.', action: 'Montar minha maquiagem' },
    penteado: { description: 'Do coque clássico aos cachos soltos, penteados para festas e eventos, pensados para o seu tipo de cabelo.', action: 'Montar meu penteado' },
    completo: { description: 'O conjunto completo para o seu evento. Tudo resolvido em um só lugar, sem correria.', action: 'Montar maquiagem + penteado' },
    noiva: { description: 'Seu grande dia com calma e cuidado, do planejamento ao último retoque.', action: 'Montar produção para noivas' },
};
export function ServiceCards({ informational = false }: { informational?: boolean }) {
    if (informational) return <div className="service-grid service-grid--home">{services.map(service =>
        <article className="service-card" key={service.id}>
            <div className="service-image"><Photo src={service.image} alt={`Inspiração para ${service.name.toLowerCase()}`} /></div>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
        </article>
    )}</div>;
    return <div className="service-grid">{services.map(service => {
        const photo = <Photo src={service.image} alt={`Inspiração para ${service.name.toLowerCase()}`} />;
        return <article className="service-card" key={service.id}>
            <Link to={`/servicos/${service.slug}`} className="service-image">{photo}</Link>
            <h3><Link to={`/servicos/${service.slug}`}>{service.name}</Link></h3>
            <p>{catalogCopy[service.id].description}</p>
            <Link className="text-link" to={`/agendar?servico=${service.id}`}>{catalogCopy[service.id].action}<ArrowUpRight size={15} /></Link>
        </article>;
    })}</div>;
}
function PageIntro({ title, text, kicker }: {
    title: string;
    text?: string;
    kicker?: string;
}) { return <section className="page-intro container">{kicker && <span className="eyebrow">{kicker}</span>}<h1>{title}</h1>{text && <p>{text}</p>}</section>; }
export function Home() { return <><section className="home-hero"><div className="hero-copy"><h1>Sua beleza tem história.<br />Nosso trabalho é valorizá-la.</h1><p>Cada produção é pensada para acompanhar seu estilo e os momentos que merecem ser lembrados.</p><div className="hero-buttons"><ButtonLink to="/servicos">Conhecer serviços</ButtonLink><Link to="/agendar" className="text-link">Solicitar atendimento<ArrowUpRight size={16}/></Link></div></div><div className="hero-visual"><Photo src={photos.makeup} alt="Retrato de beleza com maquiagem — referência demonstrativa" eager/><div className="hero-inset"><Photo src={photos.hero} alt="Detalhes de produtos de maquiagem — referência demonstrativa" eager/><span>O cuidado está nos detalhes.</span></div></div></section><section className="container section" id="servicos"><div className="heading-row"><Heading title="O cuidado que combina com o seu momento." text="Da ocasião especial ao grande dia, uma beleza que faz sentido para você."/><Link to="/servicos" className="text-link">Todos os serviços<ArrowUpRight size={16}/></Link></div><ServiceCards informational /></section><HomeAbout /><section className="container section pt-0"><div className="heading-row"><Heading title="Beleza para inspirar o seu momento."/><Link className="text-link" to="/portfolio">Explorar portfólio<ArrowUpRight size={16}/></Link></div><PortfolioGallery preview controlsOnly/></section><section className="home-courses" aria-labelledby="home-courses-title">
            <span className="home-courses-label">Cursos de maquiagem</span>
            <div className="home-courses-visual" aria-hidden="true">
                <div className="home-courses-palette">
                    <div className="home-courses-swatch home-courses-swatch--rose" />
                    <div className="home-courses-swatch home-courses-swatch--beige" aria-hidden="true" />
                    <div className="home-courses-swatch home-courses-swatch--espresso" aria-hidden="true" />
                </div>
            </div>
            <div className="home-courses-copy">
                <h2 id="home-courses-title">Aprenda maquiagem com quem vive disso</h2>
                <p>Técnica, pele e acabamento ensinados por quem faz isso todos os dias. Conheça a proposta dos cursos e converse com a equipe.</p>
                <Link className="button" to="/cursos">Conhecer os cursos<ArrowRight size={20} aria-hidden="true" /></Link>
            </div>
        </section><ContactCTA centered /><HomeLocation /></>; }
export function Services() { return <><PageIntro kicker="Nossos serviços" title="O cuidado que combina com o seu momento." text="Maquiagem, penteado ou a produção completa. Escolha o que combina com a sua ocasião."/><section className="container section pt-0"><ServiceCards /></section><ContactCTA centered className="contact-cta--services" eyebrow="Vamos conversar?" title="Ainda em dúvida? Conte o que você imagina e a gente sugere o melhor caminho." description="É só uma conversa para entender o que você precisa." action={<ServicesContactAction />} /></>; }
export function ServiceDetails() { const { slug } = useParams(); const service = services.find(s => s.slug === slug); if (!service)
    return <NotFound />; return <><section className="detail-hero container"><div><Link to="/servicos" className="text-link">Todos os serviços</Link><h1>{service.name}</h1><p>{service.description}</p><ButtonLink to={`/agendar?servico=${service.id}`}>Personalizar meu atendimento</ButtonLink></div><Photo src={service.image} alt={`Referência de ${service.name}`}/></section><section className="container section detail-info"><Heading title="Uma produção que começa na escuta." text={service.occasion}/><div><h3>Do seu jeito</h3><p>Compartilhe suas preferências e referências. A equipe poderá conversar sobre os detalhes da produção e orientar suas escolhas.</p><h3>Como se preparar</h3><p>Informe a data, o local e o horário em que deseja estar pronta. As orientações de preparação, valores e condições serão confirmadas diretamente com a equipe.</p><p className="notice">Não há reserva automática. A disponibilidade depende de confirmação.</p></div></section><section className="container section pt-0"><Heading title="Encontre sua inspiração."/><PortfolioGallery preview/></section><ContactCTA /></>; }
export function Portfolio() { return <><PageIntro title="Inspire-se para o seu momento." text="Explore estilos e encontre o que mais combina com você e leve como referência para o seu atendimento."/><section className="container section pt-0"><PortfolioEditorialGallery /></section><ContactCTA centered className="contact-cta--portfolio" eyebrow="Gostou de algum estilo?" title="Viu um estilo que combina com você? monte o seu atendimento." description="Monte tudo em poucos passos e envie direto para o WhatsApp" /></>; }
export function Courses() {
    return <div className="courses-page">
        <section className="detail-hero container courses-hero">
            <div>
                <span className="eyebrow">Cursos de maquiagem</span>
                <h1>Aprenda maquiagem com quem vive a beleza todos os dias.</h1>
                <p>Do básico ao profissional: aprenda técnicas, escolha de produtos e acabamento com a Natália.</p>
                <a className="button" href="#interesse" onClick={event => {
                    const form = document.getElementById('interesse');
                    if (!form) return;
                    event.preventDefault();
                    document.getElementById('course-form-title')?.focus({ preventScroll: true });
                    form.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
                }}>Quero saber mais<ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <Photo src={photos.tools} alt="Produtos e instrumentos de maquiagem — imagem demonstrativa" />
        </section>
        <section className="container section courses-catalog" aria-labelledby="courses-catalog-title">
            <div className="section-heading">
                <span className="eyebrow">Como funciona</span>
                <h2 id="courses-catalog-title">Escolha o curso que combina com você.</h2>
            </div>
            <p className="courses-disclaimer">{courseDisclaimer}</p>
            <div className="courses-comparison">
                {courses.map((course, index) => <article className="courses-offering" key={course.title} aria-labelledby={`course-title-${index}`}>
                    <h3 id={`course-title-${index}`}>{course.title}</h3>
                    <dl className="courses-details">
                        {([
                            ['Duração', course.duration], ['Formato', course.format], ['Turma', course.classSize],
                            ['Certificado', course.certificate], ['Material', course.material],
                        ] as const).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                    </dl>
                    <dl className="courses-pricing">
                        <div><dt>Valor</dt><dd className="courses-price">{course.price}</dd></div>
                        <div><dt>Pagamento</dt><dd>{course.payment}</dd></div>
                    </dl>
                </article>)}
            </div>
        </section>
        <div className="container"><CourseForm /></div>
        <section className="container section courses-faq">
            <Heading title="Dúvidas sobre os cursos?" />
            <FAQAccordion items={courseFAQs} />
        </section>
    </div>;
}
export { default as About } from './About/About';
export function Studio() { return <><PageIntro kicker="Nosso espaço" title="Um encontro com a sua beleza, em Niterói." text="O espaço físico do Ateliê Natália Lucena faz parte da experiência de preparação. Conheça as informações disponíveis e consulte a equipe antes da sua visita."/><LocationSection /><ContactCTA /></>; }
export function FAQ() { return <><PageIntro kicker="Dúvidas frequentes" title="Informação também é cuidado." text="Encontre orientações para preparar sua solicitação. Condições específicas devem ser confirmadas com a equipe."/><section className="container faq-page">{Array.from(new Set(faqs.map(x => x.group))).map(group => <section key={group}><h2>{group}</h2><FAQAccordion items={faqs.filter(x => x.group === group)}/></section>)}</section><ContactCTA /></>; }
export function BookingPage() { return <div className="container booking-page"><BookingWizard /></div>; }
export function NotFound() { return <section className="container empty-state"><span className="eyebrow">Página não encontrada</span><h1>Vamos encontrar seu caminho?</h1><p>Explore nossos serviços ou personalize uma solicitação de atendimento.</p><ButtonLink to="/">Voltar ao início</ButtonLink></section>; }
