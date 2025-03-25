import Grid from "@mui/material/Grid2"
import { Form, Formik, FormikState, FormikValues } from "formik";
import { useContext, useState } from "react"
import { ButtonCustom, TypographyCustom } from "../../../components/custom"
import { OptionsList } from "../../../components/ui/options"
import { SalesData, Option, IAdviser, ITeam } from "../../../interfaces"
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import PieChartRounded from "@mui/icons-material/PieChartRounded";
import { CalendarCustom } from "../../../components/custom/CalendarCustom"
import moment from "moment"
import { useNavigate } from "react-router"
import { SalesStatsTable } from "../../../components/stats/sales"
import { useGetGraphs } from "../../../hooks/useGetGraphs";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToString } from "../../../lib/functions";
import { Loading } from "../../../components/ui/content/Loading";
import { Layout } from "../../../components/ui/Layout";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";
import { ModalSelector } from "../../../components/ui/content/ModalSelector";
import AccordionRoofAndWater from "../../../components/ui/content/Accordion";

type InitialValues = Omit<SalesData, 'id' | 'created_at' | 'updated_at' | 'team' | 'adviser' | 'team_id' | 'adviser_id'>

const initialValues: InitialValues = {
    closing_date: moment().format('DD-MM-YYYY'),
    date: "",
    week: "",
    roof: 0,
    water: 0,
    claims: 0,
    observations: "",
}

export const SalesRegisterStats = () => {
    const [date, setDate] = useState<string>(moment().format('DD-MM-YYYY'));
    const [week_from, setWeekFrom] = useState<string>(moment().format('DD-MM'));
    const [week_to, setWeekTo] = useState<string>(moment().format('DD-MM'));
    const [adviserSelected, setAdviserSelected] = useState<IAdviser | null>(null);
    const [teamSelected, setTeamSelected] = useState<ITeam | null>(null);
    const { data, setData, errors, loading, getData } = useGetGraphs({ url: '/stats/sales' });
    const options: Option[] = [
        { text: 'Menu estadisticas', icon: <PieChartRounded />, path: '/stats' },
        { text: 'Estadisticas Sales', icon: <BarChartRounded />, path: '/stats/sales' },
    ]

    const onSubmit = async (values: FormikValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {
        const url = `/stats/sales`;
        const body = new URLSearchParams();
        console.log({ values })
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'closing_date' && key !== 'week_from' && key !== 'week_to' && key !== 'claims') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('closing_date', moment(date).format('YYYY-MM-DD'));
        body.append('week', `Sem ${moment(week_from).format('DD-MM')} al ${moment(week_to).format('DD-MM-YYYY')}`);
        body.append('claims', String((Number(values.roof) + Number(values.water)).toFixed(2)));
        body.append('team', String(teamSelected?.id));
        body.append('adviser', String(adviserSelected?.id));

        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (response.status) {
            case 200:
                const { message } = await response.json();
                toast.success(message);
                resetForm();
                setAdviserSelected(null)
                getData();
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
    // Loader
    if (loading) return (<Loading />);
    return (

        <Layout>
            <DescripcionDeVista title={"Agregar estadisticas"} description={"Crear nuevo registro de estadisticas del departamento Sales"} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6 }} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
                validateOnBlur={false}
                validateOnChange={false}
                validateOn={false}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit} id='form'>
                        <Grid container spacing={2} sx={{ mb: 5, p: 1 }}>
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
                                <ModalSelector title={"Seleccionar asesor"} text={"Buscar asesor"} data={adviserSelected} setData={setAdviserSelected} url={`/adviser`} dataProperty={"names"} dataPropertySecondary={"document"} dataPropertyAux={"surnames"} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                                <ModalSelector team title={"Seleccionar equipo"} text={"Buscar equipo"} data={teamSelected} setData={setTeamSelected} url={`/team`} dataProperty={"description"} dataPropertySecondary={"names"} dataPropertyAux={"surnames"} />
                            </Grid>
                            <Grid size={12} sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
                                <TypographyCustom sx={{ mr: 1 }}>Sem</TypographyCustom>
                                <CalendarCustom
                                    setValue={setWeekFrom}
                                    week
                                    rest={{
                                        name: 'week_from',
                                        value: '',
                                        label: 'Desde (DD/MM)',
                                        handleChange
                                    }}
                                />
                                <TypographyCustom sx={{ marginInline: 1 }}>al</TypographyCustom>
                                <CalendarCustom
                                    setValue={setWeekTo}
                                    rest={{
                                        name: 'week_to',
                                        value: '',
                                        label: 'Al (DD/MM/YYYY)',
                                        handleChange
                                    }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <AccordionRoofAndWater />
                            </Grid>
                            {/* <Grid item xs={12} sm={4}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Roof'
                                    value={values.roof}
                                    name="roof"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    valueIsNumericString={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Water'
                                    value={values.water}
                                    name="water"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    valueIsNumericString={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <NumericFormat
                                    customInput={TextFieldCustom}
                                    label='Claims'
                                    value={Number(values.water) + Number(values.roof)}
                                    name="claims"
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    valueIsNumericString={true}
                                    thousandSeparator={true}
                                    onChange={handleChange}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid> */}
                            {/* <Grid item xs={12}>
                                <TextFieldCustom label="Observaciones" multiline name="observations" value={values.observations} onChange={handleChange} />
                            </Grid> */}
                            <Grid size={12}>
                                <ButtonCustom type="submit" form="form">Registrar estadisticas</ButtonCustom>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>

            {data && (
                <SalesStatsTable data={data} setData={setData} />
            )}
        </Layout>
    )
}