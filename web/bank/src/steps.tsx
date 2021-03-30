import {
    Landing,
    IntroShowTodos,
    IntroShowMobile,
    IntroDemoSelection,
    AppDownloadQR,
    ProveIdentity,
    SingInConfirmation,
    CompanyData,
    CompanyDetails,
    Confirmation,
    BankData,
    InsuranceData,
    IncorporatedCompanies,
    GreatSuccess,
    ThankYou
} from './pages';

export const routes = [
    { path: '/:lng?', page: Landing },
    { path: '/:lng?/demo/select', page: IntroDemoSelection },
    { path: '/:lng?/demo/todos', page: IntroShowTodos },
    { path: '/:lng?/demo/app', page: IntroShowMobile },
    { path: '/:lng?/company/list/0', page: IncorporatedCompanies },
    { path: '/:lng?/demo/app/0', page: AppDownloadQR },
    { path: '/:lng?/company/prove/0', page: ProveIdentity },
    { path: '/:lng?/company/signin/0', page: SingInConfirmation },
    { path: '/:lng?/company/data/0', page: CompanyData },
    { path: '/:lng?/company/confirm/1', page: Confirmation },
    { path: '/:lng?/demo/success/1', page: GreatSuccess },
    { path: '/:lng?/company/details/1/:companyId', page: CompanyDetails },
    { path: '/:lng?/bank/prove/1', page: ProveIdentity },
    { path: '/:lng?/bank/data/1', page: BankData },
    { path: '/:lng?/bank/confirm/2', page: Confirmation },
    { path: '/:lng?/company/details/2/:companyId', page: CompanyDetails },
    { path: '/:lng?/insurance/prove/2', page: ProveIdentity },
    { path: '/:lng?/insurance/data/2', page: InsuranceData },
    { path: '/:lng?/insurance/confirm/3', page: Confirmation },
    { path: '/:lng?/company/details/3/:companyId', page: CompanyDetails },
    { path: '/:lng?/demo/thankyou', page: ThankYou }
];

//These are now just the keys for the translation that get dynamically loaded
export const mainSteps = [
    { title: "actions.setUpCompany" },
    { title: "actions.getBankAccount" },
    { title: "actions.liabilityInsurance"},
    { title: "actions.readyForBusiness"},
];