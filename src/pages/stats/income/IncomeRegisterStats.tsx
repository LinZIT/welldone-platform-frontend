import Grid from "@mui/material/Grid2"
import { Form, Formik, FormikState, FormikValues } from "formik";
import { useState } from "react"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { OptionsList } from "../../../components/ui/options"
import { IncomeData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
import { useNavigate } from "react-router"
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToString } from "../../../lib/functions";
import { Layout } from "../../../components/ui/Layout";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";

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
    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `/stats/income`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'closing_date' && key !== 'global_income') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        body.append('global_income', String((Number(String(values.income_by_portfolio).replace('$', '').replace(',', '')) + Number(String(values.income_by_negotiation).replace('$', '').replace(',', ''))).toFixed(2)));
        console.log(body.toString());
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                const { message } = await response.json();
                toast.success(message);
                resetForm();
                router('/stats/Income');
                break;
            case 400:
                const { errors } = await response.json();
                console.error({ errors })
                toast.error(errorArrayLaravelTransformToString(errors))
                break;
            case 404:
                toast.error('No se encontro la direccion del servidor');
                break;
            default:
                toast.error('Ocurrio un error inesperado');
                break;
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
                            <Grid size={{ xs: 12, sm: 6 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={12}>
                                <TextFieldCustom label="Observaciones" multiline name="observations" value={values.observations} onChange={handleChange} />
                            </Grid>
                            <Grid size={12}>
                                <ButtonCustom type="submit">Registrar estadisticas</ButtonCustom>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}