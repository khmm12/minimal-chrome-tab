import matchMediaPolyfill from 'mq-polyfill'

if (window.matchMedia == null) {
  matchMediaPolyfill(window)

  // mq-polyfill still doesn't support addEventListener/removeEventListener

  window.MediaQueryList.prototype.addEventListener = function (this: MediaQueryList, _type, listener) {
    Reflect.apply(this.addListener, this, [listener])
  }

  window.MediaQueryList.prototype.removeEventListener = function (this: MediaQueryList, _type, listener) {
    Reflect.apply(this.removeListener, this, [listener])
  }
}

window.resizeTo = function resizeTo(width, height) {
  Object.assign(window, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height,
  })

  window.dispatchEvent(new window.Event('resize'))
}
