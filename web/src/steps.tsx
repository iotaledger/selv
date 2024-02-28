import * as React from "react";

import * as Company from './pages/Company'

import {
    Landing,
    IntroShowTodos,
    IntroShowMobile,
    AppDownloadQR,
    BankData,
    InsuranceData,
    IncorporatedCompanies,
    GreatSuccess,
    ThankYou,
} from './pages';

import TangleLabs from "./components/powerdBy/TangleLabs";
import Impierce from "./components/powerdBy/Impierce";
import Waltid from "./components/powerdBy/Waltid";

export const routes = [
    { path: '/:lng?', element: <Landing/> },
    { path: '/:lng?/demo/todos', element: <IntroShowTodos/> },
    { path: '/:lng?/demo/app', element: <IntroShowMobile/> },
    { path: '/:lng?/company/list/0', element: <IncorporatedCompanies/> },
    { path: '/:lng?/demo/app/0', element: <AppDownloadQR/> },
    { path: '/:lng?/company/prove/0', element: <Company.ProveIdentity/>, poweredBy: <Waltid/> },
    { path: '/:lng?/company/signin/0', element: <Company.SingInConfirmation/>, poweredBy: <Waltid/> },
    { path: '/:lng?/company/provide/0', element: <Company.ProvideData/>, poweredBy: <Waltid/> },
    { path: '/:lng?/company/data/0', element: <Company.CompanyData/>, poweredBy: <Waltid/> },
    { path: '/:lng?/company/receive/0', element: <Company.ReceiveCredentials/>, poweredBy: <Waltid/> },
    { path: '/:lng?/company/confirm/1', element: <Company.Confirmation/>, poweredBy: <Waltid/> },
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