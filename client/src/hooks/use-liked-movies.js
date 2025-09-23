import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchData } from '../utils/fetchData';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchLikedMovies = async (user) => {
  if (!user) return [];
  const response = await fetchData(`${import.meta.env.VITE_BASE_API_URL}api/likes`);
  if (response.success) {
    return response.data.map((like) => ({
      id: like.tmdb_id,
      movie_id: like.movie_id,
      title: like.title,
      poster_path: like.poster_path,
      vote_average: like.vote_average,
    }));
  }
  throw new Error(response.message || "Failed to fetch liked movies");
};

const useLikedMovies = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: likedMovies = [], isLoading: loading, error } = useQuery({
    queryKey: ['likedMovies', user?.uid],
    queryFn: () => fetchLikedMovies(user),
    enabled: !!user,
  });

  const refetchLikedMovies = () => {
    queryClient.invalidateQueries(['likedMovies']);
  };

  return { likedMovies, loading, error, refetchLikedMovies };
};

export default useLikedMovies;