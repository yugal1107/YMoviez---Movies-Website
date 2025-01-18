function navName(req, res) {
  console.log("Response sended successfully...")
  return res.json(req.user);
}

export { navName };
