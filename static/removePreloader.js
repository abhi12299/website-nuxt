function loaded() {
  document.body.classList.add('loaded')
}

setTimeout(loaded, 1500)

window.addEventListener('load', loaded)
