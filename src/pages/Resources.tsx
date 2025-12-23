import React, { useState } from 'react';
import { FileText, Newspaper, MessageSquare, BookOpen, ArrowRight, Download, Calendar } from 'lucide-react';
import { blogPosts, testimonials } from '../data/resources';

const Resources = () => {
  const [activeTab, setActiveTab] = useState<'blogs' | 'reports' | 'news' | 'testimonials'>('blogs');

  // Filter content based on active tab
  const displayedPosts = activeTab === 'testimonials' 
    ? [] 
    : blogPosts.filter(post => 
        activeTab === 'blogs' ? post.type === 'blog' : 
        activeTab === 'reports' ? post.type === 'report' : 
        post.type === 'news'
      );

  return (
    <div className="min-h-screen bg-brand-light">
      
      {/* Header */}
      <div className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Resources & Insights</h1>
          <p className="text-xl text-blue-200">Industry trends, company updates, and success stories.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-20 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-8 no-scrollbar">
            {[
              { id: 'blogs', label: 'Blogs', icon: BookOpen },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'news', label: 'News', icon: Newspaper },
              { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* BLOGS / NEWS / REPORTS GRID */}
        {activeTab !== 'testimonials' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col h-full">
                  <div className="h-48 overflow-hidden relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {post.type}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {post.date}</span>
                      {post.readTime && <span>• {post.readTime}</span>}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                    <a href="#" className="text-brand-orange font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                      {post.type === 'report' ? 'Download PDF' : 'Read Article'} 
                      {post.type === 'report' ? <Download className="w-4 h-4"/> : <ArrowRight className="w-4 h-4"/>}
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-gray-500">
                <p>No posts found in this category yet.</p>
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS GRID */}
        {activeTab === 'testimonials' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {testimonials.map((t) => (
               <div key={t.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative">
                 <div className="absolute -top-4 left-8 text-6xl text-brand-orange opacity-20 font-serif">"</div>
                 <p className="text-gray-700 italic mb-6 relative z-10">{t.quote}</p>
                 <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                   <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center font-bold">
                      {t.name.charAt(0)}
                   </div>
                   <div>
                     <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                     <p className="text-xs text-gray-500">{t.role}, {t.company}</p>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;