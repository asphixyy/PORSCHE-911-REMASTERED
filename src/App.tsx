/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useState, useEffect, ReactNode } from "react";
import { ChevronRight, Gauge, Zap, Wind, Menu, X, Instagram, Twitter, Youtube, Facebook, Linkedin, Globe } from "lucide-react";
import RotatingText from "./components/RotatingText";
import BlurText from "./components/BlurText";
import ElectricBorder from "./components/ElectricBorder";
import ShinyText from "./components/ShinyText";
import CustomCursor from "./components/CustomCursor";

const MODELS = [
  {
    id: "carrera",
    name: "911 Carrera",
    year: "1963",
    acceleration: "3.9s",
    power: "290kW/394PS",
    topSpeed: "294km/h",
    description: "Crucial to the unique 911 driving experience: the optimal set-up. This includes new engine mountings and a completely revised chassis and even wider wheels to transform the increased power output into breathtaking dynamics.",
    image: "/asset/image.png"
  },
  {
    id: "cabriolet",
    name: "911 Carrera Cabriolet",
    year: "1982",
    acceleration: "4.1s",
    power: "290kW/394PS",
    topSpeed: "291km/h",
    description: "Anyone who dreams of a Porsche usually has an image in their mind: the 911 has been the epitome of an exciting, powerful sports car with day-to-day usability for 60 years.",
    image: "/asset/image copy 4.png"
  },
  {
    id: "targa",
    name: "911 Targa 4s",
    year: "1965",
    acceleration: "3.5s",
    power: "353kW/480PS",
    topSpeed: "300km/h",
    description: "The heart of the 911 Targa 4S still beats at the rear and sets the pulse of Porsche enthusiasts racing even faster than it did 60 years ago.",
    image: "/asset/image copy 2.png"
  },
  {
    id: "gt3rs",
    name: "911 GT3 RS",
    year: "1999",
    acceleration: "3.2s",
    power: "386kW/525PS",
    topSpeed: "296km/h",
    description: "The 911 GT3 RS only accepts minimalism to further reduce weight. Available as an option for the first time, the Weissach package once again saves valuable weight.",
    image: "/asset/image copy 3.png"
  },
  {
    id: "turbos",
    name: "911 Turbo S",
    year: "1975",
    acceleration: "2.7s",
    power: "478kW/650PS",
    topSpeed: "330km/h",
    description: "The 911 Turbo S is the flagship of the 911 range, combining breathtaking performance with everyday usability. With its 3.7-liter twin-turbo flat six, it delivers a driving experience that is as exciting as it is precise.",
    image: "/asset/image copy 5.png"
  },
  {
    id: "dakar",
    name: "911 Dakar",
    year: "2023",
    acceleration: "3.4s",
    power: "353kW/480PS",
    topSpeed: "240km/h",
    description: "Inspired by the iconic victory in the 1984 Paris-Dakar Rally, the 911 Dakar is a sports car that feels just as at home on the desert sands as it does on the tarmac. Featuring increased ground clearance and a specialized off-road suspension system.",
    image: "/asset/dakar.png"
  }
];

export default function App() {
  const [models, setModels] = useState(MODELS);
  const [activeModel, setActiveModel] = useState(MODELS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/models');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setModels(data);
            setActiveModel(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch models, using fallback data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const { scrollYProgress } = useScroll();
  const backgroundFilter = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    ["brightness(30%) blur(0px)", "brightness(60%) blur(8px)", "brightness(100%) blur(0px)"]
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black porsche-grid">
      <CustomCursor />
      <div className="scanline pointer-events-none" />

      {/* Sticky Background Video */}
      <motion.div 
        style={{ filter: backgroundFilter }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/asset/VID_20260220_150236.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </motion.div>

      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -260 }}
        className="fixed left-0 top-0 h-full w-72 bg-black border-r border-white/10 z-50 flex flex-col"
      >
        <div className="p-8 border-bottom border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4 text-3xl text-yellow-400 uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
            <img 
              src="/asset/image copy.png" 
              alt="Porsche Logo" 
              className="h-10 w-auto object-contain"
            />
            <ShinyText 
              text="PORSCHE" 
              color="#fbbf24" 
              shineColor="#ffffff"
              speed={3}
            />
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-12">
          <div className="px-8 mb-4 text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
            Navigation
          </div>
          <div
            onClick={() => scrollToSection('hero')}
            className={`sidebar-item ${activeModel.id === 'hero' ? 'active' : ''}`}
          >
            Home
          </div>
          <div
            onClick={() => scrollToSection('heritage')}
            className={`sidebar-item ${activeModel.id === 'heritage' ? 'active' : ''}`}
          >
            The Heritage
          </div>
          <div className="px-8 mt-8 mb-4 text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
            Lineup
          </div>
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => {
                setActiveModel(model);
                scrollToSection(model.id);
              }}
              className={`sidebar-item ${activeModel.id === model.id ? 'active' : ''}`}
            >
              {model.name}
            </div>
          ))}
        </nav>

        <div className="p-8 text-[10px] uppercase tracking-widest text-white/30 font-mono border-t border-white/10">
          © 2026 Porsche AG
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`relative z-10 transition-all duration-500 ${isSidebarOpen ? 'pl-72' : 'pl-12'}`}>
        
        {/* Top Header Bar */}
        <header className="fixed top-0 right-0 left-0 h-20 z-40 flex items-center justify-between px-12 pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
             <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               Next-Gen Performance Protocol
             </div>
          </div>
          <button 
            onClick={() => window.open('https://make-your-own-porsche.vercel.app/', '_blank')}
            className="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-colors pointer-events-auto"
          >
            Configure
          </button>
        </header>

        {/* Hero Section (Redesigned based on FLUXA inspiration) */}
        <section id="hero" className="relative h-screen flex flex-col justify-center px-12 lg:px-24 overflow-hidden">
          
          <div className="max-w-7xl relative z-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-[8vw] lg:text-[7.5vw] leading-[0.9] tracking-tighter flex flex-col uppercase whitespace-nowrap" style={{ fontFamily: 'Impact, sans-serif' }}>
                <span className="text-white">Engineered For</span>
                <RotatingText
                  texts={["The Unbeatable", "True Performance"]}
                  mainClassName={`overflow-hidden ${rotationIndex === 0 ? 'text-yellow-400' : 'text-white/90'}`}
                  staggerDuration={0.015} // Slightly faster stagger
                  staggerFrom="first"
                  animatePresenceMode="popLayout"
                  initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
                  transition={{ 
                    type: "spring", 
                    damping: 25, 
                    stiffness: 200, // Softer spring
                    mass: 0.8
                  }}
                  rotationInterval={3500}
                  onNext={setRotationIndex}
                />
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-lg"
            >
              <p className="text-lg text-white/50 leading-relaxed mb-12">
                Porsche deploys advanced engineering strategies to generate sustainable 
                performance from iconic silhouettes securely and transparently.
              </p>
              
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => scrollToSection('heritage')}
                  className="group flex items-center gap-4 text-sm uppercase tracking-widest font-bold"
                >
                  Explore Legacy
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Large Background Graphic (Inspired by the "F" in FLUXA) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.05] translate-x-1/4 z-10">
             <div className="text-[60vw] font-heading font-extrabold leading-none">911</div>
          </div>

          {/* Bottom "Partners" Row (Inspired by FLUXA) */}
          <div className="absolute bottom-12 left-12 lg:left-24 right-12 lg:right-24">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase mb-6">
              Powered by the Porsche Ecosystem
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-6 items-center opacity-40 grayscale">
               {models.map(m => (
                 <div key={m.id} className="flex items-center gap-2 font-bold tracking-widest text-sm">
                   <div className="w-1 h-1 bg-white rounded-full" />
                   {m.name.split(' ').pop()}
                 </div>
               ))}
               <div className="flex items-center gap-2 font-bold tracking-widest text-sm">
                 <div className="w-1 h-1 bg-white rounded-full" />
                 <span className="text-yellow-400">STUTTGART</span>
               </div>
            </div>
          </div>
        </section>

        {/* Heritage Section (Brutalist Style) */}
        <section id="heritage" className="relative h-screen flex items-center px-12 lg:px-24 overflow-hidden border-t border-white/5">
          {/* Decorative Plus Signs */}
          <div className="absolute top-12 left-12 text-white/20 font-mono text-xl">+</div>
          <div className="absolute top-12 right-12 text-white/20 font-mono text-xl">+</div>
          <div className="absolute bottom-12 left-12 text-white/20 font-mono text-xl">+</div>
          <div className="absolute bottom-12 right-12 text-white/20 font-mono text-xl">+</div>

          {/* Top Right Description Block */}
          <div className="absolute top-24 right-12 lg:right-24 max-w-md text-right">
            <motion.div 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="font-mono text-[11px] leading-relaxed tracking-widest text-white uppercase"
            >
              <ShinyText 
                text="DRIVEN BY DREAMS. SINCE 1948, PORSCHE HAS BEEN SYNONYMOUS WITH SPORTS CAR CONSTRUCTION AT THE HIGHEST LEVEL. EVERY PORSCHE IS A TESTAMENT TO OUR COMMITMENT TO PERFORMANCE, DESIGN, AND THE UNRELENTING PURSUIT OF THE PERFECT DRIVING EXPERIENCE. THE 911 REMAINS THE HEART OF THE BRAND, A TIMELESS ICON THAT CONTINUES TO DEFINE THE FUTURE OF THE SPORTS CAR." 
                color="rgba(255, 255, 255, 0.2)"
                shineColor="#ffffff"
                speed={3}
                spread={90}
              />
            </motion.div>
          </div>

          {/* Center Display Text */}
          <div className="w-full">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-[8vw] font-heading font-extrabold tracking-tighter leading-none uppercase flex items-center"
            >
              <BlurText 
                text="PORSCHE" 
                delay={150}
                animateBy="characters"
                direction="top"
                className="text-yellow-400"
              />
              <span className="text-white/10 text-[1.2vw] align-top ml-4 font-mono">(C)</span>
            </motion.h2>
          </div>

          {/* Bottom Elements */}
          <div className="absolute bottom-24 left-12 lg:left-24 right-12 lg:right-24">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-1 bg-white/40 mb-6" 
            />
            <div className="flex justify-between items-end">
              <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                Original Wordmark / <span className="text-yellow-400">Stuttgart</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase mb-1">Design by</div>
                <div className="font-mono text-xs tracking-widest text-white uppercase">Type-911 / Legacy</div>
              </div>
            </div>
          </div>
        </section>

        {/* Model Sections */}
        {models.map((model) => (
          <section 
            id={model.id} 
            key={model.id}
            className="relative z-10 min-h-screen flex items-center px-12 lg:px-24 py-24 border-t border-white/5"
          >
            <div className="grid lg:grid-cols-2 gap-24 items-center w-full">
              <ElectricBorder
                color="#fbbf24" // yellow-400
                speed={0.5}
                chaos={0.04}
                borderRadius={30}
                className="w-full"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="aspect-video bg-white/5 border border-white/10 relative overflow-hidden group w-full rounded-[30px]"
                >
                  {model.image ? (
                    <img 
                      src={model.image} 
                      alt={model.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/10 font-serif italic text-4xl">
                      {model.name}
                    </div>
                  )}
                  {/* Decorative elements to mimic high-tech UI */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/20" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/20" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </ElectricBorder>

              <div className="space-y-12 relative z-20">
                <motion.div
                  initial={{ opacity: 0, y: 40, filter: "blur(15px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <h2 className="text-5xl font-heading font-extrabold mb-6 uppercase tracking-tight">
                    {model.name.split(' ').map((word, i) => (
                      <span key={i} className={word === "911" ? "text-yellow-400" : ""}>
                        {word}{' '}
                      </span>
                    ))}
                  </h2>
                  <p className="text-white/60 leading-relaxed max-w-lg">
                    {model.description}
                  </p>
                </motion.div>

                <div className="grid grid-cols-3 gap-8">
                  <StatItem icon={<Gauge size={16} />} label="0-100 km/h" value={model.acceleration} />
                  <StatItem icon={<Zap size={16} />} label="Power" value={model.power} />
                  <StatItem icon={<Wind size={16} />} label="Top Speed" value={model.topSpeed} />
                </div>

                <motion.button
                  onClick={() => window.open(`https://www.porsche.com/usa/models/911/${model.id}/`, '_blank')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-widest font-bold"
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </section>
        ))}

        {/* Footer */}
        <footer className="pt-32 pb-12 px-12 lg:px-24 border-t border-white/5 bg-black/40 backdrop-blur-[7px] relative z-10">
          {/* CTA Section */}
          <div className="mb-32">
            <div className="max-w-4xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl lg:text-7xl font-heading font-extrabold mb-8 uppercase tracking-tighter leading-none"
              >
                Ready to drive <br />
                <span className="text-yellow-400 italic">your dream?</span>
              </motion.h2>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => window.open('https://make-your-own-porsche.vercel.app/', '_blank')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-yellow-400 text-black text-xs uppercase tracking-widest font-bold"
                >
                  Configure Yours
                </motion.button>
                <motion.button
                  onClick={() => window.open('https://www.porsche.com/usa/dealersearch/', '_blank')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 hover:bg-white/10 transition-all text-xs uppercase tracking-widest font-bold"
                >
                  Find a Dealer
                </motion.button>
              </div>
            </div>
          </div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-24">
            <div className="col-span-2 lg:col-span-1">
              <div className="font-heading font-black text-2xl tracking-tighter mb-8 italic text-yellow-400">PORSCHE</div>
              <div className="flex gap-4">
                <SocialIcon href="https://www.instagram.com/porsche/" icon={<Instagram size={18} />} />
                <SocialIcon href="https://twitter.com/porsche" icon={<Twitter size={18} />} />
                <SocialIcon href="https://www.youtube.com/@Porsche" icon={<Youtube size={18} />} />
                <SocialIcon href="https://www.facebook.com/porsche" icon={<Facebook size={18} />} />
                <SocialIcon href="https://www.linkedin.com/company/porsche-ag/" icon={<Linkedin size={18} />} />
              </div>
            </div>
            
            <FooterColumn title="Models" links={["911 Carrera", "911 Turbo", "911 GT3", "Taycan", "Panamera"]} />
            <FooterColumn title="Heritage" links={["History", "Museum", "Stuttgart", "Legacy", "Motorsport"]} />
            <FooterColumn title="Services" links={["Financial Services", "Leasing", "Insurance", "Maintenance", "Porsche Connect"]} />
            <FooterColumn title="Company" links={["About Porsche", "Careers", "Press", "Contact", "Sustainability"]} />
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">All systems operational</span>
            </div>
            
            <div className="font-mono text-[10px] tracking-widest text-white/20 uppercase">
              © 2024 Porsche AG. <span className="mx-2">/</span> Legal Notice <span className="mx-2">/</span> Privacy Policy
            </div>

            <div className="flex items-center gap-2 text-white/40 hover:text-white transition-colors cursor-pointer">
              <Globe size={14} />
              <span className="font-mono text-[10px] tracking-widest uppercase">International / English</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: ReactNode, href: string }) {
  return (
    <motion.a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
      className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
    >
      {icon}
    </motion.a>
  );
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="space-y-6">
      <h4 className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">{title}</h4>
      <ul className="space-y-3">
        {links.map(link => (
          <li key={link}>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors tracking-tight">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 text-white/40">
        {icon}
        <span className="text-[10px] uppercase tracking-widest font-mono">{label}</span>
      </div>
      <div className="text-xl font-mono tracking-tighter">{value}</div>
    </motion.div>
  );
}
