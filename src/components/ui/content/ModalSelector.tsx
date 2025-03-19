import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import YoutubeSearchedForRounded from "@mui/icons-material/YoutubeSearchedForRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

import { Box, IconButton, Dialog, AppBar, Toolbar, Paper, Button } from "@mui/material";
import { Dispatch, FC, useState, useEffect } from "react";
import { TypographyCustom } from "../../custom";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { errorArrayLaravelTransformToString } from "../../../lib/functions";
import { toast } from "react-toastify";
import { Loading } from "./Loading";
import { BusquedaYResultado } from "./BusquedaYResultado";

interface Props {
    title: string;
    text?: string;
    data: any;
    setData: Dispatch<any>;
    url: string;
    dataProperty: string;
    dataPropertySecondary?: string;
    dataPropertyAux?: string;
    team?: boolean;
    onChange?: any;
}
export const ModalSelector: FC<Props> = ({ title, text = "Seleccionar", data, setData, url, dataProperty, dataPropertySecondary = '', dataPropertyAux = '', team = false, onChange = () => { } }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [displayData, setDisplayData] = useState<IData[] | null>(null);

    const toggleOpen = () => {
        setOpen(!open);
    }
    const handleChange = (data: any) => {
        setData(data);
        onChange(data);
    }
    const getData = async () => {
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setOpen(false);
                setDisplayData(data);
                setLoading(false);

                break;
            case 400:
                const { errors } = await response.json();
                setOpen(false);
                toast.error(errorArrayLaravelTransformToString(errors))
                setLoading(false);

                break;
            default:
                toast.error(errorArrayLaravelTransformToString(errors))
                setLoading(false);

                break;
        }
    }

    useEffect(() => {
        getData();
    }, []);
    // Si se estan buscando registros en la API se muestra un loader

    if (loading) return (<Loading />)
    return (
        <>
            <Box>
                <TypographyCustom fontmode={2} variant={'subtitle2'} color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>{!data ? title : team ? `Seleccionado: ${data.city[dataProperty]} - ${data.adviser[dataPropertySecondary]} ${data.adviser[dataPropertyAux]}` : (
                    <>
                        {`Seleccionado: ${data[dataProperty]}`} {<CheckCircleOutlineRounded color="success" />}
                    </>)}
                </TypographyCustom>
                <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center' }}>
                    <TypographyCustom variant="subtitle2">{text}</TypographyCustom>
                    <IconButton onClick={() => toggleOpen()}>
                        {!data ? <OpenInNewRounded /> : <YoutubeSearchedForRounded />}
                    </IconButton>
                    {data && (<IconButton onClick={() => setData(null)}>
                        <CloseRounded />
                    </IconButton>)}
                </Box>
            </Box>
            <Dialog fullScreen open={open}>
                <AppBar sx={{ width: '100%', background: '#191919' }}>
                    <Toolbar sx={{ background: '#191919' }}>
                        <TypographyCustom>{title}</TypographyCustom>
                        <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {data && <Button size="small" onClick={() => toggleOpen()} sx={{ textTransform: 'none', p: 1 }} variant="contained" >Guardar Cambios</Button>}
                            <IconButton onClick={() => {
                                setData(null);
                                toggleOpen();
                            }} sx={{ color: 'white' }}>
                                <CloseRounded />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: '80%', marginInline: 'auto', marginBlock: 15 }}>
                    <BusquedaYResultado records={displayData} setRecords={setDisplayData} title={''} />
                    {displayData && <DataList data={displayData} handleChange={handleChange} dataProperty={dataProperty} dataSelected={data} dataPropertySecondary={dataPropertySecondary ? dataPropertySecondary : ''} dataPropertyAux={dataPropertyAux ? dataPropertyAux : ''} team={team ? team : false} />}
                </Box>
            </Dialog>
        </>
    )
}
type MyAny = any;
interface IData extends MyAny {
    id: number;
}
interface DataListProps {
    data: IData[];
    dataSelected: IData;
    handleChange: (data: any) => void;
    dataProperty: string;
    dataPropertySecondary?: string;
    dataPropertyAux?: string;
    team?: boolean;
}
interface DataItemProps {
    d: IData;
    dataSelected: IData;
    handleChange: (data: any) => void;
    dataProperty: string;
    dataPropertySecondary?: string;
    dataPropertyAux?: string;
    team?: boolean;
}
const DataList: FC<DataListProps> = ({ data, handleChange, dataProperty, dataPropertySecondary = '', dataPropertyAux = '', dataSelected, team = false }) => data.map((d: IData) => <DataItem key={d.id} d={d} handleChange={handleChange} dataProperty={dataProperty} dataSelected={dataSelected} dataPropertySecondary={dataPropertySecondary ? dataPropertySecondary : ""} dataPropertyAux={dataPropertyAux ? dataPropertyAux : ''} team={team} />);
const DataItem: FC<DataItemProps> = ({ d, handleChange, dataProperty, dataSelected, dataPropertySecondary = '', dataPropertyAux = '', team = false }) => {
    return (
        <Paper elevation={0} sx={{ border: '1px solid rgba(150,150,150,0.5)', p: 5, borderRadius: 5, mb: 2, display: 'flex', justifyContent: 'space-between' }} onClick={() => handleChange(d)}>
            {team ? (
                <TypographyCustom variant={'overline'}>{`${d.city[dataProperty]} - ${d.adviser[dataPropertySecondary]} ${d.adviser[dataPropertyAux]}`}</TypographyCustom>
            ) : (

                <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                    <TypographyCustom variant={'overline'}>{d[dataProperty]} {dataPropertyAux !== '' && d[dataPropertyAux]}</TypographyCustom>
                    {dataPropertySecondary !== '' && (<TypographyCustom variant={'subtitle2'}>{d[dataPropertySecondary]}</TypographyCustom>)}
                </Box>
            )}
            <Box>
                <IconButton onClick={() => handleChange(d)}>
                    {d?.id === dataSelected?.id ? <CheckCircleOutlineRounded color='success' /> : <RadioButtonUncheckedRoundedIcon />}
                </IconButton>
            </Box>
        </Paper>
    )
}