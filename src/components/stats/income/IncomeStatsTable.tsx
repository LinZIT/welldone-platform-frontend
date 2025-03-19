import { Dispatch, FC, SetStateAction, useContext } from "react"
const { default: Swal } = await import('sweetalert2');
import { AuthContext } from "../../../context/auth"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Box } from "@mui/material";
import { IncomeData } from "../../../interfaces";
import { TableData } from ".";

interface Props {
    data: any;
    setData: Dispatch<SetStateAction<any>>;
}
export const IncomeStatsTable: FC<Props> = ({ data, setData }) => {

    const { authState } = useContext(AuthContext);

    const changePage = async (event: React.ChangeEvent<unknown>, page: number) => {
        const url = `${data?.path}?page=${page}`
        const options = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authState.token}`
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
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrio un error al conectar con el servidor',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    break;
                case 500:
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrio un error al conectar con el servidor',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    break;
                default:
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrio un error al conectar con el servidor',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    })
                    break;

            }
        } catch (error) {
            console.log({ error });
            Swal.fire({
                title: 'Error',
                text: 'Ocurrio un error al conectar con el servidor',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
            })
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
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>N° facturas por negociacion</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Valor de facturas por negociacion</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Cuentas por cobrar por negociacion</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Ingresos por negociacion</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Cobros</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>N° llamadas</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>N° llamadas efectivas</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Ingresos por portafolio</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Cuentas por cobrar por portafolio</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Ingreso global</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Observaciones</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.data.map((data: IncomeData) => (
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