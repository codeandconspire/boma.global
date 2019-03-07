module.exports = ui

function ui (state, emitter) {
  state.ui = state.ui || {}
  state.ui.isLoading = false
  state.ui.hasOverlay = false
  state.ui.clock = { ref: 1 }

  // generic (optionally namespaced) vector clock for tracking changes
  emitter.on('tick', function (key) {
    state.ui.clock.ref++
    if (key) {
      if (!state.ui.clock[key]) state.ui.clock[key] = 1
      else state.ui.clock[key]++
    }
  })

  emitter.on('header:toggle', function (isOpen) {
    state.ui.hasOverlay = isOpen
    document.documentElement.classList[isOpen ? 'add' : 'remove']('has-overlay')
    emitter.emit('render')
  })

  emitter.prependListener('navigate', function () {
    state.ui.hasOverlay = false
    document.documentElement.classList.remove('has-overlay')
  })

  var requests = 0
  emitter.on('prismic:request', start)
  emitter.on('prismic:response', end)
  emitter.on('prismic:error', end)

  function start () {
    requests++
    state.ui.isLoading = true
  }

  function end () {
    requests--
    state.ui.isLoading = requests > 0
  }
}
