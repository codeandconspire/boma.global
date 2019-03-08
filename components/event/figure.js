var html = require('choo/html')
var assert = require('assert')
var { pluck, className } = require('../base')

module.exports = figure
figure.loading = loading

function figure (props = {}) {
  assert(props.src, 'figure: src string is required')
  var src = props.src
  var attrs = pluck(props, 'width', 'height', 'srcset', 'sizes', 'alt')
  attrs.alt = attrs.alt || ''

  return html`
    <figure class="${className('Event-figure u-hoverTriggerTarget', { 'Event-figure--background': props.background })}">
      <img class="Event-image" ${attrs} src="${src}" />
    </figure>
  `
}

function loading (props = {}) {
  return html`
    <div class="Event-figure is-loading">
      <div class="Event-image"></div>
    </div>
  `
}
