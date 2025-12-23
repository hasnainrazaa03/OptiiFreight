export interface BlogPost {
  id: number;
  type: 'blog' | 'report' | 'news';
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  image: string;
  author?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  quote: string;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    type: 'blog',
    title: 'The Hidden Cost of Empty Miles in 2024',
    excerpt: 'Why running trucks partially empty is costing US carriers billions and how shared truckload strategies are solving it.',
    date: 'Dec 12, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    author: 'Anurag Ahlawat'
  },
  {
    id: 2,
    type: 'blog',
    title: 'LTL vs. Shared Truckload: What is the Difference?',
    excerpt: 'A deep dive into why "Terminal-Free" shipping is faster and safer than traditional Hub-and-Spoke LTL networks.',
    date: 'Nov 28, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
    author: 'Hasnain Raza'
  },
  {
    id: 3,
    type: 'report',
    title: 'Q3 2024 Logistics Market Analysis',
    excerpt: 'Download our comprehensive report on fuel price trends, driver shortages, and the rise of AI in freight optimization.',
    date: 'Oct 15, 2024',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    readTime: 'PDF Download'
  },
  {
    id: 4,
    type: 'news',
    title: 'OptiiFreight Expands to Texas and Florida',
    excerpt: 'We are thrilled to announce 500+ new carriers added to our southern corridor network starting this month.',
    date: 'Dec 01, 2024',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=800'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    company: 'Fresh Valley Foods',
    role: 'Logistics Manager',
    quote: "OptiiFreight cut our shipping costs by 22% in the first month. The 'shared load' concept is a game changer for palletized freight.",
  },
  {
    id: 2,
    name: 'Mike Ross',
    company: 'Ross Haulage LLC',
    role: 'Fleet Owner',
    quote: "I used to drive back empty from Chicago. Now I pick up 2-3 partial loads on the way back. My revenue per mile is up $1.40.",
  },
  {
    id: 3,
    name: 'David Chen',
    company: 'TechComponents Inc.',
    role: 'Supply Chain Director',
    quote: "The real-time tracking and lack of terminals means my fragile electronics arrive intact and on time. Highly recommended.",
  }
];