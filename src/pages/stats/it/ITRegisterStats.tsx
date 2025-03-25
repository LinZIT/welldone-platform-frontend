import Grid from "@mui/material/Grid2"
import { Form, Formik, FormikValues } from "formik"
import { useState } from "react"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { OptionsList } from "../../../components/ui/options"
import { ITData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment, { Moment } from "moment"
import { useNavigate } from "react-router"
import { IResponse } from "../../../interfaces/response-type"
import { request } from "../../../common/request"
import { toast } from "react-toastify"
import { errorArrayLaravelTransformToString } from "../../../lib/functions"
import { Layout } from "../../../components/ui/Layout"
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista"

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
    const router = useNavigate();
    const onSubmit = async (values: FormikValues) => {
        const url = `/stats/it`;
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


        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                const { message, data } = await response.json();
                toast.success(message)
                router('/stats/it');
                break;
            case 400:
                const { errors } = await response.json();
                console.log(status)
                toast.error(errorArrayLaravelTransformToString(errors))
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
                            <Grid size={{ xs: 12, sm: 6 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
