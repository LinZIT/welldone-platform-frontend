import { Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableCell, TableBody, Box, IconButton, TableRow } from "@mui/material";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { TextFieldCustom, TypographyCustom } from "../../custom";
import { ModalSelector } from "./ModalSelector";
import AddRounded from "@mui/icons-material/AddRounded";
import { ChangeEvent, Dispatch, FC, useState } from "react";
import DeleteRounded from "@mui/icons-material/DeleteRounded";

export default function AccordionRoofAndWater() {
    const [roof, setRoof] = useState<any>([]);
    const [water, setWater] = useState<any>([]);
    console.log({ roof, water })
    return (
        <div>
            <AccordionElement title="roof" data={roof} setData={setRoof} />
            <AccordionElement title="water" data={water} setData={setWater} />
        </div>
    );
}
interface Props {
    title: string;
    data: any;
    setData: Dispatch<any>;
}
const AccordionElement: FC<Props> = ({ title, data, setData }) => {
    const [id, setId] = useState<number>(0);

    const agregarCampo = () => {
        const newField = { id: id + 1, [title]: '', client: {} };
        const newFields = data && data.length > 0 ? [...data, newField] : [newField];
        setData(newFields)
        setId(id + 1);
    }
    return <Accordion elevation={0} sx={{ borderRadius: 5 }}>
        <AccordionSummary
            expandIcon={<ExpandMoreRounded />}

        >
            <TypographyCustom>{title.charAt(0).toLocaleUpperCase() + title.substring(1)}</TypographyCustom>
            {/* {JSON.stringify(data)} */}
        </AccordionSummary>
        <AccordionDetails>
            <Box sx={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'center' }}>
                <TypographyCustom>Añadir otro claim</TypographyCustom>
                <IconButton onClick={agregarCampo}>
                    <AddRounded />
                </IconButton>
            </Box>
            <Table>
                <TableHead>
                    <TableCell>ID</TableCell>
                    <TableCell>Claim</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Actions</TableCell>
                </TableHead>
                <TableBody>
                    {data && data.map((d: any, i: number) => (
                        <DataSelector key={i} id={d.id} data={data} setData={setData} setId={setId} title={title} />
                    ))}
                </TableBody>
            </Table>
        </AccordionDetails>
    </Accordion>
}

interface DataSelectorProps {
    id: number;
    data: any;
    setData: Dispatch<any>;
    setId: Dispatch<any>;
    title: string;
}
const DataSelector: FC<DataSelectorProps> = ({ id, data, setData, setId, title }) => {
    const [selectedClient, setSelectedClient] = useState<any | null>(null)
    const [value, setValue] = useState<string>('')

    const changeClient = (param: any) => {
        const exclude = data.filter((d: any) => d.id !== id);
        const newData =
            data && data.length > 0
                ? [...exclude, { id, [title]: value, client: param }]
                : [{ id, [title]: value, client: param }]
        setData(newData.sort((a, b) => {
            return a.id - b.id || a.names.localeCompare(b.names)
        }))
    }
    const handleChange = () => {
        const exclude = data && data.filter((d: any) => d.id !== id);
        const newData = data && data.length > 0 ? [...exclude, { id, [title]: value, client: selectedClient }] : [{ id, [title]: value, client: selectedClient }];
        setData(newData.sort((a, b) => {
            return a.id - b.id || a.names.localeCompare(b.names)
        }));
    }
    const deleteField = () => {
        const newFields = data.filter((d: any) => d.id !== id).sort((a: any, b: any) => a > b);
        setData(newFields)
        setId(id > 0 ? id - 1 : 0);
    }

    return <TableRow>
        <TableCell>
            {id}
        </TableCell>
        <TableCell>
            <TextFieldCustom label='Claim' value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => { setValue(e.target.value) }} onKeyUp={handleChange} />
        </TableCell>
        <TableCell>
            <ModalSelector onChange={changeClient} title={"Cliente"} text={"Seleccionar cliente"} data={selectedClient} setData={setSelectedClient} url={`/client`} dataProperty={"names"} dataPropertyAux="surnames" dataPropertySecondary="email" />
        </TableCell>
        <TableCell>
            <IconButton onClick={deleteField}>
                <DeleteRounded />
            </IconButton>
        </TableCell>
    </TableRow>
}