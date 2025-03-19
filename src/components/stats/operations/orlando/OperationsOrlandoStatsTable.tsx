import { Box, Pagination, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Dispatch, SetStateAction, FC, } from "react";
import { TableData } from ".";
import { OperationsOrlandoData } from "../../../../interfaces/operations-data-type";
import { IResponse } from "../../../../interfaces/response-type";
import { request } from "../../../../common/request";
import { toast } from "react-toastify";

interface Props {
    data: any;
    setData: Dispatch<SetStateAction<any>>;
}
export const OperationsOrlandoStatsTable: FC<Props> = ({ data, setData }) => {

    const changePage = async (event: React.ChangeEvent<unknown>, page: number) => {
        const url = `${data?.path}?page=${page}`
        const { status, response, err }: IResponse = await request(url, 'GET');
        console.log({ status, response, err });
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
    const titles = [
        'ID',
        'Fecha cierre',
        'Week',
        'Roof',
        'Water',
        'Mold',
        'Mold testing',
        'Shrink Wrap',
        'Inspections',
        '2nd Tarp',
        'Observaciones',
        'Acciones',
    ]
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
                        {data && data.data.map((data: OperationsOrlandoData) => (
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