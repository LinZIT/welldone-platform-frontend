import BarChartRounded from "@mui/icons-material/BarChartRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { Layout } from "../../../components/ui";
import { DescripcionDeVista } from "../../../components/ui/content";
import { OptionsList } from "../../../components/ui/options";
import { Option } from "../../../interfaces";
import { useGetGraphs } from "../../../hooks";
import { PageLoading } from "../../../components/ui/content/PageLoading";
import { TypographyCustom } from "../../../components/custom";
import { ClaimsStatsTable } from "../../../components/stats/claims";

const options: Option[] = [
  { text: 'Agregar estadisticas', icon: <InsertChartRounded />, path: '/stats/claims/add' },
  { text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiYjBlYmE3OGEtYTQ3Yi00ZTc5LWIxNWItNjg3NmMxYzAwYTM3IiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true },
  { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
]

export const Claims = () => {
  const { data, setData, errors, loading } = useGetGraphs({ url: '/stats/claims' });
  // console.log({ data })
  // Loader
  if (loading) return (<PageLoading />);

  return (
    <Layout>
      <DescripcionDeVista title={"Estadisticas de Claims"} description={"En esta vista podras consultar las estadisticas del departamento de Claims"} />
      <OptionsList options={options} breakpoints={{ xs: 12, sm: 4, md: 4 }} />

      {errors && errors.length > 0 && (
        <>
          <TypographyCustom color='error'>Ocurrio un error</TypographyCustom>
          <TypographyCustom color='error'>{JSON.stringify(errors)}</TypographyCustom>
        </>
      )}
      {data && (
        <ClaimsStatsTable data={data} setData={setData} />
      )}
    </Layout >
  )
}

