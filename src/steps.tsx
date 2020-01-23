import { 
  Landing,
  IntroShowTodos,
  IntroShowCTA,
  IntroShowQR,
  ProveIdentity,
  SingInConfirmation,
  CompanyIntro,
  CompanyData,
  CompanyCredentials,
  CompanyConfirmation,
  BankIntro,
} from './pages'

export const routes = [ 
  { path: '/', page: Landing },
  { path: '/intro/1', page: IntroShowTodos }, 
  { path: '/progress/cta/2', page: IntroShowCTA },
  { path: '/progress/qr/2/0', page: IntroShowQR }, 
  { path: '/progress/intro/2/1', page: CompanyIntro }, 
  { path: '/progress/prove/2/1', page: ProveIdentity }, 
  { path: '/progress/signin/2/2', page: SingInConfirmation }, 
  { path: '/progress/data/2/2', page: CompanyData }, 
  { path: '/progress/credentials/2/2', page: CompanyCredentials },
  { path: '/progress/overview/2/2', page: CompanyConfirmation }, 
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