import Grid from "@mui/material/Grid2";
import { Box, CircularProgress, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { TypographyCustom } from "../../components/custom";
import { OptionsList } from "../../components/ui/options";
import { Option, IAdjustingCompany, IInsuranceCompany } from "../../interfaces";
import BusinessCenterOutlined from "@mui/icons-material/BusinessCenterOutlined";
import { IResponse } from "../../interfaces/response-type";
import { request } from "../../common/request";
import { BusquedaYResultado } from "../../components/ui/content/BusquedaYResultado";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { NoContentFound } from "../../components/ui/content/NoContentFound";
import { Layout } from "../../components/ui/Layout";
const title = 'Insurance Company'
export const InsuranceCompany = () => {
    const [insuranceCompanies, setInsuranceCompanies] = useState<IAdjustingCompany[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Agregar Insurance Company', path: '/insurance_companies/add', icon: <BusinessCenterOutlined /> },
        // { text: 'Usuarios', path: '/users', icon: <GroupRounded /> },
    ]

    /**
     * Funcion para obtener los departamentos activos
     */
    const getAdjustingCompanies = async () => {
        const url = `/insurance_companies`;
        setLoading(true)
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json()
                setInsuranceCompanies(data)
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
        getAdjustingCompanies();
    }, [])
    return (
        <Layout>
            <DescripcionDeVista title={title} description={'Consulta usuarios o navega a "Agregar Usuario" para ingresar uno nuevo en el sistema!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            {insuranceCompanies && (<BusquedaYResultado records={insuranceCompanies} setRecords={setInsuranceCompanies} title={title} />)}
            <Grid container spacing={1}>

                {insuranceCompanies && insuranceCompanies.map((insuranceCompany: IInsuranceCompany) => (
                    <Grid key={insuranceCompany.id} size={{ xs: 12, sm: 6 }}>
                        {/* <Box sx={styles.contentBox}> */}
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5 }}>
                            <TypographyCustom variant='h6'>{insuranceCompany.description}</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.secondary'>Compañia de seguros</TypographyCustom>
                        </Paper>
                        {/* </Box> */}
                    </Grid>
                ))}
            </Grid>
            {loading && <Box sx={styles.loaderBox}><CircularProgress /></Box>}
            {!loading && !insuranceCompanies && <NoContentFound title={'No hubo resultados'} text={`No hay ${title.toLowerCase()} disponibles`} />}
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