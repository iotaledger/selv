import {
    IntroTodos,
    IntroWelcome,
    IntroLegacy,
    IntroLifeSpan,
    AppDownloadQR,
    ProveIdentity,
    SingInConfirmation,
    SelectCommitmentCategory,
    SelectCommitments,
    PersonalizeFutureCommitments,
    PersonalizePresentCommitments,
    PledgeData,
    Confirmation,
    PledgeRegistry,
    GreatSuccess,
    ThankYou,
} from './pages';

export const routes = [
    { path: '/demo/welcome', page: IntroWelcome },
    { path: '/demo/legacy', page: IntroLegacy },
    { path: '/demo/lifespan', page: IntroLifeSpan },
    { path: '/demo/todos', page: IntroTodos },
    { path: '/demo/app/0', page: AppDownloadQR },
    { path: '/registry/list/1', page: PledgeRegistry },
    { path: '/registry/prove/1', page: ProveIdentity },
    { path: '/registry/signin/1', page: SingInConfirmation },

    { path: '/registry/category/2', page: SelectCommitmentCategory },
    { path: '/future/select/2', page: SelectCommitments },
    { path: '/future/personalize/2', page: PersonalizeFutureCommitments },
    { path: '/future/prove/2', page: ProveIdentity },
    { path: '/future/data/2', page: PledgeData },
    { path: '/future/confirm/2', page: Confirmation },
    { path: '/demo/success', page: GreatSuccess },

    { path: '/registry/category/3', page: SelectCommitmentCategory },
    { path: '/present/select/3', page: SelectCommitments },
    { path: '/present/personalize/3', page: PersonalizePresentCommitments },
    { path: '/present/prove/3', page: ProveIdentity },
    { path: '/present/data/3', page: PledgeData },
    { path: '/present/confirm/3', page: Confirmation },
    
    { path: '/registry/category/4', page: SelectCommitmentCategory },
    { path: '/demo/commit', page: IntroLifeSpan },
    { path: '/demo/thankyou', page: ThankYou }
];

export const mainSteps = [
    { title: 'Create your identity' },
    { title: 'Visit the Good Ancestor Registry' },
    { title: 'Choose your Future Commitment' },
    { title: 'Choose your Present Commitment' },
    { title: 'Complete your Pledge' }
];
