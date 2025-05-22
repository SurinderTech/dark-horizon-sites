
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-tech-electric/20 via-tech-cyan/20 to-tech-purple/20 rounded-full blur-3xl"></div>
            <h1 className="text-8xl font-bold text-gradient relative">404</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Page not found</h2>
          <p className="text-xl text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-purple hover:brightness-110 transition-all">
              <Link to="/">Return Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
