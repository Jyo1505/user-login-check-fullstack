exports.isAllowedTime = () => {
  const hour = new Date().getHours();
  return hour >= 10 && hour < 13;
};
