import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white">
      <Link href="/" aria-label="Home">
        <span className="text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
          n
        </span>
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/about">
              <span className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                About
              </span>
            </Link>
          </li>
          <li>
            <Link href="/services">
              <span className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                Services
              </span>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <span className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                Contact
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
