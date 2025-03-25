import BarChartRounded from "@mui/icons-material/BarChartRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { TypographyCustom } from "../../../../components/custom";
import { OptionsList } from "../../../../components/ui/options";
import { Option } from "../../../../interfaces";
import { OperationsCaliforniaStatsTable } from "../../../../components/stats/operations/california";
import { Loading } from "../../../../components/ui/content/Loading";
import { Layout } from "../../../../components/ui/Layout";
import { DescripcionDeVista } from "../../../../components/ui/content/DescripcionDeVista";
import { useGetGraphs } from "../../../../hooks/useGetGraphs";

const options: Option[] = [
    { text: 'Agregar estadisticas', icon: <InsertChartRounded />, path: '/stats/operations/california/add' },
    { text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiNmIzNjlmZWEtZGQ4Zi00YjZlLTg1OTUtMTRmOWZjYjhjZGQyIiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true },
    { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
]

export const OperationsCalifornia = () => {
    const { data, setData, errors, loading } = useGetGraphs({ url: '/stats/operations/california' });
    // Loader
    if (loading) return (<Loading />);

    return (
        <Layout>
            <DescripcionDeVista title={"Estadisticas de Operations California"} description={"En esta vista podras consultar las estadisticas del departamento de Operations California"} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 4, md: 4 }} />

            {errors && errors.length > 0 && (
                <>
                    <TypographyCustom color='error'>Ocurrio un error</TypographyCustom>
                    <TypographyCustom color='error'>{JSON.stringify(errors)}</TypographyCustom>
                </>
            )}
            {data && (
                <OperationsCaliforniaStatsTable data={data} setData={setData} />
            )}
        </Layout >
    )
}

