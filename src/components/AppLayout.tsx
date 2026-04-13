import React, { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  Paper,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import InicioPage from '../pages/Inicio';
import FavoritosPage from '../pages/Favoritos';
import OriginalPage from '../pages/Original';
import InformativaPage from '../pages/Informativa';
import UsuarioPage from '../pages/Usuario';

type PageType = 'inicio' | 'favoritos' | 'original' | 'informativa' | 'usuario';

const AppLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('inicio');
  const [bottomNavValue, setBottomNavValue] = useState(0);

  const handleNavChange = (_event: React.SyntheticEvent, newValue: number) => {
    setBottomNavValue(newValue);
    const pages: PageType[] = ['inicio', 'favoritos', 'original', 'informativa', 'usuario'];
    setCurrentPage(pages[newValue]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <InicioPage />;
      case 'favoritos':
        return <FavoritosPage />;
      case 'original':
        return <OriginalPage />;
      case 'informativa':
        return <InformativaPage />;
      case 'usuario':
        return <UsuarioPage />;
      default:
        return <InicioPage />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Contenido principal */}
      <Box sx={{ flex: 1, pb: 8, overflow: 'auto' }}>
        <Container maxWidth="sm" sx={{ py: 2 }}>
          {renderPage()}
        </Container>
      </Box>

      {/* Barra de navegación inferior */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={bottomNavValue} onChange={handleNavChange} showLabels>
          <BottomNavigationAction
            label="Inicio"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Favoritos"
            icon={<FavoriteBorderIcon />}
          />
          <BottomNavigationAction
            label="Original"
            icon={<EmojiEventsIcon />}
          />
          <BottomNavigationAction
            label="Informativa"
            icon={<InfoIcon />}
          />
          <BottomNavigationAction
            label="Usuario"
            icon={<AccountCircleIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default AppLayout;
