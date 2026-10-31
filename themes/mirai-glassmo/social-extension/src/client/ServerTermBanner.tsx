import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CalendarClock, Clock3, RefreshCw, ShieldCheck } from 'lucide-react';
import { http } from '@pterodactyl/sdk';

type Term = { server: { name: string; identifier: string }; expires_at: string | null; expired_at: string | null; expired: boolean; server_suspended: boolean; suspended_by_expiry: boolean; can_manage: boolean };
type ServerData = { identifier?: string; uuid?: string; uuidShort?: string; name?: string; attributes?: { identifier?: string; uuid?: string; name?: string } };
const API = '/api/client/servers';

function remaining(expires: string | null, now: number) {
    if (!expires) return 'No expiry configured';
    const ms = new Date(expires).getTime() - now;
    if (ms <= 0) return 'Expired';
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return days ? `${days}d ${hours}h remaining` : `${hours}h ${minutes}m ${seconds}s remaining`;
}

export default function ServerTermBanner({ data }: { data?: ServerData }) {
    const identifier = data?.identifier ?? data?.attributes?.identifier ?? data?.uuidShort;
    const [term, setTerm] = useState<Term | null>(null);
    const [now, setNow] = useState(Date.now());
    const [days, setDays] = useState('30');
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const refresh = useCallback(async () => {
        if (!identifier) return;
        try {
            const { data: response } = await http.get<Term>(`${API}/${identifier}/extensions/mirai-social/term`);
            setTerm(response);
        } catch { setTerm(null); }
    }, [identifier]);
    useEffect(() => { void refresh(); const poll = window.setInterval(() => void refresh(), 60000); const tick = window.setInterval(() => setNow(Date.now()), 1000); return () => { window.clearInterval(poll); window.clearInterval(tick); }; }, [refresh]);

    async function update(renew: boolean) {
        const duration = Number(days);
        if (!Number.isInteger(duration) || duration < 1 || duration > 3650) { setMessage('Choose a duration from 1 to 3650 days.'); return; }
        setBusy(true); setMessage('');
        try {
            const endpoint = `${API}/${identifier}/extensions/mirai-social/term${renew ? '/renew' : ''}`;
            const { data: response } = renew ? await http.post<Term>(endpoint, { duration_days: duration }) : await http.put<Term>(endpoint, { duration_days: duration });
            setTerm(response); setMessage('Term updated.');
        } catch (cause: any) { setMessage(cause?.response?.data?.message ?? 'Could not update the server term.'); }
        finally { setBusy(false); }
    }

    if (!identifier || !term) return null;
    const expired = term.expired || (term.expires_at && new Date(term.expires_at).getTime() <= now);
    return <section className={`ms-social__term ${expired ? 'is-expired' : ''}`} aria-live="polite">
        <div className="ms-social__term-icon">{expired ? <ShieldCheck size={19} /> : <CalendarClock size={19} />}</div>
        <div className="ms-social__term-copy"><strong>Server access term</strong><span>{remaining(term.expires_at, now)}{term.expires_at && <> · Ends {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(term.expires_at))}</>}{expired && ' · Server suspended; data is preserved.'}</span>{message && <small>{message}</small>}</div>
        {term.can_manage && <form className="ms-social__term-actions" onSubmit={(event) => { event.preventDefault(); void update(false); }}><label><span className="sr-only">Duration in days</span><input aria-label="Duration in days" type="number" min="1" max="3650" value={days} onChange={(event) => setDays(event.target.value)} /></label><button type="submit" disabled={busy}><Clock3 size={14} /> Set days</button><button type="button" disabled={busy} onClick={() => void update(true)}><RefreshCw size={14} /> Renew</button></form>}
    </section>;
}
