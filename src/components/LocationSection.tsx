import { ArrowUpRight, MapPin } from 'lucide-react';
import { brand } from '../config/brand';
import { locationLinks } from '../lib/location';

export default function LocationSection({ address = brand.address }: { address?: string | null }) {
    const location = locationLinks(address);
    return <section id="localizacao" className="location-section container" aria-labelledby="location-title">
        <div className="location-copy">
            <h2 id="location-title" tabIndex={-1}>Um lugar para o seu momento.</h2>
            <p>Conheça o Ateliê Natália Lucena em Niterói e descubra onde nossa equipe recebe as clientes para seus momentos especiais.</p>
            <p className="location-city"><MapPin size={18} aria-hidden="true" />{brand.city}</p>
            {location ? <>
                <address>{location.address}</address>
                <a className="button secondary" href={location.directions} target="_blank" rel="noreferrer">Como chegar<ArrowUpRight size={16} aria-hidden="true" /></a>
            </> : <p className="location-note">Endereço completo em confirmação.</p>}
        </div>
        <div className="location-panel">
            {location ? <iframe title={`Localização do ${brand.name} no Google Maps`} src={location.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                : <div className="location-pending"><MapPin size={36} strokeWidth={1.2} aria-hidden="true" /><span>{brand.city}</span><p>Localização geral do ateliê</p></div>}
        </div>
    </section>;
}
