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
import { IResponse } from '../../interfaces/response-type';
import { request } from '../../common/request';
import { toast } from 'react-toastify';
import { errorArrayLaravelTransformToString } from '../../lib/functions';
import { DescripcionDeVista } from '../../components/ui/content/DescripcionDeVista';
import { Layout } from '../../components/ui/Layout';


/**
 * Valores iniciales de los campos del formulario Formik
 */
const initialValues: IValues = {
    description: '',
}
/**
 * Tipo de dato de los campos del formulario
 */
interface IValues {
    description: string;
}

export const RegisterCity: FC = () => {

    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Listar ciudades', path: '/cities', icon: <ListRounded /> },
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
        const url = `/city`;
        const body = new URLSearchParams();
        body.append('description', values.description);

        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (status) {
            case 200:
                toast.success('Se ha registrado la ciudad')
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
            <DescripcionDeVista title={'Registrar Ciudad'} description={'Registra una nueva ciudad ingresando los datos en el formulario y luego clickeando en "Registrar"!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 6, md: 6, lg: 6 }} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mb: 5 }}>
                            <Grid size={12}>
                                <TextFieldCustom value={values.description} label='Nombre de la ciudad' name={'description'} onChange={handleChange} />
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