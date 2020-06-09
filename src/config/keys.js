var siteRecaptchaKey = process.env.GATSBY_APP_SITE_RECAPTCHA_KEY;
if (typeof siteRecaptchaKey === 'undefined') {
  const keys = require('./dev');
  siteRecaptchaKey = keys.siteRecaptchaKey;
}

module.exports = {
  siteRecaptchaKey
};
