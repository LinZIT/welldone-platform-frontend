import EditRounded from "@mui/icons-material/EditRounded";
import { TableRow, TableCell, IconButton, Box } from "@mui/material";
import moment from "moment";
import { ITData } from "../../../interfaces";
import { useState, ChangeEvent } from "react";
import { NumericFormat } from "react-number-format";
import { TextFieldCustom } from "../../custom";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToString } from "../../../lib/functions";
import { TextDialog } from "../../ui/content/TextDialog";

type InitialValues = Omit<ITData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>
interface DataProps {
    data: ITData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        optimizations: data.optimizations,
        created_automations: data.created_automations,
        improved_automations: data.improved_automations,
        web: data.web,
        approved_developments: data.approved_developments,
        testing: data.testing,
        corrections: data.corrections,
        created_tickets: data.created_tickets,
        closed_tickets: data.closed_tickets,
        in_progress_projects: data.in_progress_projects
    }
    const [info, setInfo] = useState<ITData>(data);
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
        const url = `/stats/it/${data.id}`;
        console.log({ values })
        const body = new URLSearchParams();
        // body.append('closing_date', moment(date).format('YYYY-MM-DD'));
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

        const { status, response, err }: IResponse = await request(url, 'PUT', body);
        switch (status) {
            case 200:
                const { message, data } = await response.json();
                toast.success(message)
                setInfo(data)
                setEditing(false);
                break;
            case 400:
                const { status, errors } = await response.json();
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
    return editing ? (
        <TableRow>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.id}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.closing_date}</TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                <TextDialog text={info.observations} />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
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
    ) : (
        <TableRow>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.id}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{moment(info.closing_date).format('DD-MM-YYYY')}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.optimizations}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.created_automations}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.improved_automations}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.web}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.approved_developments}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.testing}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.corrections}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.created_tickets}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.closed_tickets}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.in_progress_projects}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                <TextDialog text={info.observations} />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                <IconButton onClick={toggleEdit}>
                    {today.diff(moment(data.closing_date), 'days') < 6 && (<EditRounded />)}
                </IconButton>
            </TableCell>
        </TableRow>)
}
