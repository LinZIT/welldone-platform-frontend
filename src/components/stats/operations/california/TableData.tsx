import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { TableRow, TableCell, Box, IconButton } from "@mui/material";
import moment from "moment";
import { useState, ChangeEvent } from "react";
import { OperationsCaliforniaData } from "../../../../interfaces/operations-data-type";
import { NumericFormat } from "react-number-format";
import { TextFieldCustom } from "../../../custom";
import { request } from "../../../../common/request";
import { IResponse } from "../../../../interfaces/response-type";
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToArray } from "../../../../lib/functions";
import { TextDialog } from "../../../ui/content/TextDialog";

type InitialValues = Omit<OperationsCaliforniaData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>

interface DataProps {
    data: OperationsCaliforniaData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        week: data.week,
        roof: data.roof,
        water: data.water,
        mold: data.mold,
        mold_testing: data.mold_testing,
        shrink_wrap: data.shrink_wrap,
        inspections: data.inspections,
        second_tarp: data.second_tarp,
    }
    const [info, setInfo] = useState<OperationsCaliforniaData>(data);
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
        const url = `/stats/operations/california/${data.id}`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }

        const { status, response, err }: IResponse = await request(url, 'PUT', body);
        switch (status) {
            case 200:
                const { data } = await response.json();
                setInfo(data)
                toast.error('Se ha actualizado la información')
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
                            label="Water"
                            name="water"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={0}
                            value={values.water}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center', minWidth: 150 }}>
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
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.water}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.mold}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.mold_testing}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.shrink_wrap}</TableCell>
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