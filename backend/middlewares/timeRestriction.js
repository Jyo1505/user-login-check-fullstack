function isMobileTimeAllowed() {
  const hour = new Date().getHours(); // server time
  return hour >= 10 && hour < 13; // 10 AM - 1 PM
}

module.exports = (req, res, next) => {
  if (req.clientInfo.isMobile && !isMobileTimeAllowed()) {
    return res.status(403).json({
      success: false,
      message: "Mobile access allowed only between 10 AM to 1 PM"
    });
  }
  next();
};
