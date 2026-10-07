import { Link } from 'react-router-dom';

export default function Brand({ compact = false, inverted = false }) {
  return (
    <Link
      className={`brand${inverted ? ' brand--inverted' : ''}`}
      to="/"
      aria-label="Deepcleaning99.com home"
    >
      <img
        className="brand__logo"
        src="/assets/logo.png"
        width={compact ? 168 : 196}
        height={compact ? 48 : 56}
        alt=""
      />
      <span className="brand__tag" aria-hidden="true">
        By Pestcontrol99.com
      </span>
    </Link>
  );
}
