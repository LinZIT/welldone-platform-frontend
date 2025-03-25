import { MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Formik, FormikState, Form } from 'formik'
import { useState } from 'react'
import { TextFieldCustom, SelectCustom, ButtonCustom } from '../../../components/custom'
import { CalendarCustom } from '../../../components/custom/CalendarCustom'
import moment, { Moment } from 'moment'
import { IAdjustingCompany, IInsuranceCompany, IAdviser, ITeam, IClient } from '../../../interfaces'
import { toast } from 'react-toastify'
import { errorArrayLaravelTransformToString } from '../../../lib/functions'
import { IResponse } from '../../../interfaces/response-type'
import { request } from '../../../common/request'
import { Layout } from '../../../components/ui/Layout'
import { DescripcionDeVista } from '../../../components/ui/content/DescripcionDeVista'
import { ModalSelector } from '../../../components/ui/content/ModalSelector'
import { ModalMultipleSelector } from '../../../components/ui/content/ModalMultipleSelector'
type InitialValues = {
    claim_number: string;
    claim_date: string;
    cause: string;
    location_of_damage: string;
    adjusting_company: string;
    insurance_company: string;
    policy_number: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
}
const initialValues: InitialValues = {
    claim_number: '',
    claim_date: '',
    cause: '',
    // adviser: '',
    location_of_damage: '',
    adjusting_company: '',
    insurance_company: '',
    policy_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
}
export const SalesRegisterClaim = () => {
    const [adjustingCompany, setAdjustingCompany] = useState<IAdjustingCompany | null>(null)
    const [insuranceCompany, setInsuranceCompany] = useState<IInsuranceCompany | null>(null)
    const [client, setClient] = useState<IClient | null>(null);
    const [advisers, setAdvisers] = useState<IAdviser[]>([])
    const [teamSelected, setTeamSelected] = useState<ITeam | null>(null)
    const [claimDate, setClaimDate] = useState<Moment>(moment());
    const onSubmit = async (values: InitialValues, resetForm: (nextState?: Partial<FormikState<InitialValues>> | undefined) => void) => {

        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            body.append(key, String(value));
        }
        body.append('client_id', String(client?.id));
        body.append('team_id', String(teamSelected?.id));
        body.append('claim_date', String(claimDate.format('YYYY-MM-DD')));
        body.append('adjusting_company', String(adjustingCompany ? adjustingCompany.id : ''));
        body.append('insurance_company', String(insuranceCompany ? insuranceCompany.id : ''));
        advisers.map((ad: any, i: number) => {
            body.append(`advisers[${i}]`, String(ad.id));
        })
        const url = `/claims`;
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                toast.success('Se ha registrado el claim')
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToString(errors))
                break;
            default:
                toast.error('Ocurrio un error inesperado')
                break;
        }
    }

    return (
        <Layout>
            <DescripcionDeVista title={"Agregar Claim"} description={`Aqui podras agregar un nuevo claim, recuerda seleccionar un cliente, este paso es importante para la creacion del claim.`} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <CalendarCustom setValue={setClaimDate} rest={{
                                    name: 'claim_date',
                                    value: '',
                                    label: 'Fecha de Claim (DD/MM/YYYY)',
                                    handleChange
                                }} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} >
                                <TextFieldCustom onChange={handleChange} name="claim_number" value={values.claim_number} label="Numero de claim" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextFieldCustom onChange={handleChange} name="policy_number" value={values.policy_number} label="Poliza" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ModalSelector team title={"Equipo"} text={"Seleccionar"} data={teamSelected} setData={setTeamSelected} url={`/team`} dataProperty={"description"} dataPropertySecondary={"names"} dataPropertyAux={"surnames"} />

                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ModalSelector title={"Cliente"} text={"Seleccionar"} data={client} setData={setClient} url={`/client`} dataProperty={"names"} dataPropertySecondary='surnames' />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ModalMultipleSelector limit={2} title={"Asesor(es)"} text={"Seleccionar"} data={advisers} setData={setAdvisers} url={`/adviser`} dataProperty={"names"} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ModalSelector title={"Compañia ajustadora"} text={"Seleccionar"} data={adjustingCompany} setData={setAdjustingCompany} url={`/adjusting_companies`} dataProperty={"description"} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ModalSelector title={"Compañia de seguros"} text={"Seleccionar "} data={insuranceCompany} setData={setInsuranceCompany} url={`/insurance_companies`} dataProperty={"description"} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                {/* <TextFieldCustom onChange={handleChange} name="cause" value={values.cause} label="Causa" /> */}
                                <SelectCustom
                                    value={values.cause}
                                    onChange={handleChange}
                                    label="Causa"
                                    name="cause"
                                    helpertext={""}
                                >
                                    <MenuItem value='' disabled>Seleccione la causa</MenuItem>
                                    <MenuItem value='A/C Leak'>A/C Leak</MenuItem>
                                    <MenuItem value='Heater Water Damage'>Heater Water Damage</MenuItem>
                                    <MenuItem value='Hurricane Eta'>Hurricane Eta</MenuItem>
                                    <MenuItem value='Hurricane Ian'>Hurricane Ian</MenuItem>
                                    <MenuItem value='Hurricane Nicole'>Hurricane Nicole</MenuItem>
                                    <MenuItem value='Hurricane Idalia'>Hurricane Idalia</MenuItem>
                                    <MenuItem value='Roof Leak'>Roof Leak</MenuItem>
                                    <MenuItem value='Water Damage'>Water Damage</MenuItem>
                                    <MenuItem value='Weather Related'>Weather Related</MenuItem>
                                    <MenuItem value='Weather Related - Window'>Weather Related - Window</MenuItem>
                                </SelectCustom>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <SelectCustom
                                    value={values.location_of_damage}
                                    onChange={handleChange}
                                    label="Ubicacion del daño"
                                    name="location_of_damage"
                                    helpertext={""}
                                >
                                    <MenuItem value='' disabled>Seleccione la ubicacion del daño</MenuItem>
                                    <MenuItem value='Kitchen'>Kitchen</MenuItem>
                                    <MenuItem value='Living room'>Living room</MenuItem>
                                    <MenuItem value='Master bathroom'>Master bathroom</MenuItem>
                                    <MenuItem value='Guest bathroom'>Guest bathroom</MenuItem>
                                    <MenuItem value='Master bedroom'>Master bedroom</MenuItem>
                                    <MenuItem value='Bedroom'>Bedroom</MenuItem>
                                    <MenuItem value='Laundry room'>Laundry room</MenuItem>
                                    <MenuItem value='A/C Closet'>A/C Closet</MenuItem>
                                    <MenuItem value='Roof'>Roof</MenuItem>
                                    <MenuItem value='Hallway'>Hallway</MenuItem>
                                    <MenuItem value='Dining room'>Dining room</MenuItem>
                                    <MenuItem value='Second bathroom'>Second bathroom</MenuItem>
                                    <MenuItem value='Garage'>Garage</MenuItem>
                                    <MenuItem value='Guest bedroom'>Guest bedroom</MenuItem>
                                    <MenuItem value='Closet'>Closet</MenuItem>
                                </SelectCustom>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <SelectCustom
                                    value={values.state}
                                    onChange={handleChange}
                                    label="Estado"
                                    name="state"
                                    helpertext={""}
                                >
                                    <MenuItem value=''>Seleccione un estado</MenuItem>
                                    <MenuItem value='CA'>CA</MenuItem>
                                    <MenuItem value='FL'>FL</MenuItem>
                                    <MenuItem value='TX'>TX</MenuItem>
                                </SelectCustom>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                {
                                    values.state !== 'CA' && values.state !== 'FL' && values.state !== 'TX' && (
                                        <SelectCustom
                                            label="Ciudad"
                                            disabled
                                            defaultValue={''}
                                            helpertext={""}
                                        >
                                            <MenuItem value='' disabled>Seleccione una ciudad</MenuItem>
                                        </SelectCustom>
                                    )
                                }
                                {
                                    values.state === 'CA' && (
                                        <SelectCustom
                                            value={values.city}
                                            onChange={handleChange}
                                            label="Ciudad"
                                            name="city"
                                            helpertext={""}
                                        >
                                            <MenuItem value='' disabled>Seleccione una ciudad</MenuItem>
                                            <MenuItem value='Covina'>Covina</MenuItem>
                                            <MenuItem value='La Puente'>La Puente</MenuItem>
                                            <MenuItem value='Orange'>Orange</MenuItem>
                                            <MenuItem value='Santa Ana'>Santa Ana</MenuItem>
                                            <MenuItem value='West Covina'>West Covina</MenuItem>
                                        </SelectCustom>
                                    )
                                }
                                {
                                    values.state === 'FL' && (
                                        <SelectCustom
                                            value={values.city}
                                            onChange={handleChange}
                                            label="Ciudad"
                                            name="city"
                                            helpertext={""}
                                        >
                                            <MenuItem value='' disabled>Seleccione una ciudad</MenuItem>
                                            <MenuItem value="Apopka">Apopka</MenuItem>
                                            <MenuItem value="Arcadia">Arcadia</MenuItem>
                                            <MenuItem value="Bonita Springs">Bonita Springs</MenuItem>
                                            <MenuItem value="Bowling Green">Bowling Green</MenuItem>
                                            <MenuItem value="Cape Coral">Cape Coral</MenuItem>
                                            <MenuItem value="Casselberry">Casselberry</MenuItem>
                                            <MenuItem value="Clemont">Clemont</MenuItem>
                                            <MenuItem value="Clermont">Clermont</MenuItem>
                                            <MenuItem value="Clewiston">Clewiston</MenuItem>
                                            <MenuItem value="Coconut Creek">Coconut Creek</MenuItem>
                                            <MenuItem value="Cooper City">Cooper City</MenuItem>
                                            <MenuItem value="Coral Gables">Coral Gables</MenuItem>
                                            <MenuItem value="Cutler Bay">Cutler Bay</MenuItem>
                                            <MenuItem value="Davenport">Davenport</MenuItem>
                                            <MenuItem value="DeBary">DeBary</MenuItem>
                                            <MenuItem value="Deltona">Deltona</MenuItem>
                                            <MenuItem value="Englewood">Englewood</MenuItem>
                                            <MenuItem value="Esteros">Esteros</MenuItem>
                                            <MenuItem value="Fort Lauderdale">Fort Lauderdale</MenuItem>
                                            <MenuItem value="Fort Myers">Fort Myers</MenuItem>
                                            <MenuItem value="Graveland">Graveland</MenuItem>
                                            <MenuItem value="Greenacres">Greenacres</MenuItem>
                                            <MenuItem value="Haines City">Haines City</MenuItem>
                                            <MenuItem value="Hialeah">Hialeah</MenuItem>
                                            <MenuItem value="Hollywood">Hollywood</MenuItem>
                                            <MenuItem value="Homestead">Homestead</MenuItem>
                                            <MenuItem value="Inmokalee">Inmokalee</MenuItem>
                                            <MenuItem value="Jacksonville">Jacksonville</MenuItem>
                                            <MenuItem value="Kissimmee">Kissimmee</MenuItem>
                                            <MenuItem value="Lake City">Lake City</MenuItem>
                                            <MenuItem value="Lake Worth">Lake Worth</MenuItem>
                                            <MenuItem value="Lakeland">Lakeland</MenuItem>
                                            <MenuItem value="Lantana">Lantana</MenuItem>
                                            <MenuItem value="Lauderhill">Lauderhill</MenuItem>
                                            <MenuItem value="Lehigh Acres">Lehigh Acres</MenuItem>
                                            <MenuItem value="Live Oak">Live Oak</MenuItem>
                                            <MenuItem value="Miami">Miami</MenuItem>
                                            <MenuItem value="Miami Gardens">Miami Gardens</MenuItem>
                                            <MenuItem value="Miramar">Miramar</MenuItem>
                                            <MenuItem value="Naples">Naples</MenuItem>
                                            <MenuItem value="North Lauderdale">North Lauderdale</MenuItem>
                                            <MenuItem value="North Port">North Port</MenuItem>
                                            <MenuItem value="Orlando">Orlando</MenuItem>
                                            <MenuItem value="Palm Beach Gardens">Palm Beach Gardens</MenuItem>
                                            <MenuItem value="Palm Coast">Palm Coast</MenuItem>
                                            <MenuItem value="Palm Springs">Palm Springs</MenuItem>
                                            <MenuItem value="Pembroke Pines">Pembroke Pines</MenuItem>
                                            <MenuItem value="Plant City">Plant City</MenuItem>
                                            <MenuItem value="Ponciana">Ponciana</MenuItem>
                                            <MenuItem value="Port Charlotte">Port Charlotte</MenuItem>
                                            <MenuItem value="Port Saint Lucie">Port Saint Lucie</MenuItem>
                                            <MenuItem value="Punta Gorda">Punta Gorda</MenuItem>
                                            <MenuItem value="Royal Palm Beach">Royal Palm Beach</MenuItem>
                                            <MenuItem value="Saint Cloud">Saint Cloud</MenuItem>
                                            <MenuItem value="Sanford">Sanford</MenuItem>
                                            <MenuItem value="Sebring">Sebring</MenuItem>
                                            <MenuItem value="Spring Hill">Spring Hill</MenuItem>
                                            <MenuItem value="Sunrise">Sunrise</MenuItem>
                                            <MenuItem value="Tampa">Tampa</MenuItem>
                                            <MenuItem value="Venice">Venice</MenuItem>
                                            <MenuItem value="Vero Beach">Vero Beach</MenuItem>
                                            <MenuItem value="Wauchula">Wauchula</MenuItem>
                                            <MenuItem value="West Palm Beach">West Palm Beach</MenuItem>
                                            <MenuItem value="Weston">Weston</MenuItem>
                                            <MenuItem value="Winter Haven">Winter Haven</MenuItem>
                                            <MenuItem value="Winter Park">Winter Park</MenuItem>
                                        </SelectCustom>
                                    )
                                }
                                {
                                    values.state === 'TX' && (
                                        <SelectCustom
                                            value={values.city}
                                            onChange={handleChange}
                                            label="Ciudad"
                                            name="city"
                                            helpertext={""}
                                        >
                                            <MenuItem value='' disabled>Seleccione una ciudad</MenuItem>
                                            <MenuItem value='San Antonio'>San Antonio</MenuItem>
                                            <MenuItem value='Houston'>Houston</MenuItem>
                                            <MenuItem value='Dallas'>Dallas</MenuItem>
                                            <MenuItem value='Dr Humble'>Dr Humble</MenuItem>
                                            <MenuItem value='Dr Katy'>Dr Katy</MenuItem>
                                            <MenuItem value='Kigwood'>Kigwood</MenuItem>
                                        </SelectCustom>
                                    )
                                }
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextFieldCustom onChange={handleChange} multiline name="address" value={values.address} label="Direccion" />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextFieldCustom onChange={handleChange} name="zip_code" value={values.zip_code} label="ZIP Code" />
                            </Grid>
                            <Grid size={12}>
                                <ButtonCustom type="submit">Registrar</ButtonCustom>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout>
    )
}
