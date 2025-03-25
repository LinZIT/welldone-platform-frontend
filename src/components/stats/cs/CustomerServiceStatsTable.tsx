import { Dispatch, FC, SetStateAction } from "react"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Box } from "@mui/material";
import { CustomerServiceData } from "../../../interfaces";
import { TableData } from ".";
import { request } from "../../../common/request";
import { IResponse } from "../../../interfaces/response-type";
import { toast } from "react-toastify";
const titles = [
    'ID',
    'Fecha cierre',
    'Solicitudes extras',
    'Tickets de asesores',
    'Ll. Inconsecuente',
    'Ll. Problemas sin solución',
    'Ll. Confirmación',
    'Ll. Problemas',
    'Ll. Reparaciones',
    'Ll. Agenda de Mold y ShrinkWrap',
    'Ll. Triway call',
    'Ll. Claim number call',
    'Ll. Encuesta de satisfacción',
    'Ll. Encuesta de marketing',
    'Ll. Welcome call',
    'Total de llamadas',
    'Emails enviados',
    'Emails gestionados',
    'Ordenes de trabajo',
    'Solicitudes de reviews en Google',
    'Reviews de Google',
    'Solicitud de reviews en BBB',
    'Reviews en BBB',
    'Reparaciones del dia',
    'Inspecciones del dia',
    'Remediaciones del dia',
    'ShrinkWrap del dia',
    'Ll. Clean Initiative',
    'C.I. para WDM',
    'WDM para C.I',
    'Observaciones',
    'Acciones',
]
interface Props {
    data: any;
    setData: Dispatch<SetStateAction<any>>;
}
export const CustomerServiceStatsTable: FC<Props> = ({ data, setData }) => {
    const changePage = async (event: React.ChangeEvent<unknown>, page: number) => {
        const url = `/${data?.path}?page=${page}`
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setData(data)
                break;
            case 400:
                toast.error('Ocurrio un error al conectar con el servidor')
                break;
            case 500:
                toast.error('Ocurrio un error al conectar con el servidor')
                break;
            default:
                toast.error('Ocurrio un error al conectar con el servidor')
                break;
        }
    }
    return (
        <>
            <Box sx={{ display: 'flex', flexFlow: "row wrap", justifyContent: 'end', mt: 2, mb: 2 }}>
                <Pagination count={data.last_page} page={data.current_page} showFirstButton showLastButton onChange={(event: React.ChangeEvent<unknown>, page: number) => changePage(event, page)} />
            </Box>
            <TableContainer component={Paper} sx={{
                '&::-webkit-scrollbar': {
                    width: '0.4em'
                },
                '&::-webkit-scrollbar-track': {
                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                }
            }}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            {titles.map((title, i) => <TableCell key={i} sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{title}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.data.map((data: CustomerServiceData) => (
                            <TableData key={data.id} data={data} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', flexFlow: "row wrap", justifyContent: 'end', mt: 2, mb: 2 }}>
                <Pagination count={data.last_page} page={data.current_page} showFirstButton showLastButton onChange={(event: React.ChangeEvent<unknown>, page: number) => changePage(event, page)} />
            </Box>
        </>
    )
}