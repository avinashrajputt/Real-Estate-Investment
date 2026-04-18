import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchGrowthScores,
  fetchTrendAnalysis,
  fetchDashboardMetrics,
  fetchAllZones,
  fetchListings,
  fetchMunicipalDeclarations,
  fetchRentalAbsorption,
  fetchPricingVelocity,
} from '../services/dataService.js';

/**
 * Fetch growth velocity scores for all zones
 * @param {Object} options - Query options
 * @returns {Object} Growth scores data with loading/error states
 */
export const useGrowthScores = (options = {}) => {
  return useQuery({
    queryKey: ['growthScores', options],
    queryFn: () => fetchGrowthScores(options),
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    ...options,
  });
};

/**
 * Fetch trend analysis data
 * @param {Object} filters - Filter options
 * @returns {Object} Trend analysis data
 */
export const useTrendAnalysis = (filters = {}) => {
  return useQuery({
    queryKey: ['trendAnalysis', filters],
    queryFn: () => fetchTrendAnalysis(filters),
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
};

/**
 * Fetch dashboard metrics/KPIs
 * @returns {Object} Dashboard metrics
 */
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 2,
  });
};

/**
 * Fetch all available zones
 * @returns {Object} Zones list
 */
export const useZones = () => {
  return useQuery({
    queryKey: ['zones'],
    queryFn: fetchAllZones,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};

/**
 * Fetch real estate listings with filters
 * @param {Object} filters - Filter options
 * @returns {Object} Listings data
 */
export const useListings = (filters = {}) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
    enabled: !!Object.keys(filters).length, // Only fetch if filters provided
    staleTime: 1000 * 60 * 20,
    retry: 2,
  });
};

/**
 * Fetch municipal declarations for a zone
 * @param {string} zone - Zone identifier
 * @returns {Object} Municipal declarations
 */
export const useMunicipalDeclarations = (zone) => {
  return useQuery({
    queryKey: ['municipalDeclarations', zone],
    queryFn: () => fetchMunicipalDeclarations(zone),
    enabled: !!zone,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};

/**
 * Fetch rental absorption data
 * @param {string} zone - Zone identifier
 * @returns {Object} Rental absorption data
 */
export const useRentalAbsorption = (zone) => {
  return useQuery({
    queryKey: ['rentalAbsorption', zone],
    queryFn: () => fetchRentalAbsorption(zone),
    enabled: !!zone,
    staleTime: 1000 * 60 * 45,
    retry: 2,
  });
};

/**
 * Fetch pricing velocity for a zone
 * @param {string} zone - Zone identifier
 * @returns {Object} Pricing velocity data
 */
export const usePricingVelocity = (zone) => {
  return useQuery({
    queryKey: ['pricingVelocity', zone],
    queryFn: () => fetchPricingVelocity(zone),
    enabled: !!zone,
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
};

/**
 * Combine multiple zone-specific data queries
 * @param {string} zone - Zone identifier
 * @returns {Object} Combined zone data
 */
export const useZoneAnalytics = (zone) => {
  const declarations = useMunicipalDeclarations(zone);
  const rental = useRentalAbsorption(zone);
  const pricing = usePricingVelocity(zone);

  return {
    declarations: declarations.data || [],
    rental: rental.data || [],
    pricing: pricing.data || [],
    isLoading: declarations.isLoading || rental.isLoading || pricing.isLoading,
    isError: declarations.isError || rental.isError || pricing.isError,
    error: declarations.error || rental.error || pricing.error,
  };
};

/**
 * Use geolocation data
 * @returns {Object} Current location and position
 */
export const useGeolocation = () => {
  const [location, setLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { location, loading, error };
};

/**
 * Store and retrieve selected zones from localStorage
 * @returns {Object} Favorites management
 */
export const useFavoriteZones = () => {
  const [favorites, setFavorites] = React.useState(() => {
    const saved = localStorage.getItem('favoriteZones');
    return saved ? JSON.parse(saved) : [];
  });

  const addFavorite = React.useCallback(
    (zone) => {
      setFavorites((prev) => {
        if (!prev.find((z) => z.id === zone.id)) {
          const updated = [...prev, zone];
          localStorage.setItem('favoriteZones', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    },
    []
  );

  const removeFavorite = React.useCallback(
    (zoneId) => {
      setFavorites((prev) => {
        const updated = prev.filter((z) => z.id !== zoneId);
        localStorage.setItem('favoriteZones', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const isFavorite = React.useCallback(
    (zoneId) => favorites.some((z) => z.id === zoneId),
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};
