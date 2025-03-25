import Grid from "@mui/material/Grid2"
import { Form, Formik, FormikState, FormikValues } from "formik";
import { useState } from "react"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { OptionsList } from "../../../components/ui/options"
import { FinanceData, Option } from "../../../interfaces";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
import { useNavigate } from "react-router"
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToString } from "../../../lib/functions";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";
import { Layout } from "../../../components/ui/Layout";

type InitialValues = Omit<FinanceData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: moment().format('DD-MM-YYYY'),
    assets: 0,
    gross_income: 0,
    expenses: 0,
    income_vs_expenses_percentage: "",
    balances: 0,
    productivity_percentage: "",
    expenditures_according_to_finantial_plan: 0,
    reserved_payments: 0,
    reservations: 0,
    observations: "",
}

export const FinanceRegisterStats = () => {
    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'));
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Finance', icon: <BarChartRounded />, path: '/stats/finance' },
    ]

    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        if (Number(values.productivity_percentage.replace('%', '')) > 100) return;
        const url = `/stats/finance`;
        const body = new URLSearchParams();
        console.log({ values })
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'closing_date') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('income_vs_expenses_percentage', `${(Number(String(values.gross_income).replace('$', '').replace(',', '')) / Number(String(values.expenses).replace('$', '').replace(',', ''))) - 1}`);
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                const { message, data } = await response.json();
                toast.success(message)
                resetForm();
                router('/stats/human_resources');
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToString(errors));
                break;
            case 404:
                toast.error('No se encontro la direccion del servidor')
                break;
            default:
                toast.error('Ocurrio un error inesperado')
                break;
        }
    }
    return (

        <Layout>
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Finance"} />
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
                            <Grid size={{ xs: 12, sm: 9 }}>
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
                                    label='Activos'
                                    value={values.assets}
                                    name="assets"
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
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Ingreso bruto'
                                    value={values.gross_income}
                                    name="gross_income"
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
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Egresos'
                                    value={values.expenses}
                                    name="expenses"
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
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Ingresos contra egresos %'
                                    value={String((Number(String(values.gross_income).replace('$', '').replace(',', '')) / Number(String(values.expenses).replace('$', '').replace(',', ''))) - 1)}
                                    name="income_vs_expenses_percentage"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    suffix="%"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Balances'
                                    value={values.balances}
                                    name="balances"
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
                                    label='Productividad %'
                                    value={values.productivity_percentage}
                                    name="productivity_percentage"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    suffix="%"
                                    max={100}
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                    helperText={Number(values.productivity_percentage.replace('%', '')) > 100 ? 'El valor maximo debe ser 100%' : ''}
                                    error={Number(values.productivity_percentage.replace('%', '')) > 100 ? true : false}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Egresos segun el plan financiero'
                                    value={values.expenditures_according_to_finantial_plan}
                                    name="expenditures_according_to_finantial_plan"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    valueIsNumericString={true}
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Pagos reservados'
                                    value={values.reserved_payments}
                                    name="reserved_payments"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Reservas'
                                    value={values.reservations}
                                    name="reservations"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    valueIsNumericString={true}
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextFieldCustom label="Observaciones" multiline name="observations" value={values.observations} onChange={handleChange} />
                            </Grid>
                            <Grid size={12}>
                                <ButtonCustom type="submit" disabled={Number(values.productivity_percentage.replace('%', '')) > 100 ? true : false}>Registrar estadisticas</ButtonCustom>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}