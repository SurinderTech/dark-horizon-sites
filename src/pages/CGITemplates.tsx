
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, PlayCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const CGITemplates = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'product', label: 'Product Ads' },
    { id: 'service', label: 'Service Ads' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'tech', label: 'Tech' },
  ];

  const templates = [
    {
      id: 1,
      name: 'Floating Product Showcase',
      category: 'product',
      thumbnailUrl: 'https://via.placeholder.com/600x400/0f172a/ffffff?text=Product+Showcase',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'An elegant 3D animation that showcases your product from multiple angles with dynamic lighting.',
      price: 49,
      popular: true,
    },
    {
      id: 2,
      name: 'Service Explainer',
      category: 'service',
      thumbnailUrl: 'https://via.placeholder.com/600x400/0f172a/ffffff?text=Service+Explainer',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Explain your service with a clear, concise animated video that highlights key benefits.',
      price: 59,
      popular: false,
    },
    {
      id: 3,
      name: 'Fashion Lookbook',
      category: 'fashion',
      thumbnailUrl: 'https://via.placeholder.com/600x400/0f172a/ffffff?text=Fashion+Lookbook',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Showcase your fashion collection with this dynamic and stylish video template.',
      price: 79,
      popular: false,
    },
    {
      id: 4,
      name: 'Tech Product Launch',
      category: 'tech',
      thumbnailUrl: 'https://via.placeholder.com/600x400/0f172a/ffffff?text=Tech+Launch',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'A futuristic template perfect for launching technology products with high-tech visual effects.',
      price: 89,
      popular: true,
    },
    {
      id: 5,
      name: 'E-commerce Product Feature',
      category: 'product',
      thumbnailUrl: 'https://via.placeholder.com/600x400/0f172a/ffffff?text=E-commerce',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Highlight product features with a clean, professional template designed for e-commerce.',
      price: 59,
      popular: false,
    },
    {
      id: 6,
      name: 'Business Service Promo',
      category: 'service',
      thumbnailUrl: 'https://via.placeholder.com/600x400/0f172a/ffffff?text=Business+Service',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: 'Promote your business services with this corporate-style video template.',
      price: 69,
      popular: false,
    },
  ];

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-tech-blue to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium <span className="text-gradient">CGI Ad Templates</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Create stunning custom ads for your products and services in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="How It Works"
            description="Create professional CGI ads for your business in three simple steps"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose a Template</h3>
              <p className="text-muted-foreground">
                Browse our library of high-quality CGI ad templates and select the one that fits your needs.
              </p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize Your Ad</h3>
              <p className="text-muted-foreground">
                Upload your product images, logo, and customize the text to match your brand.
              </p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate & Download</h3>
              <p className="text-muted-foreground">
                Our AI will generate your custom ad in minutes, ready to download and use in your campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="transition-all"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className={`overflow-hidden ${template.popular ? 'border-tech-cyan' : 'border-border'}`}>
                {template.popular && (
                  <div className="absolute top-0 right-0 bg-tech-cyan text-white px-4 py-1 text-sm font-medium z-10">
                    Popular
                  </div>
                )}
                <CardHeader className="p-0">
                  <div className="relative group">
                    <img 
                      src={template.thumbnailUrl} 
                      alt={template.name} 
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40">
                        <PlayCircle className="h-6 w-6 text-white" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40">
                        <Eye className="h-6 w-6 text-white" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex flex-col gap-4">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">One-time purchase</span>
                    <span className="text-lg font-semibold">${template.price}</span>
                  </div>
                  <Button asChild className="w-full bg-blue-purple hover:brightness-110 transition-all">
                    <Link to={`/template/${template.id}`}>Customize Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-tech-blue via-tech-electric/20 to-tech-purple/20 rounded-2xl p-8 md:p-12">
            <div className="md:flex items-center justify-between gap-8">
              <div className="md:max-w-[60%] mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Unlimited Access to All Templates</h2>
                <p className="text-lg text-muted-foreground">
                  Subscribe to our Premium plan and get unlimited access to all CGI ad templates, priority rendering, and exclusive new releases.
                </p>
              </div>
              <div className="md:text-right">
                <div className="text-3xl font-bold mb-2">$99<span className="text-xl font-normal text-muted-foreground">/month</span></div>
                <Button asChild size="lg" className="bg-white text-tech-blue hover:bg-white/90">
                  <Link to="/pricing">Subscribe Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="See What You Can Create"
            description="Examples of custom ads created with our CGI templates"
            centered
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img 
                src="https://via.placeholder.com/600x400/0f172a/ffffff?text=Example+1" 
                alt="Example 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img 
                src="https://via.placeholder.com/600x400/0f172a/ffffff?text=Example+2" 
                alt="Example 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img 
                src="https://via.placeholder.com/600x400/0f172a/ffffff?text=Example+3" 
                alt="Example 3"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img 
                src="https://via.placeholder.com/600x400/0f172a/ffffff?text=Example+4" 
                alt="Example 4"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CGITemplates;
