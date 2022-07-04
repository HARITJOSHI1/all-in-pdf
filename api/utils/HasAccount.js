module.exports = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) return null;
  return user;
};
