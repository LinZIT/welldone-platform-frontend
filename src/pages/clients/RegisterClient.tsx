import { FC } from 'react';

import Grid from '@mui/material/Grid2';

// import { blue, green } from '@mui/material/colors';

import { ButtonCustom, TextFieldCustom } from '../../components/custom';
import { Formik, Form, FormikState } from 'formik';
import { OptionsList } from '../../components/ui/options';
import { Option } from '../../interfaces';
// import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import ListRounded from '@mui/icons-material/ListRounded';
import BarChartRounded from '@mui/icons-material/BarChartRounded';
import { DescripcionDeVista } from '../../components/ui/content/DescripcionDeVista';
import { Layout } from '../../components/ui/Layout';
import { toast } from 'react-toastify';
import { errorArrayLaravelTransformToString } from '../../lib/functions';
import { IResponse } from '../../interfaces/response-type';
import { request } from '../../common/request';


/**
 * Valores iniciales de los campos del formulario Formik
 */
const initialValues: IValues = {
    names: '',
    surnames: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    aditional_phone_1: '',
    aditional_phone_1_description: '',
    aditional_phone_2: '',
    aditional_phone_2_description: ''
}
/**
 * Tipo de dato de los campos del formulario
 */
interface IValues {
    names: string;
    surnames: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    aditional_phone_1: string;
    aditional_phone_1_description: string;
    aditional_phone_2: string;
    aditional_phone_2_description: string;
}
type FieldHashType = { [key: string]: string };
const fields: string[] = [
    'names',
    'surnames',
    'phone',
    'email',
    'address',
    'city',
    'state',
    'zip_code',
    'aditional_phone_1',
    'aditional_phone_1_description',
    'aditional_phone_2',
    'aditional_phone_2_description',
]

const hashFields: FieldHashType = {
    'names': 'Nombres',
    'surnames': 'Apellidos',
    'phone': 'Telefono',
    'email': 'Email',
    'address': 'Direccion',
    'city': 'Ciudad',
    'state': 'Estado',
    'zip_code': 'Zip Code',
    'aditional_phone_1': 'Telefono adicional 1',
    'aditional_phone_1_description': 'Descripcion del telefono adicional 1',
    'aditional_phone_2': 'Telefono adicional 2',
    'aditional_phone_2_description': 'Descripcion del telefono adicional 2',
}
export const RegisterClient: FC = () => {

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Listar clients', path: '/clients', icon: <ListRounded /> },
        { text: 'Estadisticas de Sales', path: '/stats/sales', icon: <BarChartRounded /> },
    ]

    /**
     * Funcion para registrar un nuevo departamento, esta funcion se ejecuta al enviar el formulario Formik
     * @param values Valores de los campos del formulario 
     * @param resetForm Funcion para reiniciar los campos del formulario
     */
    const onSubmit = async (
        values: IValues,
        resetForm: (nextState?: Partial<FormikState<IValues>> | undefined) => void) => {
        const url = `/client`;
        const body = new URLSearchParams();
        fields.map((field, i) => {
            body.append(field, values[field as keyof IValues]);
        })
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                toast.error('Se ha registrado el cliente')
                resetForm();
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToString(errors))
                break;
            default:
                const { errors: error500 } = await response.json();
                console.log({ error500 })
                toast.error('Ocurrio un error inesperado')
                break;
        }
    }

    return (
        <Layout>
            <DescripcionDeVista title={'Registrar Cliente'} description={'Registra un nuevo cliente ingresando los datos en el formulario y luego clickeando en "Registrar"!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mb: 5 }}>
                            {fields.map((field, i) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                                    <TextFieldCustom
                                        label={hashFields[field as keyof FieldHashType]}
                                        name={field}
                                        value={values[field as keyof IValues]}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            ))}
                            <Grid size={12}>
                                <ButtonCustom type='submit'>Registrar</ButtonCustom>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Layout >
    )
}