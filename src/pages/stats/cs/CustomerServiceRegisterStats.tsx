import { Grid } from "@mui/material"
import { Form, Formik, FormikState, FormikValues } from "formik";
import { baseUrl } from "../../../common"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { Layout } from "../../../components/ui"
import { DescripcionDeVista } from "../../../components/ui/content"
import { OptionsList } from "../../../components/ui/options"
import { CustomerServiceData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
const { default: Swal } = await import('sweetalert2');
import { errorArrayLaravelTransformToString } from "../../../helpers/functions"
import { useNavigate } from "react-router-dom"

type InitialValues = Omit<CustomerServiceData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: moment().format('DD-MM-YYYY'),
    aditional_applications: 0,
    adviser_tickets: 0,
    ll_inconsequential: 0,
    ll_no_solution_problems: 0,
    ll_confirmation: 0,
    ll_problems: 0,
    ll_repairs: 0,
    ll_mold_and_shrinkwrap_schedule: 0,
    ll_triway_call: 0,
    ll_claim_number_call: 0,
    ll_satisfaction_survey: 0,
    ll_marketing_survey: 0,
    ll_welcome_call: 0,
    total_calls: 0,
    emails_sent: 0,
    emails_managed: 0,
    work_orders: 0,
    google_review_applications: 0,
    google_reviews: 0,
    BBB_review_applications: 0,
    BBB_reviews: 0,
    repairs_of_the_day: 0,
    inspections_of_the_day: 0,
    remediations_of_the_day: 0,
    shrinkwrap_of_the_day: 0,
    ll_clean_initiative: 0,
    ci_to_wdm: 0,
    wdm_to_ci: 0,
    observations: ""
}

export const CustomerServiceRegisterStats = () => {
    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'));
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Customer Service', icon: <BarChartRounded />, path: '/stats/customer_service' },
    ]
    const { authState } = useContext(AuthContext);

    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `${baseUrl}/stats/customer_service`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key === 'closing_date') {
            } else {
                body.append(key, String(value));
            }
        }
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        body.append('total_calls', String(Number(values.ll_inconsequential)
            + Number(values.ll_no_solution_problems)
            + Number(values.ll_confirmation)
            + Number(values.ll_problems)
            + Number(values.ll_repairs)
            + Number(values.ll_marketing_survey)
            + Number(values.ll_satisfaction_survey)
            + Number(values.ll_mold_and_shrinkwrap_schedule)
            + Number(values.ll_triway_call)
            + Number(values.ll_claim_number_call)
            + Number(values.ll_welcome_call)))
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
                    router('/stats/customer_service');
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
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Customer Service"} />
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
                                    label='Solicitudes extras'
                                    value={values.aditional_applications}
                                    name="aditional_applications"
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
                                    label='Tickets de asesores'
                                    value={values.adviser_tickets}
                                    name="adviser_tickets"
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
                                    label='Ll. Inconsecuente'
                                    value={values.ll_inconsequential}
                                    name="ll_inconsequential"
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
                                    label='Ll. Problemas sin solución'
                                    value={values.ll_no_solution_problems}
                                    name="ll_no_solution_problems"
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
                                    label='Ll. Confirmación'
                                    value={values.ll_confirmation}
                                    name="ll_confirmation"
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
                                    label='Ll. Problemas'
                                    value={values.ll_problems}
                                    name="ll_problems"
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
                                    label='Ll. Reparaciones'
                                    value={values.ll_repairs}
                                    name="ll_repairs"
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
                                    label='Ll. Agenda de Mold y ShrinkWrap'
                                    value={values.ll_mold_and_shrinkwrap_schedule}
                                    name="ll_mold_and_shrinkwrap_schedule"
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
                                    label='Ll. Triway call'
                                    value={values.ll_triway_call}
                                    name="ll_triway_call"
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
                                    label='Ll. Claim number call'
                                    value={values.ll_claim_number_call}
                                    name="ll_claim_number_call"
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
                                    label='Ll. Encuesta de satisfacción'
                                    value={values.ll_satisfaction_survey}
                                    name="ll_satisfaction_survey"
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
                                    label='Ll. Encuesta de marketing'
                                    value={values.ll_marketing_survey}
                                    name="ll_marketing_survey"
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
                                    label='Ll. Welcome call'
                                    value={values.ll_welcome_call}
                                    name="ll_welcome_call"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    thousandSeparator={false}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextFieldCustom
                                    label='Total de llamadas'
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    name="total_calls"
                                    value={Number(values.ll_inconsequential)
                                        + Number(values.ll_no_solution_problems)
                                        + Number(values.ll_confirmation)
                                        + Number(values.ll_problems)
                                        + Number(values.ll_repairs)
                                        + Number(values.ll_marketing_survey)
                                        + Number(values.ll_satisfaction_survey)
                                        + Number(values.ll_mold_and_shrinkwrap_schedule)
                                        + Number(values.ll_triway_call)
                                        + Number(values.ll_claim_number_call)
                                        + Number(values.ll_welcome_call)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Emails enviados'
                                    value={values.emails_sent}
                                    name="emails_sent"
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
                                    label='Emails gestionados'
                                    value={values.emails_managed}
                                    name="emails_managed"
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
                                    label='Ordenes de trabajo'
                                    value={values.work_orders}
                                    name="work_orders"
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
                                    label='Solicitudes de reviews en Google'
                                    value={values.google_review_applications}
                                    name="google_review_applications"
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
                                    label='Reviews de Google'
                                    value={values.google_reviews}
                                    name="google_reviews"
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
                                    label='Solicitud de reviews en BBB'
                                    value={values.BBB_review_applications}
                                    name="BBB_review_applications"
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
                                    label='Reviews en BBB'
                                    value={values.BBB_reviews}
                                    name="BBB_reviews"
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
                                    label='Reparaciones del dia'
                                    value={values.repairs_of_the_day}
                                    name="repairs_of_the_day"
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
                                    label='Inspecciones del dia'
                                    value={values.inspections_of_the_day}
                                    name="inspections_of_the_day"
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
                                    label='Remediaciones del dia'
                                    value={values.remediations_of_the_day}
                                    name="remediations_of_the_day"
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
                                    label='ShrinkWrap del dia'
                                    value={values.shrinkwrap_of_the_day}
                                    name="shrinkwrap_of_the_day"
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
                                    label='Ll. Clean Initiative'
                                    value={values.ll_clean_initiative}
                                    name="ll_clean_initiative"
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
                                    label='C.I. para WDM'
                                    value={values.ci_to_wdm}
                                    name="ci_to_wdm"
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
                                    label='WDM para C.I.'
                                    value={values.wdm_to_ci}
                                    name="wdm_to_ci"
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