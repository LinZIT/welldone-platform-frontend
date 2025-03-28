import { MenuItem } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { Form, Formik, FormikState, FormikValues } from "formik"
import { useState } from "react"
import { ButtonCustom, SelectCustom, TextFieldCustom } from "../../../components/custom"
import { OptionsList } from "../../../components/ui/options"
import { AnalysisData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment, { Moment } from "moment"
import { IResponse } from "../../../interfaces/response-type"
import { request } from "../../../common/request"
import { toast } from "react-toastify"
import { Layout } from "../../../components/ui/Layout"
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista"
import { errorArrayLaravelTransformToString } from "../../../lib/functions"

type InitialValues = Omit<AnalysisData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: "",
    received_claims: 0,
    checked_claims: 0,
    approved_claims: 0,
    rechecked_claims: 0,
    cancelled_claims: 0,
    on_hold_claims: 0,
    unchecked_claims: 0,
    approved_claims_weeks_before: 0,
    clean_initiative: 0,
    integrity_claims: 0,
    received_leads: 0,
    checked_leads: 0,
    unchecked_leads: 0,
    approved_leads: 0,
    rechecked_leads: 0,
    on_hold_leads: 0,
    cancelled_leads: 0,
    wdm_zone: '0',
    observations: ""
}
type NumericFieldHashType = { [key: string]: string };

export const numericFieldsAnalysis: string[] = [
    'received_claims',
    'checked_claims',
    'approved_claims',
    'rechecked_claims',
    'cancelled_claims',
    'on_hold_claims',
    'unchecked_claims',
    'approved_claims_weeks_before',
    'clean_initiative',
    'integrity_claims',
    'received_leads',
    'checked_leads',
    'unchecked_leads',
    'approved_leads',
    'rechecked_leads',
    'on_hold_leads',
    'cancelled_leads',
]
export const hashNumericFieldsAnalysis: NumericFieldHashType = {
    'received_claims': 'Claims recibidos',
    'checked_claims': 'Claims revisados',
    'approved_claims': 'Claims aprobados',
    'rechecked_claims': 'Claims enviados a revisión nuevamente',
    'cancelled_claims': 'Claims cancelados',
    'on_hold_claims': 'Claims en hold',
    'unchecked_claims': 'Claims no revisados',
    'approved_claims_weeks_before': 'Claims aprobados semanas anteriores',
    'clean_initiative': 'Clean Initiative',
    'integrity_claims': 'Integrity Claims',
    'received_leads': 'Leads recibidos',
    'checked_leads': 'Leads revisados',
    'unchecked_leads': 'Leads no revisados',
    'approved_leads': 'Leads aprobados',
    'rechecked_leads': 'Leads enviados a revision nuevamente',
    'on_hold_leads': 'Leads en hold',
    'cancelled_leads': 'Leads cancelados',
}
export const AnalysisRegisterStats = () => {
    const [date, setDate] = useState<Moment>(moment());
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Analysis', icon: <BarChartRounded />, path: '/stats/analysis' },
    ]
    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `/stats/analysis`;
        const body = new URLSearchParams();
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        numericFieldsAnalysis.map((field) => {
            body.append(field, String(values[field as keyof InitialValues]));
        });
        body.append('wdm_zone', String(values.wdm_zone));
        body.append('observations', String(values.observations));
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                const { message, data } = await response.json();
                toast.success(message)
                console.log({ data });
                resetForm();
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToString(errors))
                break;
            case 404:
                toast.error('No se encontro la direccion del servidor')
                break;
            default:
                toast.error('Ocurrio un error inesperado');
                break;
        }
    }
    return (

        <Layout>
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Analysis"} />
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
                            {numericFieldsAnalysis.map((field: string, i: number) => (
                                <Grid size={{ xs: 12, sm: 3 }} key={i}>
                                    <NumericFormat
                                        label={hashNumericFieldsAnalysis[field]}
                                        name={field}
                                        value={values[field as keyof InitialValues]}
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
                            ))}
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <SelectCustom
                                    size="small"
                                    name='wdm_zone'
                                    value={values.wdm_zone}
                                    onChange={handleChange}
                                    defaultValue={'0'}
                                    label="Zona WDM"
                                    helpertext={""}
                                >
                                    <MenuItem value='0' disabled>Seleccionar Zona</MenuItem>
                                    <MenuItem value='Florida'>Florida</MenuItem>
                                    <MenuItem value='Texas'>Texas</MenuItem>
                                    <MenuItem value='California'>California</MenuItem>
                                </SelectCustom>
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
