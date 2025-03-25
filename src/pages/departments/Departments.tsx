import { Box, CircularProgress, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { TypographyCustom } from "../../components/custom";
import { OptionsList } from "../../components/ui/options";
// import GroupRounded from "@mui/icons-material/GroupRounded";
import BusinessCenterOutlined from "@mui/icons-material/BusinessCenterOutlined";
import { Option } from "../../interfaces";
import { IDepartment } from "../../interfaces/department-type";
import { IResponse } from "../../interfaces/response-type";
import { Layout } from "../../components/ui/Layout";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { BusquedaYResultado } from "../../components/ui/content/BusquedaYResultado";
import { NoContentFound } from "../../components/ui/content/NoContentFound";
import { request } from "../../common/request";
const title = 'Departamentos'
export const Departments = () => {
    const [departments, setDepartments] = useState<IDepartment[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Agregar departamento', path: '/department/add', icon: <BusinessCenterOutlined /> },
        // { text: 'Usuarios', path: '/users', icon: <GroupRounded /> },
    ]

    /**
     * Funcion para obtener los departamentos activos
     */
    const getDepartments = async () => {
        const url = `/department`;
        setLoading(true)
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json()
                setDepartments(data)
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
            <DescripcionDeVista title={title} description={'Consulta usuarios o navega a "Agregar Usuario" para ingresar uno nuevo en el sistema!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            {departments && (<BusquedaYResultado records={departments} setRecords={setDepartments} title={title} />)}
            <Grid container spacing={1}>

                {departments && departments.map((department: IDepartment) => (
                    <Grid key={department.id} size={{ xs: 12, sm: 6 }}>
                        {/* <Box sx={styles.contentBox}> */}
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5 }}>
                            <TypographyCustom variant='h6'>{department.description}</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.secondary'>Departamento</TypographyCustom>
                        </Paper>
                        {/* </Box> */}
                    </Grid>
                ))}
            </Grid>
            {loading && <Box sx={styles.loaderBox}><CircularProgress /></Box>}
            {!loading && !departments && <NoContentFound title={'No hubo resultados'} text={`No hay ${title.toLowerCase()} disponibles`} />}
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