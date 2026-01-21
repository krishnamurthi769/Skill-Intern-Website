"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Ranjith",
    role: "AI Engineer at TechNow",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The curriculum is industry-focused and the mentors are exceptional. I transitioned from a non-tech background to landing a senior developer role.",
    company: "TechNow",
  },
  {
    name: "Rakshitha",
    role: "Data Scientist at Zomato",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "The hands-on projects and real-world applications helped me understand complex concepts easily. Highly recommend for career switchers.",
    company: "Zomato",
  },
  {
    name: "Deepak",
    role: "Product Manager at Paytm",
    image: "https://randomuser.me/api/portraits/men/86.jpg",
    text: "The placement support is outstanding. They helped me prepare for interviews and connected me with top companies.",
    company: "Paytm",
  },
  {
    name: "Jenifer",
    role: "Senior Developer at Meta",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "The design thinking approach and portfolio building sessions were game-changers for my career transition.",
    company: "Meta",
  },
  {
    name: "Surya",
    role: "Product Designer at Figma",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "The cloud computing track gave me practical skills that I use daily in my current role. Best investment for my career.",
    company: "Figma",
  },
  {
    name: "Mohan",
    role: "Marketing Manager at Myntra",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    text: "The digital marketing program is comprehensive and up-to-date with the latest industry trends and tools.",
    company: "Myntra",
  },
  {
    name: "Selva",
    role: "Cybersecurity Analyst at Infosys",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    text: "The practical labs and mentorship made learning cybersecurity approachable. I now work with confidence.",
    company: "Infosys",
  },
  {
    name: "Anurag",
    role: "AI Engineer at TCS",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    text: "The AI specialization was very well designed. The hands-on projects really helped in understanding the core concepts.",
    company: "TCS",
  }
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Testimony to What We Do</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hear from our students who have transformed their careers with us.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1 - Left to Right */}
        <div className="flex overflow-hidden fade-mask">
          <motion.div
            className="flex gap-6 min-w-full pl-6"
            animate={{ x: [0, -2000] }}
            transition={{
              repeat: Infinity,
              duration: 50,
              ease: "linear"
            }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`row1-${i}`} data={t} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex overflow-hidden fade-mask">
          <motion.div
            className="flex gap-6 min-w-full pl-6"
            animate={{ x: [-2000, 0] }}
            transition={{
              repeat: Infinity,
              duration: 60,
              ease: "linear"
            }}
          >
            {[...[...testimonials].reverse(), ...testimonials].map((t, i) => (
              <TestimonialCard key={`row2-${i}`} data={t} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ data }: { data: typeof testimonials[0] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-[350px] md:min-w-[400px] flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <img src={data.image} alt={data.name} className="object-cover w-full h-full" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{data.name}</h4>
          <p className="text-sm text-purple-600 font-medium">{data.role}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
        {data.text}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-400">
        Currently at <span className="text-gray-600 font-medium">{data.company}</span>
      </div>
    </div>
  )
}
