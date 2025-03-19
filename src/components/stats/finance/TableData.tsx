import { TableRow, TableCell, IconButton, Box } from "@mui/material";
import moment from "moment";
import { FinanceData } from "../../../interfaces";
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

type InitialValues = Omit<FinanceData, 'id' | 'created_at' | 'updated_at' | 'closing_date' | 'observations'>


interface DataProps {
    data: FinanceData;
}
export const TableData = ({ data }: DataProps) => {
    const initialValues: InitialValues = {
        assets: data.assets,
        gross_income: data.gross_income,
        expenses: data.expenses,
        income_vs_expenses_percentage: data.income_vs_expenses_percentage,
        balances: data.balances,
        productivity_percentage: data.productivity_percentage,
        expenditures_according_to_finantial_plan: data.expenditures_according_to_finantial_plan,
        reserved_payments: data.reserved_payments,
        reservations: data.reservations,
    }
    const [info, setInfo] = useState<FinanceData>(data);
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
        if (Number(values.productivity_percentage.replace('%', '')) > 100) return;
        const url = `${baseUrl}/stats/finance/${data.id}`;
        const body = new URLSearchParams();
        console.log({ values })
        for (const [key, value] of Object.entries(values)) {
            body.append(key, String(value).replace('$', '').replace(',', '').replace('%', ''));
        }
        body.append('income_vs_expenses_percentage', `${Number((Number(String(values.gross_income).replace('$', '').replace(',', '')) / Number(String(values.expenses).replace('$', '').replace(',', ''))) - 1).toFixed(2)}`);
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
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Activos'
                            value={values.assets}
                            name="assets"
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
                            label='Ingreso bruto'
                            value={values.gross_income}
                            name="gross_income"
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
                            label='Egresos'
                            value={values.expenses}
                            name="expenses"
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
                            label='Ingresos contra egresos %'
                            value={String((Number(String(values.gross_income).replace('$', '').replace(',', '')) / Number(String(values.expenses).replace('$', '').replace(',', ''))) - 1)}
                            name="income_vs_expenses_percentage"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            suffix="%"
                            InputProps={{
                                readOnly: true
                            }}
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Balances'
                            value={values.balances}
                            name="balances"
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
                            label='Productividad %'
                            value={values.productivity_percentage}
                            name="productivity_percentage"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            suffix="%"
                            helperText={Number(values.productivity_percentage.replace('%', '')) > 100 ? 'El valor maximo debe ser 100%' : ''}
                            error={Number(values.productivity_percentage.replace('%', '')) > 100 ? true : false}
                            thousandSeparator={false}
                            onChange={handleChange}

                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Egresos segun el plan financiero'
                            value={values.expenditures_according_to_finantial_plan}
                            name="expenditures_according_to_finantial_plan"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            decimalScale={2}
                            fixedDecimalScale
                            valueIsNumericString={true}
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Pagos reservados'
                            value={values.reserved_payments}
                            name="reserved_payments"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            valueIsNumericString={true}
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator={false}
                            onChange={handleChange}
                        />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <NumericFormat
                            customInput={TextFieldCustom}
                            label='Reservas'
                            value={values.reservations}
                            name="reservations"
                            allowLeadingZeros={false}
                            allowNegative={false}
                            decimalScale={2}
                            fixedDecimalScale
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
                                <IconButton onClick={onSubmit} disabled={Number(values.productivity_percentage.replace('%', '')) > 100 ? true : false}>
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
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.assets}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.gross_income}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.expenses}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.income_vs_expenses_percentage}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.balances}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.productivity_percentage}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.expenditures_according_to_finantial_plan}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.reserved_payments}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{info.reservations}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            <TextDialog text={info.observations} />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                            {today.diff(moment(info.closing_date), 'days') < 6 && (
                                <IconButton onClick={toggleEdit} >
                                    <EditRounded />
                                </IconButton>
                            )}
                        </TableCell>
                    </TableRow>
                )}
        </>
    )
}