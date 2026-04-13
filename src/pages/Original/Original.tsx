import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Skeleton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import AttractionsIcon from '@mui/icons-material/Attractions';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import disneyAPI from '../../services/disneyAPI';

interface Statistics {
  totalCharacters: number;
  totalMovies: number;
  totalSeries: number;
  totalAttractions: number;
}

const statCards = [
  {
    key: 'totalCharacters' as keyof Statistics,
    label: 'Personajes',
    caption: 'Personajes en la API',
    icon: <PeopleIcon sx={{ fontSize: 32, opacity: 0.85 }} />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    key: 'totalMovies' as keyof Statistics,
    label: 'Películas',
    caption: 'Películas únicas',
    icon: <MovieIcon sx={{ fontSize: 32, opacity: 0.85 }} />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    key: 'totalSeries' as keyof Statistics,
    label: 'Series',
    caption: 'Series de TV únicas',
    icon: <TvIcon sx={{ fontSize: 32, opacity: 0.85 }} />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    key: 'totalAttractions' as keyof Statistics,
    label: 'Atracciones',
    caption: 'Atracciones en parques',
    icon: <AttractionsIcon sx={{ fontSize: 32, opacity: 0.85 }} />,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
];

const facts = [
  'Disney tiene uno de los catálogos de personajes más grandes del mundo.',
  'Algunos personajes aparecen en múltiples películas y series.',
  'Muchos personajes tienen sus propias atracciones en los parques temáticos.',
  'La API de Disney proporciona información de miles de personajes.',
];

const OriginalPage: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await disneyAPI.getStatistics();
      setStatistics(stats as Statistics);
    } catch (err) {
      setError('Error al cargar las estadísticas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <EmojiEventsIcon color="primary" />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Datos Curiosos
          </Typography>
        </Box>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
        >
          Datos Curiosos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Conoce datos interesantes sobre el universo de Disney
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6 }}>
                <Skeleton variant="rectangular" height={130} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : statCards.map((card) => (
              <Grid key={card.key} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    background: card.gradient,
                    color: 'white',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ opacity: 0.9 }}>{card.icon}</Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                        {statistics?.[card.key]?.toLocaleString() ?? 0}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.85 }}>
                        {card.caption}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Sabías que... */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LightbulbIcon color="warning" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Sabías que...
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {facts.map((fact, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <FiberManualRecordIcon sx={{ fontSize: 8, mt: 0.8, color: 'text.disabled', flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  {fact}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OriginalPage;
