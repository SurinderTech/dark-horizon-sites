
import React from 'react';
import Layout from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: 'Years Experience', value: '8+' },
    { label: 'Projects Completed', value: '200+' },
    { label: 'Client Satisfaction', value: '99%' },
    { label: 'AI Models Trained', value: '50+' },
  ];

  const teamMembers = [
    {
      name: 'Alex Morgan',
      role: 'Founder & AI Specialist',
      bio: 'With over 10 years of experience in AI and machine learning, Alex has worked with Fortune 500 companies to implement cutting-edge AI solutions.',
    },
    {
      name: 'Jamie Rivera',
      role: 'Lead Developer',
      bio: 'Jamie specializes in integrating AI systems with existing business infrastructure, ensuring seamless operation and maximum efficiency.',
    },
    {
      name: 'Sam Taylor',
      role: 'Data Scientist',
      bio: 'Sam has trained numerous AI models for various applications, from natural language processing to computer vision and predictive analytics.',
    },
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We continuously push the boundaries of what AI can accomplish, staying at the forefront of technological advancements.',
    },
    {
      title: 'Customization',
      description: 'Every business is unique, and we believe in tailoring AI solutions to address specific challenges and goals.',
    },
    {
      title: 'Transparency',
      description: 'We maintain clear communication throughout the development process, ensuring clients understand how their AI solutions work.',
    },
    {
      title: 'Results',
      description: 'Our focus is on delivering measurable outcomes that positively impact your business operations and bottom line.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-tech-blue to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-gradient">AI Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We're a team of AI specialists dedicated to creating custom solutions that drive business success through innovation and technology.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                pretitle="Our Story"
                title="Pioneering AI Solutions Since 2015"
                description="What started as a passion project has evolved into a comprehensive service helping businesses harness the power of artificial intelligence."
              />
              <p className="text-muted-foreground mb-6">
                Founded by a team of AI researchers and business strategists, our company has grown from a small startup to an industry leader in custom AI solutions. We've worked with businesses across various industries, from healthcare to finance, e-commerce to manufacturing.
              </p>
              <p className="text-muted-foreground mb-8">
                Our mission is to democratize access to advanced AI technologies, making them accessible and beneficial for businesses of all sizes. We believe that AI should enhance human capabilities, not replace them, and we design our solutions with this philosophy in mind.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-tech-cyan mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-tech-electric/20 via-tech-purple/20 to-tech-cyan/20 rounded-xl blur-xl"></div>
              <div className="relative bg-card/60 backdrop-blur-sm border border-white/10 p-8 rounded-xl">
                <div className="aspect-video w-full bg-tech-blue rounded-lg overflow-hidden">
                  {/* This would be an image or video in a real implementation */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gradient mb-4">Our Journey</div>
                      <p className="text-muted-foreground">From startup to industry leader</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-4 h-4 mt-1 rounded-full bg-tech-cyan"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">2015: Company Founded</h3>
                      <p className="text-muted-foreground text-sm">Started with a team of 3 AI researchers</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-4 h-4 mt-1 rounded-full bg-tech-electric"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">2017: First Enterprise Client</h3>
                      <p className="text-muted-foreground text-sm">Developed custom NLP solution for Fortune 500 company</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-4 h-4 mt-1 rounded-full bg-tech-purple"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">2020: Team Expansion</h3>
                      <p className="text-muted-foreground text-sm">Grew to 25 specialists across various AI domains</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-4 h-4 mt-1 rounded-full bg-tech-cyan"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">2023: Global Recognition</h3>
                      <p className="text-muted-foreground text-sm">Named Top AI Solution Provider by Tech Innovation Awards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-tech-blue/20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            pretitle="Our Team"
            title="Meet the Experts Behind Our AI Solutions"
            description="A diverse team of AI specialists, developers, and business strategists working together to create powerful, tailored solutions."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-tech-cyan/40 transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-tech-electric to-tech-cyan rounded-full mb-6"></div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-tech-cyan text-sm mb-4">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            pretitle="Our Values"
            title="The Principles That Guide Our Work"
            description="These core values shape how we approach every project and client relationship, ensuring excellence and integrity in all we do."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, index) => (
              <div key={index} className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-tech-cyan/40 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-tech-electric to-tech-purple rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-tech-blue via-tech-electric/20 to-tech-purple/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to work with us?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how our AI expertise can help your business overcome challenges and achieve new levels of success.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-purple hover:brightness-110 transition-all">
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
