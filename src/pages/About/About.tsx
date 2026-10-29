import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { aboutPage } from '../../data/about-page';
import './about.css';

export default function About() {
    const { portrait, experienceYears, paragraphs, pillars } = aboutPage;
    return <div className="about-editorial container">
        <section className="about-introduction" aria-labelledby="about-title">
            <div className="about-introduction-heading">
                <span className="eyebrow">Sobre Natália</span>
                <h1 id="about-title">Prazer, eu sou a Natália.</h1>
                <p className="about-subtitle">Especialista em beleza para noivas.</p>
            </div>
            <figure className="about-portrait">
                <div className="about-portrait-frame">
                    {portrait.src ? <img src={portrait.src} alt={portrait.alt} />
                        : <div className="about-portrait-placeholder" role="img" aria-label={portrait.placeholder}><span aria-hidden="true">{portrait.placeholder}</span></div>}
                </div>
                <figcaption className="about-experience"><span>{experienceYears}</span><span>anos de experiência</span></figcaption>
            </figure>
            <div className="about-story">{paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>

        <section className="about-pillars" aria-labelledby="about-pillars-title">
            <h2 id="about-pillars-title">Escuta, identidade e cuidado.</h2>
            <ol>{pillars.map(pillar => <li key={pillar.number}>
                <span className="about-pillar-number" aria-hidden="true">{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
            </li>)}</ol>
        </section>

        <section className="about-explore" aria-labelledby="about-explore-title">
            <h2 id="about-explore-title" className="eyebrow">Continue conhecendo</h2>
            <div className="about-explore-grid">
                <article className="about-explore-card">
                    <h3>Aprenda comigo.</h3>
                    <p>Cursos de maquiagem para quem quer se desenvolver na área da beleza, com o olhar de quem vive isso todos os dias.</p>
                    <Link className="text-link" to="/cursos">Conhecer os cursos<ArrowUpRight size={18} aria-hidden="true" /></Link>
                </article>
                <article className="about-explore-card about-explore-card--dark">
                    <h3>Veja o meu trabalho.</h3>
                    <p>Noivas, produções sociais e penteados: um olhar sobre como cada história se transforma em beleza.</p>
                    <Link className="text-link" to="/portfolio">Ver portfólio<ArrowUpRight size={18} aria-hidden="true" /></Link>
                </article>
            </div>
        </section>
    </div>;
}
