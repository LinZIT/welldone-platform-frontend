import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { TypographyCustom } from "../../components/custom";
import { OptionsList } from "../../components/ui/options";
import { Option, IAdviser } from "../../interfaces";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import { IResponse } from "../../interfaces/response-type";
import { Layout } from "../../components/ui/Layout";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { BusquedaYResultado } from "../../components/ui/content/BusquedaYResultado";
import { NoContentFound } from "../../components/ui/content/NoContentFound";
import { request } from "../../common/request";

const title = 'Advisers'

export const Advisers = () => {
    const [advisers, setAdvisers] = useState<IAdviser[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Agregar asesor', path: '/advisers/add', icon: <AddRounded /> },
        { text: 'Estadisticas de Sales', path: '/stats/sales', icon: <BarChartRounded /> },
    ]

    /**
     * Funcion para obtener los departamentos activos
     */
    const getDepartments = async () => {
        const url = `/adviser`;
        setLoading(true)
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json()
                setAdvisers(data)
                setLoading(false)
                break;
            case 400:
                setLoading(false)
                break;
            default:
                setLoading(false)
                break;
        }
    }
    useEffect(() => {
        getDepartments();
    }, [])
    return (
        <Layout>
            <DescripcionDeVista title={title} description={'Consulta asesores o navega a "Agregar asesor" para ingresar uno nuevo en el sistema!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            {advisers && (<BusquedaYResultado records={advisers} setRecords={setAdvisers} title={title} />)}
            <Grid container spacing={1}>

                {advisers && advisers.map((adviser: IAdviser) => (
                    <Grid key={adviser.id} item xs={12} sm={6} md={6} lg={6}>
                        {/* <Box sx={styles.contentBox}> */}
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5 }}>
                            <TypographyCustom variant='h6'>{adviser.names} {adviser.surnames}</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.secondary'>{adviser.document}</TypographyCustom>
                        </Paper>
                        {/* </Box> */}
                    </Grid>
                ))}
            </Grid>
            {loading && <Box sx={styles.loaderBox}><CircularProgress /></Box>}
            {!loading && !advisers && <NoContentFound title={'No hubo resultados'} text={`No hay ${title.toLowerCase()} disponibles`} />}
        </Layout>
    )
}

/**
 * Estilos de los componentes MUI
 */
const styles = {
    contentBox: {
        mb: 2,
        border: '1px solid rgba(150,150,150,0.1)',
        borderRadius: 3,
        p: 2,

    },
    loaderBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        mt: 2
    },
}