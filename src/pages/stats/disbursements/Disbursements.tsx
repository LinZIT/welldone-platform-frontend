import BarChartRounded from "@mui/icons-material/BarChartRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { OptionsList } from "../../../components/ui/options";
import { Option } from "../../../interfaces";
import { TypographyCustom } from "../../../components/custom";
import { DisbursementsStatsTable } from "../../../components/stats/disbursements";
import { Loading } from "../../../components/ui/content/Loading";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";
import { Layout } from "../../../components/ui/Layout";
import { useGetGraphs } from "../../../hooks/useGetGraphs";

const options: Option[] = [
  { text: 'Agregar estadisticas', icon: <InsertChartRounded />, path: '/stats/disbursements/add' },
  { text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiMmVkM2UxYjktOWJkYy00ZDczLWE0ZjgtN2FjM2IxMWNjMTI5IiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true },
  { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
]

export const Disbursements = () => {
  const { data, setData, errors, loading } = useGetGraphs({ url: '/stats/disbursements' });
  // console.log({ data })
  // Loader
  if (loading) return (<Loading />);

  return (
    <Layout>
      <DescripcionDeVista title={"Estadisticas de Disbursements"} description={"En esta vista podras consultar las estadisticas del departamento de Disbursements"} />
      <OptionsList options={options} breakpoints={{ xs: 12, sm: 4, md: 4 }} />

      {errors && errors.length > 0 && (
        <>
          <TypographyCustom color='error'>Ocurrio un error</TypographyCustom>
          <TypographyCustom color='error'>{JSON.stringify(errors)}</TypographyCustom>
        </>
      )}
      {data && (
        <DisbursementsStatsTable data={data} setData={setData} />
      )}
    </Layout >
  )
}

