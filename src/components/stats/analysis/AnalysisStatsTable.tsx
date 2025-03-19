import { Dispatch, FC, SetStateAction } from "react"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Box } from "@mui/material";
import { TableData } from ".";
import { AnalysisData } from "../../../interfaces";
import { hashNumericFieldsAnalysis, numericFieldsAnalysis } from "../../../pages/stats";
import { request } from "../../../common/request";
import { IResponse } from "../../../interfaces/response-type";
import { toast } from "react-toastify";

interface Props {
    data: any;
    setData: Dispatch<SetStateAction<any>>;
}
export const AnalysisStatsTable: FC<Props> = ({ data, setData }) => {
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
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>ID</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Fecha cierre</TableCell>
                            {numericFieldsAnalysis.map((field, i) => (<TableCell key={i} sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{hashNumericFieldsAnalysis[field]}</TableCell>))}
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Zona WDM</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Observaciones</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.data.map((data: AnalysisData) => (
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
