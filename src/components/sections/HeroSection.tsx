
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-gradient pt-32 pb-24 md:pb-32 relative overflow-hidden">
      {/* Abstract shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-tech-electric/10 filter blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-tech-cyan/10 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transform Your Business with{' '}
              <span className="text-gradient">Advanced AI Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Custom AI agents, intelligent chatbots, and powerful tools designed to elevate your business operations and customer experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-blue-purple hover:brightness-110 transition-all">
                <Link to="/contact">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="relative w-full max-w-md">
              {/* Decorative elements */}
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-tech-cyan/20 via-tech-electric/20 to-tech-purple/20 rounded-xl blur-xl"></div>
              
              {/* Main image/visualization */}
              <div className="relative bg-card backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl animate-float">
                <div className="aspect-video w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-tech-purple/30 via-tech-electric/30 to-tech-cyan/30 rounded-lg"></div>
                  
                  {/* AI Visualization Mockup */}
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex items-center justify-between p-3 border-b border-white/10">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-xs font-mono">AI Assistant</div>
                    </div>
                    <div className="flex-grow p-4 flex flex-col justify-end">
                      <div className="flex gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-tech-purple/70"></div>
                        <div className="bg-secondary/70 p-2 rounded-lg text-xs max-w-[80%]">
                          How can I optimize my customer support workflow?
                        </div>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-tech-cyan/70 flex items-center justify-center text-xs">AI</div>
                        <div className="bg-card p-2 rounded-lg text-xs max-w-[80%] animate-pulse-glow">
                          I recommend implementing a custom AI agent that can handle 80% of common inquiries while routing complex cases to your team. Here's how we can set this up...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Metrics display */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="text-tech-cyan text-sm font-medium">Response Time</div>
                    <div className="text-lg font-bold">0.4s</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <div className="text-tech-cyan text-sm font-medium">Accuracy</div>
                    <div className="text-lg font-bold">98.7%</div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 bg-tech-purple/20 backdrop-blur-sm border border-tech-purple/30 p-3 rounded-lg shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-xs font-semibold">AI Processing</div>
                <div className="text-tech-purple text-xs">Training Complete</div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-tech-cyan/20 backdrop-blur-sm border border-tech-cyan/30 p-3 rounded-lg shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="text-xs font-semibold">Integration</div>
                <div className="text-tech-cyan text-xs">100% Compatible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
