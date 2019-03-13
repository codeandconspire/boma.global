module.exports = catchall

// custom waterfall routing landing -> page -> throw 404
// (obj, fn) -> Element
function catchall (state, emit) {
  var segments = state.params.wildcard.split('/')
  var slug = segments[segments.length - 1]

  if (segments.length > 2) {
    let view = require('./404')
    return view(state, emit)
  }

  if (segments.length === 2) {
    state.params.slug = slug
    state.params.slug = segments[0]
    let view = require('./page')
    return view(state, emit)
  }

  return state.prismic.getByUID('landing', slug, function (err, doc) {
    if (!err) {
      let view = require('./page').landing
      state.params.slug = slug
      return view(state, emit)
    }

    return state.prismic.getByUID('page', slug, function (err, doc) {
      var view = err ? require('./404') : require('./page')
      state.params.slug = slug
      return view(state, emit)
    })
  })
}
