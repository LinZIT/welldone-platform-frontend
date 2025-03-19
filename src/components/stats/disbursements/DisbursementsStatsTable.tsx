import { Dispatch, FC, SetStateAction } from "react"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Box } from "@mui/material";
import { DisbursementsData } from "../../../interfaces";
import { TableData } from ".";
import { useUserStore } from "../../../store/user/UserStore";
import { toast } from "react-toastify";

interface Props {
    data: any;
    setData: Dispatch<SetStateAction<any>>;
}
export const DisbursementsStatsTable: FC<Props> = ({ data, setData }) => {

    const user = useUserStore(state => state.user);

    const changePage = async (event: React.ChangeEvent<unknown>, page: number) => {
        const url = `${data?.path}?page=${page}`
        const options = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        }
        try {
            const response = await fetch(url, options);
            switch (response.status) {
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
        } catch (error) {
            console.log({ error });
            toast.error('Ocurrio un error al conectar con el servidor')
        }
        return;
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
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>ID</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Fecha cierre</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>N° de facturas vencidas</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Valor de facturas pagadas</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Cuentas por pagar</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Proveedores pagados</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Observaciones</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.data.map((data: DisbursementsData) => (
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