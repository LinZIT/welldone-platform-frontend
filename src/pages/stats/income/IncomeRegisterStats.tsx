import { Grid } from "@mui/material"
import { Form, Formik, FormikState, FormikValues } from "formik";
import { baseUrl } from "../../../common"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { Layout } from "../../../components/ui"
import { DescripcionDeVista } from "../../../components/ui/content"
import { OptionsList } from "../../../components/ui/options"
import { IncomeData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
const { default: Swal } = await import('sweetalert2');
import { errorArrayLaravelTransformToString } from "../../../helpers/functions"
import { useNavigate } from "react-router-dom"

type InitialValues = Omit<IncomeData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: moment().format('DD-MM-YYYY'),
    number_of_invoices_by_negotiation: 0,
    value_of_invoices_by_negotiation: 0,
    accounts_receivable_by_negotiation: 0,
    income_by_negotiation: 0,
    charges: 0,
    number_of_calls: 0,
    number_of_effective_calls: 0,
    income_by_portfolio: 0,
    accounts_receivable_by_portfolio: 0,
    global_income: 0,
    observations: "",
}

export const IncomeRegisterStats = () => {
    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'));
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Income', icon: <BarChartRounded />, path: '/stats/income' },
    ]
    const { authState } = useContext(AuthContext);

    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `${baseUrl}/stats/income`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'closing_date' && key !== 'global_income') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        body.append('global_income', String((Number(String(values.income_by_portfolio).replace('$', '').replace(',', '')) + Number(String(values.income_by_negotiation).replace('$', '').replace(',', ''))).toFixed(2)));
        console.log(body.toString());
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
                    const { message } = await response.json();
                    Swal.fire({
                        title: 'Exito',
                        text: message,
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    resetForm();
                    router('/stats/Income');
                    break;
                case 400:
                    const { status, errors } = await response.json();
                    console.error({ status, errors })
                    Swal.fire({
                        title: 'Error',
                        html: errorArrayLaravelTransformToString(errors),
                        icon: 'error',
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
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Income"} />
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
                            <Grid item xs={12} sm={6}>
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
                                    label='N° de facturas por negociacion'
                                    value={values.number_of_invoices_by_negotiation}
                                    name="number_of_invoices_by_negotiation"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Valor de facturas por negociacion'
                                    value={values.value_of_invoices_by_negotiation}
                                    name="value_of_invoices_by_negotiation"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix="$"
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Cuentas por cobrar por negociacion'
                                    value={values.accounts_receivable_by_negotiation}
                                    name="accounts_receivable_by_negotiation"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix="$"
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Ingresos por negociacion'
                                    value={values.income_by_negotiation}
                                    name="income_by_negotiation"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix="$"
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Cobros'
                                    value={values.charges}
                                    name="charges"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='N° de llamadas'
                                    value={values.number_of_calls}
                                    name="number_of_calls"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='N° de llamadas efectivas'
                                    value={values.number_of_effective_calls}
                                    name="number_of_effective_calls"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Ingresos por portafolio'
                                    value={values.income_by_portfolio}
                                    name="income_by_portfolio"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix="$"
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Cuentas por cobrar por portafolio'
                                    value={values.accounts_receivable_by_portfolio}
                                    name="accounts_receivable_by_portfolio"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix="$"
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Ingreso global'
                                    value={String(Number(String(values.income_by_portfolio).replace('$', '').replace(',', '')) + Number(String(values.income_by_negotiation).replace('$', '').replace(',', '')))}
                                    name="global_income"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    prefix="$"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    thousandSeparator={true}
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
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