var html = require('choo/html')
var link = require('./link')
var figure = require('./figure')
var { className, snippet, loader } = require('../base')

module.exports = card
card.loading = loading

function card (props = {}) {
  var body = props.body
  if (body) {
    if (typeof window === 'undefined') {
      if (Array.isArray(body) || body[0] === '<') html`<div class="Card-text">${body}</div>`
      else body = html`<p class="Card-text">${snippet(body, props.truncate || 170)}</p>`
    } else if (Array.isArray(body) || body instanceof window.Element) {
      body = html`<div class="Card-text">${body}</div>`
    } else {
      body = html`<p class="Card-text">${snippet(body, props.truncate || 170)}</p>`
    }
  }

  if (props.link) {
    props.link.block = true
  }

  var attrs = {
    class: className('Card', {
      'Card--interactive': props.link,
      'Card--image': props.image,
      'Card--video': props.video
    })
  }

  if (props.video) {
    props.image.icon = html`<svg class="Card-figureIcon" width="67" height="67" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" fill="none" fill-rule="evenodd"><circle stroke="#FFF" fill="#FFF" cx="32.5" cy="32.5" r="32.5"/><path fill="#201745" d="M41 33l-14 8V25z"/></g></svg>`
  }

  var cover = null
  if (props.image) {
    cover = figure(props.image)
  }

  return html`
    <article ${attrs}>
      ${cover}
      <div class="Card-content">
        <div class="Card-body">
          ${props.date && props.date.text ? html`
            <time class="Card-meta" datetime="${JSON.stringify(props.date.datetime).replace(/"/g, '')}">
              ${props.date.text}
            </time>
          ` : null}
          <h3 class="Card-title u-textBold">
            ${props.type ? html`
              <span><span class="Card-type">${props.type}:</span> ${props.title}</span>
            ` : props.title}
          </h3>
          ${body}
          ${props.location ? html`
            <div class="Card-footer">
              <svg class="Card-footerIcon" width="11" height="13" xmlns="http://www.w3.org/2000/svg"><g fill="#201745" fill-rule="nonzero"><path d="M5.5.25a5 5 0 0 0-5 4.95c0 3.42 4.4 7.24 4.6 7.4.23.2.57.2.8 0 .22-.16 4.6-3.97 4.6-7.4a5 5 0 0 0-5-4.95zm0 11.03c-1.04-1-3.75-3.75-3.75-6.08a3.75 3.75 0 0 1 7.5 0c0 2.31-2.7 5.09-3.75 6.08z"/><path d="M5.5 2.75a2.19 2.19 0 1 0 0 4.38 2.19 2.19 0 0 0 0-4.38zm0 3.13A.94.94 0 1 1 5.5 4a.94.94 0 0 1 0 1.88z"/></g></svg>
              ${props.location}
            </div>
          ` : null}

          ${props.link && props.link.title && (
            html`<div class="Card-action u-textBold">${props.link.title}</div>`
          )}
        </div>

        ${props.link ? link(Object.assign({ inherit: props.background }, props.link)) : null}
      </div>
    </article>
  `
}

function loading (props = {}) {
  return html`
    <article class="Card">
      ${figure.loading()}
      <div class="Card-content">
        <div class="Card-body">
          ${props.date ? html`<time class="Card-meta">${loader(8)}</time>` : null}
          <h3 class="Card-title">${loader(8)}</h3>
          <p class="Card-text">${loader(24)}</p>
        </div>
        ${props.link && props.link.title && (
          html`<div class="Card-action">${loader(4)}</div>`
        )}
      </div>
    </article>
  `
}
