import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './HomeAbout.css';

export default function HomeAbout({ portraitSrc }: { portraitSrc?: string }) {
    return <section className="home-about container" aria-labelledby="home-about-title">
        <Link to="/sobre" className="home-about-link" aria-labelledby="home-about-title home-about-action">
            <div className="home-about-portrait">
                <div className="home-about-photo">
                    {portraitSrc ? <img src={portraitSrc} alt="Natália Lucena" loading="lazy" /> : <span>Foto da Natália</span>}
                </div>
                <span className="home-about-name">Natália Lucena</span>
            </div>
            <div className="home-about-copy">
                <span className="home-about-label">Sobre</span>
                <h2 id="home-about-title">Tudo começou com uma <em>curiosidade.</em></h2>
                <p>Descubra como a Natália chegou até aqui.</p>
                <span id="home-about-action" className="home-about-action">Ler a história<ArrowRight size={20} aria-hidden="true" /></span>
            </div>
        </Link>
    </section>;
}
