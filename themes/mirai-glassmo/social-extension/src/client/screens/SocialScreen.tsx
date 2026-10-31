import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Bell, Check, ChevronRight, CircleHelp, MessageCircle, Plus, Search, Send, ShieldCheck, Sparkles, Users, X, Megaphone, Trash2, UserPlus, Clock3, KeyRound, Copy } from 'lucide-react';
import { http, usePanelLocation } from '@pterodactyl/sdk';

type User = {
    id: number;
    username: string;
    name: string;
    is_admin: boolean;
    avatar_url: string | null;
    last_message: null | { id: number; body: string; created_at: string; from_me: boolean };
    unread: number;
};
type Message = { id: number; sender_id: number; recipient_id: number; body: string; created_at: string; read_at: string | null };
type AiMessage = { role: 'user' | 'assistant'; content: string };
type Inbox = { users: User[]; unread_total: number; ai_enabled: boolean; is_admin: boolean; is_reseller: boolean };
type Broadcast = { id: number; title: string; body: string; published_at: string; expires_at: string | null; read_at: string | null };
type ApiKeyInfo = { id: number; name: string; key_prefix: string; scopes: string[] | string; last_used_at: string | null; created_at: string; owner_username: string; created_by_username: string | null };
type AdminData = { broadcasts: Broadcast[]; resellers: { id: number; username: string; name_first: string; name_last: string; created_at: string }[]; keys: ApiKeyInfo[] };
const API = '/api/client/extensions/mirai-social';
const ADMIN_API = '/api/admin/extensions/mirai-social';

function requestedSocialTab(search: unknown): 'messages' | 'assistant' | null {
    if (!search || typeof search !== 'object') return null;
    const value = (search as Record<string, unknown>).socialTab;
    return value === 'assistant' || value === 'messages' ? value : null;
}

function initials(user?: User) {
    if (!user) return 'M';
    const words = user.name.trim().split(/\s+/).filter(Boolean);
    return (words.length > 1 ? words[0][0] + words[1][0] : user.username.slice(0, 2)).toUpperCase();
}
function UserAvatar({ user, tiny = false }: { user: User; tiny?: boolean }) {
    return <span className={`ms-social__avatar ${tiny ? 'ms-social__avatar--tiny' : ''} ${user.is_admin ? 'is-admin' : ''}`}>
        {user.avatar_url ? <img src={user.avatar_url} alt="" loading="lazy" /> : initials(user)}
        {user.is_admin && <i><ShieldCheck size={10} /></i>}
    </span>;
}
function shortTime(value?: string | null) {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function inlineText(text: string, keyPrefix: string): ReactNode[] {
    const token = /(\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
    return text.split(token).filter(Boolean).map((part, index) => {
        const key = `${keyPrefix}-${index}`;
        if (/^\*\*.+\*\*$|^__.+__$/.test(part)) return <strong key={key}>{part.slice(2, -2)}</strong>;
        if (/^~~.+~~$/.test(part)) return <del key={key}>{part.slice(2, -2)}</del>;
        if (/^`.+`$/.test(part)) return <code key={key}>{part.slice(1, -1)}</code>;
        if (/^\*.+\*$|^_.+_$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>;
        return part;
    });
}

function RichText({ content }: { content: string }) {
    const lines = content.replace(/\r\n?/g, '\n').split('\n');
    const blocks: ReactNode[] = [];
    let paragraph: string[] = [];
    let list: { ordered: boolean; items: string[] } | null = null;
    let code: string[] | null = null;

    const flushParagraph = () => {
        if (!paragraph.length) return;
        blocks.push(<p key={`p-${blocks.length}`}>{paragraph.map((line, i) => <span key={i}>{i > 0 && <br />}{inlineText(line, `p-${blocks.length}-${i}`)}</span>)}</p>);
        paragraph = [];
    };
    const flushList = () => {
        if (!list) return;
        const List = list.ordered ? 'ol' : 'ul';
        blocks.push(<List key={`list-${blocks.length}`}>{list.items.map((item, i) => <li key={i}>{inlineText(item, `list-${blocks.length}-${i}`)}</li>)}</List>);
        list = null;
    };

    for (const [index, line] of lines.entries()) {
        if (line.trim().startsWith('```')) {
            flushParagraph();
            flushList();
            if (code === null) code = [];
            else {
                blocks.push(<pre key={`code-${blocks.length}`}><code>{code.join('\n')}</code></pre>);
                code = null;
            }
            continue;
        }
        if (code !== null) { code.push(line); continue; }
        const heading = /^(#{1,3})\s+(.+)$/.exec(line);
        const bullet = /^\s*[-*+]\s+(.+)$/.exec(line);
        const numbered = /^\s*\d+[.)]\s+(.+)$/.exec(line);
        if (heading || bullet || numbered || /^\s*>/.test(line) || !line.trim()) flushParagraph();
        if (heading) {
            flushList();
            const level = heading[1].length;
            const Tag = (`h${level}` as 'h1' | 'h2' | 'h3');
            blocks.push(<Tag key={`h-${index}`}>{inlineText(heading[2], `h-${index}`)}</Tag>);
        } else if (bullet || numbered) {
            const ordered = Boolean(numbered);
            if (list && list.ordered !== ordered) flushList();
            list ??= { ordered, items: [] };
            list.items.push((bullet ?? numbered)![1]);
        } else if (/^\s*>/.test(line)) {
            flushList();
            blocks.push(<blockquote key={`quote-${index}`}>{inlineText(line.replace(/^\s*>\s?/, ''), `quote-${index}`)}</blockquote>);
        } else if (!line.trim()) flushList();
        else { flushList(); paragraph.push(line); }
    }
    flushParagraph();
    flushList();
    if (code !== null) blocks.push(<pre key={`code-${blocks.length}`}><code>{code.join('\n')}</code></pre>);
    return <div className="ms-social__rich-text">{blocks}</div>;
}

export default function SocialScreen() {
    const route = usePanelLocation();
    const [inbox, setInbox] = useState<Inbox>({ users: [], unread_total: 0, ai_enabled: false, is_admin: false, is_reseller: false });
    const [selected, setSelected] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState('');
    const [filter, setFilter] = useState('');
    const [tab, setTab] = useState<'messages' | 'assistant' | 'notifications' | 'admin'>(() => requestedSocialTab(route.search) ?? 'messages');
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiDraft, setAiDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [desktopNotifications, setDesktopNotifications] = useState(typeof Notification !== 'undefined' && Notification.permission === 'granted');
    const [showMobileContacts, setShowMobileContacts] = useState(true);
    const [composing, setComposing] = useState(false);
    const [visibleViewport, setVisibleViewport] = useState({ height: 0, top: 0 });
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [adminData, setAdminData] = useState<AdminData>({ broadcasts: [], resellers: [], keys: [] });
    const [broadcastTitle, setBroadcastTitle] = useState('');
    const [broadcastBody, setBroadcastBody] = useState('');
    const [resellerUsername, setResellerUsername] = useState('');
    const [adminBusy, setAdminBusy] = useState(false);
    const [keyOwner, setKeyOwner] = useState('');
    const [keyName, setKeyName] = useState('');
    const [keyScopes, setKeyScopes] = useState<string[]>(['server-terms:read', 'server-terms:write', 'server-terms:renew']);
    const [newApiSecret, setNewApiSecret] = useState('');
    const lastSeenRef = useRef<Record<number, number>>({});
    const initializedRef = useRef(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messageComposerRef = useRef<HTMLTextAreaElement>(null);
    const aiComposerRef = useRef<HTMLTextAreaElement>(null);
    const activeUser = inbox.users.find((user) => user.id === selected);

    const loadInbox = useCallback(async (notify = true) => {
        try {
            const { data } = await http.get<Inbox>(`${API}/inbox`);
            if (initializedRef.current && notify) {
                for (const user of data.users) {
                    const newest = user.last_message;
                    const previous = lastSeenRef.current[user.id];
                    if (!newest?.from_me && newest && previous !== undefined && newest.id > previous && user.id !== selected) {
                        if (desktopNotifications && typeof Notification !== 'undefined') {
                            new Notification(`Message from ${user.name || user.username}`, { body: newest.body.slice(0, 120), tag: `mirai-social-${user.id}` });
                        }
                    }
                }
            }
            lastSeenRef.current = Object.fromEntries(data.users.map((user) => [user.id, user.last_message?.id ?? 0]));
            initializedRef.current = true;
            setInbox(data);
        } catch {
            setError('Could not load the user list. Refresh the page and try again.');
        }
    }, [desktopNotifications, selected]);

    const loadMessages = useCallback(async (peer: number) => {
        try {
            const { data } = await http.get<{ messages: Message[] }>(`${API}/messages/${peer}`);
            setMessages(data.messages);
            setInbox((current) => ({
                ...current,
                unread_total: Math.max(0, current.unread_total - (current.users.find((item) => item.id === peer)?.unread ?? 0)),
                users: current.users.map((item) => item.id === peer ? { ...item, unread: 0 } : item),
            }));
        } catch {
            setError('Could not load this conversation.');
        }
    }, []);

    useEffect(() => { void loadInbox(false); }, [loadInbox]);
    const loadBroadcasts = useCallback(async () => {
        try { const { data } = await http.get<{ broadcasts: Broadcast[] }>(`${API}/broadcasts`); setBroadcasts(data.broadcasts); } catch { /* ignore temporary panel disconnects */ }
    }, []);
    const loadAdmin = useCallback(async () => {
        try { const { data } = await http.get<AdminData>(`${ADMIN_API}/resellers-broadcasts`); setAdminData(data); } catch { /* this endpoint is root-admin only */ }
    }, []);
    useEffect(() => { void loadBroadcasts(); const timer = window.setInterval(() => void loadBroadcasts(), 30000); return () => window.clearInterval(timer); }, [loadBroadcasts]);
    useEffect(() => { if (inbox.is_admin) void loadAdmin(); }, [inbox.is_admin, loadAdmin]);
    useEffect(() => {
        const timer = window.setInterval(() => {
            if (document.visibilityState === 'visible') void loadInbox();
        }, 4000);
        return () => window.clearInterval(timer);
    }, [loadInbox]);
    useEffect(() => {
        if (selected === null) return;
        void loadMessages(selected);
        const timer = window.setInterval(() => {
            if (document.visibilityState === 'visible') void loadMessages(selected);
        }, 3000);
        return () => window.clearInterval(timer);
    }, [selected, loadMessages]);
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, aiMessages, tab]);
    useEffect(() => {
        const viewport = window.visualViewport;
        const updateViewport = () => setVisibleViewport({
            height: Math.round(viewport?.height ?? window.innerHeight),
            top: Math.round(viewport?.offsetTop ?? 0),
        });
        updateViewport();
        viewport?.addEventListener('resize', updateViewport);
        viewport?.addEventListener('scroll', updateViewport);
        window.addEventListener('resize', updateViewport);
        return () => {
            viewport?.removeEventListener('resize', updateViewport);
            viewport?.removeEventListener('scroll', updateViewport);
            window.removeEventListener('resize', updateViewport);
        };
    }, []);
    useEffect(() => {
        document.body.classList.toggle('ms-social--typing-open', composing);
        return () => document.body.classList.remove('ms-social--typing-open');
    }, [composing]);
    useEffect(() => {
        const requested = requestedSocialTab(route.search);
        if (requested) {
            setTab(requested);
            if (requested === 'messages' && selected === null) setShowMobileContacts(true);
        }
    }, [route.search, selected]);

    const filteredUsers = useMemo(() => inbox.users.filter((user) => `${user.name} ${user.username}`.toLowerCase().includes(filter.toLowerCase())), [filter, inbox.users]);

    async function sendMessage(event: FormEvent) {
        event.preventDefault();
        if (!selected || !draft.trim() || sending) return;
        const body = draft.trim();
        setDraft('');
        if (messageComposerRef.current) messageComposerRef.current.style.height = '44px';
        setSending(true);
        setError('');
        try {
            const { data } = await http.post<{ message: Message }>(`${API}/messages`, { recipient_id: selected, body });
            setMessages((current) => [...current, data.message]);
            void loadInbox(false);
        } catch {
            setDraft(body);
            setError('Message could not be sent. Check your panel connection.');
        } finally { setSending(false); }
    }

    async function askAi(event: FormEvent) {
        event.preventDefault();
        const message = aiDraft.trim();
        if (!message || busy || !inbox.ai_enabled) return;
        const prior = aiMessages;
        setAiDraft('');
        if (aiComposerRef.current) aiComposerRef.current.style.height = '44px';
        setAiMessages((current) => [...current, { role: 'user', content: message }]);
        setBusy(true);
        setError('');
        try {
            const { data } = await http.post<{ message: string }>(`${API}/ai`, { message, history: prior.slice(-6).map((item) => ({ ...item, content: item.content.slice(0, 1500) })) });
            setAiMessages((current) => [...current, { role: 'assistant', content: data.message }]);
        } catch (cause: any) {
            const messageFromApi = cause?.response?.data?.message;
            setError(typeof messageFromApi === 'string' ? messageFromApi : 'The AI provider is unavailable. Check the extension settings and server connection.');
        } finally { setBusy(false); }
    }

    async function enableNotifications() {
        if (typeof Notification === 'undefined') { setError('This browser does not support desktop notifications.'); return; }
        const permission = await Notification.requestPermission();
        setDesktopNotifications(permission === 'granted');
    }

    async function markBroadcastRead(item: Broadcast) {
        if (!item.read_at) {
            try { await http.post(`${API}/broadcasts/${item.id}/read`, {}); setBroadcasts((current) => current.map((row) => row.id === item.id ? { ...row, read_at: new Date().toISOString() } : row)); }
            catch { setError('Could not update the announcement status.'); }
        }
    }

    async function publishBroadcast(event: FormEvent) {
        event.preventDefault(); setAdminBusy(true); setError('');
        try { await http.post(`${ADMIN_API}/broadcasts`, { title: broadcastTitle, body: broadcastBody }); setBroadcastTitle(''); setBroadcastBody(''); await loadAdmin(); await loadBroadcasts(); }
        catch (cause: any) { setError(cause?.response?.data?.message ?? 'Could not publish this announcement.'); }
        finally { setAdminBusy(false); }
    }

    async function grantReseller(event: FormEvent) {
        event.preventDefault(); setAdminBusy(true); setError('');
        try { await http.post(`${ADMIN_API}/resellers`, { username: resellerUsername }); setResellerUsername(''); await loadAdmin(); }
        catch (cause: any) { setError(cause?.response?.data?.message ?? 'Could not grant reseller access.'); }
        finally { setAdminBusy(false); }
    }

    async function createApiKey(event: FormEvent) {
        event.preventDefault(); setAdminBusy(true); setError(''); setNewApiSecret('');
        try {
            const { data } = await http.post<{ secret: string }>(`${ADMIN_API}/api-keys`, { username: keyOwner, name: keyName, scopes: keyScopes });
            setNewApiSecret(data.secret); setKeyName(''); await loadAdmin();
        } catch (cause: any) { setError(cause?.response?.data?.message ?? 'Could not create the API key.'); }
        finally { setAdminBusy(false); }
    }

    function keyScopeList(value: string[] | string): string[] {
        if (Array.isArray(value)) return value;
        try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
    }

    function handleEnter(event: KeyboardEvent<HTMLTextAreaElement>, submit: (event: FormEvent) => void) {
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(event as unknown as FormEvent); }
    }

    function resizeComposer(event: ChangeEvent<HTMLTextAreaElement>) {
        const field = event.currentTarget;
        field.style.height = 'auto';
        field.style.height = `${Math.min(field.scrollHeight, Math.min(160, Math.round(window.innerHeight * 0.24)))}px`;
    }

    return (
        <div className={`ms-social ${composing ? 'is-composing' : ''}`} style={{ '--ms-visible-height': `${visibleViewport.height}px`, '--ms-visible-top': `${visibleViewport.top}px` } as CSSProperties}>
            <header className="ms-social__hero">
                <div className="ms-social__hero-orb" />
                <div className="ms-social__hero-copy">
                    <span className="ms-social__eyebrow"><Sparkles size={13} /> MIRAI COMMUNITY</span>
                    <h1>Connect in one place<span>.</span></h1>
                    <p>Direct messages, AI assistance, and panel alerts in one workspace.</p>
                </div>
                <div className="ms-social__hero-actions">
                    <div className="ms-social__online"><i /> Panel online</div>
                    <button className="ms-social__icon-button" type="button" onClick={enableNotifications} title="Enable desktop notifications" aria-label="Enable desktop notifications"><Bell size={18} />{inbox.unread_total > 0 && <b>{inbox.unread_total > 99 ? '99+' : inbox.unread_total}</b>}</button>
                </div>
            </header>

            <div className="ms-social__tabs" role="tablist" aria-label="Mirai Social features">
                <button className={tab === 'messages' ? 'is-active' : ''} onClick={() => setTab('messages')} role="tab"><MessageCircle size={16} /> Messages <span>{inbox.unread_total || ''}</span></button>
                <button className={tab === 'assistant' ? 'is-active' : ''} onClick={() => setTab('assistant')} role="tab"><Sparkles size={16} /> AI Assistant {!inbox.ai_enabled && <i className="ms-social__soon">OFF</i>}</button>
                <button className={tab === 'notifications' ? 'is-active' : ''} onClick={() => setTab('notifications')} role="tab"><Bell size={16} /> Alerts {(inbox.unread_total + broadcasts.filter((item) => !item.read_at).length) > 0 && <span>{inbox.unread_total + broadcasts.filter((item) => !item.read_at).length}</span>}</button>
                {inbox.is_admin && <button className={tab === 'admin' ? 'is-active' : ''} onClick={() => setTab('admin')} role="tab"><ShieldCheck size={16} /> Admin</button>}
            </div>

            {error && <div className="ms-social__error" role="alert"><CircleHelp size={16} />{error}<button onClick={() => setError('')} aria-label="Dismiss message"><X size={15} /></button></div>}

            {tab === 'messages' && <section className="ms-social__workspace">
                <aside className={`ms-social__contacts ${showMobileContacts ? 'mobile-show' : ''}`}>
                    <div className="ms-social__section-title"><div><span className="ms-social__eyebrow">DIRECT MESSAGE</span><h2>People</h2></div><span className="ms-social__count"><Users size={14} /> {inbox.users.length}</span></div>
                    <label className="ms-social__search"><Search size={16} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search people..." /></label>
                    <div className="ms-social__user-list">
                        {filteredUsers.map((user) => <button key={user.id} className={`ms-social__user ${selected === user.id ? 'is-selected' : ''}`} onClick={() => { if (selected !== user.id) setMessages([]); setSelected(user.id); setShowMobileContacts(false); setTab('messages'); }}>
                            <UserAvatar user={user} />
                            <span className="ms-social__user-copy"><strong>{user.name || user.username}{user.is_admin && <em>ADMIN</em>}</strong><small>{user.last_message?.body || `@${user.username}`}</small></span>
                            <span className="ms-social__user-meta">{user.last_message && <time>{shortTime(user.last_message.created_at)}</time>}{user.unread > 0 && <b>{user.unread > 9 ? '9+' : user.unread}</b>}</span>
                        </button>)}
                        {filteredUsers.length === 0 && <div className="ms-social__empty-small">{filter ? 'No matching people.' : 'No other panel users yet.'}</div>}
                    </div>
                    <div className="ms-social__privacy"><ShieldCheck size={14} /> Messages are visible only to conversation participants.</div>
                </aside>

                <section className="ms-social__conversation" aria-label="Conversation">
                    {activeUser ? <>
                        <div className="ms-social__chat-head">
                            <button className="ms-social__back" onClick={() => { setShowMobileContacts(true); setSelected(null); }} aria-label="Back to people"><ChevronRight size={18} /></button>
                            <UserAvatar user={activeUser} />
                            <div className="ms-social__chat-person"><strong>{activeUser.name || activeUser.username}{activeUser.is_admin && <em>ADMIN</em>}</strong><span>@{activeUser.username} · {activeUser.is_admin ? 'Panel administrator' : 'Panel user'}</span></div>
                            <span className="ms-social__secure"><ShieldCheck size={15} /> Private</span>
                        </div>
                        <div className="ms-social__messages" aria-live="polite">
                            {messages.length === 0 && <div className="ms-social__empty"><span className="ms-social__empty-icon"><MessageCircle size={23} /></span><strong>Start a conversation</strong><p>Send the first message to {activeUser.name || activeUser.username}.</p></div>}
                            {messages.map((message) => {
                                const mine = message.sender_id !== activeUser.id;
                                return <article key={message.id} className={`ms-social__bubble-row ${mine ? 'mine' : ''}`}>
                                    {!mine && <UserAvatar user={activeUser} tiny />}
                                    <div className="ms-social__bubble-wrap"><div className="ms-social__bubble">{message.body}</div><time>{shortTime(message.created_at)} {mine && message.read_at && <Check size={12} />}</time></div>
                                </article>;
                            })}
                            <div ref={bottomRef} />
                        </div>
                        <form className="ms-social__composer" onSubmit={sendMessage}>
                            <textarea ref={messageComposerRef} value={draft} onFocus={() => setComposing(true)} onBlur={() => setComposing(false)} onChange={(event) => { setDraft(event.target.value.slice(0, 2000)); resizeComposer(event); }} onKeyDown={(event) => handleEnter(event, sendMessage)} placeholder="Write a message… (Enter to send)" rows={1} maxLength={2000} />
                            <span>{draft.length}/2000</span><button disabled={!draft.trim() || sending} aria-label="Send message"><Send size={17} /></button>
                        </form>
                    </> : <div className="ms-social__welcome"><div className="ms-social__welcome-graphic"><MessageCircle size={34} /><span><Plus size={15} /></span></div><span className="ms-social__eyebrow">PANEL COMMUNICATION</span><h2>Every conversation,<br />in one place.</h2><p>Choose someone from the list to start a private conversation.</p><button onClick={() => setShowMobileContacts(true)}>Browse people <ChevronRight size={15} /></button></div>}
                </section>
            </section>}

            {tab === 'assistant' && <section className="ms-social__assistant">
                <header className="ms-social__assistant-head"><span className="ms-social__assistant-icon"><Sparkles size={21} /></span><div><span className="ms-social__eyebrow">MIRAI AI</span><h2>Panel assistant</h2><p>{inbox.ai_enabled ? 'Ready when you are.' : 'Disabled by the panel administrator.'}</p></div><span className={`ms-social__ai-state ${inbox.ai_enabled ? 'on' : ''}`}><i /> {inbox.ai_enabled ? 'ONLINE' : 'OFFLINE'}</span></header>
                {!inbox.ai_enabled ? <div className="ms-social__ai-disabled"><Sparkles size={23} /><strong>Assistant setup required</strong><p>Ask a panel root administrator to enable Mirai Social AI and configure its provider in Admin → Extensions → Mirai Social.</p></div> : <>
                    <div className="ms-social__ai-messages">
                        {aiMessages.length === 0 && <div className="ms-social__empty"><span className="ms-social__empty-icon"><Sparkles size={23} /></span><strong>How can I help?</strong><p>Ask about the panel, server management, or troubleshooting.</p><div className="ms-social__suggestions"><button onClick={() => setAiDraft('How do I read my server memory usage?')}>Read server stats</button><button onClick={() => setAiDraft('How do I create a server backup from the panel?')}>Backup guide</button></div></div>}
                        {aiMessages.map((message, index) => <article key={index} className={`ms-social__ai-row ${message.role}`}><span className="ms-social__ai-avatar">{message.role === 'assistant' ? <Sparkles size={15} /> : 'A'}</span><div><small>{message.role === 'assistant' ? 'MIRAI AI' : 'YOU'}</small><div className="ms-social__ai-content"><RichText content={message.content} /></div></div></article>)}
                        {busy && <article className="ms-social__ai-row assistant"><span className="ms-social__ai-avatar"><Sparkles size={15} /></span><div><small>MIRAI AI</small><p className="ms-social__typing"><i /><i /><i /></p></div></article>}
                        <div ref={bottomRef} />
                    </div>
                    <form className="ms-social__composer ms-social__composer--ai" onSubmit={askAi}><textarea ref={aiComposerRef} value={aiDraft} onFocus={() => setComposing(true)} onBlur={() => setComposing(false)} onChange={(event) => { setAiDraft(event.target.value.slice(0, 2000)); resizeComposer(event); }} onKeyDown={(event) => handleEnter(event, askAi)} placeholder="Ask Mirai anything…" rows={1} maxLength={2000} /><span>AI can make mistakes</span><button disabled={!aiDraft.trim() || busy} aria-label="Send to AI"><Send size={17} /></button></form>
                </>}
            </section>}

            {tab === 'notifications' && <section className="ms-social__notification-page"><div className="ms-social__section-title"><div><span className="ms-social__eyebrow">ACTIVITY CENTER</span><h2>Notifications</h2></div><button className="ms-social__notify-toggle" onClick={enableNotifications}><Bell size={15} />{desktopNotifications ? 'Desktop enabled' : 'Enable desktop'}</button></div>
                {(inbox.unread_total > 0 || broadcasts.length > 0) ? <div className="ms-social__notification-list">{inbox.users.filter((user) => user.unread > 0).map((user) => <button key={`message-${user.id}`} className="ms-social__notification" onClick={() => { setMessages([]); setSelected(user.id); setTab('messages'); setShowMobileContacts(false); }}><UserAvatar user={user} /><span><strong>{user.name || user.username}</strong><small>{user.unread} unread messages · {user.last_message?.body}</small></span><time>{shortTime(user.last_message?.created_at)}</time><ChevronRight size={16} /></button>)}{broadcasts.map((item) => <button key={`broadcast-${item.id}`} className={`ms-social__notification ms-social__broadcast-notification ${item.read_at ? 'is-read' : 'is-unread'}`} onClick={() => void markBroadcastRead(item)}><span className="ms-social__broadcast-icon"><Megaphone size={17} /></span><span><strong>{item.title}</strong><small>{item.body}</small></span><time>{shortTime(item.published_at)}</time><ChevronRight size={16} /></button>)}</div> : <div className="ms-social__notification-empty"><span className="ms-social__empty-icon"><Check size={22} /></span><strong>You are all caught up</strong><p>New messages and announcements will appear here.</p></div>}
                <div className="ms-social__notification-note"><Bell size={15} /> Message alerts update while the panel is open. {desktopNotifications ? 'Desktop notifications are allowed.' : 'Enable desktop notifications to receive new-message alerts outside the panel tab.'}</div>
            </section>}

            {tab === 'admin' && inbox.is_admin && <section className="ms-social__admin-page">
                <div className="ms-social__section-title"><div><span className="ms-social__eyebrow">ROOT ADMIN</span><h2>Reseller and broadcast controls</h2></div><ShieldCheck size={20} /></div>
                <div className="ms-social__admin-grid">
                    <form className="ms-social__admin-card" onSubmit={(event) => void publishBroadcast(event)}><span className="ms-social__eyebrow"><Megaphone size={13} /> GLOBAL ANNOUNCEMENT</span><h3>Broadcast to every user</h3><input required maxLength={120} value={broadcastTitle} onChange={(event) => setBroadcastTitle(event.target.value)} placeholder="Announcement title" /><textarea required maxLength={10000} value={broadcastBody} onChange={(event) => setBroadcastBody(event.target.value)} placeholder="Write a message for all panel users…" rows={5} /><button disabled={adminBusy || !broadcastTitle.trim() || !broadcastBody.trim()}><Megaphone size={15} /> Publish announcement</button></form>
                    <div className="ms-social__admin-card"><span className="ms-social__eyebrow"><UserPlus size={13} /> RESELLER ACCESS</span><h3>Authorize a reseller</h3><form className="ms-social__admin-inline" onSubmit={(event) => void grantReseller(event)}><input required value={resellerUsername} onChange={(event) => setResellerUsername(event.target.value)} placeholder="Exact panel username" /><button disabled={adminBusy || !resellerUsername.trim()}><UserPlus size={15} /> Grant</button></form><p className="ms-social__admin-help">An authorized reseller can set terms only for servers they own. Root administrators retain full access.</p><div className="ms-social__admin-list">{adminData.resellers.map((reseller) => <div key={reseller.id}><span><strong>{reseller.name_first} {reseller.name_last}</strong><small>@{reseller.username}</small></span><button title={`Revoke reseller access for ${reseller.username}`} aria-label={`Revoke reseller access for ${reseller.username}`} onClick={async () => { await http.delete(`${ADMIN_API}/resellers/${reseller.id}`); await loadAdmin(); }}><Trash2 size={15} /></button></div>)}{adminData.resellers.length === 0 && <small>No resellers authorized yet.</small>}</div></div>
                </div>
                <div className="ms-social__admin-card ms-social__admin-history"><span className="ms-social__eyebrow"><Clock3 size={13} /> ANNOUNCEMENT HISTORY</span>{adminData.broadcasts.map((item) => <div key={item.id}><span><strong>{item.title}</strong><small>{item.body}</small></span><button title="Delete announcement" aria-label={`Delete ${item.title}`} onClick={async () => { await http.delete(`${ADMIN_API}/broadcasts/${item.id}`); await loadAdmin(); await loadBroadcasts(); }}><Trash2 size={15} /></button></div>)}{adminData.broadcasts.length === 0 && <p>No announcements have been published.</p>}</div>
                <div className="ms-social__admin-card ms-social__api-keys"><span className="ms-social__eyebrow"><KeyRound size={13} /> SCOPED INTEGRATION KEYS</span><h3>Create a Mirai Social API key</h3><p className="ms-social__admin-help">This is a separate, limited key—not a Pterodactyl Application API key. It is shown once after creation and stored as a hash.</p>
                    <form className="ms-social__api-key-form" onSubmit={(event) => void createApiKey(event)}><input required value={keyOwner} onChange={(event) => setKeyOwner(event.target.value)} placeholder="Owner username (root admin or reseller)" /><input required maxLength={80} value={keyName} onChange={(event) => setKeyName(event.target.value)} placeholder="Key name, e.g. Reseller bot" /><div className="ms-social__scope-options">{[['server-terms:read','Read server terms'],['server-terms:write','Set terms'],['server-terms:renew','Renew terms'],['broadcasts:read','Read broadcasts'],['broadcasts:write','Publish broadcasts (root admin only)']].map(([scope,label]) => <label key={scope}><input type="checkbox" checked={keyScopes.includes(scope)} onChange={(event) => setKeyScopes((current) => event.target.checked ? [...current, scope] : current.filter((item) => item !== scope))} /><span>{label}</span></label>)}</div><button disabled={adminBusy || !keyOwner.trim() || !keyName.trim() || keyScopes.length === 0}><KeyRound size={15} /> Create scoped key</button></form>
                    {newApiSecret && <div className="ms-social__secret-reveal" role="alert"><strong>Copy this key now. It will not be shown again.</strong><code>{newApiSecret}</code><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(newApiSecret); setError('API key copied to clipboard.'); } catch { setError('Copy failed. Select and copy the key manually.'); } }}><Copy size={14} /> Copy key</button></div>}
                    <div className="ms-social__admin-list">{adminData.keys.map((key) => <div key={key.id}><span><strong>{key.name} · @{key.owner_username}</strong><small>{key.key_prefix}… · {keyScopeList(key.scopes).join(', ')} · Last used: {key.last_used_at ? shortTime(key.last_used_at) : 'Never'}</small></span><button title={`Revoke ${key.name}`} aria-label={`Revoke API key ${key.name}`} onClick={async () => { await http.delete(`${ADMIN_API}/api-keys/${key.id}`); setNewApiSecret(''); await loadAdmin(); }}><Trash2 size={15} /></button></div>)}{adminData.keys.length === 0 && <small>No active Mirai Social API keys.</small>}</div>
                </div>
            </section>}
            <footer className="ms-social__footer"><span>Mirai Social <i>·</i> panel communication layer</span><span><i /> Secure session</span></footer>
        </div>
    );
}
