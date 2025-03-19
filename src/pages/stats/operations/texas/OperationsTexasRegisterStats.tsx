import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { Grid } from "@mui/material";
import { FormikValues, FormikState, Formik, Form } from "formik";
import moment, { Moment } from "moment";
import { useState, useContext } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate, } from "react-router-dom";
const { default: Swal } = await import('sweetalert2');
import { baseUrl } from "../../../../common";
import { TextFieldCustom, ButtonCustom } from "../../../../components/custom";
import { CalendarCustom } from "../../../../components/custom/CalendarCustom";
import { Layout } from "../../../../components/ui";
import { DescripcionDeVista } from "../../../../components/ui/content";
import { OptionsList } from "../../../../components/ui/options";
import { AuthContext } from "../../../../context/auth";
import { errorArrayLaravelTransformToString } from "../../../../helpers/functions";
import { OperationsTexasData } from "../../../../interfaces/operations-data-type";
import { Option } from "../../../../interfaces";

type InitialValues = Omit<OperationsTexasData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: moment().format('DD-MM-YYYY'),
    week: 0,
    roof: 0,
    inspections: 0,
    second_tarp: 0,
    observations: "",
}

export const OperationsTexasRegisterStats = () => {
    const [date, setDate] = useState<Moment>(moment());

    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Operations Texas', icon: <BarChartRounded />, path: '/stats/operations/texas' },
    ]
    const { authState } = useContext(AuthContext);

    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `${baseUrl}/stats/operations/texas`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'closing_date') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
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
                    router('/stats/operations/texas');
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
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Operations Texas"} />
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
                            <Grid item xs={12} sm={3}>
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
                            <Grid item xs={12} sm={3}>
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
                            <Grid item xs={12} sm={3}>
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