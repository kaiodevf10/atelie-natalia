import { useState } from 'react';
import { Clock3, MapPin, Navigation } from 'lucide-react';
import { brand } from '../config/brand';
import { homeMapLocation } from '../lib/location';
import './HomeLocation.css';

export default function HomeLocation() {
    const { confirmed: location, embed, external } = homeMapLocation();
    const [mapFailed, setMapFailed] = useState(false);
    return <section id="localizacao" className="home-location" aria-labelledby="studio-preview-title">
        <div className="home-location-copy">
            <h2 id="studio-preview-title" tabIndex={-1}>Um lugar para o seu momento</h2>
            <p className="home-location-description">Atendemos em Niterói, em um espaço pensado para você chegar com calma e sair pronta.</p>
            <div className="home-location-details">
                <div className="home-location-detail"><MapPin size={24} aria-hidden="true" /><address>{location && <>{location.address}<br /></>}{brand.city}</address></div>
                {brand.hours?.trim() && <div className="home-location-detail"><Clock3 size={24} aria-hidden="true" /><span>{brand.hours}</span></div>}
            </div>
            <div className="home-location-actions">
                {location ? <a className="button" href={location.directions} target="_blank" rel="noreferrer"><Navigation size={20} aria-hidden="true" />Como chegar</a>
                    : <button className="button" type="button" disabled><Navigation size={20} aria-hidden="true" />Como chegar</button>}
            </div>
        </div>
        <figure className="home-location-map-figure">
            <div className="home-location-map">
                {mapFailed ? <p className="home-location-map-error" role="status">Não foi possível carregar o mapa. <a href={external} target="_blank" rel="noreferrer">Abrir no Google Maps</a></p>
                    : <iframe title={location ? `Localização do ${brand.name} no Google Maps` : `Google Maps — referência regional de ${brand.city}`} src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen onError={() => setMapFailed(true)} />}
            </div>
        </figure>
    </section>;
}
