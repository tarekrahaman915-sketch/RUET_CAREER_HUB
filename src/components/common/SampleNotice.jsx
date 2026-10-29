export default function SampleNotice({ children }) {
  return <div className="notice-bar">{children || 'Showing sample data. Start the server and run the seed script to see live content.'}</div>
}
