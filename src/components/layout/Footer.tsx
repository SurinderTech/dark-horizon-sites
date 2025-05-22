
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tech-blue/70 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-gradient">
              AI Services
            </Link>
            <p className="mt-4 text-muted-foreground">
              Cutting-edge AI solutions for businesses and individuals. Elevate your operations with custom AI tools and chatbots.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-tech-cyan transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-tech-cyan transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-tech-cyan transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-tech-cyan transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-tech-cyan transition-colors">
                  AI Agents
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-tech-cyan transition-colors">
                  Chatbot Setup
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-tech-cyan transition-colors">
                  Custom Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground">
                <span className="block">Email:</span>
                <a href="mailto:contact@aiservices.com" className="hover:text-tech-cyan transition-colors">
                  contact@aiservices.com
                </a>
              </li>
              <li className="text-muted-foreground">
                <span className="block">Phone:</span>
                <a href="tel:+123456789" className="hover:text-tech-cyan transition-colors">
                  +1 (234) 567-89
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} AI Services. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-tech-cyan transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-tech-cyan transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
