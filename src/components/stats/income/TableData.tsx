import { TableRow, TableCell, IconButton, Box } from "@mui/material";
import moment from "moment";
import { IncomeData } from "../../../interfaces";
import { TextDialog } from "../../ui/content/TextDialog";
import { ChangeEvent, useState } from "react";
import { TextFieldCustom } from "../../custom";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { NumericFormat } from "react-number-format";
import { useUserStore } from "../../../store/user/UserStore";
import { toast } from "react-toastify";
import { errorArrayLaravelTransformToArray } from "../../../lib/functions";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";

type InitialValues = Omit<IncomeData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>


interface DataProps {
    data: IncomeData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        number_of_invoices_by_negotiation: data.number_of_invoices_by_negotiation,
        value_of_invoices_by_negotiation: data.value_of_invoices_by_negotiation,
        accounts_receivable_by_negotiation: data.accounts_receivable_by_negotiation,
        income_by_negotiation: data.income_by_negotiation,
        charges: data.charges,
        number_of_calls: data.number_of_calls,
        number_of_effective_calls: data.number_of_effective_calls,
        income_by_portfolio: data.income_by_portfolio,
        accounts_receivable_by_portfolio: data.accounts_receivable_by_portfolio,
        global_income: data.global_income,
    }
    const [info, setInfo] = useState<IncomeData>(data);
    const [values, setValues] = useState<InitialValues>(initialValues);
    const [editing, setEditing] = useState<boolean>(false);
    const user = useUserStore(state => state.user);
    const today = moment();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    const toggleEdit = () => {
        setEditing(!editing);
    }

    const onSubmit = async () => {
        const url = `/stats/income/${data.id}`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (key !== 'global_income') body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('global_income', String((Number(String(values.income_by_portfolio).replace('$', '').replace(',', '')) + Number(String(values.income_by_negotiation).replace('$', '').replace(',', ''))).toFixed(2)));
        const { status, response, err }: IResponse = await request(url, 'PUT', body);

        switch (status) {
            case 200:
                const { data } = await response.json();
                setInfo(data)
                toast.error('Se ha actualizado la información');
                setEditing(false);
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToArray(errors));
                break;
            default:
                toast.error(`Ocurrio un error inesperado (${status})`);
        }
    }
    return (
        <>
            {editing ?
                <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.id}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{data.closing_date}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.number_of_invoices_by_negotiation}
                            name="number_of_invoices_by_negotiation"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.value_of_invoices_by_negotiation}
                            name="value_of_invoices_by_negotiation"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix="$"
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.accounts_receivable_by_negotiation}
                            name="accounts_receivable_by_negotiation"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix="$"
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.income_by_negotiation}
                            name="income_by_negotiation"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix="$"
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.charges}
                            name="charges"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.number_of_calls}
                            name="number_of_calls"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.number_of_effective_calls}
                            name="number_of_effective_calls"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.income_by_portfolio}
                            name="income_by_portfolio"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix="$"
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={values.accounts_receivable_by_portfolio}
                            name="accounts_receivable_by_portfolio"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix="$"
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            value={String(Number(String(values.income_by_portfolio).replace('$', '').replace(',', '')) + Number(String(values.income_by_negotiation).replace('$', '').replace(',', '')))}
                            name="global_income"
                            decimalScale={2}
                            fixedDecimalScale={true}
                            prefix="$"
                            InputProps={{
                                readOnly: true
                            }}
                            thousandSeparator={true}
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <TextDialog text={data.observations} />
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
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.number_of_invoices_by_negotiation}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.value_of_invoices_by_negotiation}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.accounts_receivable_by_negotiation}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.income_by_negotiation}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.charges}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.number_of_calls}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.number_of_effective_calls}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.income_by_portfolio}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.accounts_receivable_by_portfolio}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.global_income}</TableCell>
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