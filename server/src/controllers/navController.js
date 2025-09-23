import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const navName = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized: User not authenticated.");
  }

  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User data fetched successfully"));
});

export { navName };
