
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import MagneticButton from '../components/ui/MagneticButton';
import SectionHeader from '../components/ui/SectionHeader';
import Marquee from '../components/ui/Marquee';
import ServiceList from '../components/ServiceList';
import WhatDefinesUs from '../components/WhatDefinesUs';
import { PORTFOLIO_DATA } from '../constants';
import CTABanner from '../components/CTABanner';
import Testimonials from '../components/Testimonials';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const Home: React.FC = () => {
  const heroTextRef = useRef<HTMLDivElement>(null);

  const [featuredWork, setFeaturedWork] = React.useState<any[]>([]);
  const [totalFeatured, setTotalFeatured] = React.useState(0);

  useEffect(() => {
    const fetchFeaturedWork = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/portfolio`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const featured = data.filter((item: any) => item.is_featured);
          setTotalFeatured(featured.length);
          // If > 6, take 6. Else take all
          setFeaturedWork(featured.slice(0, 6));
        } else {
          console.error('Portfolio data is not an array:', data);
          setFeaturedWork([]);
        }
      } catch (err) {
        console.error('Failed to fetch featured work', err);
      }
    };

    fetchFeaturedWork();

    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const tl = gsap.timeline();
    tl.fromTo(heroTextRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
    );

  }, []);

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-start">
        <Hero3D />

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div ref={heroTextRef} className="max-w-2xl">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Welcome to <br />
              <span className="text-gradevo-orange">#</span>GRADEVO
            </h1>

            <p className="text-xl text-gradevo-white/80 mb-10 font-light leading-relaxed mix-blend-difference">
              A full-stack creative agency blending design, engineering, and storytelling to help brands grow digitally.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link to="/contact">
                <MagneticButton variant="primary">Start a Project</MagneticButton>
              </Link>
              <Link to="/portfolio">
                <MagneticButton variant="secondary">View Our Work</MagneticButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50 text-sm tracking-widest uppercase">
          Scroll
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="bg-gradevo-white/5 py-6 border-y border-white/10 backdrop-blur-sm">
        <Marquee text="STRATEGY • DESIGN • DEVELOPMENT • BRANDING • MARKETING • " className="text-xl font-bold text-gradevo-white/80" />
      </div>

      {/* SERVICES PREVIEW */}
      <section className="py-32 relative bg-gradevo-navy">
        <div className="container mx-auto px-6 mb-16">
          <SectionHeader title="Our #Expertise" subtitle="We build digital experiences that are fast, beautiful, and ready to scale." />
        </div>
        <ServiceList />
      </section>

      {/* DEFINES US SECTION (Horizontal Scroll) */}
      <WhatDefinesUs />

      {/* FEATURED WORK */}
      <section className="py-32 bg-gradevo-navy">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-20">
            <SectionHeader title="Selected #Work" className="mb-0" />
            {/* Show View All button if total items > 6 */}
            {totalFeatured > 6 && (
              <Link to="/portfolio" className="hidden md:block">
                <MagneticButton variant="secondary">View All Projects</MagneticButton>
              </Link>
            )}
          </div>

          <div className={`grid ${totalFeatured <= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {featuredWork.map((item, idx) => (
              <div
                key={item.id}
                className={`group relative ${totalFeatured <= 3 && idx % 2 !== 0 ? 'md:mt-24' : ''}`}
              >
                <Link to="/portfolio">
                  <div
                    className="overflow-hidden rounded-2xl mb-6 relative cursor-none"
                    data-cursor="View More"
                  >
                    <div className="absolute inset-0 bg-gradevo-blue/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                    <ImageWithFallback
                      src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[4/3] object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-gradevo-red text-sm font-bold uppercase tracking-wider mb-2 block">{item.category}</span>
                      <h3 className={`${totalFeatured <= 3 ? 'text-3xl' : 'text-xl'} font-display font-bold text-gradevo-white group-hover:text-gradevo-blue transition-colors`}>{item.title}</h3>
                    </div>
                    {totalFeatured <= 3 && (
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-gradevo-white group-hover:text-gradevo-navy transition-all">
                        <span className="text-xl">↗</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            <Link to="/portfolio">
              <MagneticButton variant="secondary">View All Projects</MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA BANNER (Pre-Footer) */}
      <CTABanner />
    </div>
  );
};

export default Home;
