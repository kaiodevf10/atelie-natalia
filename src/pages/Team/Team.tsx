// Isolated for future publication after the official profiles are supplied.
// This page is deliberately absent from the public router and navigation.
import { team } from '../../data/content';
import { ButtonLink, Photo } from '../../components/ui';

export default function Team() {
    return <div className="container section">
        <h1>Talentos diferentes, o mesmo cuidado com você.</h1>
        {team.length > 0 && <div className="service-grid">{team.map(person => <article key={person.name}>
            <Photo src={person.image} alt={person.name} />
            <h2>{person.name}</h2><p>{person.specialty}</p><p>{person.bio}</p>
            <ButtonLink to="/agendar">Solicitar atendimento</ButtonLink>
        </article>)}</div>}
    </div>;
}
