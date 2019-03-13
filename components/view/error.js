var html = require('choo/html')
var { i18n } = require('../base')
var button = require('../button')

var text = i18n()

var DEBUG = process.env.NODE_ENV === 'development'
if (typeof window !== 'undefined') {
  try {
    let flag = window.localStorage.DEBUG
    DEBUG = DEBUG || (flag && JSON.parse(flag))
  } catch (err) {}
}

module.exports = error

function error (err) {
  return html`
    <main class="View-main">
      <div class="u-container">
          <div class="Text">
            <h1>${text`Ouch`}</h1>
            ${message(err.status)}
            ${DEBUG ? html`<pre>${err.stack}</pre>` : null}
          </div>
        </div>
      </div>
    </main>
  `
}

function message (status) {
  switch (status) {
    case 404: return html`<div><p>${text`There is no page at this address. Try finding your way using the menu or from ${html`<a href="/">${text`the homepage`}</a>`}.`}</p></div>`
    case 503: return html`<div><p>${text`You seem to be offline. Check your network connection.`}</p><p>${button({ text: text`Try again`, type: 'button', onclick: reload })}</p></div>`
    default: return html`<div><p>${text`We apologize, an error has occured on our site.`}</p><p>${button({ text: text`Try again`, type: 'button', onclick: reload })}</p></div>`
  }

  function reload (event) {
    window.location.reload()
    event.preventDefault()
  }
}
