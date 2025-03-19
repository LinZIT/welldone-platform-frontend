import { TableRow, TableCell, IconButton, Box } from "@mui/material";
import moment from "moment";
import { DisbursementsData } from "../../../interfaces";
import { ChangeEvent, useContext, useState } from "react";
import { TextFieldCustom } from "../../custom";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import { NumericFormat } from "react-number-format";
import { request } from "../../../common/request";
import { toast } from "react-toastify";
import { useUserStore } from "../../../store/user/UserStore";
import { TextDialog } from "../../ui/content/TextDialog";

type InitialValues = Omit<DisbursementsData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>


interface DataProps {
    data: DisbursementsData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        number_of_overdue_invoices: data.number_of_overdue_invoices,
        value_of_paid_invoices: data.value_of_paid_invoices,
        payable_accounts: data.payable_accounts,
        paid_providers: data.paid_providers
    }
    const [info, setInfo] = useState<DisbursementsData>(data);
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
        const url = `/stats/disbursements/${data.id}`;
        const body = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            body.append(key, String(value).replace('$', '').replace(',', ''));
        }
        const { status, response, err }: { status: number, response: any, err: any } = await request(url, 'PUT', body)
        switch (response.status) {
            case 200:
                const { data } = await response.json();
                setInfo(data)
                toast.success('Se ha actualizado la información')
                setEditing(false);
                break;
            case 400:
                const { errors } = await response.json();
                // text: errorArrayLaravelTransformToArray(errors),
                toast.error(`Ocurrio un error inesperado (${response.status})`);
                break;
            default:
                toast.error('No se ha podido actualizar la información');
                break;
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
                            label='N° de facturas vencidas'
                            value={values.number_of_overdue_invoices}
                            name="number_of_overdue_invoices"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Valor de facturas pagadas'
                            value={values.value_of_paid_invoices}
                            name="value_of_paid_invoices"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            prefix="$"
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Cuentas por pagar'
                            value={values.payable_accounts}
                            name="payable_accounts"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            prefix="$"
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Proveedores pagados'
                            value={values.paid_providers}
                            name="paid_providers"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            thousandSeparator={false}
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
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.number_of_overdue_invoices}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.value_of_paid_invoices}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.payable_accounts}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.paid_providers}</TableCell>
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