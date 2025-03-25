import Grid from "@mui/material/Grid2";
import { TableWidget, Widget } from "../widgets";
import { DepartmentType } from "../../interfaces/department-type";
import { useGetDashboardStats } from "../../hooks/useGetDashboardStats";
const department: DepartmentType = 'disbursements';

type PropertyHashType = { [key: string]: string };

const PropertiesHash: PropertyHashType = {
    'number_of_overdue_invoices': 'N° de Facturas Vencidas',
    'value_of_paid_invoices': 'Valor de Facturas Pagadas',
    'payable_accounts': 'Cuentas por Pagar',
    'paid_providers': 'Proveedores Pagados',
}
const Properties: string[] = [
    'number_of_overdue_invoices',
    'value_of_paid_invoices',
    'payable_accounts',
    'paid_providers',
]
export const DashboardDisbursements = () => {
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