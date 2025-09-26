import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userController = () => ({
  testRoute: asyncHandler(async (req, res) => {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user_id: req.user.user_id },
          "Authentication test successful"
        )
      );
  }),
});

export default userController;
