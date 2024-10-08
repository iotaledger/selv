import * as React from "react";

import * as Company from './pages/Company'
import * as Government from './pages/Government'

import {
    Landing,
    IntroShowTodos,
    IntroShowMobile,
    GreatSuccess,
    ThankYou,
    AppPicker,
    WalletDownload,
} from './pages';

import TangleLabs from "./components/powerdBy/TangleLabs";
import Impierce from "./components/powerdBy/Impierce";
import Waltid from "./components/powerdBy/Waltid";

export type Route = {
    path: string;
    element: JSX.Element;
    step?: string;
    process?: string;
    poweredBy?: JSX.Element;
    id?: string;
};


export const routes: Route[] = [
    { path: '/:lng?', element: <Landing /> },
    { path: '/:lng?/demo/todos', element: <IntroShowTodos /> },
    { path: '/:lng?/demo/app', element: <IntroShowMobile /> },
    { path: '/:lng?/demo/app-picker', element: <AppPicker />, step: "setup" },
    { path: '/:lng?/government/prove', id: "governmentEntry", element: <Government.ProveIdentity />, step: "government", process: "signIn", poweredBy: <TangleLabs /> },
    { path: '/:lng?/government/signin', element: <Government.SingInConfirmation />, step: "government", process: "signIn", poweredBy: <TangleLabs /> },
    // { path: '/:lng?/government/data', element: <Government.GovernmentData/>, step: "government", poweredBy: <TangleLabs/> },
    { path: '/:lng?/government/receive', element: <Government.ReceiveCredentials />, step: "government", process: "issueCredential", poweredBy: <TangleLabs /> },
    { path: '/:lng?/government/confirm', element: <Government.Confirmation />, step: "government", process: "issueCredential", poweredBy: <TangleLabs /> },
    { path: '/:lng?/company/prove', id: "companyEntry", element: <Company.ProveIdentity />, step: "company", process: "signIn", poweredBy: <Impierce /> },
    { path: '/:lng?/company/signin', element: <Company.SingInConfirmation />, step: "company", process: "signIn", poweredBy: <Impierce /> },
    { path: '/:lng?/company/provide', id: "companyPresentation", element: <Company.ProvideData />, step: "company", process: "presentCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/provided', element: <Company.PresentationConfirmation />, step: "company", process: "presentCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/data', id: "companyData", element: <Company.CompanyData />, step: "company", process: "offerCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/receive', element: <Company.ReceiveCredentials />, step: "company", process: "issueCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/confirm', element: <Company.Confirmation />, step: "company", process: "issueCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/demo/success', element: <GreatSuccess /> },
    { path: '/:lng?/demo/thankyou', element: <ThankYou /> }
];

export const utilityRoutes: Route[] = [
    { path: '/wallets/:wallet', id: "walletDownload", element: <WalletDownload /> }
];

export type MainStep = {
    id: string;
    title: string;
    processes?: {
        id: string;
        title: string;
    }[]
};

//These are now just the keys for the translation that get dynamically loaded
export const mainSteps: MainStep[] = [
    { id: "setup", title: "steps.setup.title" },
    {
        id: "government", title: "steps.government.title", processes: [
            {
                id: "signIn",
                title: "steps.government.processes.signIn",
            },
            {
                id: "issueCredential",
                title: "steps.government.processes.issueCredential",
            },
        ]
    },
    {
        id: "company", title: "steps.company.title", processes: [
            {
                id: "signIn",
                title: "steps.company.processes.signIn",
            },
            {

                id: "presentCredential",
                title: "steps.company.processes.presentCredential",
            },
            {
                id: "offerCredential",
                title: "steps.company.processes.offerCredential",
            },
            {
                id: "issueCredential",
                title: "steps.company.processes.issueCredential",
            },
        ]
    },
    { id: "done", title: "steps.done.title" },
];