import { TableRow, TableCell, IconButton, Box, Grid, MenuItem, SelectChangeEvent } from "@mui/material";
import moment from "moment";
import { AnalysisData } from "../../../interfaces";
import { TextDialog } from "../../ui/content/TextDialog";
import { ChangeEvent, ReactNode, useContext, useState } from "react";
import { AuthContext } from "../../../context/auth";
import { SelectCustom, TextFieldCustom } from "../../custom";
import { baseUrl } from "../../../common";
const { default: Swal } = await import('sweetalert2');
import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { errorArrayLaravelTransformToArray } from "../../../helpers/functions";
import { hashNumericFieldsAnalysis, numericFieldsAnalysis } from "../../../pages/stats";
import { NumericFormat } from "react-number-format";

type InitialValues = Omit<AnalysisData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>


interface DataProps {
    data: AnalysisData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        received_claims: data.received_claims,
        checked_claims: data.checked_claims,
        approved_claims: data.approved_claims,
        rechecked_claims: data.rechecked_claims,
        cancelled_claims: data.cancelled_claims,
        on_hold_claims: data.on_hold_claims,
        unchecked_claims: data.unchecked_claims,
        approved_claims_weeks_before: data.approved_claims_weeks_before,
        clean_initiative: data.clean_initiative,
        integrity_claims: data.integrity_claims,
        received_leads: data.received_leads,
        checked_leads: data.checked_leads,
        unchecked_leads: data.unchecked_leads,
        approved_leads: data.approved_leads,
        rechecked_leads: data.rechecked_leads,
        on_hold_leads: data.on_hold_leads,
        cancelled_leads: data.cancelled_leads,
        wdm_zone: data.wdm_zone,
    }
    const [info, setInfo] = useState<AnalysisData>(data);
    const [values, setValues] = useState<InitialValues>(initialValues);
    const [editing, setEditing] = useState<boolean>(false);
    const { authState } = useContext(AuthContext)
    const today = moment();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    const handleChangeSelect = (e: SelectChangeEvent<unknown>, child: ReactNode) => {
        setValues({ ...values, [e.target.name]: e.target.value })

    }
    const toggleEdit = () => {
        setEditing(!editing);
    }

    const onSubmit = async () => {
        const url = `${baseUrl}/stats/analysis/${data.id}`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            body.append(key, String(value));
        }
        const options = {
            method: 'PUT',
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
                    const { data } = await response.json();
                    setInfo(data)
                    Swal.fire({
                        title: 'Exito',
                        text: 'Se ha actualizado la información',
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: true,
                        toast: true,
                        position: 'bottom',
                        showConfirmButton: false,

                    });
                    setEditing(false);
                    break;
                case 400:
                    const { errors } = await response.json();
                    Swal.fire({
                        title: 'Error',
                        text: errorArrayLaravelTransformToArray(errors),
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    break;
                default:
                    Swal.fire({
                        title: 'Error',
                        text: `Ocurrio un error inesperado (${response.status})`,
                        icon: 'error',
                        timer: 2000,
                        timerProgressBar: true,
                        position: 'bottom',
                        showConfirmButton: false,
                        toast: true
                    });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se ha podido actualizar la información',
                icon: 'error',
                timer: 2000,
                toast: true,
                position: 'bottom',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    }
    return (
        <>
            {editing ?
                <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.id}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.closing_date}</TableCell>
                    {numericFieldsAnalysis.map((field: string, i: number) => (
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 100 }} key={i}>
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
                        </TableCell>
                    ))}
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <SelectCustom
                            size="small"
                            name='wdm_zone'
                            value={values.wdm_zone}
                            onChange={handleChangeSelect}
                            defaultValue={'0'}
                            label="Zona WDM"
                            helpertext={""}
                        >
                            <MenuItem value='0' disabled>Seleccionar Zona</MenuItem>
                            <MenuItem value='Florida'>Florida</MenuItem>
                            <MenuItem value='Texas'>Texas</MenuItem>
                            <MenuItem value='California'>California</MenuItem>
                        </SelectCustom>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {today.diff(moment(data.closing_date), 'days') < 6 && (<TextDialog text={data.observations} />)}
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
                : (
                    <TableRow>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.id}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.closing_date}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.received_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.checked_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.approved_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.rechecked_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.cancelled_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.on_hold_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.unchecked_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.approved_claims_weeks_before}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.clean_initiative}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.integrity_claims}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.received_leads}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.checked_leads}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.unchecked_leads}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.approved_leads}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.rechecked_leads}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.on_hold_leads}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.cancelled_leads}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.wdm_zone}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            {today.diff(moment(info.closing_date), 'days') < 6 && (<TextDialog text={info.observations} />)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            {today.diff(moment(info.closing_date), 'days') < 6 && (
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