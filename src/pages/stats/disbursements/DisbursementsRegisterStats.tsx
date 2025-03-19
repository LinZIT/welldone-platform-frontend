import { Grid } from "@mui/material"
import { Form, Formik, FormikState, FormikValues } from "formik"
import { baseUrl } from "../../../common"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { Layout } from "../../../components/ui"
import { DescripcionDeVista } from "../../../components/ui/content"
import { OptionsList } from "../../../components/ui/options"
import { DisbursementsData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
const { default: Swal } = await import('sweetalert2');
import { errorArrayLaravelTransformToString } from "../../../helpers/functions"
import { useNavigate } from "react-router-dom"

type InitialValues = Omit<DisbursementsData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: moment().format('DD-MM-YYYY'),
    observations: "",
    number_of_overdue_invoices: 0,
    value_of_paid_invoices: 0,
    payable_accounts: 0,
    paid_providers: 0
}

export const DisbursementsRegisterStats = () => {
    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'));
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Disbursements', icon: <BarChartRounded />, path: '/stats/disbursements' },
    ]
    const { authState } = useContext(AuthContext);

    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `${baseUrl}/stats/disbursements`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'closing_date') body.append(key, String(value).replace('$', '').replace(',', ''));
        }
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${authState.token}`
            },
            body
        }

        try {
            const response = await fetch(url, options);
            switch (response.status) {
                case 200:
                    const { message, data } = await response.json();
                    Swal.fire({
                        title: 'Exito',
                        text: message,
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    resetForm();
                    router('/stats/disbursements');
                    break;
                case 400:
                    const { status, errors } = await response.json();
                    console.log(status)
                    Swal.fire({
                        title: 'Error',
                        html: errorArrayLaravelTransformToString(errors),
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    break;
                case 404:
                    Swal.fire({
                        title: 'Error',
                        text: 'No se encontro la direccion del servidor',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    break;
                default:
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrio un error inesperado',
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    break;
            }
        } catch (error) {
            console.log({ error })
            Swal.fire({
                title: 'Error',
                text: 'No se logro conectar con el servidor',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    }
    return (

        <Layout>
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Disbursements"} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6 }} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                validateOnBlur={false}
                validateOnChange={false}
                validateOn={false}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mb: 5 }}>
                            <Grid item xs={12}>
                                <CalendarCustom
                                    setValue={setDate}
                                    rest={{
                                        name: 'closing_date',
                                        value: '',
                                        label: 'Fecha de cierre (DD/MM/YYYY)',
                                        handleChange
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='N° de facturas vencidas'
                                    value={values.number_of_overdue_invoices}
                                    name="number_of_overdue_invoices"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Valor de facturas pagadas'
                                    value={values.value_of_paid_invoices}
                                    name="value_of_paid_invoices"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    prefix="$"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Cuentas por pagar'
                                    value={values.payable_accounts}
                                    name="payable_accounts"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    prefix="$"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Proveedores pagados'
                                    value={values.paid_providers}
                                    name="paid_providers"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldCustom label="Observaciones" multiline name="observations" value={values.observations} onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonCustom type="submit">Registrar estadisticas</ButtonCustom>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}