
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

interface TestimonialProps {
  content: string;
  name: string;
  role: string;
  company: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ content, name, role, company }) => {
  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/40 p-6 rounded-xl hover:border-tech-cyan/40 transition-all">
      {/* Quote icon */}
      <div className="mb-4 text-tech-cyan">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
      </div>
      <p className="text-muted-foreground mb-6">{content}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-tech-electric to-tech-cyan rounded-full mr-4"></div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{role}, {company}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      content: "The custom AI agent developed for our customer service team has reduced response times by 60% and improved satisfaction scores dramatically. It was worth every penny.",
      name: "Sarah Johnson",
      role: "Customer Service Director",
      company: "TechCorp Inc."
    },
    {
      content: "Implementing the AI-powered analytical tools has given us insights we never knew were possible. Our decision-making process is now backed by solid data intelligence.",
      name: "Michael Chen",
      role: "Head of Analytics",
      company: "DataSmart Solutions"
    },
    {
      content: "The chatbot integration was seamless and exceeded our expectations. Our website visitors get instant responses 24/7, and our team can focus on complex cases.",
      name: "Jessica Rodriguez",
      role: "Marketing Manager",
      company: "Global Retail Group"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-tech-blue/50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          pretitle="Client Success"
          title="What Our Clients Say"
          description="Don't take our word for it. Hear from businesses that have transformed their operations with our custom AI solutions."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
