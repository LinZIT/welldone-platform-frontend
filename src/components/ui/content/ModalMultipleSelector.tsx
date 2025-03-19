import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import YoutubeSearchedForRounded from "@mui/icons-material/YoutubeSearchedForRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";

import { Box, IconButton, Dialog, AppBar, Toolbar, Paper, Button } from "@mui/material";
import { Dispatch, FC, useState, useEffect } from "react";
import { TypographyCustom } from "../../custom";
import { CheckBoxOutlineBlankRounded, CheckBoxRounded } from "@mui/icons-material";
import { toast } from "react-toastify";
import { IResponse } from "../../../interfaces/response-type";
import { request } from "../../../common/request";
import { errorArrayLaravelTransformToString } from "../../../lib/functions";
import { Loading } from "./Loading";
import { BusquedaYResultado } from "./BusquedaYResultado";

interface Props {
    title: string;
    text?: string;
    limit?: number;
    data: any;
    setData: Dispatch<any>;
    url: string;
    dataProperty: string;
    dataPropertySecondary?: string;
    dataPropertyAux?: string;
    onChange?: any;
}
export const ModalMultipleSelector: FC<Props> = ({ title, text = "Seleccionar", limit = 10, data, setData, url, dataProperty, dataPropertySecondary = '', dataPropertyAux = '', onChange = () => { } }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [displayData, setDisplayData] = useState<IData[] | null>(null);
    const identifier = `modal-multiple-selector-${title.replace(' ', '').toLowerCase()}`
    const toggleOpen = () => {
        setOpen(!open);
    }
    const handleChange = (d: any) => {
        const exists = data.length > 0 && data.filter((arr: any) => arr.id === d.id);
        if (exists && exists.length > 0) {
            const newData = data.filter((arr: any) => arr.id !== d.id);

            setData(newData);
            onChange(newData);
        } else {
            if (data.length === limit) {
                toast.warning(`Has superado el limite de selecciones (${limit})`)
            } else {
                setData([...data, d]);
                onChange([...data, d]);
            }
        }
    }
    const getData = async () => {
        const { status, response, err }: IResponse = await request(url, 'GET');
        switch (status) {
            case 200:
                const { data } = await response.json();
                setOpen(false);
                setDisplayData(data);
                break;
            case 400:
                const { errors } = await response.json();
                setOpen(false);
                toast.error(errorArrayLaravelTransformToString(errors));
                break;
            default:
                toast.error(errorArrayLaravelTransformToString(errors));
                break;
        }
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);
    // Si se estan buscando registros en la API se muestra un loader
    if (loading) return (<Loading />)

    return (
        <>
            <Box>
                <TypographyCustom fontmode={2} variant={'subtitle2'} color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    {data.length === 0
                        ? title
                        : (<>{`Seleccionado: ${data.length} ${data.length > 1 ? 'elementos' : 'elemento'}`} {<CheckCircleOutlineRounded color="success" />}</>)}
                </TypographyCustom>
                <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center' }}>
                    <TypographyCustom variant="subtitle2">{text}</TypographyCustom>
                    <IconButton onClick={() => toggleOpen()}>
                        {data.length === 0 ? <OpenInNewRounded /> : <YoutubeSearchedForRounded />}
                    </IconButton>
                    {data.length > 0 && (<IconButton onClick={() => setData([])}>
                        <CloseRounded />
                    </IconButton>)}
                </Box>
            </Box>
            <Dialog fullScreen open={open} id={identifier}>
                <AppBar sx={{ width: '100%', background: '#191919' }}>
                    <Toolbar sx={{ background: '#191919' }}>
                        <TypographyCustom>{title}</TypographyCustom>
                        <Box sx={{ width: '90%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {data && <Button size="small" onClick={() => toggleOpen()} sx={{ textTransform: 'none', p: 1 }} variant="contained" >Guardar Cambios</Button>}
                            <IconButton onClick={() => {
                                setData([]);
                                toggleOpen();
                            }} sx={{ color: 'white' }}>
                                <CloseRounded />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{ width: '80%', marginInline: 'auto', marginBlock: 15 }}>
                    <BusquedaYResultado records={displayData} setRecords={setDisplayData} title={''} />
                    {displayData && <DataList data={displayData} handleChange={handleChange} dataProperty={dataProperty} dataSelected={data} dataPropertySecondary={dataPropertySecondary ? dataPropertySecondary : ''} dataPropertyAux={dataPropertyAux ? dataPropertyAux : ''} />}
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
}
interface DataItemProps {
    d: IData;
    dataSelected: IData;
    handleChange: (data: any) => void;
    dataProperty: string;
    dataPropertySecondary?: string;
    dataPropertyAux?: string;
}
const DataList: FC<DataListProps> = ({ data, handleChange, dataProperty, dataPropertySecondary = '', dataPropertyAux = '', dataSelected }) => data.map((d: IData) => <DataItem key={d.id} d={d} handleChange={handleChange} dataProperty={dataProperty} dataSelected={dataSelected} dataPropertySecondary={dataPropertySecondary ? dataPropertySecondary : ""} dataPropertyAux={dataPropertyAux ? dataPropertyAux : ''} />);
const DataItem: FC<DataItemProps> = ({ d, handleChange, dataProperty, dataSelected, dataPropertySecondary = '', dataPropertyAux = '' }) => {
    return (
        <Paper elevation={0} sx={{ border: '1px solid rgba(150,150,150,0.5)', p: 5, borderRadius: 5, mb: 2, display: 'flex', justifyContent: 'space-between' }} onClick={() => handleChange(d)}>
            <Box sx={{ display: 'flex', flexFlow: 'column wrap' }}>
                <TypographyCustom variant={'overline'}>{d[dataProperty]} {dataPropertyAux !== '' && d[dataPropertyAux]}</TypographyCustom>
                {dataPropertySecondary !== '' && (<TypographyCustom variant={'subtitle2'}>{d[dataPropertySecondary]}</TypographyCustom>)}
            </Box>
            <Box>
                <IconButton onClick={() => handleChange(d)}>
                    {dataSelected.find((da: any) => da?.id === d?.id) ? <CheckBoxRounded color='success' /> : <CheckBoxOutlineBlankRounded />}
                </IconButton>
            </Box>
        </Paper>
    )
}