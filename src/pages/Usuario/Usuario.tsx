import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getInitials, formatDate } from '../../utils/helpers';

interface UserProfile {
  username: string;
  email: string;
}

const UsuarioPage: React.FC = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', {
    username: 'Usuario Disney',
    email: 'usuario@disney.com',
  });

  const [searchHistory] = useLocalStorage<Array<{ query: string; timestamp: number }>>(
    'searchHistory',
    []
  );

  const [favorites] = useLocalStorage<number[]>('favorites', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
  };

  const handleDeleteHistoryItem = (timestamp: number) => {
    console.log('Delete history item:', timestamp);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
        >
          Perfil de Usuario
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona tu información y preferencias
        </Typography>
      </Box>

      {/* Profile Card */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                mr: 2,
                bgcolor: 'primary.main',
                fontSize: '28px',
                fontWeight: 700,
              }}
            >
              {getInitials(userProfile.username)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {userProfile.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userProfile.email}
              </Typography>
              <Chip
                label={`${favorites.length} Favoritos`}
                size="small"
                color="error"
                variant="outlined"
                sx={{ mt: 0.75 }}
              />
            </Box>
          </Box>

          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nombre de Usuario"
                value={editedProfile.username}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, username: e.target.value })
                }
                fullWidth
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                label="Correo Electrónico"
                type="email"
                value={editedProfile.email}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, email: e.target.value })
                }
                fullWidth
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveProfile}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Guardar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(userProfile);
                  }}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Cancelar
                </Button>
              </Stack>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => setIsEditing(true)}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Editar Perfil
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BarChartIcon color="primary" fontSize="small" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Estadísticas
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                flex: 1,
                p: 1.5,
                backgroundColor: 'action.hover',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main', lineHeight: 1 }}>
                {favorites.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Favoritos Guardados
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 1.5,
                backgroundColor: 'action.hover',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                {searchHistory.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Búsquedas Realizadas
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Search History */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <HistoryIcon color="primary" fontSize="small" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Historial de Búsquedas
            </Typography>
          </Box>

          {searchHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay búsquedas recientes.
            </Typography>
          ) : (
            <List disablePadding>
              {searchHistory.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button
                      size="small"
                      onClick={() => handleDeleteHistoryItem(item.timestamp)}
                      sx={{ p: 0, minWidth: 'auto', color: 'text.disabled' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  }
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'action.hover' : 'transparent',
                    mb: 0.5,
                    borderRadius: 2,
                    px: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HistoryIcon fontSize="small" color="disabled" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.query}
                    secondary={formatDate(item.timestamp)}
                    slotProps={{
                      primary: { style: { fontWeight: 500, fontSize: '0.875rem' } },
                      secondary: { style: { fontSize: '0.75rem' } },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Info Footer */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: 'rgba(25, 118, 210, 0.06)',
          border: '1px solid',
          borderColor: 'primary.light',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <StorageIcon fontSize="small" color="primary" />
        <Typography variant="caption" color="text.secondary">
          Tu información se guarda localmente en tu dispositivo
        </Typography>
      </Box>
    </Box>
  );
};

export default UsuarioPage;
