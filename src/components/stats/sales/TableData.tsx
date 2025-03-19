import { TableRow, TableCell, IconButton, Box } from "@mui/material";
import moment from "moment";
import { IAdviser, ITeam, SalesData } from "../../../interfaces";
import { ChangeEvent, useContext, useState } from "react";
import { TextFieldCustom, TypographyCustom } from "../../custom";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { NumericFormat } from "react-number-format";
import { CalendarCustom } from "../../custom/CalendarCustom";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { errorArrayLaravelTransformToArray, errorArrayLaravelTransformToString } from "../../../lib/functions";
import { toast } from "react-toastify";
import { ModalSelector } from "../../ui/content/ModalSelector";
import { TextDialog } from "../../ui/content/TextDialog";

type InitialValues = Omit<SalesData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations' | 'team' | 'adviser' | 'team_id' | 'adviser_id'>


interface DataProps {
    data: SalesData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        date: data.date,
        week: data.week,
        roof: data.roof,
        water: data.water,
        claims: data.claims,
    }
    const [info, setInfo] = useState<SalesData>(data);
    const [week_from, setWeekFrom] = useState<string>(moment().format('DD-MM'));
    const [week_to, setWeekTo] = useState<string>(moment().format('DD-MM'));
    const [adviserSelected, setAdviserSelected] = useState<IAdviser | null>(data.adviser);
    const [teamSelected, setTeamSelected] = useState<ITeam | null>(data.team);
    const [values, setValues] = useState<InitialValues>(initialValues);
    const [editing, setEditing] = useState<boolean>(false);
    const today = moment();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    const toggleEdit = () => {
        setEditing(!editing);
    }

    const onSubmit = async () => {
        let errors = [];
        if (!week_from) {
            errors.push('Seleccione una semana desde')
        }
        if (!week_to) {
            errors.push('Seleccione una semana hasta')
        }
        if (errors.length > 0) {
            toast.error(errorArrayLaravelTransformToString(errors))
            return;
        }
        const url = `/stats/sales/${data.id}`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'week_from' && key !== 'week_to' && key !== 'claims') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('week', `Sem ${moment(week_from).format('DD-MM')} al ${moment(week_to).format('DD-MM-YYYY')}`);
        body.append('claims', String((Number(values.roof) + Number(values.water)).toFixed(2)));
        body.append('team', String(teamSelected?.id));
        body.append('adviser', String(adviserSelected?.id));
        const { status, response, err }: IResponse = await request(url, 'PUT', body);
        switch (status) {
            case 200:
                const { data } = await response.json();
                console.log({ data })
                setInfo(data)
                toast.success('Se ha actualizado la información')
                setEditing(false);
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToArray(errors))
                break;
            default:
                toast.error(`Ocurrio un error inesperado (${response.status})`)
        }
    }
    return (
        <>
            {editing ?
                <TableRow>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>{data.id}</TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>{data.closing_date}</TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <ModalSelector title={"Seleccionar asesor"} text={"Buscar asesor"} data={adviserSelected} setData={setAdviserSelected} url={`${import.meta.env.VITE_BACKEND_API_URl}/adviser`} dataProperty={"names"} dataPropertySecondary={"document"} dataPropertyAux={"surnames"} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <ModalSelector team title={"Seleccionar equipo"} text={"Buscar equipo"} data={teamSelected} setData={setTeamSelected} url={`${import.meta.env.VITE_BACKEND_API_URl}/team`} dataProperty={"description"} dataPropertySecondary={"names"} dataPropertyAux={"surnames"} />
                    </TableCell>
                    <TableCell sx={{ minHeight: 150, minWidth: 500, whiteSpace: 'nowrap', display: 'flex', flexFlow: 'column wrap', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                            <TypographyCustom>{`Fecha actual: Sem ${moment(week_from).format('DD-MM')} al ${moment(week_to).format('DD-MM-YYYY')}`}</TypographyCustom>
                        </Box>
                        <Box sx={{ display: 'flex', flexFlow: 'row nowrap' }}>
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
                        </Box>
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <TextDialog text={data.observations} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {today.diff(moment(data.closing_date), 'days') < 6 && (
                            <Box sx={{ display: 'flex', flexFlow: 'row nowrap' }}>
                                <IconButton onClick={onSubmit}>
                                    <CheckRounded />
                                </IconButton>
                                <IconButton onClick={toggleEdit}>
                                    <CancelRounded />
                                </IconButton>
                            </Box>
                        )}
                    </TableCell>
                </TableRow>
                : (
                    <TableRow>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info?.id}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info?.closing_date}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{`${info?.adviser?.names} ${info?.adviser?.surnames}`}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{`${info?.team?.city.description} - ${info?.team?.adviser?.names} ${info?.team?.adviser?.surnames}`}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info?.week}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info?.roof}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info?.water}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info?.claims}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
                            <TextDialog text={info?.observations} />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
                            {today.diff(moment(info?.closing_date), 'days') < 6 && (
                                <IconButton onClick={toggleEdit}>
                                    <EditRounded />
                                </IconButton>
                            )}
                        </TableCell>
                    </TableRow>
                )}
        </>
    )
}