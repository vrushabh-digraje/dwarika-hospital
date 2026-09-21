import { getDashboardStats } from '../services/dashboardService.js';
import { success } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const stats = asyncHandler(async (req, res) => {
  const data = await getDashboardStats();
  return success(res, data, 'Dashboard stats');
});
