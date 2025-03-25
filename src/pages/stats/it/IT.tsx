import BarChartRounded from "@mui/icons-material/BarChartRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { OptionsList } from "../../../components/ui/options"
import { Option } from "../../../interfaces"
import { TypographyCustom } from "../../../components/custom"
import { ITStatsTable } from "../../../components/stats/it"
import { useGetGraphs } from "../../../hooks/useGetGraphs";
import { Loading } from "../../../components/ui/content/Loading";
import { Layout } from "../../../components/ui/Layout";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";
// const { default: Swal } = await import('sweetalert2');
// import { errorArrayLaravelTransformToArray } from "../../../helpers/functions"
const options: Option[] = [
  { text: 'Agregar estadisticas', icon: <InsertChartRounded />, path: '/stats/it/add' },
  { text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiMDJlYTBlMGItOGM0OS00N2QzLTkyOTUtOGMyMzllNTg3ZGZlIiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true },
  { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
]
export const IT = () => {
  const { data, setData, errors, loading } = useGetGraphs({ url: '/stats/it' });
  console.log({ data })
  // Loader
  if (loading) return (<Loading />);

  return (
    <Layout>
      <DescripcionDeVista title={"Estadisticas de IT"} description={"En esta vista podras consultar las estadisticas del departamento de IT"} />
      <OptionsList options={options} breakpoints={{ xs: 12, sm: 4, md: 4 }} />

      {errors && errors.length > 0 && (
        <>
          <TypographyCustom color='error'>Ocurrio un error</TypographyCustom>
          <TypographyCustom color='error'>{JSON.stringify(errors)}</TypographyCustom>
        </>
      )}
      {data && (
        <ITStatsTable data={data} setData={setData} />
      )}
    </Layout >
  )
}

