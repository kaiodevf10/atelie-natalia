import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';
import Modal from './Modal';
import { guidanceSteps } from '../data/guidance';

export default function HowItWorksButton({ label = 'Como funciona?', onStart }: { label?: string; onStart?: () => void }) {
    const [open, setOpen] = useState(false);
    const startRequested = useRef(false);
    const navigate = useNavigate();

    function finish() {
        setOpen(false);
        if (startRequested.current) { onStart?.(); navigate('/agendar'); }
    }

    return <>
        <button type="button" className="help-button" aria-haspopup="dialog" onClick={() => { startRequested.current = false; setOpen(true); }}><CircleHelp size={16} aria-hidden="true" />{label}</button>
        {open && <Modal label="Como funciona seu atendimento?" closeLabel="Fechar orientação" className="guidance-dialog" animated onClose={finish}>
            {close => <>
                <h2>Como funciona seu atendimento?</h2>
                <p>Preparamos uma maneira simples de você contar o que deseja antes de conversar com nossa equipe.</p>
                <ol className="guidance-steps">{guidanceSteps.map((step, index) => <li key={step.title}>
                    <span aria-hidden="true">{index + 1}</span>
                    <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </li>)}</ol>
                <p className="notice">O preenchimento do formulário não confirma um agendamento. A disponibilidade e as condições do atendimento serão informadas pela equipe.</p>
                <button type="button" className="button" onClick={() => { startRequested.current = true; close(); }}>Solicitar meu atendimento</button>
            </>}
        </Modal>}
    </>;
}
