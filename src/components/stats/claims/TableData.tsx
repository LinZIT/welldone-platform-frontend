import { TableRow, TableCell, IconButton, Box } from "@mui/material";
import moment from "moment";
import { ClaimsData } from "../../../interfaces";
import { TextDialog } from "../../ui/content/TextDialog";
import { ChangeEvent, useState } from "react";
import { TextFieldCustom } from "../../custom";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { NumericFormat } from "react-number-format";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToArray } from "../../../lib/functions";

type InitialValues = Omit<ClaimsData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>


interface DataProps {
    data: ClaimsData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        proceedings: data.proceedings,
        declined: data.declined,
        proceeding_value: data.proceeding_value,
        fixed_amount: data.fixed_amount,
        funding: data.funding,
        buy_back: data.buy_back,
        portfolio_number: data.portfolio_number
    }
    const [info, setInfo] = useState<ClaimsData>(data);
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
        const url = `/stats/claims/${data.id}`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            body.append(key, String(value).replace('$', ''));
        }
        const { status, response, err }: IResponse = await request(url, 'PUT', body);
        switch (status) {
            case 200:
                const { data } = await response.json();
                setInfo(data)
                toast.success('Se ha actualizado la información')
                setEditing(false);
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToArray(errors))
                break;
            default:
                toast.error(`Ocurrio un error inesperado (${response.status})`);
                break;
        }
    }
    return (
        <>
            {editing ?
                <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.id}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.closing_date}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}><TextFieldCustom size="small" value={values.proceedings} name="proceedings" onChange={handleChange} /></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}><TextFieldCustom size="small" value={values.declined} name="declined" onChange={handleChange} /></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            size="small"
                            value={values.proceeding_value}
                            name="proceeding_value"
                            allowLeadingZeros={false}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix={'$'}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            size="small"
                            value={values.fixed_amount}
                            name="fixed_amount"
                            allowLeadingZeros={false}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix={'$'}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            size="small"
                            value={values.funding}
                            name="funding"
                            allowLeadingZeros={false}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix={'$'}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            size="small"
                            value={values.buy_back}
                            name="buy_back"
                            allowLeadingZeros={false}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix={'$'}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}><TextFieldCustom size="small" value={values.portfolio_number} name="portfolio_number" onChange={handleChange} /></TableCell>
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
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.proceedings}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.declined}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.proceeding_value}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.fixed_amount}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.funding}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.buy_back}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.portfolio_number}</TableCell>
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