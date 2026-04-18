/**
 * Calculate normalized score for a metric
 * @param {number} value - Current metric value
 * @param {number} min - Minimum expected value
 * @param {number} max - Maximum expected value
 * @param {boolean} inverse - If true, higher values = lower score
 * @returns {number} Normalized score 0-100
 */
const normalizeScore = (value, min, max, inverse = false) => {
  if (value <= min) return inverse ? 100 : 0;
  if (value >= max) return inverse ? 0 : 100;

  const normalized = (value - min) / (max - min) * 100;
  return inverse ? 100 - normalized : normalized;
};

/**
 * Calculate municipal impact score based on infrastructure projects
 * @param {Array} municipalProjects - Array of municipal projects in the zone
 * @param {number} investmentAmount - Total investment amount
 * @returns {number} Score 0-100
 */
export const calculateMunicipalScore = (municipalProjects = [], investmentAmount = 0) => {
  if (!municipalProjects || municipalProjects.length === 0) return 0;

  // Weight various factors
  const projectCount = municipalProjects.length;
  const projectCountScore = normalizeScore(projectCount, 0, 10, false);

  // Investment score (more investment = higher score)
  const investmentScore = normalizeScore(investmentAmount, 0, 1000, false);

  // Project status weight (completed projects = 20%, under construction = 40%, tender = 20%, planned = 20%)
  const statusWeights = {
    COMPLETED: 0.2,
    UNDER_CONSTRUCTION: 0.4,
    TENDER: 0.2,
    PLANNED: 0.2,
  };

  let statusScore = 0;
  municipalProjects.forEach((project) => {
    const weight = statusWeights[project.status] || 0;
    statusScore += weight * 20;
  });

  // Category bonus (metro = 30 points, road = 20, sewage = 15, zoning = 10)
  const categoryWeights = {
    METRO: 30,
    ROAD: 20,
    SEWAGE: 15,
    ZONING_CHANGE: 10,
  };

  let categoryScore = 0;
  municipalProjects.forEach((project) => {
    categoryScore += categoryWeights[project.category] || 5;
  });

  categoryScore = Math.min(categoryScore, 100); // Cap at 100

  // Combine scores with weights
  const finalScore =
    projectCountScore * 0.3 +
    investmentScore * 0.3 +
    statusScore * 0.2 +
    categoryScore * 0.2;

  return Math.min(Math.max(finalScore, 0), 100);
};

/**
 * Calculate market activity score
 * @param {Object} marketData - Market sentiment and listing data
 * @returns {number} Score 0-100
 */
export const calculateMarketScore = (marketData = {}) => {
  const {
    listingDensity = 0,
    searchVolume = 0,
    inquiryCount = 0,
    priceApprecia = 0,
    vacancyRate = 50,
  } = marketData;

  // Listing density score (more listings = more activity)
  const densityScore = normalizeScore(listingDensity, 0, 1000, false);

  // Search volume score
  const searchScore = normalizeScore(searchVolume, 0, 10000, false);

  // Inquiry count score
  const inquiryScore = normalizeScore(inquiryCount, 0, 5000, false);

  // Vacancy rate (lower = better, more demand)
  const vacancyScore = normalizeScore(vacancyRate, 0, 100, true);

  // Combine with weights
  const finalScore =
    densityScore * 0.25 +
    searchScore * 0.35 +
    inquiryScore * 0.2 +
    vacancyScore * 0.2;

  return Math.min(Math.max(finalScore, 0), 100);
};

/**
 * Calculate pricing velocity score
 * @param {Object} pricingData - Pricing velocity metrics
 * @returns {number} Score 0-100
 */
export const calculatePricingVelocityScore = (pricingData = {}) => {
  const {
    priceChangePercentage = 0,
    volumeSold = 0,
    daysToSell = 180,
    rentYield = 0,
    rentToSaleRatio = 0.05,
  } = pricingData;

  // Price appreciation score (yearly appreciation 5-20% is ideal)
  const appreciationScore = normalizeScore(priceChangePercentage, 0, 20, false);

  // Sales volume score (higher = market strength)
  const volumeScore = normalizeScore(volumeSold, 0, 500, false);

  // Days to sell (lower = better market)
  const daysScore = normalizeScore(daysToSell, 0, 365, true);

  // Rental yield score (4-8% is ideal)
  const yieldScore = normalizeScore(rentYield, 2, 10, false);

  // Rent to sale ratio (higher indicates rental demand)
  const ratioScore = normalizeScore(rentToSaleRatio, 0.03, 0.10, false);

  const finalScore =
    appreciationScore * 0.3 +
    volumeScore * 0.25 +
    daysScore * 0.2 +
    yieldScore * 0.15 +
    ratioScore * 0.1;

  return Math.min(Math.max(finalScore, 0), 100);
};

/**
 * Calculate composite growth velocity score
 * @param {Object} allMetrics - Object containing all metric types
 * @param {Object} weights - Weight distribution for different metrics
 * @returns {Object} Complete growth score object
 */
export const calculateGrowthVelocityScore = (
  allMetrics = {},
  weights = {}
) => {
  const defaultWeights = {
    municipal: 0.35,
    market: 0.35,
    pricing: 0.3,
  };

  const finalWeights = { ...defaultWeights, ...weights };

  const {
    municipalProjects = [],
    municipalInvestment = 0,
    marketData = {},
    pricingData = {},
  } = allMetrics;

  // Calculate individual scores
  const municipalScore = calculateMunicipalScore(municipalProjects, municipalInvestment);
  const marketScore = calculateMarketScore(marketData);
  const pricingScore = calculatePricingVelocityScore(pricingData);

  // Calculate composite score
  const overallScore =
    municipalScore * finalWeights.municipal +
    marketScore * finalWeights.market +
    pricingScore * finalWeights.pricing;

  // Determine category based on score
  let category = 'DECLINING';
  if (overallScore >= 75) category = 'EMERGING';
  else if (overallScore >= 50) category = 'GROWING';
  else if (overallScore >= 30) category = 'MATURE';

  // Forecast ROI based on all factors
  const forecastedROI = calculateForecastedROI(
    overallScore,
    pricingData,
    marketData
  );

  // Calculate confidence level
  const confidenceLevel = calculateConfidenceLevel(
    municipalProjects,
    marketData,
    pricingData
  );

  return {
    municipalWeight: municipalScore,
    marketWeight: marketScore,
    priceVelocityWeight: pricingScore,
    overallScore: Math.round(overallScore),
    category,
    forecastedROI,
    confidenceLevel,
  };
};

/**
 * Calculate forecasted ROI based on growth indicators
 * @param {number} growthScore - Overall growth velocity score
 * @param {Object} pricingData - Pricing metrics
 * @param {Object} marketData - Market metrics
 * @returns {number} Forecasted ROI percentage
 */
export const calculateForecastedROI = (
  growthScore,
  pricingData = {},
  marketData = {}
) => {
  const { priceChangePercentage = 0, rentYield = 0 } = pricingData;
  const { vacancyRate = 50 } = marketData;

  // Base ROI from rental yield
  let baseROI = rentYield || 0;

  // Add appreciation component (score 0-100 maps to 0-15% appreciation)
  const appreciationComponent = (growthScore / 100) * 15;

  // Adjust for market health (lower vacancy = better)
  const marketFactor = 1 - vacancyRate / 100;

  const totalROI = (baseROI + appreciationComponent) * marketFactor;

  // Cap at reasonable values
  return Math.min(Math.max(totalROI, -10), 40);
};

/**
 * Calculate confidence level in the prediction
 * @param {Array} municipalProjects - Municipal project data
 * @param {Object} marketData - Market data
 * @param {Object} pricingData - Pricing data
 * @returns {number} Confidence level 0-100
 */
export const calculateConfidenceLevel = (
  municipalProjects = [],
  marketData = {},
  pricingData = {}
) => {
  let confidence = 50; // Base confidence

  // Increase confidence with more municipal projects
  if (municipalProjects.length > 0) {
    confidence += Math.min(municipalProjects.length * 5, 20);
  }

  // Increase confidence with market data points
  if (Object.keys(marketData).length >= 3) {
    confidence += 15;
  }

  // Increase confidence with pricing data
  if (Object.keys(pricingData).length >= 3) {
    confidence += 10;
  }

  return Math.min(confidence, 100);
};

/**
 * Identify undervalued zones (opportunity zones)
 * @param {Array} zones - Array of zones with trend data
 * @returns {Array} Sorted zones with opportunity indicators
 */
export const identifyUndervaluedZones = (zones = []) => {
  return zones
    .map((zone) => {
      const { rentPrice = 0, sellPrice = 0, rentYield = 0 } = zone;

      // Calculate rent-to-price ratio
      let rentToSaleRatio = 0;
      if (sellPrice > 0) {
        rentToSaleRatio = (rentPrice * 12) / sellPrice;
      }

      // Opportunity scoring
      let opportunity = 'FAIRLY_VALUED';
      if (rentToSaleRatio > 0.075) {
        opportunity = 'UNDERVALUED'; // High rental yield relative to price
      } else if (rentToSaleRatio < 0.035) {
        opportunity = 'OVERVALUED'; // Low rental yield relative to price
      }

      return {
        ...zone,
        rentToSaleRatio,
        opportunity,
      };
    })
    .sort((a, b) => b.rentToSaleRatio - a.rentToSaleRatio);
};

/**
 * Generate trend forecast
 * @param {Array} historicalData - Historical pricing/metrics data
 * @param {number} forecastMonths - Number of months to forecast
 * @returns {Array} Forecasted data points
 */
export const generateTrendForecast = (historicalData = [], forecastMonths = 12) => {
  if (historicalData.length < 2) return [];

  // Calculate trend using simple linear regression
  const dataPoints = historicalData.map((d) => d.value);
  const n = dataPoints.length;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += dataPoints[i];
    sumXY += i * dataPoints[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate forecast
  const forecast = [];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);

  for (let i = 1; i <= forecastMonths; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setMonth(forecastDate.getMonth() + i);

    const forecastValue = intercept + slope * (n + i - 1);

    forecast.push({
      date: forecastDate,
      value: Math.max(0, forecastValue),
      isForecast: true,
    });
  }

  return forecast;
};
