export default function Audio () {
  return (
    <audio id="firesfx" preload="auto">
      <source src="./fire.mp3" type="audio/mpeg" />
    </audio>
  )
}

export function playFireSFX () {
  const sfx = window.firesfx.cloneNode(true)
  sfx.play()
}
