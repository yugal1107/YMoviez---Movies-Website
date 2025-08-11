const userController = () => ({
  testRoute: (req, res) => {
    res.json({ message: "Authenticated!", user_id: req.user.user_id });
  },
});

export default userController;
