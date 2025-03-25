import Grid from "@mui/material/Grid2";
import { TableWidget, Widget } from "../widgets";
import { DepartmentType } from "../../interfaces/department-type";
import { useGetDashboardStats } from "../../hooks/useGetDashboardStats";
const department: DepartmentType = 'income';

type PropertyHashType = { [key: string]: string };

const PropertiesHash: PropertyHashType = {
    'accounts_receivable_by_negotiation': 'Cuentas por Cobrar por Negociacion',
    'income_by_negotiation': 'Ingresos por Negociacion',
    'charges': 'Cobros',
    'number_of_calls': 'N° Llamadas',
    'number_of_effective_calls': 'N° Llamadas Efectivas',
}
const Properties: string[] = [
    'accounts_receivable_by_negotiation',
    'income_by_negotiation',
    'charges',
    'number_of_calls',
    'number_of_effective_calls',
]
export const DashboardIncome = () => {
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