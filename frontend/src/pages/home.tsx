import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, BookOpenCheck, Brain, MessageSquare, ArrowRight, Activity, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      title: "Learning Modules",
      description: "Master the essentials of digital security from phishing to ransomware.",
      icon: <BookOpenCheck className="w-8 h-8 text-primary" />,
      link: "/learn",
      color: "bg-primary/10 border-primary/20",
    },
    {
      title: "Interactive Quizzes",
      description: "Test your knowledge with scenario-based cybersecurity challenges.",
      icon: <Brain className="w-8 h-8 text-accent" />,
      link: "/quizzes",
      color: "bg-accent/10 border-accent/20",
    },
    {
      title: "Threat Alerts",
      description: "Stay updated with the latest zero-day vulnerabilities and breaches.",
      icon: <Activity className="w-8 h-8 text-destructive" />,
      link: "/news",
      color: "bg-destructive/10 border-destructive/20",
    },
    {
      title: "Community Forum",
      description: "Discuss security strategies and share experiences with peers.",
      icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
      link: "/forum",
      color: "bg-purple-400/10 border-purple-400/20",
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Cybersecurity grid background" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 pt-32 pb-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 text-sm font-medium">
              <ShieldAlert className="w-4 h-4" />
              Empowering your digital defense
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
              Security is not a product, <br/>
              <span className="text-primary">it's a process.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Equip yourself with the knowledge to identify, prevent, and respond to modern cyber threats. Join our community of security-conscious individuals today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/learn">
                <Button size="lg" variant="glow" className="w-full sm:w-auto">
                  Start Learning Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/report">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/10">
                  Report an Incident
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="border-y border-white/5 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="p-4">
              <div className="text-4xl font-display font-bold text-white mb-2">10k+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Active Learners</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-display font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Interactive Modules</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-display font-bold text-accent mb-2">24/7</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Threat Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Comprehensive Defense Toolkit</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to build strong security habits and protect your digital identity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={feature.link} className="block group h-full">
                  <Card className="h-full bg-card/40 hover:bg-card/60 border-white/5 hover:border-primary/30 transition-all duration-300">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 border ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground flex-1">{feature.description}</p>
                      <div className="mt-6 flex items-center text-sm font-medium text-white/50 group-hover:text-primary transition-colors">
                        Explore section <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
