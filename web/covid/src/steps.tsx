import {
    IntroShowTodos,
    IntroShowMobile,
    AppDownloadQR,
    ProveIdentity,
    SingInConfirmation,
    Certificate,
    Confirmation,
    HRData,
    AgencyData,
    AccessYourTests,
    TestResults,
    ThankYou,
    Step1,
    Step2,
    Step3
} from './pages';

export const routes = [
    { path: '/demo/app', page: IntroShowMobile },
    { path: '/demo/todos', page: IntroShowTodos },
    { path: '/demo/app/1', page: AppDownloadQR },
    { path: '/demo/step1', page: Step1 },
    { path: '/health/banner/1', page: AccessYourTests },
    { path: '/health/prove/1', page: ProveIdentity },
    { path: '/health/signin/1', page: SingInConfirmation },
    { path: '/health/list/1', page: TestResults },
    { path: '/health/data/1', page: Certificate },
    { path: '/health/confirm/1', page: Confirmation },
    { path: '/demo/step2', page: Step2 },
    { path: '/hr/prove/2', page: ProveIdentity },
    { path: '/hr/data/2', page: HRData },
    { path: '/demo/step3', page: Step3 },
    { path: '/agency/prove/3', page: ProveIdentity },
    { path: '/agency/data/3', page: AgencyData },
    { path: '/agency/confirm/3', page: Confirmation },
    { path: '/demo/thankyou', page: ThankYou }
];

export const mainSteps = [
    { title: 'Get tested' },
    { title: 'Acquire health certificate' },
    { title: 'Share your status with your employer' },
    { title: 'Apply for a visa' }
];
