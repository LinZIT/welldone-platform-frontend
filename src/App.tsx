import { Theme, ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { themeLight, themeDark } from "./common/theme";
import { Profile } from "./pages/profile/Profile";
import { CreateNewTicket } from "./pages/tickets/CreateNewTicket";
import { Tickets } from "./pages/tickets/Tickets";
import { TicketView } from "./pages/tickets/TicketView";
import { useUserStore } from "./store/user/UserStore";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/Dashboard";
import { Loading } from "./components/ui/content/Loading";
import { Analysis, AnalysisRegisterStats, Claims, ClaimsRegisterStats, CustomerService, CustomerServiceRegisterStats, Disbursements, DisbursementsRegisterStats, Finance, FinanceRegisterStats, HumanResources, HumanResourcesRegisterStats, Income, IncomeRegisterStats, Operations, Sales, SalesRegisterStats, StatsMenu } from "./pages/stats";
import { SalesRegisterClaim } from "./pages/stats/sales";
import { OperationsCalifornia, OperationsCaliforniaRegisterStats } from "./pages/stats/operations/california";
import { OperationsMiami, OperationsMiamiRegisterStats } from "./pages/stats/operations/miami";
import { OperationsOrlando, OperationsOrlandoRegisterStats } from "./pages/stats/operations/orlando";
import { OperationsTexas, OperationsTexasRegisterStats } from "./pages/stats/operations/texas";
import { RegisterTeam, Teams } from "./pages/teams";
import { Advisers, RegisterAdviser } from "./pages/advisers";
import { Cities, RegisterCity } from "./pages/cities";
import { Clients, RegisterClient } from "./pages/clients";
import { AdjustingCompany, RegisterAdjustingCompany } from "./pages/adjusting_company";
import { InsuranceCompany, RegisterInsuranceCompany } from "./pages/insurance_company";
import { Departments, RegisterDepartment } from "./pages/departments";

const useGetTheme = () => {
  const user = useUserStore((state) => state.user);
  const [theme, setTheme] = useState<Theme>(themeLight)
  useEffect(() => {
    if (user?.theme === 'dark') {
      setTheme(themeDark);
    } else {
      setTheme(themeLight);
    }
  }, [user?.theme])
  return theme
}
function App() {
  const theme = useGetTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes departmentHashTable={['*']} />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/ticket/new' element={<CreateNewTicket />} />
            <Route path="/stats" element={<StatsMenu />} />
            {/**----------------------------------------------
            ********** Adjusting Companies
            ********** --------------------------------*/}
            <Route path="/adjusting_companies" element={<AdjustingCompany />} />
            <Route path="/adjusting_companies/add" element={<RegisterAdjustingCompany />} />
            {/**---------------------------------------
            ********** Insurance Companies
            ********** --------------------------------*/}
            <Route path="/insurance_companies" element={<InsuranceCompany />} />
            <Route path="/insurance_companies/add" element={<RegisterInsuranceCompany />} />

            {/**---------------------------------------
             ********** Departments
            ********** --------------------------------*/}
            <Route path="/department" element={<Departments />} />
            <Route path="/department/add" element={<RegisterDepartment />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['IT', 'Sales']} />}>
            <Route path='/tickets' element={<Tickets />} />
            <Route path='/ticket/:id' element={<TicketView />} />
          </Route>
          {/**---------------------------------------
          ********** Statistics
          ********** --------------------------------*/}
          <Route element={<PrivateRoutes departmentHashTable={['Analysis']} />} >
            <Route path="/stats/analysis" element={<Analysis />} />
            <Route path="/stats/analysis/add" element={<AnalysisRegisterStats />} />
          </Route>

          {/*********
           **** SALES
           **********/}
          <Route element={<PrivateRoutes departmentHashTable={['Sales']} />} >
            <Route path="/stats/sales/claims/add" element={<SalesRegisterClaim />} />
            <Route path="/stats/sales" element={<Sales />} />
            <Route path="/stats/sales/add" element={<SalesRegisterStats />} />
            {/**---------------------------------------
             ********** TEAMS/CITIES/ADVISERS
            ********** --------------------------------*/}
            <Route path="/teams" element={<Teams />} />
            <Route path="/team/add" element={<RegisterTeam />} />
            <Route path="/advisers" element={<Advisers />} />
            <Route path="/advisers/add" element={<RegisterAdviser />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/cities/add" element={<RegisterCity />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/add" element={<RegisterClient />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['Customer Service']} />} >
            <Route path="/stats/customer_service" element={<CustomerService />} />
            <Route path="/stats/customer_service/add" element={<CustomerServiceRegisterStats />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['Disbursements']} />} >
            <Route path="/stats/disbursements" element={<Disbursements />} />
            <Route path="/stats/disbursements/add" element={<DisbursementsRegisterStats />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['Human Resources']} />} >
            <Route path="/stats/human_resources" element={<HumanResources />} />
            <Route path="/stats/human_resources/add" element={<HumanResourcesRegisterStats />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['Income']} />} >
            <Route path="/stats/income" element={<Income />} />
            <Route path="/stats/income/add" element={<IncomeRegisterStats />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['Claims']} />} >
            <Route path="/stats/claims" element={<Claims />} />
            <Route path="/stats/claims/add" element={<ClaimsRegisterStats />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['Operations']} />} >
            <Route path="/stats/operations" element={<Operations />} />
            <Route path="/stats/operations/california" element={<OperationsCalifornia />} />
            <Route path="/stats/operations/california/add" element={<OperationsCaliforniaRegisterStats />} />
            <Route path="/stats/operations/miami" element={<OperationsMiami />} />
            <Route path="/stats/operations/miami/add" element={<OperationsMiamiRegisterStats />} />
            <Route path="/stats/operations/orlando" element={<OperationsOrlando />} />
            <Route path="/stats/operations/orlando/add" element={<OperationsOrlandoRegisterStats />} />
            <Route path="/stats/operations/texas" element={<OperationsTexas />} />
            <Route path="/stats/operations/texas/add" element={<OperationsTexasRegisterStats />} />
          </Route>
          <Route element={<PrivateRoutes departmentHashTable={['Finance']} />} >
            <Route path="/stats/finance" element={<Finance />} />
            <Route path="/stats/finance/add" element={<FinanceRegisterStats />} />
          </Route>
          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
const PrivateRoutes = ({ departmentHashTable }: { departmentHashTable: string[] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const validateToken = useUserStore((state) => state.validateToken);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    validateToken().then((result) => result.status ? setIsAuthenticated(true) : setIsAuthenticated(false))
  }, []);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  if (isAuthenticated) {
    if (departmentHashTable.includes('*')) {
      return <Outlet />;
    }

    if (user?.department?.description && departmentHashTable.includes(user?.department?.description)) {
      return <Outlet />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  } else {
    return <Navigate to="/" />;
  }
};
export default App
