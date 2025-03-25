import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/ui/Layout'

import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumberRounded';

import { OptionsList } from '../components/ui/options';
import { TypographyCustom } from '../components/custom';
import { DescripcionDeVista } from '../components/ui/content/DescripcionDeVista';

import { useUserStore } from '../store/user/UserStore';

import moment from 'moment';
import { useSocketStore } from '../store/sockets/SocketStore';
import { Option } from '../interfaces';
import { BarChartRounded, BusinessCenterRounded, BusinessRounded, CloseRounded, Diversity3Rounded, GroupRounded, InsertChartRounded, LocationCityRounded, PeopleRounded, SupportAgentOutlined } from '@mui/icons-material';
import { DashboardAnalysis, DashboardClaims, DashboardCustomerService, DashboardDisbursements, DashboardFinance, DashboardHumanResources, DashboardIncome, DashboardIT, DashboardOperations, DashboardSales } from '../components/dashboard';

export const Dashboard = () => {
    const user = useUserStore((state) => state.user);
    const validateToken = useUserStore((state) => state.validateToken);
    const socket = useSocketStore((state) => state);
    const [path, setPath] = useState<string>('/stats')
    useEffect(() => {

    }, [])
    useEffect(() => {
        validateToken();

        // getCategories();
        if (user.id !== 0) {
            switch (user.department?.description) {
                case 'Sales':
                    setPath('/stats/sales');
                    break;
                case 'Disbursements':
                    setPath('/stats/disbursements');
                    break;
                case 'Claims':
                    setPath('/stats/claims');
                    break;
                case 'Customer Service':
                    setPath('/stats/cs');
                    break;
                case 'Human Resources':
                    setPath('/stats/hr');
                    break;
                case 'Analysis':
                    setPath('/stats/analysis');
                    break;
                case 'Income':
                    setPath('/stats/income');
                    break;
                case 'Marketing':
                    setPath('/stats/marketing');
                    break;
                case 'Operations':
                    setPath('/stats/operations');
                    break;
                case 'Finance':
                    setPath('/stats/finance');
                    break;
                default:
                    break;
            }
            if (socket.echo === null) {
                socket.setSocket();
            } else {
                console.log({ socket })
                socket.echo.join(`ticketsRoom.${user?.department_id}`)
            }
        }
        return () => {
            if (socket.echo) {
                socket.echo.leave(`ticketsRoom.${user?.department_id}`)
            }
        }
    }, [user.id, socket.echo])
    let options: Option[] = user.department?.description === 'IT' ? [
        { text: 'Estadisticas', icon: <BarChartRounded />, path: '/stats' },
        { text: 'Department', icon: <BusinessCenterRounded />, path: '/department' },
        { text: 'Users', icon: <PeopleRounded />, path: '/users' },
        { text: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/tickets' },
    ] : [
        { text: 'Estadisticas', icon: <BarChartRounded />, path },
        { text: 'Crear ticket', icon: <SupportAgentOutlined />, path: '/tickets' },
    ]
    if (user.department?.description === 'Sales') {
        options.pop();
        options.push({ text: 'Agregar claim', icon: <InsertChartRounded />, path: '/stats/sales/claims/add' });
        options.push({ text: 'Graficas PowerBI', icon: <BarChartRounded />, path: 'https://app.powerbi.com/view?r=eyJrIjoiOTgwYWYwMDYtYzFjYi00ZGYwLTk0OWEtMzkyMTJiYTg3OGQ4IiwidCI6ImFkYjQwNTM2LWJlODAtNDc3ZC05MDIxLTFlMGIzMTZiMjRmMCIsImMiOjJ9', external: true });
        options.push({ text: 'Asesores', icon: <GroupRounded />, path: '/advisers' });
        options.push({ text: 'Equipos', icon: <Diversity3Rounded />, path: '/teams' });
        options.push({ text: 'Ciudades', icon: <LocationCityRounded />, path: '/cities' });
        options.push({ text: 'Clientes', icon: <GroupRounded />, path: '/clients' });
        options.push({ text: 'Compañias ajustadoras', icon: <BusinessCenterRounded />, path: '/adjusti ng_companies' });
        options.push({ text: 'Compañias de seguro', icon: <BusinessRounded />, path: '/insurance_companies' });
        options.push({ text: 'Crear ticket', icon: <SupportAgentOutlined />, path: '/tickets' });
    }
    const router = useNavigate();
    const days: any = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miercoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sabado',
        7: 'Domingo',
    }
    if (!user.names) return (
        <Layout>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress />
            </Box>
        </Layout>
    )
    return (
        <Layout >
            <DescripcionDeVista title={`Bienvenido, ${user.names.split(' ')[0]} 👋`} description={`¡Feliz ${days[moment().day()]}! 🌞 Selecciona alguna de las opciones disponibles para interactuar con el sistema`} buttons={false} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: options.length > 4 ? 3 : (12 / options.length) }} />

            <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
                {days[moment().day()] === 'Jueves' && (
                    <Grid size={12}>
                        <DismissableReminder />
                    </Grid>
                )}
                {user.department?.description === 'IT' && (<DashboardIT />)}
                {user.department?.description === 'Sales' && (<DashboardSales />)}
                {user.department?.description === 'Claims' && (<DashboardClaims />)}
                {user.department?.description === 'Income' && (<DashboardIncome />)}
                {user.department?.description === 'Finance' && (<DashboardFinance />)}
                {user.department?.description === 'Analysis' && (<DashboardAnalysis />)}
                {user.department?.description === 'Operations' && (<DashboardOperations />)}
                {user.department?.description === 'Disbursements' && (<DashboardDisbursements />)}
                {user.department?.description === 'Human Resources' && (<DashboardHumanResources />)}
                {user.department?.description === 'Customer Service' && (<DashboardCustomerService />)}
            </Grid>
        </Layout>
    )
}
const DismissableReminder = () => {
    const [open, setOpen] = useState<boolean>(true);
    const close = () => {
        setOpen(false);
    }
    return open && (
        <Paper elevation={0} sx={{ border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5, display: 'flex', flexFlow: 'column wrap' }}>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', pr: 1, pt: 1 }}>
                <IconButton onClick={close}>
                    <CloseRounded />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexFlow: 'row wrap', justifyContent: 'center', textAlign: 'center', width: '100%', paddingInline: 5, gap: 2 }}>
                <img src='/charts-thursday.svg' width={250} height={250} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 4 } }}>
                    <TypographyCustom fontSize={24} _color="p">
                        Hoy es Jueves ¡Recuerda ingresar tus estadisticas!
                    </TypographyCustom>
                </Box>
            </Box>
        </Paper>
    )
}
