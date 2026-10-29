const COMPANIES = [
  'NextWave Semiconductors',
  'Orbit Telecom',
  'Vertex Systems',
  'Nimbus Networks',
  'Solstice Robotics',
  'Circuitry Labs',
  'Farfield Aerospace',
  'BlueTrace Electronics',
]

export default function CompanySlider() {
  const loop = [...COMPANIES, ...COMPANIES]

  return (
    <div className="company-slider">
      <div className="company-track">
        {loop.map((name, i) => (
          <div className="company-item" key={`${name}-${i}`}>
            <span className="dot" />
            {name}
          </div>
        ))}
      </div>
    </div>
  )
}
