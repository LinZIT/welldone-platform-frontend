import BarChartRounded from "@mui/icons-material/BarChartRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import { Paper, Box, IconButton } from "@mui/material";
import { FC } from "react";
import { TypographyCustom } from "../custom";
import { ITStatsTable } from "../stats/it";
import { useNavigate } from "react-router";
import { CustomerServiceStatsTable } from "../stats/cs";
import { HumanResourcesStatsTable } from "../stats/hr";
import { IncomeStatsTable } from "../stats/income";
import { SalesStatsTable } from "../stats/sales";
import { DisbursementsStatsTable } from "../stats/disbursements";
import { FinanceStatsTable } from "../stats/finance";
import { ClaimsStatsTable } from "../stats/claims";
import { AnalysisStatsTable } from "../stats/analysis";
import { DepartmentType } from "../../interfaces/department-type";
import { useGetGraphs } from "../../hooks/useGetGraphs";
import { Loading } from "../ui/content/Loading";

interface Props {
    department: DepartmentType;
}
export const TableWidget: FC<Props> = ({ department }) => {
    const { data, setData, errors, loading } = useGetGraphs({ url: `/stats/${department}`, limit: 4 });
    const router = useNavigate();
    return (
        <Paper elevation={0} sx={{ p: 5, border: '1px solid rgba(150,150,150,0.2)', borderRadius: 5 }}>
            <Box sx={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BarChartRounded />
                        <TypographyCustom variant="h5">Historial</TypographyCustom>
                    </Box>
                    <TypographyCustom variant="subtitle2" color='text.secondary'>Ultimos 4 registros estadisticos</TypographyCustom>
                </Box>
                <Box>
                    <IconButton onClick={() => router(`/stats/${department}`)}>
                        <OpenInNewRounded />
                    </IconButton>
                </Box>
            </Box>
            {loading && (<Loading />)}
            {errors && (<TypographyCustom color={'error'}>Ocurrio un error inesperado</TypographyCustom>)}
            {data && (
                <>
                    {department === 'it' && (<ITStatsTable data={data} setData={setData} />)}
                    {department === 'cs' && (<CustomerServiceStatsTable data={data} setData={setData} />)}
                    {department === 'hr' && (<HumanResourcesStatsTable data={data} setData={setData} />)}
                    {department === 'income' && (<IncomeStatsTable data={data} setData={setData} />)}
                    {/* {department === 'operations' && (< data={data} setData={setData} />)} */}
                    {department === 'sales' && (<SalesStatsTable data={data} setData={setData} />)}
                    {/* {department === 'marketing' && (<MarketingStatsTable data={data} setData={setData} />)} */}
                    {department === 'disbursements' && (<DisbursementsStatsTable data={data} setData={setData} />)}
                    {department === 'finance' && (<FinanceStatsTable data={data} setData={setData} />)}
                    {department === 'claims' && (<ClaimsStatsTable data={data} setData={setData} />)}
                    {department === 'analysis' && (<AnalysisStatsTable data={data} setData={setData} />)}
                </>
            )}
        </Paper>
    )
}
