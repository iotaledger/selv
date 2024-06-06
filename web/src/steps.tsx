import * as React from "react";

import * as Company from './pages/Company'
import * as Government from './pages/Government'

import {
    Landing,
    IntroShowTodos,
    IntroShowMobile,
    AppDownloadQR,
    BankData,
    InsuranceData,
    GreatSuccess,
    ThankYou,
    AppPicker,
} from './pages';

import TangleLabs from "./components/powerdBy/TangleLabs";
import Impierce from "./components/powerdBy/Impierce";
import Waltid from "./components/powerdBy/Waltid";

export const routes = [
    { path: '/:lng?', element: <Landing/> },
    { path: '/:lng?/demo/todos', element: <IntroShowTodos/> },
    { path: '/:lng?/demo/app', element: <IntroShowMobile/> },
    { path: '/:lng?/demo/app/0', element: <AppPicker/> },
    { path: '/:lng?/government/prove/0', element: <Government.ProveIdentity/>, poweredBy: <TangleLabs/> },
    { path: '/:lng?/government/signin/0', element: <Government.SingInConfirmation/>, poweredBy: <TangleLabs/> },
    // { path: '/:lng?/government/data/0', element: <Government.GovernmentData/>, poweredBy: <TangleLabs/> },
    { path: '/:lng?/government/receive/0', element: <Government.ReceiveCredentials/>, poweredBy: <TangleLabs/> },
    { path: '/:lng?/government/confirm/1', element: <Government.Confirmation/>, poweredBy: <TangleLabs/> },
    { path: '/:lng?/company/prove/0', element: <Company.ProveIdentity/>, poweredBy: <Impierce/> },
    { path: '/:lng?/company/signin/0', element: <Company.SingInConfirmation/>, poweredBy: <Impierce/> },
    { path: '/:lng?/company/provide/0', element: <Company.ProvideData/>, poweredBy: <Impierce/> },
    { path: '/:lng?/company/data/0', element: <Company.CompanyData/>, poweredBy: <Impierce/> },
    { path: '/:lng?/company/receive/0', element: <Company.ReceiveCredentials/>, poweredBy: <Impierce/> },
    { path: '/:lng?/company/confirm/1', element: <Company.Confirmation/>, poweredBy: <Impierce/> },
    { path: '/:lng?/demo/success/1', element: <GreatSuccess/> },
    { path: '/:lng?/company/details/1/:companyId', element: <Company.CompanyDetails/> },
    { path: '/:lng?/bank/prove/1', element: <Company.ProveIdentity/> },
    { path: '/:lng?/bank/data/1', element: <BankData/> },
    { path: '/:lng?/bank/confirm/2', element: <Company.Confirmation/> },
    { path: '/:lng?/company/details/2/:companyId', element: <Company.CompanyDetails/> },
    { path: '/:lng?/insurance/prove/2', element: <Company.ProveIdentity/> },
    { path: '/:lng?/insurance/data/2', element: <InsuranceData/> },
    { path: '/:lng?/insurance/confirm/3', element: <Company.Confirmation/> },
    { path: '/:lng?/company/details/3/:companyId', element: <Company.CompanyDetails/> },
    { path: '/:lng?/demo/thankyou', element: <ThankYou/> }
];

//These are now just the keys for the translation that get dynamically loaded
export const mainSteps = [
    { title: "actions.setUpCompany" },
    { title: "actions.getBankAccount" },
    { title: "actions.liabilityInsurance"},
    { title: "actions.readyForBusiness"},
];