import { site } from '../data/content';

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <span>&copy; {site.year} {site.name}</span>
        <a href="#top" className="totop">
          Back to top &uarr;
        </a>
      </div>
    </footer>
  );
}
