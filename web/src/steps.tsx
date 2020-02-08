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
  { path: '/progress/intro/2', page: IntroShowTodos }, 
  { path: '/progress/intromobile/2', page: IntroShowMobile }, 
  { path: '/progress/companies/2', page: IncorporatedCompanies }, 
  { path: '/progress/qr/2', page: AppDownloadQR }, 
  { path: '/progress/prove/2', page: ProveIdentity }, 
  { path: '/progress/signin/2', page: SingInConfirmation }, 
  { path: '/progress/companydata/2', page: CompanyData }, 
  { path: '/progress/companysuccess/2', page: CompanyConfirmation }, 
  { path: '/progress/intro/3', page: BankIntro }, 
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