import { TableRow, TableCell, IconButton, Box } from "@mui/material";
import moment from "moment";
import { HumanResourcesData } from "../../../interfaces";
import { TextDialog } from "../../ui/content/TextDialog";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/auth";
import { TextFieldCustom } from "../../custom";
import { baseUrl } from "../../../common";
const { default: Swal } = await import('sweetalert2');
import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { errorArrayLaravelTransformToArray } from "../../../helpers/functions";
import { NumericFormat } from "react-number-format";
import { hashNumericFieldsHR, numericFieldsHR } from "../../../pages/stats";

type InitialValues = Omit<HumanResourcesData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>

interface DataProps {
    data: HumanResourcesData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        active_team_members_florida: data.active_team_members_florida,
        active_team_members_texas: data.active_team_members_texas,
        active_team_members_valencia: data.active_team_members_valencia,
        active_team_members_maracay: data.active_team_members_maracay,
        managment_request: data.managment_request,
        employee_requests: data.employee_requests,
        disciplinary_actions: data.disciplinary_actions,
        meetings: data.meetings,
        file_updates: data.file_updates,
        new_hires: data.new_hires,
        offers: data.offers,
        interviews_scheduled: data.interviews_scheduled,
        completed_interviews: data.completed_interviews,
        declined: data.declined,
        terminations: data.terminations,
    }
    const [info, setInfo] = useState<HumanResourcesData>(data);
    const [values, setValues] = useState<InitialValues>(initialValues);
    const [editing, setEditing] = useState<boolean>(false);
    const { authState } = useContext(AuthContext)
    const today = moment();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    const toggleEdit = () => {
        setEditing(!editing);
    }

    const onSubmit = async () => {
        const url = `${baseUrl}/stats/human_resources/${data.id}`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
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
                    <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{data.id}</TableCell>
                    <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{data.closing_date}</TableCell>
                    {numericFieldsHR.map((field: string, i: number) => (
                        <TableCell key={i} sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
                            <NumericFormat
                                customInput={TextFieldCustom}
                                allowLeadingZeros={false}
                                allowNegative={false}
                                valueIsNumericString={true}
                                thousandSeparator={true}
                                onChange={handleChange}
                                label={hashNumericFieldsHR[field]}
                                value={data[field as keyof InitialValues]}
                            />
                        </TableCell>
                    ))}
                    <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <TextDialog text={data.observations} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info.id}</TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info.closing_date}</TableCell>
                        {numericFieldsHR.map((field: string, i: number) => (
                            <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>{info[field as keyof HumanResourcesData]}</TableCell>
                        ))}
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
                            <TextDialog text={info.observations} />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap', textAlign: 'center' }}>
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