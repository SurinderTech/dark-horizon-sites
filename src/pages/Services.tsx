
import React from 'react';
import Layout from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Services = () => {
  const services = [
    {
      id: "ai-agents",
      title: "AI Agents",
      description: "Custom intelligent agents designed to handle specific tasks and workflows for your business.",
      features: [
        "Natural language understanding and processing",
        "Task automation and workflow optimization",
        "Personalized responses and recommendations",
        "Seamless integration with existing systems",
        "Continuous learning and improvement",
        "Multi-platform support (web, mobile, API)",
      ],
      useCases: [
        {
          title: "Customer Service",
          description: "Intelligent agents that handle customer inquiries, provide support, and escalate complex issues to human agents when necessary.",
        },
        {
          title: "Sales Assistance",
          description: "AI agents that qualify leads, schedule meetings, and provide product information to potential customers.",
        },
        {
          title: "Internal Operations",
          description: "Automated agents that handle internal requests, manage resources, and streamline administrative tasks.",
        },
      ],
    },
    {
      id: "chatbots",
      title: "Chatbot Setup",
      description: "Conversational AI solutions that engage with your customers naturally and provide assistance around the clock.",
      features: [
        "Contextual understanding and memory",
        "Multi-language support",
        "Omnichannel deployment (website, messaging apps, etc.)",
        "Sentiment analysis and emotional intelligence",
        "Customizable conversation flows",
        "Analytics and performance tracking",
      ],
      useCases: [
        {
          title: "Website Assistant",
          description: "Interactive chatbots that engage visitors, answer questions, and guide them through your website.",
        },
        {
          title: "E-commerce Helper",
          description: "Shopping assistants that help customers find products, compare options, and complete purchases.",
        },
        {
          title: "Knowledge Base",
          description: "Intelligent chatbots that access your knowledge base to provide accurate information and answers.",
        },
      ],
    },
    {
      id: "custom-tools",
      title: "Custom Tools",
      description: "Specialized AI-powered applications built to solve your unique business challenges and streamline operations.",
      features: [
        "Tailor-made solutions for specific business needs",
        "Data analysis and visualization",
        "Predictive modeling and forecasting",
        "Process automation and optimization",
        "Custom recommendation engines",
        "Industry-specific AI applications",
      ],
      useCases: [
        {
          title: "Predictive Maintenance",
          description: "AI tools that analyze equipment data to predict failures before they occur, reducing downtime and maintenance costs.",
        },
        {
          title: "Content Generation",
          description: "Custom tools that generate marketing copy, product descriptions, and other content based on your brand guidelines.",
        },
        {
          title: "Market Analysis",
          description: "AI-powered tools that analyze market trends, customer behavior, and competitor actions to inform business decisions.",
        },
      ],
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Consultation & Discovery",
      description: "We begin by understanding your business, challenges, and goals to identify how AI can deliver the most value.",
    },
    {
      number: "02",
      title: "Solution Design",
      description: "Our team designs a custom AI solution tailored to your specific needs, with clear deliverables and timelines.",
    },
    {
      number: "03",
      title: "Development & Training",
      description: "We develop and train the AI system using your data and industry best practices to ensure optimal performance.",
    },
    {
      number: "04",
      title: "Integration & Testing",
      description: "The solution is integrated with your existing systems and thoroughly tested to ensure smooth operation.",
    },
    {
      number: "05",
      title: "Deployment & Optimization",
      description: "Once launched, we monitor performance and continuously optimize the system based on real-world usage and feedback.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-tech-blue to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-gradient">AI Services</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive AI solutions designed to drive innovation, efficiency, and growth for your business.
            </p>
            <Button asChild size="lg" className="bg-blue-purple hover:brightness-110 transition-all">
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Tabs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            pretitle="What We Offer"
            title="Comprehensive AI Services"
            description="Explore our range of AI solutions designed to address specific business challenges and create new opportunities for growth."
            centered
          />

          <div className="mt-12">
            <Tabs defaultValue="ai-agents" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg p-1">
                {services.map((service) => (
                  <TabsTrigger 
                    key={service.id}
                    value={service.id}
                    className="py-3 data-[state=active]:bg-blue-purple data-[state=active]:text-white"
                  >
                    {service.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {services.map((service) => (
                <TabsContent key={service.id} value={service.id} className="animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold">{service.title}</h3>
                      <p className="text-muted-foreground text-lg">{service.description}</p>
                      
                      <div className="mt-8">
                        <h4 className="text-xl font-semibold mb-4">Key Features</h4>
                        <ul className="space-y-3">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <div className="mr-3 mt-1.5">
                                <div className="w-2 h-2 bg-tech-cyan rounded-full"></div>
                              </div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-8 flex flex-wrap gap-4">
                        <Button asChild className="bg-blue-purple hover:brightness-110 transition-all">
                          <Link to="/pricing">View Pricing</Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link to="/contact">Request Demo</Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6">
                      <h4 className="text-xl font-semibold mb-6">Use Cases</h4>
                      <div className="space-y-6">
                        {service.useCases.map((useCase, index) => (
                          <div key={index} className="p-4 bg-background/30 rounded-lg border border-border/40">
                            <h5 className="text-lg font-medium text-tech-cyan mb-2">{useCase.title}</h5>
                            <p className="text-muted-foreground">{useCase.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-tech-blue/20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            pretitle="Our Process"
            title="How We Deliver Results"
            description="Our structured approach ensures that every AI solution we build is tailored to your needs and delivers measurable value."
            centered
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-tech-cyan/40 transition-all relative">
                <div className="absolute -top-3 -left-3 bg-gradient-to-br from-tech-electric to-tech-cyan w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-tech-blue via-tech-electric/20 to-tech-purple/20 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your business?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contact us today to discuss how our AI services can help you achieve your business goals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-blue-purple hover:brightness-110 transition-all">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
