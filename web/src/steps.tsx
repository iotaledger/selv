import * as React from "react";

import * as Company from './pages/Company'
import * as Government from './pages/Government'
import * as Insurance from './pages/Insurance'

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
};


export const routes: Route[] = [
    { path: '/:lng?', element: <Landing /> },
    { path: '/:lng?/demo/todos', element: <IntroShowTodos /> },
    { path: '/:lng?/demo/app', element: <IntroShowMobile /> },
    { path: '/:lng?/demo/app-picker', element: <AppPicker />, step: "setup" },
    { path: '/:lng?/government/prove', element: <Government.ProveIdentity />, step: "government", process: "signIn", poweredBy: <TangleLabs /> },
    { path: '/:lng?/government/signin', element: <Government.SingInConfirmation />, step: "government", process: "signIn", poweredBy: <TangleLabs /> },
    // { path: '/:lng?/government/data', element: <Government.GovernmentData/>, step: "government", poweredBy: <TangleLabs/> },
    { path: '/:lng?/government/receive', element: <Government.ReceiveCredentials />, step: "government", process: "issueCredential", poweredBy: <TangleLabs /> },
    { path: '/:lng?/government/confirm', element: <Government.Confirmation />, step: "government", process: "issueCredential", poweredBy: <TangleLabs /> },
    { path: '/:lng?/company/prove', element: <Company.ProveIdentity />, step: "company", process: "signIn", poweredBy: <Impierce /> },
    { path: '/:lng?/company/signin', element: <Company.SingInConfirmation />, step: "company", process: "signIn", poweredBy: <Impierce /> },
    { path: '/:lng?/company/provide', element: <Company.ProvideData />, step: "company", process: "presentCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/provided', element: <Company.PresentationConfirmation />, step: "company", process: "presentCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/data', element: <Company.CompanyData />, step: "company", process: "offerCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/receive', element: <Company.ReceiveCredentials />, step: "company", process: "issueCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/company/confirm', element: <Company.Confirmation />, step: "company", process: "issueCredential", poweredBy: <Impierce /> },
    { path: '/:lng?/demo/success', element: <GreatSuccess /> },
    // { path: '/:lng?/insurance/prove', element: <Insurance.ProveIdentity />, step: "insurance", poweredBy: <Waltid /> },
    // { path: '/:lng?/insurance/signin', element: <Insurance.SingInConfirmation />, step: "insurance", poweredBy: <Waltid /> },
    // { path: '/:lng?/insurance/provide', element: <Insurance.ProvideData />, step: "insurance", poweredBy: <Waltid /> },
    // { path: '/:lng?/insurance/data', element: <Insurance.InsuranceData />, step: "insurance", poweredBy: <Waltid /> },
    // { path: '/:lng?/insurance/receive', element: <Insurance.ReceiveCredentials />, step: "insurance", poweredBy: <Waltid /> },
    // { path: '/:lng?/insurance/confirm', element: <Insurance.Confirmation />, step: "insurance", poweredBy: <Waltid /> },
    // { path: '/:lng?/company/details/1/:companyId', element: <Company.CompanyDetails/> },
    // { path: '/:lng?/bank/prove/1', element: <Company.ProveIdentity/> },
    // { path: '/:lng?/bank/data/1', element: <BankData/> },
    // { path: '/:lng?/bank/confirm/2', element: <Company.Confirmation/> },
    // { path: '/:lng?/company/details/2/:companyId', element: <Company.CompanyDetails/> },
    // { path: '/:lng?/insurance/prove/2', element: <Company.ProveIdentity/> },
    // { path: '/:lng?/insurance/data/2', element: <InsuranceData/> },
    // { path: '/:lng?/insurance/confirm/3', element: <Company.Confirmation/> },
    // { path: '/:lng?/company/details/3/:companyId', element: <Company.CompanyDetails/> },
    { path: '/:lng?/demo/thankyou', element: <ThankYou /> }
];

export const utilityRoutes = [
    { path: '/wallets/:wallet', element: <WalletDownload /> }
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
    // { id: "bank", title: "steps.company.processes.getBankAccount" },
    // { id: "insurance", title: "steps.company.processes.liabilityInsurance" },
    { id: "done", title: "steps.done.title" },
];