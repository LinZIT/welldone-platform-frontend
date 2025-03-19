import { Grid } from "@mui/material"
import { Form, Formik, FormikValues } from "formik"
import { baseUrl } from "../../../common"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { Layout } from "../../../components/ui"
import { DescripcionDeVista } from "../../../components/ui/content"
import { OptionsList } from "../../../components/ui/options"
import { ClaimsData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
const { default: Swal } = await import('sweetalert2');
import { errorArrayLaravelTransformToString } from "../../../helpers/functions"
import { useNavigate } from "react-router-dom"

type InitialValues = Omit<ClaimsData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: "",
    proceedings: 0,
    declined: 0,
    proceeding_value: 0,
    fixed_amount: 0,
    funding: 0,
    buy_back: 0,
    portfolio_number: 0,
    observations: ""
}

export const ClaimsRegisterStats = () => {
    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'));
    const router = useNavigate();
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Claims', icon: <BarChartRounded />, path: '/stats/claims' },
    ]
    const { authState } = useContext(AuthContext);
    const onSubmit = async (values: FormikValues) => {
        const url = `${baseUrl}/stats/claims`;
        const body = new URLSearchParams();
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        body.append('proceedings', String(values.proceedings));
        body.append('declined', String(values.declined));
        body.append('proceeding_value', String(values.proceeding_value).replace('$', '').replace(',', ''));
        body.append('fixed_amount', String(values.fixed_amount).replace('$', '').replace(',', ''));
        body.append('funding', String(values.funding).replace('$', '').replace(',', ''));
        body.append('buy_back', String(values.buy_back).replace('$', '').replace(',', ''));
        body.append('portfolio_number', String(values.portfolio_number));
        body.append('observations', String(values.observations));

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
                    router('/stats/claims');
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
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Claims"} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6 }} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => onSubmit(values)}
                validateOnBlur={false}
                validateOnChange={false}
                validateOn={false}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <CalendarCustom
                                    setValue={setDate}
                                    rest={{
                                        name: 'closing_date',
                                        value: values.closing_date,
                                        label: 'Fecha de cierre',
                                        handleChange
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    label='Expedientes'
                                    name='proceedings'
                                    value={values.proceedings}
                                    customInput={TextFieldCustom}
                                    onChange={handleChange}
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    valueIsNumericString={false}
                                    thousandSeparator={false}
                                    decimalScale={0}
                                    fixedDecimalScale={false}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    label='Rechazados'
                                    name='declined'
                                    value={values.declined}
                                    customInput={TextFieldCustom}
                                    onChange={handleChange}
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    valueIsNumericString={false}
                                    thousandSeparator={false}
                                    decimalScale={0}
                                    fixedDecimalScale={false}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    label='Valor del expediente'
                                    name='proceeding_value'
                                    value={values.proceeding_value}
                                    customInput={TextFieldCustom}
                                    onChange={handleChange}
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    valueIsNumericString={false}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    label='Monto ajustado'
                                    name='fixed_amount'
                                    value={values.fixed_amount}
                                    customInput={TextFieldCustom}
                                    onChange={handleChange}
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    valueIsNumericString={false}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    label='Funding'
                                    name='funding'
                                    value={values.funding}
                                    customInput={TextFieldCustom}
                                    onChange={handleChange}
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    valueIsNumericString={false}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    label='Buy back'
                                    name='buy_back'
                                    value={values.buy_back}
                                    customInput={TextFieldCustom}
                                    onChange={handleChange}
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    valueIsNumericString={false}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    label='Numero de portafolio'
                                    name='portfolio_number'
                                    value={values.portfolio_number}
                                    customInput={TextFieldCustom}
                                    onChange={handleChange}
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    valueIsNumericString={false}
                                    thousandSeparator={false}
                                    decimalScale={0}
                                    fixedDecimalScale={false}
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
