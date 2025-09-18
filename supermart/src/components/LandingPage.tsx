import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

import { 
  ShoppingCart, 
  BarChart3, 
  Calculator, 
  Users, 
  MapPin, 
  Shield, 
  Smartphone, 
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Building2,
  Receipt,
  Package,
  CreditCard,
  UserCheck,
  Globe
} from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Point of Sale (POS)",
    description: "Advanced POS system with barcode scanning, inventory sync, and mobile payment support",
    highlight: "Real-time inventory updates"
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Complete stock control with automatic reorder points, supplier management, and multi-location tracking",
    highlight: "Automated stock alerts"
  },
  {
    icon: Calculator,
    title: "Accounting & Finance",
    description: "Full accounting suite with VAT compliance, financial reporting, and Kenya-specific tax calculations",
    highlight: "VAT & KRA compliance"
  },
  {
    icon: Receipt,
    title: "Invoicing & Billing",
    description: "Generate professional invoices, receipts, and financial documents with automated numbering",
    highlight: "Professional templates"
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Comprehensive CRM with loyalty programs, purchase history, and customer analytics",
    highlight: "Loyalty program support"
  },
  {
    icon: MapPin,
    title: "Multi-Location Support",
    description: "Manage multiple supermarket branches with centralized control and location-specific reporting",
    highlight: "Centralized management"
  }
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Revenue by 25%",
    description: "Optimize pricing, reduce waste, and improve customer retention with data-driven insights"
  },
  {
    icon: Shield,
    title: "100% Tax Compliant",
    description: "Built-in VAT, KRA, and Kenyan tax compliance ensures you never miss a filing deadline"
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Access your business data anywhere with responsive design and offline capabilities"
  },
  {
    icon: Building2,
    title: "Scale Your Chain",
    description: "Add new locations seamlessly with automated data synchronization across all branches"
  }
];

const testimonials = [
  {
    name: "James Mwangi",
    role: "Owner, Fresh Valley Supermarkets",
    location: "Nairobi, Kenya",
    content: "This ERP system transformed our 5-store chain. Inventory management is now effortless, and our VAT compliance is automated. Revenue increased 30% in the first year.",
    rating: 5
  },
  {
    name: "Sarah Wanjiku",
    role: "Manager, Urban Mart",
    location: "Mombasa, Kenya",
    content: "The POS system is incredibly fast and reliable. Our checkout times decreased by 40%, and customers love the digital receipts and loyalty program integration.",
    rating: 5
  },
  {
    name: "David Kiprotich",
    role: "Director, Highland Stores",
    location: "Eldoret, Kenya",
    content: "Managing 8 locations was a nightmare before this system. Now I can monitor all stores in real-time and make data-driven decisions that boost profitability.",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "KES 15,000",
    period: "/month",
    description: "Perfect for single store operations",
    features: [
      "1 Store Location",
      "Basic POS System",
      "Inventory Management",
      "VAT Compliance",
      "Customer Database",
      "Basic Reports",
      "Email Support"
    ],
    highlighted: false
  },
  {
    name: "Professional",
    price: "KES 35,000",
    period: "/month",
    description: "Ideal for growing supermarket chains",
    features: [
      "Up to 5 Store Locations",
      "Advanced POS System",
      "Full Inventory Control",
      "Complete Accounting Suite",
      "CRM & Loyalty Programs",
      "Advanced Analytics",
      "Multi-location Reporting",
      "Priority Support",
      "Staff Management"
    ],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "KES 75,000",
    period: "/month",
    description: "For large supermarket chains",
    features: [
      "Unlimited Store Locations",
      "Enterprise POS System",
      "Advanced Inventory AI",
      "Full Financial Suite",
      "Advanced CRM",
      "Business Intelligence",
      "Custom Integrations",
      "24/7 Dedicated Support",
      "Staff & Payroll Management",
      "Custom Features"
    ],
    highlighted: false
  }
];

interface LandingPageProps {
  onEnterApp?: () => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-medium">SuperMarket ERP</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onEnterApp}>Sign In</Button>
            <div className="animated-border">
              <Button onClick={onEnterApp}>Start Free Trial</Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Globe className="h-4 w-4 mr-2" />
                  Made for Kenya's Supermarket Chains
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-medium leading-tight">
                  Complete ERP Solution for 
                  <span className="text-primary"> Supermarket Chains</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Streamline operations, ensure VAT compliance, and scale your supermarket business across Kenya with our comprehensive ERP system designed specifically for SMEs.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="animated-border">
                  <Button size="lg" className="text-lg px-8 py-6" onClick={onEnterApp}>
                    Start Free 30-Day Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={onEnterApp}>
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-medium">500+</div>
                  <div className="text-sm text-muted-foreground">Stores Using Our System</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium">25%</div>
                  <div className="text-sm text-muted-foreground">Average Revenue Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium">99.9%</div>
                  <div className="text-sm text-muted-foreground">System Uptime</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1671427478482-2968e71a6311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdXBlcm1hcmtldCUyMGludGVyaW9yJTIwS2VueWF8ZW58MXx8fHwxNzU4MDc4MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern supermarket interior in Kenya"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm opacity-90">Modern Kenyan Supermarket</div>
                  <div className="text-lg font-medium">Powered by Our ERP System</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <Badge variant="secondary" className="w-fit mx-auto">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comprehensive Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-medium">
              Everything Your Supermarket Chain Needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From point-of-sale to financial reporting, our ERP system covers every aspect of supermarket operations with Kenya-specific compliance built in.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="animated-card-border"
              >
                <Card className="relative border-2 hover:border-primary/20 transition-colors h-full">
                <CardHeader className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Proven Results
                </Badge>
                <h2 className="text-3xl lg:text-5xl font-medium">
                  Grow Your Business with Confidence
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our ERP system is specifically designed for Kenyan supermarket chains, ensuring you get the features and compliance you need to succeed.
                </p>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="animated-border">
                <Button size="lg" className="text-lg px-8 py-6">
                  See All Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZCUyMHNjcmVlbnxlbnwxfHx8fDE3NTgwMTI1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Business analytics dashboard showing growth metrics"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <Badge variant="secondary" className="w-fit mx-auto">
              <UserCheck className="h-4 w-4 mr-2" />
              Customer Success
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-medium">
              Trusted by Leading Supermarket Chains
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how supermarket owners across Kenya are transforming their businesses with our ERP system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative h-full">
                <CardHeader className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <Badge variant="secondary" className="w-fit mx-auto">
              <CreditCard className="h-4 w-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-medium">
              Choose the Right Plan for Your Chain
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transparent pricing with no hidden fees. All plans include VAT compliance and 24/7 support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={plan.highlighted ? 'animated-card-border' : ''}
              >
                <Card className={`relative h-full ${plan.highlighted ? 'border-primary shadow-lg scale-105' : 'border-2'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center space-y-4">
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-medium">{plan.price}</div>
                    <div className="text-muted-foreground">{plan.period}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.highlighted ? '' : 'variant-outline'}`} 
                    variant={plan.highlighted ? 'default' : 'outline'}
                    size="lg"
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              All plans include 30-day free trial • No setup fees • Cancel anytime
            </p>
            <Button variant="outline" size="lg">
              Contact Sales for Custom Enterprise Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h2 className="text-3xl lg:text-5xl font-medium">
              Ready to Transform Your Supermarket Chain?
            </h2>
            <p className="text-xl opacity-90">
              Join hundreds of Kenyan supermarket owners who have already modernized their operations with our ERP system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="animated-border">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-medium">SuperMarket ERP</span>
              </div>
              <p className="text-muted-foreground">
                The complete ERP solution designed specifically for Kenyan supermarket chains.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">Twitter</Button>
                <Button variant="ghost" size="sm">LinkedIn</Button>
                <Button variant="ghost" size="sm">Facebook</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>Security</div>
                <div>Integrations</div>
                <div>API Documentation</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About Us</div>
                <div>Careers</div>
                <div>Blog</div>
                <div>Press</div>
                <div>Contact</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Help Center</div>
                <div>Documentation</div>
                <div>Community</div>
                <div>Training</div>
                <div>Status</div>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 SuperMarket ERP. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Cookie Policy</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}