import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses looking to get started with AI',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        'Basic AI chatbot setup',
        'Up to 1,000 conversations/month',
        'Business hours support',
        '1 custom integration',
        'Basic analytics dashboard',
        'Monthly performance reports',
      ],
      popularFeatures: [
        'Basic AI chatbot setup',
        'Up to 1,000 conversations/month',
        'Business hours support',
      ],
    },
    {
      name: 'Professional',
      description: 'Advanced AI solutions for growing businesses',
      monthlyPrice: 699,
      yearlyPrice: 6990,
      isPopular: true,
      features: [
        'Advanced AI agent development',
        'Up to 5,000 conversations/month',
        'Priority support (24/7)',
        '3 custom integrations',
        'Advanced analytics & insights',
        'Weekly performance reports',
        'Custom training data integration',
        'Personalized response templates',
      ],
      popularFeatures: [
        'Advanced AI agent development',
        'Up to 5,000 conversations/month',
        'Priority support (24/7)',
        '3 custom integrations',
      ],
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive AI solutions for large organizations',
      monthlyPrice: 1499,
      yearlyPrice: 14990,
      features: [
        'Full suite of AI tools & agents',
        'Unlimited conversations',
        'Dedicated support manager',
        'Unlimited custom integrations',
        'Enterprise-grade analytics',
        'Daily performance reports',
        'Custom AI model training',
        'White-labeling options',
        'API access',
        'On-premise deployment option',
      ],
      popularFeatures: [
        'Full suite of AI tools & agents',
        'Unlimited conversations',
        'Dedicated support manager',
        'Unlimited custom integrations',
      ],
    },
  ];

  const faq = [
    {
      question: 'How do I get started with your AI services?',
      answer: 'Getting started is easy. Simply contact us through our contact form or book a consultation call. We will discuss your needs and recommend the best solution for your business. Once you have selected a plan, our team will begin the implementation process.'
    },
    {
      question: 'Can I upgrade or downgrade my plan later?',
      answer: 'Yes, you can change your subscription plan at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your current billing cycle. There are no penalties for changing your plan.'
    },
    {
      question: 'Do you offer custom pricing for specific needs?',
      answer: 'Absolutely. If our standard plans do not fit your requirements, we can create a custom pricing plan tailored to your specific needs. Contact us to discuss your requirements and get a custom quote.'
    },
    {
      question: 'How long does implementation take?',
      answer: 'Implementation time varies depending on the complexity of your project and the level of customization required. Simple chatbot implementations can be completed in as little as 2-3 weeks, while more complex AI agents may take 6-8 weeks to develop and deploy.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'There are no hidden setup fees for our standard plans. All costs are included in the monthly or yearly subscription. For highly customized enterprise solutions, there may be additional implementation fees which will be clearly outlined in your proposal.'
    },
    {
      question: 'What kind of support is included?',
      answer: 'All plans include ongoing support, with varying levels of priority. The Starter plan includes business hours support, the Professional plan offers 24/7 priority support, and the Enterprise plan provides a dedicated support manager.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-tech-blue to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, <span className="text-gradient">Transparent Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for your business. All plans include ongoing support and updates.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-full p-1 flex">
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-blue-purple text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === 'yearly' 
                    ? 'bg-blue-purple text-white' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="text-xs ml-1">Save 15%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-card/60 backdrop-blur-sm border ${plan.isPopular ? 'border-tech-cyan' : 'border-border/40'} rounded-xl overflow-hidden`}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-tech-cyan text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)}
                      </span>
                      <span className="text-muted-foreground mb-1">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-tech-cyan text-sm mt-1">
                        Billed annually (${plan.yearlyPrice}/year)
                      </div>
                    )}
                  </div>
                  
                  <Button asChild className={`w-full mb-6 ${plan.isPopular ? 'bg-gradient-to-r from-tech-cyan to-tech-electric' : 'bg-blue-purple'} hover:brightness-110 transition-all`}>
                    <Link to="/contact">Get Started</Link>
                  </Button>
                  
                  <div className="space-y-4">
                    {plan.popularFeatures.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Check className="h-5 w-5 text-tech-cyan" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > plan.popularFeatures.length && (
                      <div className="pt-4">
                        <p className="text-muted-foreground text-sm font-medium mb-3">Also includes:</p>
                        {plan.features.slice(plan.popularFeatures.length).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start mb-3">
                            <div className="mr-3 mt-1">
                              <Check className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-muted-foreground text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enterprise Banner */}
          <div className="mt-12 bg-gradient-to-br from-tech-blue via-tech-electric/20 to-tech-purple/20 rounded-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need a custom solution?</h3>
                <p className="text-muted-foreground">
                  Contact us for a tailored AI solution designed specifically for your business needs.
                </p>
              </div>
              <Button asChild size="lg" className="bg-white text-tech-blue hover:bg-white/90">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Compare Plan Features"
            description="Detailed comparison of what's included in each plan to help you make the right choice."
            centered
          />
          
          <div className="mt-12 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="font-medium">Feature</div>
                {pricingPlans.map((plan, index) => (
                  <div key={index} className="font-medium">{plan.name}</div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/40">
                  <div>Conversations</div>
                  <div>1,000/month</div>
                  <div>5,000/month</div>
                  <div>Unlimited</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/40">
                  <div>Support</div>
                  <div>Business hours</div>
                  <div>24/7 Priority</div>
                  <div>Dedicated manager</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/40">
                  <div>Custom integrations</div>
                  <div>1</div>
                  <div>3</div>
                  <div>Unlimited</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/40">
                  <div>Analytics</div>
                  <div>Basic</div>
                  <div>Advanced</div>
                  <div>Enterprise-grade</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/40">
                  <div>Performance reports</div>
                  <div>Monthly</div>
                  <div>Weekly</div>
                  <div>Daily</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/40">
                  <div>Custom training data</div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Check className="h-5 w-5 text-tech-cyan" />
                  </div>
                  <div>
                    <Check className="h-5 w-5 text-tech-cyan" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-border/40">
                  <div>API access</div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Check className="h-5 w-5 text-tech-cyan" />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 py-3">
                  <div>White-labeling</div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Check className="h-5 w-5 text-tech-cyan" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-tech-blue/20">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Frequently Asked Questions"
            description="Find answers to common questions about our pricing and services."
            centered
          />
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {faq.map((item, index) => (
              <div key={index} className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Choose the plan that's right for you or contact us for a custom solution.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-blue-purple hover:brightness-110 transition-all">
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#pricing">View Plans</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
