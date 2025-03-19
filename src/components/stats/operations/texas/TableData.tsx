import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { TableRow, TableCell, Box, IconButton } from "@mui/material";
import moment from "moment";
import { useState, useContext, ChangeEvent } from "react";
// import { NumericFormat } from "react-number-format";
const { default: Swal } = await import('sweetalert2');
import { baseUrl } from "../../../../common";
import { AuthContext } from "../../../../context/auth";
import { errorArrayLaravelTransformToArray } from "../../../../helpers/functions";
import { OperationsTexasData } from "../../../../interfaces/operations-data-type";
// import { TextFieldCustom } from "../../../custom";
import { TextDialog } from "../../../ui/content/TextDialog";
import { NumericFormat } from "react-number-format";
import { TextFieldCustom } from "../../../custom";


type InitialValues = Omit<OperationsTexasData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>


interface DataProps {
    data: OperationsTexasData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        week: data.week,
        roof: data.roof,
        inspections: data.inspections,
        second_tarp: data.second_tarp,
    }
    const [info, setInfo] = useState<OperationsTexasData>(data);
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
        const url = `${baseUrl}/stats/operations/texas/${data.id}`;
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
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.id}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.closing_date}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
                        <TextDialog text={data.observations} />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.week}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.roof}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.inspections}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.second_tarp}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            <TextDialog text={info.observations} />
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