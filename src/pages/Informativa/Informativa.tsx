import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import PublicIcon from '@mui/icons-material/Public';
import CastleIcon from '@mui/icons-material/Castle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AdsClickIcon from '@mui/icons-material/AdsClick';

const features = [
  {
    icon: <SearchIcon color="primary" fontSize="small" />,
    primary: 'Búsqueda y Filtrado',
    secondary: 'Busca personajes y filtra por múltiples criterios',
  },
  {
    icon: <FavoriteIcon color="error" fontSize="small" />,
    primary: 'Guarda Favoritos',
    secondary: 'Marca tus personajes favoritos y accede a ellos después',
  },
  {
    icon: <InfoIcon color="info" fontSize="small" />,
    primary: 'Información Detallada',
    secondary: 'Consulta películas, series y atracciones de cada personaje',
  },
  {
    icon: <PublicIcon color="success" fontSize="small" />,
    primary: 'Datos en Tiempo Real',
    secondary: 'Información obtenida de la API oficial de Disney',
  },
];

const howToUse = [
  { primary: 'Inicio', secondary: 'Explora el catálogo completo de personajes con búsqueda avanzada' },
  { primary: 'Favoritos', secondary: 'Accede a tus personajes guardados en una sola vista' },
  { primary: 'Datos Curiosos', secondary: 'Descubre estadísticas interesantes sobre Disney' },
  { primary: 'Usuario', secondary: 'Visualiza tu perfil y el historial de búsquedas' },
];

const InformativaPage: React.FC = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
        >
          Información
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Todo sobre esta aplicación
        </Typography>
      </Box>

      {/* About */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <CastleIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Sobre esta Aplicación
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Disney Mobile es una aplicación desarrollada para explorar y descubrir el fascinante mundo
            de los personajes de Disney. Accede a información detallada, guarda tus favoritos y
            disfruta de estadísticas interesantes sobre el universo Disney.
          </Typography>
        </CardContent>
      </Card>

      {/* Features */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Características
            </Typography>
          </Box>
          <List disablePadding>
            {features.map((f) => (
              <ListItem key={f.primary} disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>{f.icon}</ListItemIcon>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {f.primary}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {f.secondary}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {/* Data Source */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <MenuBookIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Fuente de Datos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Los datos de esta aplicación provienen de:
          </Typography>
          <Box sx={{ pl: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>API:</Box>{' '}
              <Box component="span" color="text.secondary">Disney API (https://api.disneyapi.dev)</Box>
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>Actualización:</Box>{' '}
              <Box component="span" color="text.secondary">Los datos se actualizan en tiempo real</Box>
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>Disponibilidad:</Box>{' '}
              <Box component="span" color="text.secondary">API pública y gratuita</Box>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AdsClickIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Cómo Usar
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {howToUse.map((item) => (
              <Box key={item.primary}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.primary}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.secondary}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Footer */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          textAlign: 'center',
          backgroundColor: 'action.hover',
          borderRadius: 3,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Desarrollada con React, TypeScript y Material-UI
        </Typography>
        <Typography variant="caption" color="text.secondary">
          © 2026 Disney Mobile · Todos los derechos reservados
        </Typography>
      </Box>
    </Box>
  );
};

export default InformativaPage;
