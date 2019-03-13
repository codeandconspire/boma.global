var html = require('choo/html')
var button = require('../button')

module.exports = highlight

function highlight (props) {
  return html`
    <section class="Highlight Highlight--${props.direction}">
      ${props.action ? html`
        <figure class="Highlight-figure">
          <img class="Highlight-image" ${props.image} />
        </figure>
      ` : null}
      <div class="Highlight-body">
        <div class="Text Highlight-text">
          ${props.title ? html`<h2>${props.title}</h2>` : null}
          ${props.body ? props.body : null}
          ${props.action ? html`
            <p>
              ${button({ href: props.action.href, text: props.action.text })}
            </p>
          ` : null}
        </div>
      </div>
    </section>
  `
}
