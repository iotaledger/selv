import { 
  Landing,
  IntroShowTodos,
  IntroShowMobile,
  AppDownloadQR,
  ProveIdentity,
  SingInConfirmation,
  CompanyData,
  CompanyConfirmation,
  BankIntro,
  IncorporatedCompanies,
} from './pages'

export const routes = [ 
  { path: '/', page: Landing },
  { path: '/progress/intro/todos/2', page: IntroShowTodos }, 
  { path: '/progress/intro/app/2', page: IntroShowMobile }, 
  { path: '/progress/company/list/2', page: IncorporatedCompanies }, 
  { path: '/progress/company/app/2', page: AppDownloadQR }, 
  { path: '/progress/company/prove/2', page: ProveIdentity }, 
  { path: '/progress/company/signin/2', page: SingInConfirmation }, 
  { path: '/progress/company/data/2', page: CompanyData }, 
  { path: '/progress/company/success/2', page: CompanyConfirmation }, 
  { path: '/progress/bank/prove/3', page: BankIntro }, 
]

export const subSteps = [
  { title: `Get DID app with Bob's ID` },
  { title: 'Sign in on Company House website' },
  { title: 'Register a new company' },
]

export const mainSteps = [
  { title: 'Yoga class' },
  { title: 'Eat breakfast' },
  { title: 'Set up a company', subSteps: true },
  { title: 'Get a bank account' },
  { title: 'Get liability insurance' },
  { title: 'Treat yourself' },
]