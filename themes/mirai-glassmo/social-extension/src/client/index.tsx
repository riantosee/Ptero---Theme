import './styles.css';
import { definePterodactylExtension } from '@pterodactyl/sdk';
import GlobalQuickNav from './GlobalQuickNav';
import AccountProfileCard from './AccountProfileCard';
import ServerTermBanner from './ServerTermBanner';

export default definePterodactylExtension({
    setup({ screens, slots }) {
        screens.register('chat', () => import('./screens/SocialScreen'));
        slots.register('nav.items.after', GlobalQuickNav);
        slots.register('account.overview.after', AccountProfileCard);
        slots.register('server.console.after', ServerTermBanner);
    },
});
