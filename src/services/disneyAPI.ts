import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Character, ApiResponse } from '../types';

const API_BASE_URL = 'https://api.disneyapi.dev';

class DisneyAPIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Obtener todos los personajes
   */
  async getAllCharacters(page: number = 1): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/character', {
        params: {
          pageSize: 50,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }

  /**
   * Buscar personaje por nombre
   */
  async searchCharacters(query: string): Promise<ApiResponse> {
    try {
      const response = await this.api.get('/character', {
        params: {
          name: query,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching characters:', error);
      throw error;
    }
  }

  /**
   * Obtener personaje por ID
   */
  async getCharacterById(id: number): Promise<Character> {
    try {
      const response = await this.api.get(`/character/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener personajes aleatorios
   */
  async getRandomCharacters(limit: number = 10): Promise<Character[]> {
    try {
      const response = await this.api.get('/character', {
        params: {
          pageSize: limit,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching random characters:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas generales
   */
  async getStatistics(): Promise<any> {
    try {
      const allCharacters = await this.getAllCharacters();
      const totalCharacters = allCharacters.info?.count || 0;

      // Calcular películas únicas
      const moviesSet = new Set<string>();
      allCharacters.data?.forEach((char) => {
        char.movies?.forEach((movie) => moviesSet.add(movie));
      });

      // Calcular series únicas
      const seriesSet = new Set<string>();
      allCharacters.data?.forEach((char) => {
        char.tvShows?.forEach((show) => seriesSet.add(show));
      });

      return {
        totalCharacters,
        totalMovies: moviesSet.size,
        totalSeries: seriesSet.size,
        totalAttractions: new Set(
          allCharacters.data?.flatMap((c) => c.parkAttractions || [])
        ).size,
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
}

export default new DisneyAPIService();
