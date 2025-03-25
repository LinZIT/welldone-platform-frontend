import Grid from "@mui/material/Grid2";
import { Box, CircularProgress, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { TypographyCustom } from "../../components/custom";
import { OptionsList } from "../../components/ui/options";
import { Option, ICity } from "../../interfaces";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import { request } from "../../common/request";
import { IResponse } from "../../interfaces/response-type";
import { BusquedaYResultado } from "../../components/ui/content/BusquedaYResultado";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { NoContentFound } from "../../components/ui/content/NoContentFound";
import { Layout } from "../../components/ui/Layout";

const title = 'Cities'

export const Cities = () => {
    const [cities, setCities] = useState<ICity[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Agregar ciudad', path: '/cities/add', icon: <AddRounded /> },
        { text: 'Estadisticas de Sales', path: '/stats/sales', icon: <BarChartRounded /> },
    ]

    /**
     * Funcion para obtener los departamentos activos
     */
    const getDepartments = async () => {
        const url = `/city`;
        setLoading(true)
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json()
                setCities(data)
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
            <DescripcionDeVista title={title} description={'Consulta ciudades o navega a "Agregar ciudad" para ingresar uno nuevo en el sistema!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            {cities && (<BusquedaYResultado records={cities} setRecords={setCities} title={title} />)}
            <Grid container spacing={1}>

                {cities && cities.map((city: ICity) => (
                    <Grid key={city.id} size={{ xs: 12, sm: 6 }}>
                        {/* <Box sx={styles.contentBox}> */}
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5 }}>
                            <TypographyCustom variant='h6'>{city.description}</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.secondary'>Ciudad</TypographyCustom>
                        </Paper>
                        {/* </Box> */}
                    </Grid>
                ))}
            </Grid>
            {loading && <Box sx={styles.loaderBox}><CircularProgress /></Box>}
            {!loading && !cities && <NoContentFound title={'No hubo resultados'} text={`No hay ${title.toLowerCase()} disponibles`} />}
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