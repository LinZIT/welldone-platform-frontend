import Grid from "@mui/material/Grid2";
import { TableWidget, Widget } from "../widgets";
import { DepartmentType } from "../../interfaces/department-type";
import { useGetDashboardStats } from "../../hooks/useGetDashboardStats";
const department: DepartmentType = 'sales';

type PropertyHashType = { [key: string]: string };

const PropertiesHash: PropertyHashType = {
    'roof': 'Roof',
    'water': 'Water',
    'claims': 'Claims',
}
const Properties: string[] = [
    'roof',
    'water',
    'claims',
]
export const DashboardSales = () => {
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