import BarChartRounded from "@mui/icons-material/BarChartRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { OptionsList } from "../../../components/ui/options";
import { Option } from "../../../interfaces";
import { TypographyCustom } from "../../../components/custom";
import { CustomerServiceStatsTable } from "../../../components/stats/cs";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";
import { Layout } from "../../../components/ui/Layout";
import { Loading } from "../../../components/ui/content/Loading";
import { useGetGraphs } from "../../../hooks/useGetGraphs";

const options: Option[] = [
  { text: 'Agregar estadisticas', icon: <InsertChartRounded />, path: '/stats/customer_service/add' },
  { text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiMjY0MWFiN2QtOTA3My00OGM1LTkxZmItMzYyMjlhZjYzODI4IiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true },
  { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
]

export const CustomerService = () => {
  const { data, setData, errors, loading } = useGetGraphs({ url: '/stats/customer_service' });
  // console.log({ data })
  // Loader
  if (loading) return (<Loading />);

  return (
    <Layout>
      <DescripcionDeVista title={"Estadisticas de Customer Service"} description={"En esta vista podras consultar las estadisticas del departamento de Customer Service"} />
      <OptionsList options={options} breakpoints={{ xs: 12, sm: 4, md: 4 }} />

      {errors && errors.length > 0 && (
        <>
          <TypographyCustom color='error'>Ocurrio un error</TypographyCustom>
          <TypographyCustom color='error'>{JSON.stringify(errors)}</TypographyCustom>
        </>
      )}
      {data && (
        <CustomerServiceStatsTable data={data} setData={setData} />
      )}
    </Layout >
  )
}

