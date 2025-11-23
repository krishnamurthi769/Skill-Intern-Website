
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { TESTIMONIALS_DATA } from '../constants';
import SectionHeader from './ui/SectionHeader';
import { Quote } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';
import ImageWithFallback from './ui/ImageWithFallback';

const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = React.useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/content/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
          console.error('Testimonials data is not an array:', data);
          setTestimonials([]);
        }
      })
      .catch(err => console.error('Failed to fetch testimonials:', err));
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".testimonial-card", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [testimonials]);

  return (
    <section ref={containerRef} className="py-32 bg-gradevo-navy relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradevo-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6">
        <SectionHeader title="Client #Stories" subtitle="Don't just take our word for it." />

        <div className={`grid ${testimonials.length <= 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {testimonials.slice(0, 6).map((item) => (
            <div key={item.id} className={`testimonial-card bg-white/5 ${testimonials.length <= 3 ? 'p-8 md:p-10' : 'p-6'} rounded-3xl border border-white/5 relative group hover:bg-white/10 transition-colors duration-500`}>
              <Quote className={`text-gradevo-red ${testimonials.length <= 3 ? 'mb-6' : 'mb-4'} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} size={testimonials.length <= 3 ? 48 : 32} />
              <p className={`${testimonials.length <= 3 ? 'text-xl md:text-3xl' : 'text-lg md:text-xl'} font-display font-medium text-white ${testimonials.length <= 3 ? 'mb-8' : 'mb-6'} leading-tight`}>
                "{item.content}"
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {item.image_url ? (
                  <ImageWithFallback
                    src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL}${item.image_url}`}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className={`${testimonials.length <= 3 ? 'w-12 h-12' : 'w-10 h-10'} rounded-full object-cover border border-white/10`}
                  />
                ) : (
                  <div className={`${testimonials.length <= 3 ? 'w-12 h-12' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-gradevo-blue to-gradevo-navy flex items-center justify-center text-white font-bold text-lg border border-white/10`}>
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className={`text-white font-bold ${testimonials.length <= 3 ? 'text-lg' : 'text-base'} flex flex-wrap items-center gap-2`}>
                    {item.name}
                    {item.linkedin_url && (
                      <a href={item.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm whitespace-nowrap">
                        (LinkedIn)
                      </a>
                    )}
                  </h4>
                  <p className="text-gradevo-white/60 text-sm uppercase tracking-wider">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {testimonials.length > 6 && (
          <div className="mt-12 text-center">
            <MagneticButton variant="secondary">View All Stories</MagneticButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
