import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  CircularProgress,
  Box,
  Typography,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import disneyAPI from '../../services/disneyAPI';
import type { DisneyCharacter } from '../../types';
import CharacterCard from '../../components/CharacterCard';
import { useAuth } from '../../context/AuthContext';

const InicioPage: React.FC = () => {
  const [characters, setCharacters] = useState<DisneyCharacter[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<DisneyCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<DisneyCharacter | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { profile, recordSearch, toggleFavorite, loading: authLoading } = useAuth();

  const favorites = profile?.favorites ?? [];

  const itemsPerPage = 12;

  useEffect(() => {
    loadCharacters(1);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      recordSearch(searchQuery);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [recordSearch, searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = characters.filter((char) =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCharacters(filtered);
      setCurrentPage(1);
    } else {
      setFilteredCharacters(characters);
      setCurrentPage(1);
    }
  }, [searchQuery, characters]);

  const loadCharacters = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await disneyAPI.getAllCharacters(page);
      setCharacters(response.data);
      setFilteredCharacters(response.data);
    } catch (err) {
      setError('Error al cargar los personajes. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFavoriteToggle = async (characterId: number) => {
    await toggleFavorite(characterId);
  };

  const handleViewDetails = (character: DisneyCharacter) => {
    setSelectedCharacter(character);
    setOpenDialog(true);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
  const charactersWithState = filteredCharacters.map((character) => ({
    ...character,
    isFavorite: favorites.includes(character._id),
  }));
  const paginatedCharacters = charactersWithState.slice(startIndex, endIndex);
  const selectedCharacterIsFavorite = selectedCharacter
    ? favorites.includes(selectedCharacter._id)
    : false;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
        >
          Inicio
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Explora el universo de personajes Disney
        </Typography>
      </Box>

      {/* Search bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar personajes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
            },
          }}
        />
      </Box>

      {!authLoading && !profile && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          Inicia sesión en la sección Usuario para guardar favoritos y búsquedas por cuenta.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <>
          {filteredCharacters.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No se encontraron personajes que coincidan con tu búsqueda.
            </Alert>
          ) : (
            <>
              {searchQuery && (
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  {filteredCharacters.length} resultado{filteredCharacters.length !== 1 ? 's' : ''} para "{searchQuery}"
                </Typography>
              )}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {paginatedCharacters.map((character) => (
                  <Grid key={character._id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <CharacterCard
                      character={character}
                      onFavoriteToggle={handleFavoriteToggle}
                      onViewDetails={handleViewDetails}
                    />
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}

      {/* Dialog de detalles */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        {selectedCharacter && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              {selectedCharacter.name}
            </DialogTitle>
            <DialogContent>
              <Box
                component="img"
                src={selectedCharacter.imageUrl || 'https://placehold.co/400x300?text=Disney'}
                alt={selectedCharacter.name}
                sx={{
                  width: '100%',
                  maxHeight: '320px',
                  objectFit: 'cover',
                  mb: 2,
                  borderRadius: 2,
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  const fallback = 'https://placehold.co/400x300?text=Disney';
                  if (img.src !== fallback) img.src = fallback;
                }}
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {(selectedCharacter.movies?.length ?? 0) > 0 && (
                  <Chip
                    icon={<MovieIcon />}
                    label={`${selectedCharacter.movies?.length} películas`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                )}
                {(selectedCharacter.tvShows?.length ?? 0) > 0 && (
                  <Chip
                    icon={<TvIcon />}
                    label={`${selectedCharacter.tvShows?.length} series`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                Películas ({selectedCharacter.movies?.length || 0})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedCharacter.movies?.slice(0, 5).join(', ') || 'Sin información'}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                Series ({selectedCharacter.tvShows?.length || 0})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCharacter.tvShows?.slice(0, 5).join(', ') || 'Sin información'}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
                Cerrar
              </Button>
              <Button
                variant="contained"
                color={selectedCharacterIsFavorite ? 'error' : 'primary'}
                onClick={async () => {
                  await handleFavoriteToggle(selectedCharacter._id);
                  setOpenDialog(false);
                }}
                sx={{ borderRadius: 2 }}
              >
                {selectedCharacterIsFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default InicioPage;
