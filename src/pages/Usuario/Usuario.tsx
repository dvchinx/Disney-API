import React, { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import StorageIcon from '@mui/icons-material/Storage';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getInitials } from '../../utils/helpers';

const UsuarioPage: React.FC = () => {
  const {
    profile,
    loading,
    authError,
    register,
    login,
    logout,
    removeSearchHistoryItem,
    clearSearchHistory,
    sendResetEmail,
    clearAuthError,
  } = useAuth();

  const [tab, setTab] = useState(0);
  const [registerForm, setRegisterForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const favoritesCount = profile?.favorites.length ?? 0;
  const searchHistory = profile?.searchHistory ?? [];

  const headerSubtitle = useMemo(
    () =>
      profile
        ? 'Gestiona tu cuenta, favoritos y búsquedas sincronizadas'
        : 'Crea tu cuenta o inicia sesión para guardar tus datos por usuario',
    [profile],
  );

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    clearAuthError();
    setLocalMessage(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setLocalMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register(registerForm.displayName, registerForm.email, registerForm.password);
      setRegisterForm({ displayName: '', email: '', password: '', confirmPassword: '' });
      setLocalMessage('Cuenta creada correctamente.');
    } catch {
      setLocalMessage('No se pudo crear la cuenta.');
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    clearAuthError();
    setLocalMessage(null);
    try {
      await login(loginForm.email, loginForm.password);
      setLoginForm({ email: '', password: '' });
    } catch {
      setLocalMessage('No se pudo iniciar sesión.');
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) return;
    clearAuthError();
    try {
      await sendResetEmail(resetEmail);
      setLocalMessage('Se envió un correo para restablecer la contraseña.');
    } catch {
      setLocalMessage('No se pudo enviar el correo de recuperación.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setLocalMessage('No se pudo cerrar sesión.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Typography variant="body2" color="text.secondary">
          Cargando usuario...
        </Typography>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Usuario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {headerSubtitle}
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab icon={<PersonAddIcon />} iconPosition="start" label="Registro" />
              <Tab icon={<LoginIcon />} iconPosition="start" label="Login" />
            </Tabs>

            {(authError || localMessage) && (
              <Alert
                severity={authError ? 'error' : 'info'}
                sx={{ mb: 2, borderRadius: 2 }}
                onClose={authError ? clearAuthError : undefined}
              >
                {authError || localMessage}
              </Alert>
            )}

            {tab === 0 ? (
              <Box component="form" onSubmit={handleRegister} sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Nombre"
                  value={registerForm.displayName}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, displayName: e.target.value });
                    setLocalMessage(null);
                  }}
                  required
                  fullWidth
                />
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, email: e.target.value });
                    setLocalMessage(null);
                  }}
                  required
                  fullWidth
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, password: e.target.value });
                    setLocalMessage(null);
                  }}
                  required
                  fullWidth
                />
                <TextField
                  label="Confirmar contraseña"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                    setLocalMessage(null);
                  }}
                  required
                  fullWidth
                />
                <Button type="submit" variant="contained" startIcon={<PersonIcon />} sx={{ borderRadius: 2 }}>
                  Crear cuenta
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleLogin} sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, email: e.target.value });
                    setLocalMessage(null);
                  }}
                  required
                  fullWidth
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, password: e.target.value });
                    setLocalMessage(null);
                  }}
                  required
                  fullWidth
                />
                <Button type="submit" variant="contained" startIcon={<LockIcon />} sx={{ borderRadius: 2 }}>
                  Iniciar sesión
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Recuperar contraseña
              </Typography>
              <TextField
                label="Correo para recuperación"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                fullWidth
                size="small"
              />
              <Button variant="outlined" onClick={handlePasswordReset} sx={{ borderRadius: 2 }}>
                Enviar enlace
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
          Perfil de Usuario
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {headerSubtitle}
        </Typography>
      </Box>

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
              {getInitials(profile.displayName)}
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {profile.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                <Chip label={`${favoritesCount} favoritos`} size="small" color="error" variant="outlined" />
                <Chip label={`${searchHistory.length} búsquedas`} size="small" color="primary" variant="outlined" />
              </Stack>
            </Box>
          </Box>

          <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} fullWidth sx={{ borderRadius: 2 }}>
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BarChartIcon color="primary" fontSize="small" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Estadísticas
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1, p: 1.5, backgroundColor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main', lineHeight: 1 }}>
                {favoritesCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Favoritos guardados
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 1.5, backgroundColor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                {searchHistory.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Búsquedas realizadas
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon color="primary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Historial de búsquedas
              </Typography>
            </Box>
            {searchHistory.length > 0 && (
              <Button size="small" onClick={clearSearchHistory} sx={{ borderRadius: 2 }}>
                Limpiar todo
              </Button>
            )}
          </Box>

          {searchHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay búsquedas guardadas para este usuario.
            </Typography>
          ) : (
            <List disablePadding>
              {searchHistory.map((item, index) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <Button
                      size="small"
                      onClick={() => removeSearchHistoryItem(item.id)}
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
          Tus favoritos y búsquedas se guardan en Firebase por cada usuario.
        </Typography>
      </Box>
    </Box>
  );
};

export default UsuarioPage;
