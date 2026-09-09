const asyncHandler = require('../../utils/asyncHandler.js');
const ApiResponse = require('../../utils/ApiResponse.js');
const statsService = require('./stats.service.js');

const getStats = asyncHandler(async (req, res) => {
    const stats = await statsService.getOverviewStats();
    res
        .status(200)
        .json(new ApiResponse(200, stats, 'Platform statistics fetched successfully'));
});

module.exports = {
    getStats,
};
