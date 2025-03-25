import { Box } from "@mui/material";
import { Layout } from "../../../components/ui/Layout";
import { DescripcionDeVista } from "../../../components/ui/content/DescripcionDeVista";
import { AlignItemsList } from "../../../components/ui/content/ListComponent";

const items = [
  { avatar: 'OR', title: 'Operaciones Orlando', text: 'Estadisticas de Orlando', path: '/stats/operations/orlando', color: '#ff379b' },
  { avatar: 'MI', title: 'Operaciones Miami', text: 'Estadisticas de Miami', path: '/stats/operations/miami', color: '#fba546' },
  { avatar: 'TX', title: 'Operaciones Texas', text: 'Estadisticas de Texas', path: '/stats/operations/texas', color: '#2492ff' },
  { avatar: 'CA', title: 'Operaciones California', text: 'Estadisticas de California', path: '/stats/operations/california', color: '#ffa7e0' },
];

export const Operations = () => {
  return (
    <Layout>
      <DescripcionDeVista title={"Operations"} description={"Elige uno de los sub-departamentos de Operations..."} />
      <Box sx={{ mb: 5 }}>
        <AlignItemsList items={items} />
      </Box>
    </Layout>
  )
}
