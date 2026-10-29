import ruetLogoCircle from '../../assets/ruet-logo-circle.png'

/** RUET's official seal, cropped into a true circle with transparency. */
export default function Logo({ size = 30 }) {
  return <img src={ruetLogoCircle} alt="RUET" style={{ height: size, width: size, display: 'block' }} />
}
