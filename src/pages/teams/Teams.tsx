import Grid from "@mui/material/Grid2";
import { Avatar, Box, CircularProgress, Paper, darken } from "@mui/material";
import { useState, useEffect } from "react";
import { TypographyCustom } from "../../components/custom";
import { OptionsList } from "../../components/ui/options";
import { Option, ITeam } from "../../interfaces";
import AddRounded from "@mui/icons-material/AddRounded";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import { IResponse } from "../../interfaces/response-type";
import { request } from "../../common/request";
import { Layout } from "../../components/ui/Layout";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { BusquedaYResultado } from "../../components/ui/content/BusquedaYResultado";
import { getRandomColorPastel } from "../../lib/functions";
import { NoContentFound } from "../../components/ui/content/NoContentFound";
const title = 'Teams'
export const Teams = () => {
    const [teams, setTeams] = useState<ITeam[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Agregar equipo', path: '/team/add', icon: <AddRounded /> },
        { text: 'Estadisticas de Sales', path: '/stats/sales', icon: <BarChartRounded /> },
        // { text: 'Usuarios', path: '/users', icon: <GroupRounded /> },
    ]

    /**
     * Funcion para obtener los departamentos activos
     */
    const getTeams = async () => {
        const url = `/team`;
        setLoading(true)
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (response.status) {
            case 200:
                const { data } = await response.json()
                setTeams(data)
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
        getTeams();
    }, [])
    return (
        <Layout>
            <DescripcionDeVista title={title} description={'Consulta usuarios o navega a "Agregar Usuario" para ingresar uno nuevo en el sistema!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            {teams && (<BusquedaYResultado records={teams} setRecords={setTeams} title={title} />)}
            <Grid container spacing={1}>

                {teams && teams.map((team: ITeam) => (
                    <Grid key={team.id} size={{ xs: 12, sm: 6 }}>
                        {/* <Box sx={styles.contentBox}> */}
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5 }}>
                            <Avatar sx={{ background: darken(getRandomColorPastel(), 0.2) }}>{team.adviser.names.charAt(0).toUpperCase() + team.adviser.surnames.charAt(0).toUpperCase()}</Avatar>
                            <TypographyCustom variant='h6'>{team.city.description} - {`${team.adviser.names} ${team.adviser.surnames}`}</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.secondary'>Equipo</TypographyCustom>
                        </Paper>
                        {/* </Box> */}
                    </Grid>
                ))}
            </Grid>
            {loading && <Box sx={styles.loaderBox}><CircularProgress /></Box>}
            {!loading && !teams && <NoContentFound title={'No hubo resultados'} text={`No hay ${title.toLowerCase()} disponibles`} />}
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