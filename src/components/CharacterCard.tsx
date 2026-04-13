import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { DisneyCharacter } from '../types';

interface CharacterCardProps {
  character: DisneyCharacter;
  onFavoriteToggle: (id: number) => void;
  onViewDetails?: (character: DisneyCharacter) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onFavoriteToggle,
  onViewDetails,
}) => {
  const movieCount = character.movies?.length || 0;
  const tvShowCount = character.tvShows?.length || 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Imagen del personaje */}
      <CardMedia
        component="img"
        height="250"
        image={character.imageUrl || 'https://placehold.co/300x250?text=Disney'}
        alt={character.name}
        sx={{
          objectFit: 'cover',
        }}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          const fallback = 'https://placehold.co/300x250?text=Disney';
          if (img.src !== fallback) {
            img.src = fallback;
          }
        }}
      />

      {/* Contenido de la tarjeta */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {character.name}
        </Typography>

        {/* Información de películas y series */}
        {(movieCount > 0 || tvShowCount > 0) && (
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {movieCount > 0 && (
              <Chip label={`${movieCount} películas`} size="small" variant="outlined" />
            )}
            {tvShowCount > 0 && (
              <Chip label={`${tvShowCount} series`} size="small" variant="outlined" />
            )}
          </Stack>
        )}

        {/* Descripción (si existe en los datos) */}
        <Typography variant="body2" color="textSecondary">
          {character.allies && character.allies.length > 0
            ? `Aliados: ${character.allies.length}`
            : 'Personaje de Disney'}
        </Typography>
      </CardContent>

      {/* Acciones */}
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          size="small"
          startIcon={character.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={() => onFavoriteToggle(character._id)}
          color={character.isFavorite ? 'error' : 'inherit'}
        >
          {character.isFavorite ? 'Favorito' : 'Agregar'}
        </Button>
        <Button
          size="small"
          onClick={() => onViewDetails?.(character)}
          color="primary"
        >
          Detalles
        </Button>
      </CardActions>
    </Card>
  );
};

export default CharacterCard;
