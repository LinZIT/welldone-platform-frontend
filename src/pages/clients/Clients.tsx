import Grid from "@mui/material/Grid2";
import { AppBar, Box, CircularProgress, Dialog, Divider, IconButton, Paper, Table, TableCell, TableHead, TableRow, Toolbar, darken } from "@mui/material";
import { useState, useContext, useEffect, FC } from "react";
import { TypographyCustom } from "../../components/custom";
import { OptionsList } from "../../components/ui/options";
import { Option, IClient, IClaim } from "../../interfaces";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { useTheme } from "@emotion/react";
import { IResponse } from "../../interfaces/response-type";
import { request } from "../../common/request";
import { BusquedaYResultado } from "../../components/ui/content/BusquedaYResultado";
import { DescripcionDeVista } from "../../components/ui/content/DescripcionDeVista";
import { Loading } from "../../components/ui/content/Loading";
import { NoContentFound } from "../../components/ui/content/NoContentFound";
import { Layout } from "../../components/ui/Layout";
import { ucwords } from "../../lib/functions";
import { useUserStore } from "../../store/user/UserStore";
import { ClaimDialog, ClaimTableCellDialog } from "../../components/dialogs/claims";

const title = 'Clients'

export const Clients = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [clients, setclients] = useState<IClient[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Agregar client', path: '/clients/add', icon: <AddRounded /> },
        { text: 'Estadisticas de Sales', path: '/stats/sales', icon: <BarChartRounded /> },
    ]

    /**
     * Funcion para obtener los departamentos activos
     */
    const getDepartments = async () => {
        const url = `/client`;
        setLoading(true)
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json()
                setclients(data)
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
            <DescripcionDeVista title={title} description={'Consulta clientes o navega a "Agregar cliente" para ingresar uno nuevo en el sistema!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            {clients && (<BusquedaYResultado records={clients} setRecords={setclients} title={title} />)}
            <Grid container spacing={1}>
                {clients && clients.map((client: IClient) => (
                    <Grid key={client.id} size={{ xs: 12, sm: 6 }}>
                        <ClientDialog clientShowData={client} />
                    </Grid>
                ))}
            </Grid>
            {loading && <Box sx={styles.loaderBox}><CircularProgress /></Box>}
            {!loading && !clients && <NoContentFound title={'No hubo resultados'} text={`No hay ${title.toLowerCase()} disponibles`} />}
        </Layout>
    )
}

type ClientShowData = {
    id: number;
    names: string;
    surnames: string;
}
interface ClientDialogProps {
    clientShowData: ClientShowData;
}

const ClientDialog: FC<ClientDialogProps> = ({ clientShowData }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [client, setClient] = useState<IClient | null>(null)

    const getClient = async () => {
        setLoading(true);
        const url = `/client/${clientShowData.id}`;
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setClient(data);
                setLoading(false);
                break;
            case 400:
                const { errors } = await response.json();
                setErrors(errors);
                setLoading(false);
                break;
            default:
                setErrors(['Ocurrio un error inesperado', String(response.status)]);
                setLoading(false);
                break;
        }

    }

    const openModal = async () => {
        await getClient();
        setOpen(true);
    }
    const closeModal = () => {
        setOpen(false)
    }
    return (<>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5, cursor: 'pointer' }} onClick={openModal}>
            <TypographyCustom variant='h6'>{`${clientShowData?.names} ${clientShowData?.surnames}`}</TypographyCustom>
            <TypographyCustom variant='subtitle2' color='text.secondary'>Cliente</TypographyCustom>
        </Paper>
        <Dialog fullScreen open={open}>
            <AppBar sx={{ background: (theme) => theme.palette.mode === 'dark' ? '#101010' : darken(useUserStore.getState().user.color, 0.9) }}>
                <Toolbar sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between' }}>
                    <TypographyCustom fontSize={16}>
                        Informacion del cliente
                    </TypographyCustom>
                    <IconButton edge="start" color="inherit" onClick={closeModal} aria-label="close">
                        <CloseRounded />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {loading
                ? (<Loading />)
                : (
                    <Paper elevation={0} sx={{ margin: 'auto', width: '100%', minHeight: '100vh', background: (theme) => darken(theme.palette.background.paper, 0.1) }}>
                        {client && (<ClientInfo client={client} />)}
                        {!client && <TypographyCustom>No se encontro informacion del cliente</TypographyCustom>}
                        {errors && errors.map((e) => (<TypographyCustom>{e}</TypographyCustom>))}
                    </Paper>
                )
            }

        </Dialog>
    </>
    )
}

const useGetClaims = (id: number) => {
    const [claims, setClaims] = useState<IClaim[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const getClaims = async () => {
        const url = `/claims/${id}`;
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setClaims(data)
                setLoading(false)
                break;
            case 400:
                const { errors: responseErrors } = await response.json();
                setErrors([responseErrors]);
                setLoading(false)
                break;
            default:
                setErrors(['Ocurrio un error inesperado', String(response.status)])
                setLoading(false)
                break;
        }
    }

    useEffect(() => {
        getClaims();
    }, [])

    return { claims, setClaims, getClaims, loading, errors }
}

interface ClientInfoProps {
    client: IClient;
}
const ClientInfo: FC<ClientInfoProps> = ({ client }) => {
    const { claims, setClaims, getClaims, loading, errors } = useGetClaims(client.id);

    return loading
        ? <Loading />
        : (<>
            <Box sx={{ background: (theme) => theme.palette.mode === 'dark' ? '#191919' : theme.palette.background.paper, width: '100%', mt: 8, mb: 4, borderRadius: '0 0 2em 2em ' }}>
                <Box sx={{ width: '80%', margin: 'auto', pt: 5, pb: 10 }}>
                    <TypographyCustom variant='h4' fontWeight={'bold'}>
                        {client && `${ucwords(client?.names.toLowerCase())} ${ucwords(client?.surnames.toLowerCase())}`}
                    </TypographyCustom>
                    <Divider sx={{ marginBlock: 3 }} />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={'bold'} fontSize={16}>Email</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={200} fontSize={16}>{`${client?.email} `}</TypographyCustom>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={'bold'} fontSize={16}>Telefono</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={200} fontSize={16}>{`${client?.phone} `}</TypographyCustom>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={'bold'} fontSize={16}>Direccion</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={200} fontSize={16}>
                                {`${client?.address}, ${client?.city}, ${client?.state}, ${client?.zip_code} `}
                            </TypographyCustom>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={'bold'} fontSize={16}>Descripcion numero adicional 1</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={200} fontSize={16}>{`${client?.aditional_phone_1_description} `}</TypographyCustom>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={'bold'} fontSize={16}>Numero adicional 1</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={200} fontSize={16}>{`${client?.aditional_phone_1} `}</TypographyCustom>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={'bold'} fontSize={16}>Descripcion numero adicional 2</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={200} fontSize={16}>{`${client?.aditional_phone_2_description} `}</TypographyCustom>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={'bold'} fontSize={16}>Numero adicional 2</TypographyCustom>
                            <TypographyCustom variant='subtitle2' color='text.primary' fontWeight={200} fontSize={16}>{`${client?.aditional_phone_2} `}</TypographyCustom>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center', mb: 4, width: '80%', margin: 'auto' }}>
                <TypographyCustom variant='h4' fontWeight={'bold'}>Claims</TypographyCustom>
                <ClaimDialog client={client} getClaims={getClaims} />
                {claims && claims.length === 0 && (<NoContentFound title={"No hubo resultados"} text={"No se encontraron claims"} />)}
                {claims && claims.length > 0 && (
                    <Table sx={{ mt: 3, background: (theme) => darken(theme.palette.background.paper, 0.3), borderRadius: 5, overflow: 'hidden', border: '1px solid black' }}>
                        <TableHead sx={{ background: (theme) => darken(theme.palette.background.paper, 0.5) }}>
                            <TableRow>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Fecha</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}># Claim</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Numero de poliza</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Causa</TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Ubicacion del daño</TableCell>
                            </TableRow>
                        </TableHead>
                        {claims.map((claim: IClaim, i: number) => <ClaimTableCellDialog claim={claim} key={i} />)}
                    </Table>
                )}
            </Box>
        </>
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