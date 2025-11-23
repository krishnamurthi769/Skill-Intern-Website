
import React from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { PORTFOLIO_DATA } from '../constants';
import CTABanner from '../components/CTABanner';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const CATEGORIES = ['All', 'Brand Solutions', 'Tech Solutions', 'Media Solutions', 'Others'];

const Portfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = React.useState<any[]>([]);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [loading, setLoading] = React.useState(true);
  const [itemsToShow, setItemsToShow] = React.useState(6); // Show 6 items initially

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/content/portfolio`)
      .then(res => res.json())
      .then(data => setPortfolioItems(data))
      .catch(err => console.error('Failed to fetch portfolio:', err))
      .finally(() => setLoading(false));
  }, []);

  // Reset items to show when category changes
  React.useEffect(() => {
    setItemsToShow(6);
  }, [activeCategory]);

  const filteredItems = activeCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  const displayedItems = filteredItems.slice(0, itemsToShow);
  const hasMore = filteredItems.length > itemsToShow;

  const handleViewMore = () => {
    setItemsToShow(prev => prev + 6);
  };

  return (
    <div className="pt-32 bg-gradevo-navy min-h-screen">
      <div className="container mx-auto px-6 pb-20">
        <SectionHeader title="Our #Work" subtitle="A selection of projects we are proud of." />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg md:text-xl font-bold transition-colors duration-300 ${activeCategory === category
                ? 'text-white'
                : 'text-white/40 hover:text-white/70'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-16">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-2/3">
                  <div className="w-full aspect-video bg-white/5 rounded-2xl animate-pulse" />
                </div>
                <div className="w-full md:w-1/3 space-y-4">
                  <div className="h-4 bg-white/5 rounded w-24 animate-pulse" />
                  <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
                  <div className="h-20 bg-white/5 rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            displayedItems.map((item, index) => (
              <div key={item.id} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div
                  className="w-full md:w-2/3 relative group cursor-none overflow-hidden rounded-2xl"
                  data-cursor="View More"
                >
                  <ImageWithFallback
                    src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradevo-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                </div>

                <div className="w-full md:w-1/3">
                  <span className="text-gradevo-red font-bold tracking-widest uppercase mb-2 block">{item.category}</span>
                  <h3 className="text-4xl font-display font-bold text-white mb-6">{item.title}</h3>
                  <p className="text-white/70 mb-8 text-lg">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {item.tech_stack ? (
                      item.tech_stack.split(',').map((tag: string) => (
                        <span key={tag} className="px-3 py-1 border border-white/20 rounded-full text-xs text-white/60">{tag.trim()}</span>
                      ))
                    ) : (
                      ['React', 'GSAP', 'Design'].map(tag => (
                        <span key={tag} className="px-3 py-1 border border-white/20 rounded-full text-xs text-white/60">{tag}</span>
                      ))
                    )}
                  </div>
                  {item.project_url ? (
                    <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="text-white font-bold border-b-2 border-gradevo-red pb-1 hover:text-gradevo-red transition-colors inline-block">
                      View Project
                    </a>
                  ) : (
                    <button className="text-white font-bold border-b-2 border-gradevo-red pb-1 hover:text-gradevo-red transition-colors">
                      View Case Study
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* View More Button */}
        {!loading && hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={handleViewMore}
              className="px-8 py-4 bg-gradevo-red text-white font-bold rounded-full hover:bg-gradevo-red/80 transition-colors duration-300"
            >
              View More Projects
            </button>
          </div>
        )}
      </div>

      <CTABanner />
    </div>
  );
};

export default Portfolio;
