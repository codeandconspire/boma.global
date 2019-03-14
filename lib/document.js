var dedent = require('dedent')
var hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    'meta[name="viewport"]': {
      content: 'width=device-width, initial-scale=1, viewport-fit=cover'
    },
    head: {
      _appendHtml: dedent`
        <meta property="og:site_name" content="Boma Global">
        <link rel="dns-prefetch" href="https://bomaglobal.cdn.prismic.io">
        <link rel="dns-prefetch" href="res.cloudinary.com">
        <script>
          document.documentElement.setAttribute('scripting-enabled', '');
          window.onerror = function () {
            document.documentElement.removeAttribute('scripting-enabled');
            document.documentElement.setAttribute('scripting-initial-only', '');
          }
        </script>
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/icon.png">
      `
    }
  })
}
