import { Dispatch, useState } from "react";
import SearchRounded from "@mui/icons-material/SearchRounded";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { TextFieldWithIconCustom, TypographyCustom } from "../../custom";
import { toast } from "react-toastify";
import { Loading } from "./Loading";
import { NoContentFound } from "./NoContentFound";
import { ucfirst } from "../../../lib/functions";

interface Props {
    records: any;
    setRecords: Dispatch<any>;
    title: string;
    subdata?: string;
}
export const BusquedaYResultado = (props: Props) => {
    const [search, setSearch] = useState<string>('');
    const [originalValues] = useState<any[]>(props.records);

    function buscarObjeto(objetos: any[], busqueda: string) {
        return objetos.filter((objeto: any) => {
            let outofloop = false;
            for (let key in objeto) {
                if (typeof objeto[key] === 'string') {
                    if (
                        typeof objeto[key] === 'string' &&
                        (objeto[key].includes(String(busqueda)) || objeto[key].includes(String(busqueda).toLowerCase()) || objeto[key].includes(ucfirst(String(busqueda).toLowerCase())) || objeto[key].includes(String(busqueda).toUpperCase()))
                    ) {
                        return true;
                    }
                } else if (typeof objeto[key] === 'object') {

                    const objetoRecorrido = objeto[key];
                    if (objetoRecorrido) {
                        const keys = Object.keys(objetoRecorrido);
                        keys.forEach(element => {
                            if (!!objetoRecorrido[element] && (String(objetoRecorrido[element]).toLowerCase().includes(String(busqueda).toLowerCase()))) {
                                outofloop = true;
                                return true;
                            }
                        });
                    }
                }
            }
            if (outofloop) return true;
            return false;
        });
    }
    // const handleSubmit2 = (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (!search) return;
    //     const result: any[] = buscarObjeto(originalValues.[props.subdata ? props.subdata : '0'], search);
    //     if (result.length > 0) {
    //         setSearch('');
    //         props.setRecords(result);
    //     } else {
    //         Swal.fire({
    //             title: 'Oops...',
    //             text: 'No se encontraron resultados',
    //             icon: 'warning',
    //             timer: 2000,
    //             timerProgressBar: true,
    //             showConfirmButton: false,
    //         });
    //     }
    // };
    const handleSubmit = () => {
        // e.preventDefault();
        if (!search) return;
        const result: any[] = buscarObjeto(originalValues, search);
        if (result.length > 0) {
            setSearch('');
            props.setRecords(result);
        } else {
            toast.error('No se encontraron resultados')
        }
    };

    const handleReset = () => {
        setSearch('');
        props.setRecords(originalValues);
    };
    const rand = Math.random();
    return (
        <>
            {props.records === 'loading' && <Loading />}
            {props.records !== 'loading' && props.records && (
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexFlow: 'column wrap',
                        width: '100%',
                    }}
                >
                    <TypographyCustom variant='subtitle2'>Para realizar tu busqueda haz click en la lupa, el ENTER esta deshabilitado</TypographyCustom>
                    {/* <form onSubmit={(e) => handleSubmit(e)} style={{ width: '100%' }} id={`busqueda-${props.title}-${rand}`}> */}
                    <TextFieldWithIconCustom
                        label={`Filtrar ${props.title}`}
                        value={search}
                        focused
                        variant='outlined'
                        InputProps={{
                            startAdornment: (
                                <IconButton onClick={handleReset}>
                                    <RestartAltRounded />
                                </IconButton>
                            ),
                            endAdornment: (
                                <IconButton onClick={() => handleSubmit()}>
                                    <SearchRounded sx={{ color: 'rgba(100,100,100)' }} />
                                </IconButton>
                            ),
                        }}
                        onChange={(e) => setSearch(e.target.value)}
                    ></TextFieldWithIconCustom>
                    {/* </form> */}
                    {!props.records && (
                        <NoContentFound
                            title="No se encontraron pagos"
                            text="No hay pagos a tu nombre hasta el momento..."
                        />
                    )}
                </Box>
            )}
        </>
    );
}