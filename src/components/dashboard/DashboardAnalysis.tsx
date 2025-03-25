import ConstructionRounded from "@mui/icons-material/ConstructionRounded";
import Grid from "@mui/material/Grid2";
import { DepartmentType } from "../../interfaces/department-type";
import { useGetDashboardStats } from "../../hooks/useGetDashboardStats";
import { TableWidget, Widget } from "../widgets";

const department: DepartmentType = 'analysis';

type PropertyHashType = { [key: string]: string };

const PropertiesHash: PropertyHashType = {
    'total_received_claims': 'Total de Claims Recibidos',
    'total_checked_claims': 'Total de Claims Revisados',
    'total_approved_claims': 'Total de Claims Aprobados',
    'total_cancelled_claims': 'Total de Claims Cancelados',
    'total_on_hold_claims': 'Total de Claims en Hold',
}
const Properties: string[] = [
    'total_received_claims',
    'total_checked_claims',
    'total_approved_claims',
    'total_cancelled_claims',
    'total_on_hold_claims',
]
export const DashboardAnalysis = () => {
    const { loading, thisMonth } = useGetDashboardStats(department);

    return <>
        {Properties.map((property, i) => (
            <Grid key={i} size={{ xs: 12, sm: 4 }}>
                <Widget
                    loading={loading}
                    title={PropertiesHash[property]}
                    mode={thisMonth?.this_month[property].mode ?? 0}
                    percentage={thisMonth?.this_month[property].percentage ?? 0}
                    thisMonth={thisMonth?.this_month[property].value ?? '0'}
                    pastMonth={thisMonth?.last_month[property] ?? '0'}
                    icon={<ConstructionRounded sx={{ color: (theme) => theme.palette.text.secondary }} />}
                />
            </Grid>
        ))}
        <Grid size={12}>
            <TableWidget department={department} />
        </Grid>
    </>

}