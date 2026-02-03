module.exports = (req, res, next) => {
  const browser = req.useragent.browser;
  const os = req.useragent.os;
  const isMobile = req.useragent.isMobile;

  req.clientInfo = {
    browser,
    os,
    isMobile,
    device: isMobile ? "Mobile" : "Desktop"
  };

  next();
};
