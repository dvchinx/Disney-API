import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import type { DisneyCharacter } from '../../types';
import CharacterCard from '../../components/CharacterCard';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import disneyAPI from '../../services/disneyAPI';

const FavoritosPage: React.FC = () => {
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', []);
  const [favoriteCharacters, setFavoriteCharacters] = useState<DisneyCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<DisneyCharacter | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, [favorites]);

  const loadFavorites = async () => {
    if (favorites.length === 0) {
      setFavoriteCharacters([]);
      return;
    }

    setLoading(true);
    try {
      const characters: DisneyCharacter[] = [];
      for (const id of favorites) {
        try {
          const character = await disneyAPI.getCharacterById(id);
          characters.push({ ...character, isFavorite: true });
        } catch (err) {
          console.error(`Error loading character ${id}:`, err);
        }
      }
      setFavoriteCharacters(characters);
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (characterId: number) => {
    const newFavorites = favorites.filter((id) => id !== characterId);
    setFavorites(newFavorites);
    if (selectedCharacter?._id === characterId) {
      setOpenDialog(false);
      setSelectedCharacter(null);
    }
  };

  const handleViewDetails = (character: DisneyCharacter) => {
    setSelectedCharacter(character);
    setOpenDialog(true);
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
          Favoritos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tus personajes Disney guardados
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No tienes personajes favoritos aún. Agrega alguno desde la sección de Inicio.
        </Alert>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            {favorites.length} personaje{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
          </Typography>

          {loading ? (
            <Typography color="text.secondary">Cargando...</Typography>
          ) : (
            <Grid container spacing={2}>
              {favoriteCharacters.map((character) => (
                <Grid key={character._id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <CharacterCard
                    character={character}
                    onFavoriteToggle={handleFavoriteToggle}
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
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

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Películas ({selectedCharacter.movies?.length || 0})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedCharacter.movies?.slice(0, 5).join(', ') || 'Sin información'}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
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
                color="error"
                onClick={() => handleFavoriteToggle(selectedCharacter._id)}
                sx={{ borderRadius: 2 }}
              >
                Eliminar de Favoritos
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default FavoritosPage;
