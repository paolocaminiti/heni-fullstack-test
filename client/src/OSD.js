export default function OSD ({ title, page }) {
  return (
    <div className="osd">
      <div>{title}</div>
      <div className="level">Level {page}</div>
    </div>
  )
}
