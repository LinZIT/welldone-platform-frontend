import Grid from "@mui/material/Grid2";
import { TableWidget, Widget } from "../widgets";
import { useGetDashboardStats } from "../../hooks/useGetDashboardStats";
import { DepartmentType } from "../../interfaces/department-type";

const department: DepartmentType = 'it';

type PropertyHashType = { [key: string]: string };

const PropertiesHash: PropertyHashType = {
    'optimizations': 'Optimizaciones aplicadas',
    'approved_developments': 'Desarrollos aprobados',
    'closed_tickets': 'Tickets cerrados',
}
const Properties: string[] = [
    'optimizations',
    'approved_developments',
    'closed_tickets',
]
export const DashboardIT = () => {
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
                    icon={<></>}
                />
            </Grid>
        ))}
        <Grid size={12}>
            <TableWidget department={department} />
        </Grid>
    </>

}