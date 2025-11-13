"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "Why Us", href: "#why" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="#home" className="text-xl font-bold text-green-700">
          P&P Remodeling
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-green-700 transition-colors"
            >
              {item.name}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors"
          >
            Get a Quote
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl text-green-700 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-100">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a
            href="#contact"
            className="block px-6 py-3 text-center bg-green-700 text-white hover:bg-green-800"
            onClick={() => setIsOpen(false)}
          >
            Get a Quote
          </a>
        </div>
      )}
    </header>
  );
}
