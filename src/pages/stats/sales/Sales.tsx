import BarChartRounded from "@mui/icons-material/BarChartRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import LocationCityRounded from "@mui/icons-material/LocationCityRounded";
import { OptionsList } from "../../../components/ui/options";
import { Option } from "../../../interfaces";
import { TypographyCustom } from "../../../components/custom";
import { SalesStatsTable } from "../../../components/stats/sales";
import GroupRounded from "@mui/icons-material/GroupRounded";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import BusinessCenterRounded from "@mui/icons-material/BusinessCenterRounded";
import BusinessRounded from "@mui/icons-material/BusinessRounded";
import { Loading } from "../../../components/ui/content/Loading";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";
import { Layout } from "../../../components/ui/Layout";
import { useGetGraphs } from "../../../hooks/useGetGraphs";
const options: Option[] = [
  { text: 'Agregar claim', icon: <InsertChartRounded />, path: '/stats/sales/claims/add' },
  { text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiOTgwYWYwMDYtYzFjYi00ZGYwLTk0OWEtMzkyMTJiYTg3OGQ4IiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true },
  { text: 'Asesores', icon: <GroupRounded />, path: '/advisers' },
  { text: 'Equipos', icon: <Diversity3Icon />, path: '/teams' },
  { text: 'Ciudades', icon: <LocationCityRounded />, path: '/cities' },
  { text: 'Clientes', icon: <GroupRounded />, path: '/clients' },
  { text: 'Compañias ajustadoras', icon: <BusinessCenterRounded />, path: '/adjusting_companies' },
  { text: 'Compañias de seguro', icon: <BusinessRounded />, path: '/insurance_companies' },
]

export const Sales = () => {
  const { data, setData, errors, loading } = useGetGraphs({ url: '/stats/sales' });
  // Loader
  if (loading) return (<Loading />);

  return (
    <Layout>
      <DescripcionDeVista title={"Estadisticas de Sales"} description={"En esta vista podras consultar las estadisticas del departamento de Sales"} />
      <OptionsList options={options} breakpoints={{ xs: 12, sm: 3, md: 3 }} />

      {errors && errors.length > 0 && (
        <>
          <TypographyCustom color='error'>Ocurrio un error</TypographyCustom>
          <TypographyCustom color='error'>{JSON.stringify(errors)}</TypographyCustom>
        </>
      )}
      {data && (
        <SalesStatsTable data={data} setData={setData} />
      )}
    </Layout >
  )
}

