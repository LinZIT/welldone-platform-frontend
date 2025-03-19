import BarChartRounded from "@mui/icons-material/BarChartRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { TypographyCustom } from "../../../../components/custom";
import { Layout } from "../../../../components/ui";
import { DescripcionDeVista } from "../../../../components/ui/content";
import { PageLoading } from "../../../../components/ui/content/PageLoading";
import { OptionsList } from "../../../../components/ui/options";
import { useGetGraphs } from "../../../../hooks";
import { Option } from "../../../../interfaces";
import { OperationsTexasStatsTable } from "../../../../components/stats/operations/texas";

const options: Option[] = [
    { text: 'Agregar estadisticas', icon: <InsertChartRounded />, path: '/stats/operations/texas/add' },
    { text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiNmIzNjlmZWEtZGQ4Zi00YjZlLTg1OTUtMTRmOWZjYjhjZGQyIiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true },
    { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
]

export const OperationsTexas = () => {
    const { data, setData, errors, loading } = useGetGraphs({ url: '/stats/operations/texas' });
    // Loader
    if (loading) return (<PageLoading />);

    return (
        <Layout>
            <DescripcionDeVista title={"Estadisticas de Operations Texas"} description={"En esta vista podras consultar las estadisticas del departamento de Operations Texas"} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 4, md: 4 }} />

            {errors && errors.length > 0 && (
                <>
                    <TypographyCustom color='error'>Ocurrio un error</TypographyCustom>
                    <TypographyCustom color='error'>{JSON.stringify(errors)}</TypographyCustom>
                </>
            )}
            {data && (
                <OperationsTexasStatsTable data={data} setData={setData} />
            )}
        </Layout >
    )
}

