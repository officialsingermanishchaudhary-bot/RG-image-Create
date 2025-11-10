import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const getStartedLink = user?.isLoggedIn ? '/generator' : '/auth';

  const features = [
    { icon: 'bot', title: 'AI-Powered Generation', description: 'Create stunning visuals from simple text prompts with our advanced AI.' },
    { icon: 'image-up', title: 'AI Image Editor', description: 'Upload your own photos and edit them with text to create personalized art.'},
    { icon: 'database', title: 'Simple Credit System', description: 'Get started with free credits and purchase more only when you need them.' },
    { icon: 'sparkles', title: 'Daily Credits', description: 'Subscribe to a daily plan and get a fresh batch of credits every single day.' },
  ];

  return (
    <div className="space-y-20 pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display text-gray-900 dark:text-white">
          Bring Your Imagination to Life with
          <span className="block brand-gradient text-transparent bg-clip-text mt-2 animate-text-gradient">RG AI Images</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
          Generate high-quality, custom images from text prompts in seconds. Professional, private, and powerful.
        </p>
        <div className="mt-8">
          <Link to={getStartedLink}>
            <Button className="text-lg px-8 py-3.5 font-bold">
              Try Now For Free
              <i data-lucide="arrow-right" className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 glass-card rounded-xl shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <i data-lucide={feature.icon} className="w-10 h-10 text-brandFrom mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white font-display">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;