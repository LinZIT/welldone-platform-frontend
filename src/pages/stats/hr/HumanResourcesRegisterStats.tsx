import { Grid } from "@mui/material"
import { Form, Formik, FormikState, FormikValues } from "formik";
import { baseUrl } from "../../../common"
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/auth"
import { ButtonCustom, TextFieldCustom } from "../../../components/custom"
import { Layout } from "../../../components/ui"
import { DescripcionDeVista } from "../../../components/ui/content"
import { OptionsList } from "../../../components/ui/options"
import { HumanResourcesData, Option } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { NumericFormat } from "react-number-format"
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
const { default: Swal } = await import('sweetalert2');
import { errorArrayLaravelTransformToString } from "../../../helpers/functions"
import { useNavigate } from "react-router-dom"

type InitialValues = Omit<HumanResourcesData, 'id' | 'created_at' | 'updated_at'>

const initialValues: InitialValues = {
    closing_date: "",
    managment_request: 0,
    employee_requests: 0,
    disciplinary_actions: 0,
    meetings: 0,
    file_updates: 0,
    new_hires: 0,
    offers: 0,
    interviews_scheduled: 0,
    completed_interviews: 0,
    declined: 0,
    terminations: 0,
    active_team_members_florida: 0,
    active_team_members_texas: 0,
    active_team_members_valencia: 0,
    active_team_members_maracay: 0,
    observations: "",
}

type NumericFieldHashType = { [key: string]: string };

export const numericFieldsHR: string[] = [
    'managment_request',
    'employee_requests',
    'disciplinary_actions',
    'meetings',
    'file_updates',
    'new_hires',
    'offers',
    'interviews_scheduled',
    'completed_interviews',
    'declined',
    'terminations',
    'active_team_members_florida',
    'active_team_members_texas',
    'active_team_members_valencia',
    'active_team_members_maracay',
]
export const hashNumericFieldsHR: NumericFieldHashType = {
    'managment_request': 'Management Request',
    'employee_requests': 'Employee Requests',
    'disciplinary_actions': 'Disciplinary Actions',
    'meetings': 'Meetings',
    'file_updates': 'File Updates',
    'new_hires': 'New Hires',
    'offers': 'Offers',
    'interviews_scheduled': 'In1terviews Scheduled',
    'completed_interviews': 'Completed Interviews',
    'declined': 'Declined',
    'terminations': 'Terminations',
    'active_team_members_florida': 'Active team members Florida',
    'active_team_members_texas': 'Active team members Texas',
    'active_team_members_valencia': 'Active team members Valencia (VE)',
    'active_team_members_maracay': 'Active team members Maracay (VE)',
}
export const HumanResourcesRegisterStats = () => {
    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'));
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Human Resources', icon: <BarChartRounded />, path: '/stats/human_resources' },
    ]
    const { authState } = useContext(AuthContext);

    const router = useNavigate();

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `${baseUrl}/stats/human_resources`;
        const body = new URLSearchParams();
        console.log({ values })
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
                    router('/stats/human_resources');
                    break;
                case 400:
                    const { status, errors } = await response.json();
                    console.log({ errors })
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
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Human Resources"} />
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
                            <Grid item xs={12} sm={12}>
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
                            {numericFieldsHR.map((field: string, i: number) => (
                                <Grid item xs={12} sm={3} key={i}>
                                    <NumericFormat
                                        label={hashNumericFieldsHR[field]}
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