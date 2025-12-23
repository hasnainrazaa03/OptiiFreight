// src/data/teamMembers.ts

// 1. Import the images from the assets folder
// (Make sure the filenames match exactly what you pasted!)
import anuragImg from '../assets/team/anurag.jpeg';
import tanzeemImg from '../assets/team/tanzeem.jpeg';
import hasnainImg from '../assets/team/hasnain.jpg';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Anurag Ahlawat',
    role: 'Co-Founder & CEO',
    image: anuragImg, // Use the imported variable
    bio: 'Anurag is the visionary behind OptiiFreight. With over 15 years of experience in supply chain management across North America and Asia, he identified the critical inefficiencies in partial load logistics. Before founding OptiiFreight, he led operations for a Fortune 500 logistics firm. He is passionate about using technology to reduce carbon footprints while increasing profitability for small carriers.'
  },
  {
    id: 2,
    name: 'Tanzeem Ahmed',
    role: 'Co-Founder & COO',
    image: tanzeemImg,
    bio: 'Tanzeem ensures the wheels keep turning. An operations expert with a background in fleet management and driver relations, he understands the daily struggles of truck owners better than anyone. He architects the "Driver-First" policies at OptiiFreight and oversees the carrier network expansion, ensuring that every partner meets our rigorous safety and quality standards.'
  },
  {
    id: 3,
    name: 'Hasnain Raza',
    role: 'Chief Technology Officer',
    image: hasnainImg,
    bio: 'Hasnain is the architect of the "OptiiMatch" algorithm. A former AI researcher with a focus on geospatial optimization, he built the engine that matches partial loads in milliseconds. He leads the engineering team with a focus on scalability and security, ensuring that our platform remains robust as we scale to millions of transactions.'
  }
];