import { FC, } from 'react';

import Grid from '@mui/material/Grid2';

// import { blue, green } from '@mui/material/colors';

import { ButtonCustom, TextFieldCustom } from '../../components/custom';
import { Formik, Form, FormikState } from 'formik';
import { OptionsList } from '../../components/ui/options';
import { Option } from '../../interfaces';
// import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import ListRounded from '@mui/icons-material/ListRounded';
import BarChartRounded from '@mui/icons-material/BarChartRounded';
import { NumericFormat } from 'react-number-format';
import { IResponse } from '../../interfaces/response-type';
import { request } from '../../common/request';
import { toast } from 'react-toastify';
import { errorArrayLaravelTransformToString } from '../../lib/functions';
import { Layout } from '../../components/ui/Layout';
import { DescripcionDeVista } from '../../components/ui/content/DescripcionDeVista';


/**
 * Valores iniciales de los campos del formulario Formik
 */
const initialValues: IValues = {
    names: '',
    surnames: '',
    document: ''
}
/**
 * Tipo de dato de los campos del formulario
 */
interface IValues {
    names: string;
    surnames: string;
    document: string;
}

export const RegisterAdviser: FC = () => {

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Listar asesores', path: '/advisers', icon: <ListRounded /> },
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
        const url = `/adviser`;
        const body = new URLSearchParams();
        body.append('names', values.names);
        body.append('surnames', values.surnames);
        body.append('document', String(values.document).replace('.', ''));
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                toast.success('Se ha registrado el asesor')
                resetForm();
                break;
            case 400:
                const { errors } = await response.json();
                toast.error(errorArrayLaravelTransformToString(errors))
                break;
            default:
                toast.error('Ocurrio un error inesperado')
                break;
        }
    }
    return (
        <Layout>
            <DescripcionDeVista title={'Registrar Asesor'} description={'Registra un nuevo asesor ingresando los datos en el formulario y luego clickeando en "Registrar"!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mb: 5 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextFieldCustom value={values.names} label='Nombres' name={'names'} onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextFieldCustom value={values.surnames} label='Apellidos' name={'surnames'} onChange={handleChange} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <NumericFormat
                                    value={values.document}
                                    customInput={TextFieldCustom}
                                    label='Identificación'
                                    name={'document'}
                                    allowLeadingZeros={false}
                                    allowNegative={false}
                                    onChange={handleChange}
                                />
                            </Grid>
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