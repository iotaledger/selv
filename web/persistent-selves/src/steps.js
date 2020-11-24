import {
    IntroTodos,
    IntroWelcome,
    IntroOutcomes,
    IntroLifeSpan,
    AppDownloadQR,
    ProveIdentity,
    SingInConfirmation,
    SelectCommitmentCategory,
    SelectCommitments,
    PersonalizeCommitments,
    PledgeData,
    Confirmation,
    PledgeRegistry,
    GreatSuccess,
    ThankYou,
    // Stats
} from './pages';

export const routes = [
    { path: '/demo/welcome', page: IntroWelcome },
    { path: '/demo/outcomes', page: IntroOutcomes },
    { path: '/demo/lifespan', page: IntroLifeSpan },
    { path: '/demo/todos', page: IntroTodos },
    { path: '/demo/app/0', page: AppDownloadQR },
    { path: '/registry/list/1', page: PledgeRegistry },
    { path: '/registry/prove/1', page: ProveIdentity },
    { path: '/registry/signin/1', page: SingInConfirmation },

    { path: '/registry/category/1', page: SelectCommitmentCategory },
    { path: '/future/select/1', page: SelectCommitments },
    { path: '/future/personalize/2', page: PersonalizeCommitments },
    { path: '/future/prove/2', page: ProveIdentity },
    { path: '/future/data/2', page: PledgeData },
    { path: '/future/confirm/2', page: Confirmation },
    { path: '/demo/success', page: GreatSuccess },

    { path: '/registry/category/2', page: SelectCommitmentCategory },
    { path: '/present/select/2', page: SelectCommitments },
    { path: '/present/personalize/2', page: PersonalizeCommitments },
    { path: '/present/prove/2', page: ProveIdentity },
    { path: '/present/data/2', page: PledgeData },
    { path: '/present/confirm/3', page: Confirmation },
    { path: '/registry/category/3', page: SelectCommitmentCategory },

    // { path: '/demo/stats', page: Stats },
    { path: '/demo/thankyou', page: ThankYou }
];

export const mainSteps = [
    { title: 'Create your identity' },
    { title: 'Visit the registry' },
    { title: 'Start your pledge' },
    { title: 'Create your legacies' }
];
