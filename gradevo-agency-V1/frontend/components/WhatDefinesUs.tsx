
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';

interface DnaItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const WhatDefinesUs: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [definesData, setDefinesData] = useState<DnaItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/dna`);
        const data = await res.json();
        setDefinesData(data);
      } catch (error) {
        console.error('Error fetching DNA data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (definesData.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    // Only enable horizontal scroll on desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const scrollWidth = track.scrollWidth - window.innerWidth + 100; // Buffer

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          invalidateOnRefresh: true,
        }
      });

      tl.to(track, {
        x: -scrollWidth,
        ease: "none",
      });

      // Parallax effect for images inside cards
      const images = track.querySelectorAll('.card-image');
      images.forEach((img) => {
        gsap.fromTo(img,
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tl,
              start: "left right",
              end: "right left",
              scrub: true
            }
          }
        );
      });
    });

    return () => mm.revert();
  }, [definesData]);

  return (
    <section ref={sectionRef} className="relative bg-gradevo-navy py-20 md:py-0 md:h-screen flex flex-col md:flex-row items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(27,43,238,0.1),transparent_50%)] pointer-events-none" />

      {/* Sticky Header (Desktop) / Normal Header (Mobile) */}
      <div ref={headerRef} className="w-full md:w-[30vw] md:h-full flex flex-col justify-center px-6 md:px-12 md:border-r border-white/10 z-10 bg-gradevo-navy md:bg-transparent mb-12 md:mb-0">
        <div className="overflow-hidden">
          <p className="text-gradevo-red font-bold tracking-[0.2em] uppercase mb-4">Our DNA</p>
        </div>
        <h2 className="text-5xl md:text-7xl font-display font-bold text-gradevo-white leading-[0.95]">
          What <br /> Defines <br /> <span className="text-gradevo-blue">#Us</span>
        </h2>
        <p className="mt-8 text-gradevo-white/60 leading-relaxed max-w-xs">
          The core principles that drive our creativity, engineering, and strategy.
        </p>
      </div>

      {/* Scrolling Track */}
      <div className="w-full md:w-[70vw] overflow-hidden h-full flex items-center">
        <div ref={trackRef} className="flex flex-col md:flex-row gap-8 md:gap-16 px-6 md:px-16 h-auto md:h-[70vh]">
          {definesData.map((item, index) => (
            <div
              key={item.id}
              className="group relative flex-shrink-0 w-full md:w-[35vw] min-h-[400px] md:min-h-0 md:h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-gradevo-red/50 transition-colors duration-500"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradevo-navy/40 z-10 group-hover:bg-gradevo-navy/20 transition-colors duration-500" />
                <img
                  src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="card-image w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                />
              </div>

              {/* Content Layer */}
              <div className="relative z-20 h-full flex flex-col justify-between p-8 md:p-10">
                <div className="flex justify-between items-start">
                  <span className="text-5xl font-display font-bold text-white/10 group-hover:text-white/30 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gradevo-red transition-colors duration-300">
                    <Plus size={20} className="text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
                    {item.title.split('#').map((part, i) => (
                      <React.Fragment key={i}>
                        {i === 0 ? part : <span className="text-gradevo-red">#{part}</span>}
                        {' '}
                      </React.Fragment>
                    ))}
                  </h3>
                  <p className="text-white/70 leading-relaxed transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* End Spacer for comfortable scrolling */}
          <div className="w-1 md:w-24 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
};

export default WhatDefinesUs;
