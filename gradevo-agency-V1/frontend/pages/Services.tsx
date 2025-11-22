
import * as React from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { SERVICES_DATA } from '../constants';
import { Code2, Laptop, LayoutTemplate, Fingerprint, Megaphone, Sparkles } from 'lucide-react';
import CTABanner from '../components/CTABanner';

const Services: React.FC = () => {
  const [services, setServices] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/content/services`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Services data is not an array:', data);
          setServices([]);
        }
      })
      .catch(err => console.error('Failed to fetch services:', err));
  }, []);

  // Helper to map icon string to Lucide component
  const getIcon = (iconName: string) => {
    const icons: any = { Code2, Laptop, LayoutTemplate, Fingerprint, Megaphone, Sparkles };
    return icons[iconName] || Sparkles;
  };

  return (
    <div className="pt-32 bg-gradevo-navy min-h-screen">
      <div className="container mx-auto px-6 pb-20">
        <SectionHeader title="What We #Do" subtitle="Comprehensive digital solutions tailored to your needs." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <div key={service.id} className="bg-white/5 p-8 md:p-12 rounded-3xl hover:bg-white/10 transition-colors border border-white/5 group">
                <div className="flex items-center justify-between mb-8">
                  <Icon size={48} className="text-gradevo-blue group-hover:text-gradevo-red transition-colors duration-300" />
                  <span className="text-4xl font-bold text-white/10 group-hover:text-white/20">0{service.id}</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-4">{service.title}</h3>
                <p className="text-lg text-white/70 mb-8">{service.description}</p>

                {/* Details are not currently in DB schema, hiding for now or could add to DB later */}
                {/* <div className="grid grid-cols-2 gap-4">
                  {service.details && service.details.map((detail: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                      <div className="w-1.5 h-1.5 bg-gradevo-red rounded-full" />
                      {detail}
                    </div>
                  ))}
                </div> */}
              </div>
            );
          })}
        </div>
      </div>

      <CTABanner />
    </div>
  );
};

export default Services;
