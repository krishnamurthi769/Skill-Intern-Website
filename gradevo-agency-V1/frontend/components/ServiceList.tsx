
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticButton from './ui/MagneticButton';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/services`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Services data is not an array:', data);
          setServices([]);
        }
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, []);

  if (services.length === 0) return null;

  const isGrid = services.length > 4;
  const displayedServices = services.slice(0, 6);

  return (
    <div className="border-t border-white/10">
      {isGrid ? (
        // Grid Layout for > 4 items
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors duration-500 flex flex-col justify-between h-full min-h-[250px]"
              >
                <div>
                  <span className="text-gradevo-red font-display font-bold text-lg mb-4 block">0{index + 1}</span>
                  <h3 className="text-2xl font-display font-bold text-gradevo-white mb-3 group-hover:text-gradevo-blue transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gradevo-white/60 text-sm line-clamp-3">{service.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <div className="w-10 h-10 rounded-full border border-gradevo-red/50 flex items-center justify-center text-gradevo-red group-hover:bg-gradevo-red group-hover:text-white transition-all">
                    <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {services.length > 6 && (
            <div className="mt-12 text-center">
              <Link to="/services">
                <MagneticButton variant="secondary">View All Services</MagneticButton>
              </Link>
            </div>
          )}
        </div>
      ) : (
        // List Layout for <= 4 items (Original Design)
        <div className="flex flex-col">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative border-b border-white/10 py-12 md:py-16 px-4 md:px-0 transition-colors duration-500 hover:bg-white/5 cursor-pointer overflow-hidden"
            >
              <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6 mb-4 md:mb-0">
                  <span className="text-gradevo-red font-display font-bold text-lg sm:text-xl">0{index + 1}</span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gradevo-white group-hover:translate-x-4 transition-transform duration-500 break-words">
                    {service.title}
                  </h3>
                </div>

                <div className="flex items-center gap-8 opacity-0 md:opacity-100 md:translate-x-10 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-gradevo-white/60 max-w-xs hidden md:block">{service.description}</p>
                  <div className="w-12 h-12 rounded-full border border-gradevo-red/50 flex items-center justify-center text-gradevo-red group-hover:bg-gradevo-red group-hover:text-white transition-all">
                    <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Abstract Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-gradevo-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
