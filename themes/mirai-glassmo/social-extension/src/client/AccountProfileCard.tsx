import { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, LoaderCircle, Trash2 } from 'lucide-react';
import { http } from '@pterodactyl/sdk';

const API = '/api/client/extensions/mirai-social';
type Profile = { avatar_url: string | null };

export default function AccountProfileCard() {
    const input = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState<Profile>({ avatar_url: null });
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        let active = true;
        void http.get<{ profile: Profile }>(`${API}/profile`).then(({ data }) => {
            if (active) setProfile(data.profile);
        }).catch(() => {
            if (active) setMessage('Could not load your profile photo.');
        }).finally(() => {
            if (active) setLoading(false);
        });
        return () => { active = false; };
    }, []);

    async function upload(file?: File) {
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
            setMessage('Choose a JPEG, PNG, or WebP image up to 2 MB.');
            if (input.current) input.current.value = '';
            return;
        }

        setBusy(true);
        setMessage('');
        try {
            const body = new FormData();
            body.append('avatar', file);
            const { data } = await http.post<{ profile: Profile }>(`${API}/profile/avatar`, body);
            setProfile(data.profile);
            setMessage('Profile photo updated.');
        } catch (error: any) {
            setMessage(error?.response?.data?.message || 'Could not upload this photo. Try another image.');
        } finally {
            setBusy(false);
            if (input.current) input.current.value = '';
        }
    }

    async function remove() {
        setBusy(true);
        setMessage('');
        try {
            const { data } = await http.delete<{ profile: Profile }>(`${API}/profile/avatar`);
            setProfile(data.profile);
            setMessage('Profile photo removed.');
        } catch {
            setMessage('Could not remove your profile photo.');
        } finally { setBusy(false); }
    }

    return (
        <section className="ms-profile-card" aria-labelledby="ms-profile-title">
            <div className="ms-profile-card__identity">
                <span className="ms-profile-card__avatar">
                    {profile.avatar_url ? <img src={profile.avatar_url} alt="Your profile" /> : <Camera size={22} />}
                </span>
                <div>
                    <span className="ms-profile-card__eyebrow">MIRAI SOCIAL</span>
                    <h2 id="ms-profile-title">Profile photo</h2>
                    <p>Choose a photo other panel users can see in conversations.</p>
                </div>
            </div>
            <input ref={input} className="ms-profile-card__input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void upload(event.currentTarget.files?.[0])} aria-label="Choose a profile photo" />
            <div className="ms-profile-card__actions">
                <button type="button" onClick={() => input.current?.click()} disabled={busy || loading}><ImagePlus size={16} />{busy ? 'Saving…' : 'Choose photo'}</button>
                {profile.avatar_url && <button type="button" className="ms-profile-card__remove" onClick={() => void remove()} disabled={busy}><Trash2 size={15} />Remove</button>}
                {busy && <LoaderCircle className="ms-profile-card__spinner" size={16} aria-label="Saving photo" />}
            </div>
            <p className="ms-profile-card__note" role="status">{message || 'JPEG, PNG, or WebP · 2 MB maximum'}</p>
        </section>
    );
}
