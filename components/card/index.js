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
      if (Array.isArray(body) || body[0] === '<') body = html`<div class="Card-text">${body}</div>`
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
      'Card--video': props.video,
      'Card--background': props.background
    })
  }

  if (props.video && props.image) {
    props.image.icon = html`<svg class="Card-figureIcon" width="67" height="67" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" fill="none" fill-rule="evenodd"><circle stroke="#FFF" fill="#FFF" cx="32.5" cy="32.5" r="32.5"/><path fill="#201745" d="M41 33l-14 8V25z"/></g></svg>`
  }

  var image = props.image || props.background || null
  if (typeof image === 'function') image = image()
  else if (image) image = figure(image)

  if (props.image && props.image.width && props.image.height) {
    attrs.style = `--Card-aspect: ${props.image.height / props.image.width};`
  }

  return html`
    <article ${attrs}>
      ${image}
      <div class="Card-content">
        <div class="Card-body">
          ${(props.background || props.location) && props.date && props.date.text ? date(props.date) : null}
          <h3 class="Card-title">
            ${props.title}
          </h3>
          ${body}
          ${props.location || (!props.background && props.date) ? html`
            <div class="Card-footer">
              ${props.location ? html`
                <svg class="Card-footerIcon" width="11" height="13">
                  <g fill="currentColor" fill-rule="nonzero"><path d="M5.5.25a5 5 0 0 0-5 4.95c0 3.42 4.4 7.24 4.6 7.4.23.2.57.2.8 0 .22-.16 4.6-3.97 4.6-7.4a5 5 0 0 0-5-4.95zm0 11.03c-1.04-1-3.75-3.75-3.75-6.08a3.75 3.75 0 0 1 7.5 0c0 2.31-2.7 5.09-3.75 6.08z"/><path d="M5.5 2.75a2.19 2.19 0 1 0 0 4.38 2.19 2.19 0 0 0 0-4.38zm0 3.13A.94.94 0 1 1 5.5 4a.94.94 0 0 1 0 1.88z"/></g>
                </svg>
              ` : null}
              ${props.location || date(props.date)}
            </div>
          ` : null}
        </div>
        ${props.link ? link(Object.assign({
          visible: !props.background && !props.location
        }, props.link)) : null}
      </div>
    </article>
  `
}

function date (props) {
  return html`
    <time class="Card-meta" datetime="${JSON.stringify(props.datetime).replace(/"/g, '')}">
      ${props.text}
    </time>
  `
}

function loading (props = {}) {
  var hasBody = !('body' in props) || props.body
  return html`
    <article class="${className('Card', { 'Card--background': props.background })}">
      ${figure.loading()}
      <div class="Card-content">
        <div class="Card-body">
          ${props.date ? html`<time class="Card-meta">${loader(6)}</time>` : null}
          <h3 class="Card-title">${loader(8)}</h3>
          ${hasBody ? html`<p class="Card-text">${loader(24)}</p>` : null}
          ${props.location ? html`<time class="Card-meta">${loader(8)}</time>` : null}
        </div>
        ${props.link && props.link.title && (
          html`<div class="Card-action">${loader(4)}</div>`
        )}
      </div>
    </article>
  `
}
