import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import Grid from "@mui/material/Grid2";
import { FormikValues, FormikState, Formik, Form } from "formik";
import moment, { Moment } from "moment";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router";
import { TextFieldCustom, ButtonCustom } from "../../../../components/custom";
import { CalendarCustom } from "../../../../components/custom/CalendarCustom";
import { OptionsList } from "../../../../components/ui/options";
import { OperationsCaliforniaData } from "../../../../interfaces/operations-data-type";
import { Option } from "../../../../interfaces";
import { IResponse } from "../../../../interfaces/response-type";
import { request } from "../../../../common/request";
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToString } from "../../../../lib/functions";
import { Layout } from "../../../../components/ui/Layout";
import { DescripcionDeVista } from "../../../../components/ui/content/DescripcionDeVista";

type InitialValues = Omit<OperationsCaliforniaData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: moment().format('DD-MM-YYYY'),
    week: 0,
    roof: 0,
    water: 0,
    mold: 0,
    mold_testing: 0,
    shrink_wrap: 0,
    inspections: 0,
    second_tarp: 0,
    observations: "",
}

export const OperationsCaliforniaRegisterStats = () => {
    const [date, setDate] = useState<Moment>(moment());
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Operations California', icon: <BarChartRounded />, path: '/stats/operations/california' },
    ]

    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `/stats/operations/california`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'closing_date') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                const { message } = await response.json();
                toast.success(message)
                resetForm();
                router('/stats/operations/california');
                break;
            case 400:
                const { errors } = await response.json();
                console.error({ errors })
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
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Operations California"} />
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
                                    label="Week"
                                    name="week"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.week}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label="Roof"
                                    name="roof"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.roof}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label="Water"
                                    name="water"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.water}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label="Mold"
                                    name="mold"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.mold}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label="Mold testing"
                                    name="mold_testing"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.mold_testing}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label="Shrink Wrap"
                                    name="shrink_wrap"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.shrink_wrap}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label="Inspections"
                                    name="inspections"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.inspections}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label="Second Tarp"
                                    name="second_tarp"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    valueIsNumericString={true}
                                    decimalScale={0}
                                    value={values.second_tarp}
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