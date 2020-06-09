var siteRecaptchaKey = process.env.SITE_RECAPTCHA_KEY;
if (typeof process.env.SITE_RECAPTCHA_KEY === 'undefined') {
  const keys = require('./dev');
  siteRecaptchaKey = keys.siteRecaptchaKey;
}

module.exports = {
  siteRecaptchaKey
};
