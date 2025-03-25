import DashboardRounded from "@mui/icons-material/DashboardRounded"
import { OptionsList } from "../../components/ui/options"
import { Option } from "../../interfaces"
import { Box, Paper, darken } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { TypographyCustom } from "../../components/custom"
import { FC, ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { AnalysisIcon, ClaimsIcon, CustomerServiceIcon, DisbursementsIcon, FinanceIcon, HumanResourcesIcon, ITIcon, IncomeIcon, MarketingIcon, OperationsIcon, SalesIcon } from "../../components/icons"
import { useUserStore } from "../../store/user/UserStore"
import { Loading } from "../../components/ui/content/Loading"
import { Layout } from "../../components/ui/Layout"
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista"

const options: Option[] = [
  { text: 'Dashboard', icon: <DashboardRounded />, path: '/dashboard' }
]

export const StatsMenu = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const user = useUserStore((state) => state.user);
  const router = useNavigate();

  useEffect(() => {
    switch (user.department?.description) {
      case 'Sales':
        router('/stats/sales');
        break;
      case 'Disbursements':
        router('/stats/disbursements');
        break;
      case 'Claims':
        router('/stats/claims');
        break;
      case 'Customer Service':
        router('/stats/cs');
        break;
      case 'Human Resources':
        router('/stats/hr');
        break;
      case 'Analysis':
        router('/stats/analysis');
        break;
      case 'Income':
        router('/stats/income');
        break;
      case 'Marketing':
        router('/stats/marketing');
        break;
      case 'Operations':
        router('/stats/operations');
        break;
      case 'Finance':
        router('/stats/finance');
        break;
      default:
        setLoading(false);
        break;
    }
  }, [])

  return loading
    ? (<Loading />)
    : (
      <Layout>
        <DescripcionDeVista title={"Estadisticas"} description={"Selecciona un departamento del que necesites ver estadisticas en especifico"} />
        <OptionsList options={options} breakpoints={{ xs: 12 }} />
        <Grid container spacing={1} sx={{ marginBottom: 5, marginTop: 5 }}>
          {(user.department?.description === 'Analysis' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Analysis'} text={'Estadisticas de Analysis'} icon={<AnalysisIcon width={30} height={30} fill={darken('rgb(297,150,353)', 0.5)} />} color={'rgb(297,150,353)'} path="/analysis" />
          </Grid>)}
          {(user.department?.description === 'Customer Service' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Customer Service'} text={'Estadisticas de Customer Service'} icon={<CustomerServiceIcon width={30} height={30} fill={darken('rgb(339,138,128)', 0.5)} />} color={'rgb(339,138,128)'} path="/customer_service" />
          </Grid>)}
          {(user.department?.description === 'Human Resources' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Human Resources'} text={'Estadisticas de Human Resources'} icon={<HumanResourcesIcon width={30} height={30} fill={darken('rgb(193,246,266)', 0.5)} />} color={'rgb(193,246,266)'} path="/human_resources" />
          </Grid>)}
          {(user.department?.description === 'Sales' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Sales'} text={'Estadisticas de Sales'} icon={<SalesIcon width={30} height={30} fill={darken('rgb(352,354,201)', 0.5)} />} color={'rgb(352,354,201)'} path="/sales" />
          </Grid>)}
          {(user.department?.description === 'Operations' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Operations'} text={'Estadisticas de Operations'} icon={<OperationsIcon width={30} height={30} fill={darken('rgb(165,242,212)', 0.5)} />} color={'rgb(165,242,212)'} path="/operations" />
          </Grid>)}
          {(user.department?.description === 'Claims' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Claims'} text={'Estadisticas de Claims'} icon={<ClaimsIcon width={30} height={30} fill={darken('rgb(161,202,248)', 0.5)} />} color={'rgb(161,202,248)'} path="/claims" />
          </Grid>)}
          {(user.department?.description === 'Disbursements' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Disbursements'} text={'Estadisticas de Disbursements'} icon={<DisbursementsIcon width={30} height={30} fill={darken('rgb(257,304,335)', 0.5)} />} color={'rgb(257,304,335)'} path="/disbursements" />
          </Grid>)}
          {(user.department?.description === 'Marketing' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Marketing'} text={'Estadisticas de Marketing'} icon={<MarketingIcon width={30} height={30} fill={darken('rgb(258,218,341)', 0.5)} />} color={'rgb(258,218,341)'} path="/marketing" />
          </Grid>)}
          {(user.department?.description === 'Income' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Income'} text={'Estadisticas de Income'} icon={<IncomeIcon width={30} height={30} fill={darken('rgb(267,200,177)', 0.5)} />} color={'rgb(267,200,177)'} path="/income" />
          </Grid>)}
          {(user.department?.description === 'Finance' || user.department?.description === 'IT') && (<Grid size={{ xs: 12, md: user.department?.description === 'IT' ? 6 : 12 }}>
            <KPILink title={'Finance'} text={'Estadisticas de Finance'} icon={<FinanceIcon width={30} height={30} fill={darken('rgb(127,249,329)', 0.5)} />} color={'rgb(127,249,329)'} path="/finance" />
          </Grid>)}
          {user.department?.description === 'IT' && (<Grid size={12}>
            <KPILink title={'IT'} text={'Estadisticas de IT'} icon={<ITIcon width={30} height={30} fill={darken('rgb(233,275,146)', 0.5)} />} color={'rgb(233,275,146)'} path="/it" />
          </Grid>)}
        </Grid>
      </Layout>
    )
}

interface Props {
  title: string;
  text: string;
  icon: ReactNode;
  color: string;
  path: string;
}

const KPILink: FC<Props> = ({ title, text, icon, color, path }) => {
  const router = useNavigate();
  return (
    <Paper
      elevation={0}
      onClick={() => router('/stats' + path)}
      sx={styles.KPILink}
    >
      <Box sx={{ minWidth: { xs: 10, sm: 100 }, minHeight: { xs: 100, sm: 100 }, borderRadius: 5, border: `1px solid rgba(0,0,0,0.2)`, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: { sm: 'none', md: 'block' } }}>
          {icon}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexFlow: 'column wrap', ml: 2 }}>
        <TypographyCustom variant={'h4'} sx={{ fontSize: 24 }}>{title}</TypographyCustom>
        <TypographyCustom fontmode={2} color={'text.secondary'} variant="subtitle2">{text}</TypographyCustom>
      </Box>
    </Paper>
  )
}

const styles = {
  KPILink: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    // background: '#FFF',
    borderRadius: 5,
    p: 5,
    transition: '0.5s ease all',
    cursor: 'pointer',
    border: '1px solid rgba(150,150,150,0.2)',
    '&:hover': {
      background: 'rgba(150,150,150,0.2)',
    }, marginInline: { xs: 2, sm: 0 }
  }
}
