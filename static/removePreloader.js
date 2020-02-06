function loaded() {
  document.body.classList.add('loaded')
}

setTimeout(loaded, 2500)

window.addEventListener('load', loaded)
