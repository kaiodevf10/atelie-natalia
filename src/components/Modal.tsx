import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalProps = {
    children: ReactNode | ((close: () => void) => ReactNode);
    onClose: () => void;
    label: string;
    closeLabel?: string;
    className?: string;
    animated?: boolean;
};

export default function Modal({ children, onClose, label, closeLabel = 'Fechar imagem ampliada', className = '', animated = false }: ModalProps) {
    const ref = useRef<HTMLDivElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const root = document.getElementById('root');
        const previousInert = root?.inert ?? false;
        const overflow = document.body.style.overflow;
        if (root) root.inert = true;
        document.body.style.overflow = 'hidden';
        ref.current?.querySelector<HTMLButtonElement>('[data-modal-close]')?.focus();
        return () => {
            clearTimeout(timer.current);
            document.body.style.overflow = overflow;
            if (root) root.inert = previousInert;
            if (previous?.isConnected) previous.focus({ preventScroll: true });
        };
    }, []);

    function close() {
        if (closing) return;
        const canAnimate = animated && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === false;
        if (!canAnimate) { onClose(); return; }
        setClosing(true);
        timer.current = setTimeout(onClose, 180);
    }

    return createPortal(<div className={`modal-backdrop ${animated ? 'modal-animated' : ''} ${closing ? 'modal-closing' : ''}`} onClick={event => { if (event.target === event.currentTarget) close(); }}>
        <div ref={ref} className={`modal ${className}`} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} onKeyDown={event => {
            if (event.key === 'Escape') { event.stopPropagation(); close(); }
            if (event.key !== 'Tab') return;
            const nodes = ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]');
            if (!nodes?.length) return;
            const first = nodes[0], last = nodes[nodes.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }}>
            <div className="modal-controls"><button data-modal-close type="button" className="icon-button modal-close" aria-label={closeLabel} onClick={close}><X aria-hidden="true" /></button></div>
            {typeof children === 'function' ? children(close) : children}
        </div>
    </div>, document.body);
}
