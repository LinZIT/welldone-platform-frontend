import { Grid } from "@mui/material"
import { Form, Formik, FormikValues } from "formik"
import { baseUrl } from "../../../common"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { Layout } from "../../../components/ui"
import { DescripcionDeVista } from "../../../components/ui/content"
import { OptionsList } from "../../../components/ui/options"
import { ITData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment, { Moment } from "moment"
const { default: Swal } = await import('sweetalert2');
import { errorArrayLaravelTransformToString } from "../../../helpers/functions"
import { useNavigate } from "react-router-dom"

type InitialValues = Omit<ITData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: "",
    optimizations: 0,
    created_automations: 0,
    improved_automations: 0,
    web: 0,
    approved_developments: 0,
    testing: 0,
    corrections: 0,
    created_tickets: 0,
    closed_tickets: 0,
    in_progress_projects: 0,
    observations: ""
}

export const ITRegisterStats = () => {
    const [date, setDate] = useState<Moment>(moment());
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas IT', icon: <BarChartRounded />, path: '/stats/it' },
    ]
    const { authState } = useContext(AuthContext);
    const router = useNavigate();
    const onSubmit = async (values: FormikValues) => {
        const url = `${baseUrl}/stats/it`;
        console.log({ values })
        const body = new URLSearchParams();
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        body.append('optimizations', String(values.optimizations));
        body.append('created_automations', String(values.created_automations));
        body.append('improved_automations', String(values.improved_automations));
        body.append('web', String(values.web));
        body.append('approved_developments', String(values.approved_developments));
        body.append('testing', String(values.testing));
        body.append('corrections', String(values.corrections));
        body.append('created_tickets', String(values.created_tickets));
        body.append('closed_tickets', String(values.closed_tickets));
        body.append('in_progress_projects', String(values.in_progress_projects));
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
                    router('/stats/it');
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
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento IT"} />
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
                            <Grid item xs={12} sm={6}>
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
                                    label='Optimizaciones'
                                    name='optimizations'
                                    value={values.optimizations}
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
                                    label='Automatizaciones creadas'
                                    name='created_automations'
                                    value={values.created_automations}
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
                                    label='Automatizaciones mejoradas'
                                    name='improved_automations'
                                    value={values.improved_automations}
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
                                    label='Web'
                                    name='web'
                                    value={values.web}
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
                                    label='Desarrollos aprobados'
                                    name='approved_developments'
                                    value={values.approved_developments}
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
                                    label='Testing'
                                    name='testing'
                                    value={values.testing}
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
                                    label='Correcciones'
                                    name='corrections'
                                    value={values.corrections}
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
                                    label='Tickets creados'
                                    name='created_tickets'
                                    value={values.created_tickets}
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
                                    label='Tickets cerrados'
                                    name='closed_tickets'
                                    value={values.closed_tickets}
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
                                    label='Proyectos en curso'
                                    name='in_progress_projects'
                                    value={values.in_progress_projects}
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
