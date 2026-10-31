import { useEffect, useState } from 'react';
import { MessageCircle, MessagesSquare, Sparkles, X } from 'lucide-react';
import { Portal, usePanelNavigate } from '@pterodactyl/sdk';

export default function GlobalQuickNav() {
    const [open, setOpen] = useState(false);
    const navigate = usePanelNavigate();

    useEffect(() => {
        if (!open) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [open]);

    const goTo = (socialTab: 'messages' | 'assistant') => {
        setOpen(false);
        void navigate({ extension: 'mirai-social', screen: 'chat', search: { socialTab } });
    };

    return (
        <Portal>
            <div className={`ms-social__quicknav ${open ? 'is-open' : ''}`}>
                {open && <>
                    <button className="ms-social__quicknav-scrim" aria-label="Close quick navigation" onClick={() => setOpen(false)} />
                    <div className="ms-social__quicknav-menu" role="menu" aria-label="Quick navigation">
                        <button role="menuitem" onClick={() => goTo('messages')}>
                            <MessageCircle size={18} />
                            <span><strong>Messages</strong><small>Chat with panel users</small></span>
                        </button>
                        <button role="menuitem" onClick={() => goTo('assistant')}>
                            <Sparkles size={18} />
                            <span><strong>AI Assistant</strong><small>Ask Mirai for help</small></span>
                        </button>
                    </div>
                </>}
                <button
                    className="ms-social__quicknav-toggle"
                    type="button"
                    aria-label={open ? 'Close chat shortcuts' : 'Open chat shortcuts'}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    onClick={() => setOpen((current) => !current)}
                >
                    <span className="ms-social__quicknav-mark">
                        {open ? <X size={20} /> : <><MessagesSquare size={21} /><Sparkles size={11} /></>}
                    </span>
                    <span className="ms-social__quicknav-label">Chat</span>
                </button>
            </div>
        </Portal>
    );
}
