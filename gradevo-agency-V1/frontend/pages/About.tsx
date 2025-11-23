
import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import MagneticButton from '../components/ui/MagneticButton';
import { Link } from 'react-router-dom';
import CTABanner from '../components/CTABanner';

const About: React.FC = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/site-content`);
        const data = await res.json();
        const contentMap: Record<string, string> = {};
        data.forEach((item: { key: string; value: string }) => {
          contentMap[item.key] = item.value;
        });
        setContent(contentMap);
      } catch (err) {
        console.error('Failed to fetch content', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="pt-32 bg-gradevo-navy min-h-screen">
      <div className="container mx-auto px-6 pb-20">
        <SectionHeader title="Our #Story" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div className="text-lg text-gradevo-white/80 leading-relaxed space-y-6">
            <p>
              {content.story_p1 || "Gradevo was born from a simple idea: The digital world shouldn't just be functional; it should be immersive. We are a collective of designers, engineers, and strategists obsessed with the space where art meets technology."}
            </p>
            <p>
              {content.story_p2 || "Our name, Gra#Devo, represents the fusion of Graphics (Design) and Development. The hashtag isn't just a symbol; it's a connector. It connects brands to audiences, problems to solutions, and dreams to reality."}
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 border-2 border-gradevo-red translate-x-4 translate-y-4 rounded-xl" />
            {loading ? (
              <div className="relative rounded-xl bg-white/5 animate-pulse w-full h-[400px]" />
            ) : (
              <img
                src={content.story_image ? (content.story_image.startsWith('http') ? content.story_image : `${import.meta.env.VITE_API_URL}${content.story_image}`) : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"}
                alt="Team working"
                loading="lazy"
                decoding="async"
                className="relative rounded-xl grayscale hover:grayscale-0 transition-all duration-500 w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="p-8 bg-white/5 rounded-2xl border-l-4 border-gradevo-red">
            <h3 className="text-2xl font-bold text-white mb-4">{content.mission_title || "Mission"}</h3>
            <p className="text-white/70">{content.mission_text || "To elevate brands through digital innovation that defies the ordinary."}</p>
          </div>
          <div className="p-8 bg-white/5 rounded-2xl border-l-4 border-gradevo-blue">
            <h3 className="text-2xl font-bold text-white mb-4">{content.vision_title || "Vision"}</h3>
            <p className="text-white/70">{content.vision_text || "A web where every interaction is a memorable experience."}</p>
          </div>
          <div className="p-8 bg-white/5 rounded-2xl border-l-4 border-white">
            <h3 className="text-2xl font-bold text-white mb-4">{content.values_title || "Values"}</h3>
            <p className="text-white/70">{content.values_text || "Innovation. Transparency. Perfection. Speed."}</p>
          </div>
        </div>

        <div className="text-center mb-20">
          <h3 className="text-3xl font-display font-bold text-white mb-8">Ready to meet the team?</h3>
          <Link to="/contact"><MagneticButton>Contact Us</MagneticButton></Link>
        </div>
      </div>

      <CTABanner />
    </div>
  );
};

export default About;
