import { FC, useState } from 'react';

import Grid from '@mui/material/Grid2';

import { ButtonCustom } from '../../components/custom';
import { Formik, Form, FormikState } from 'formik';

import { OptionsList } from '../../components/ui/options';
import { IAdviser, ICity, Option } from '../../interfaces';

// import PersonAddRounded from '@mui/icons-material/PersonAddRounded';
import ListRounded from '@mui/icons-material/ListRounded';
import PeopleRounded from '@mui/icons-material/PeopleRounded';
import BusinessRounded from '@mui/icons-material/BusinessRounded';
import { toast } from 'react-toastify';
import { IResponse } from '../../interfaces/response-type';
import { request } from '../../common/request';
import { errorArrayLaravelTransformToString } from '../../lib/functions';
import { Layout } from '../../components/ui/Layout';
import { DescripcionDeVista } from '../../components/ui/content/DescripcionDeVista';
import { ModalSelector } from '../../components/ui/content/ModalSelector';

interface IValues {
    adviser: string;
    city: string;
}
const initialValues: IValues = {
    adviser: '0',
    city: '0',
}
export const RegisterTeam: FC = () => {
    const [adviserSelected, setAdviserSelected] = useState<IAdviser | null>(null);
    const [citySelected, setCitySelected] = useState<ICity | null>(null);
    /**
     * Opciones del menu de navegacion superior
     */
    const options: Option[] = [
        { text: 'Listar equipos', path: '/teams', icon: <ListRounded /> },
        { text: 'Ciudades', path: '/cities', icon: <BusinessRounded /> },
        { text: 'Asesores', path: '/advisers', icon: <PeopleRounded /> },
    ]

    /**
     * Funcion para registrar un nuevo departamento, esta funcion se ejecuta al enviar el formulario Formik
     * @param values Valores de los campos del formulario 
     * @param resetForm Funcion para reiniciar los campos del formulario
     */
    const onSubmit = async (
        values: IValues,
        resetForm: (nextState?: Partial<FormikState<IValues>> | undefined) => void) => {
        const url = `/team`;
        const body = new URLSearchParams();
        if (!adviserSelected) {
            toast.warning('Debes seleccionar un asesor')
            return;
        }
        if (!citySelected) {
            toast.warning('Debes seleccionar una ciudad')
            return;
        }
        body.append('adviser_id', String(adviserSelected?.id));
        body.append('city_id', String(citySelected?.id));
        const { status, response, err }: IResponse = await request(url, 'POST', body);
        switch (response.status) {
            case 200:
                toast.success('Se ha registrado el equipo');
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
            <DescripcionDeVista title={'Registrar Equipo'} description={'Registra un nuevo equipo seleccionando los datos correspondiente y clickeando en "Registrar"!'} />
            <OptionsList options={options} breakpoints={{ xs: 12, sm: 4, md: 4, lg: 4 }} />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => onSubmit(values, resetForm)}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2} sx={{ mb: 5 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ModalSelector
                                    title={'Seleccione una ciudad'}
                                    text={'Buscar ciudad'}
                                    data={citySelected}
                                    setData={setCitySelected}
                                    url={`/city`}
                                    dataProperty={'description'}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <ModalSelector
                                    title={'Seleccione un asesor'}
                                    text={'Buscar asesor'}
                                    data={adviserSelected}
                                    setData={setAdviserSelected}
                                    url={`/adviser`}
                                    dataProperty={'names'}
                                    dataPropertySecondary={'document'}
                                    dataPropertyAux={'surnames'}
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

