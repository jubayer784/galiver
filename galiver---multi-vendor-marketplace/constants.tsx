
import { Product, Category, Vendor } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: '1', 
    name: "Baby's Home", 
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=200&fit=crop',
    subCategories: [
      {
        id: 's-baby-1',
        name: 'Clothing & Accessories',
        childCategories: [
          { id: 'c-baby-1', name: 'Newborn Clothes' },
          { id: 'c-baby-2', name: 'Baby Dresses & Outfits' },
          { id: 'c-baby-3', name: 'Shoes & Socks' }
        ]
      },
      {
        id: 's-baby-2',
        name: 'Diapers & Hygiene',
        childCategories: [
          { id: 'c-baby-4', name: 'Baby Diapers' },
          { id: 'c-baby-5', name: 'Baby Powder & Lotion' }
        ]
      },
      { id: 's-baby-3', name: 'Feeding & Nursing' },
      { id: 's-baby-4', name: 'Toys & Learning' }
    ]
  },
  { 
    id: '2', 
    name: 'ইলেকট্রনিক্স', 
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop',
    subCategories: [
      {
        id: 's1',
        name: 'মোবাইল ও ট্যাবলেট',
        childCategories: [
          { id: 'c1', name: 'স্মার্টফোন' },
          { id: 'c2', name: 'ফিচার ফোন' },
          { id: 'c3', name: 'ট্যাবলেট' }
        ]
      },
      {
        id: 's2',
        name: 'কম্পিউটার ও ল্যাপটপ',
        childCategories: [
          { id: 'c4', name: 'ল্যাপটপ' },
          { id: 'c5', name: 'ডেস্কটপ' },
          { id: 'c6', name: 'মনিটর' }
        ]
      }
    ]
  },
  { 
    id: '3', 
    name: 'ফ্যাশন', 
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
    subCategories: [
      {
        id: 's3',
        name: 'পুরুষের পোশাক',
        childCategories: [
          { id: 'c7', name: 'শার্ট' },
          { id: 'c8', name: 'প্যান্ট' },
          { id: 'c9', name: 'পাঞ্জাবি' }
        ]
      }
    ]
  },
  { id: '4', name: 'গৃহস্থালি', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop' },
  { id: '5', name: 'গ্যাজেট', image: 'https://images.unsplash.com/photo-1526733158272-68095899b10a?w=200&h=200&fit=crop' },
  { id: '6', name: 'ঘড়ি', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop' },
  { id: '7', name: 'গেমিং', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop' },
  { id: '8', name: 'ক্যামেরা', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop' },
  { id: '9', name: 'অডিও', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
  { id: '10', name: 'ল্যাপটপ', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max Titanium',
    price: 154999,
    originalPrice: 169999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 1250,
    discount: '15000',
    category: 'স্মার্টফোন',
    vendorId: 'v1',
    stock: 45,
    description: 'এটি অ্যাপলের লেটেস্ট আইফোন ১৫ প্রো ম্যাক্স। এতে রয়েছে টাইটানিয়াম বডি এবং এ১৭ প্রো চিপসেট। এর ক্যামেরা কোয়ালিটি বাজারের সেরা। গেমার এবং ফটোগ্রাফারদের জন্য এটি সেরা পছন্দ। দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপ এবং সুপার রেটিনা এক্সডিআর ডিসপ্লে আপনার অভিজ্ঞতাকে করবে আরও উন্নত। এটি পানি ও ধুলিকণা প্রতিরোধী এবং এতে রয়েছে ৫জি কানেক্টিভিটি। সব মিলিয়ে এটি একটি প্রিমিয়াম লেভেলের স্মার্টফোন যা আপনার আভিজাত্যকে প্রকাশ করবে।'
  },
  {
    id: 'p2',
    name: 'Mechanical Gaming Keyboard RGB',
    price: 4500,
    originalPrice: 6000,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 430,
    discount: '1500',
    category: 'গেমিং',
    vendorId: 'v2',
    stock: 120,
    description: 'সেরা গেমিং অভিজ্ঞতার জন্য ব্যবহার করুন এই মেকানিক্যাল আরজিবি কিবোর্ড। এর প্রতিটি কি টেকসই এবং টাইপিংয়ে পাওয়া যায় দারুণ তৃপ্তি। গেমারদের কথা মাথায় রেখে এটি ডিজাইন করা হয়েছে। এর আরজিবি লাইট আপনার সেটআপকে করবে আরও আকর্ষণীয়। এটি উইন্ডোজ এবং ম্যাক দুটিতেই সাপোর্ট করে। লং সেশন গেমিংয়ের জন্য এটি খুবই আরামদায়ক এবং এর রেসপন্স টাইম অত্যন্ত দ্রুত। কিবোর্ডটির বডি অ্যালুমিনিয়ামের তৈরি যা একে করে তুলেছে আরও প্রিমিয়াম।'
  },
  {
    id: 'p3',
    name: 'Premium Leather Wallet',
    price: 1200,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    rating: 4.2,
    reviews: 89,
    discount: '600',
    category: 'ফ্যাশন',
    vendorId: 'v1',
    stock: 300,
    description: 'আসল চামড়া দিয়ে তৈরি প্রিমিয়াম লেদার ওয়ালেট। এটি স্টাইলিশ এবং টেকসই। এতে টাকা এবং কার্ড রাখার পর্যাপ্ত জায়গা রয়েছে। উপহার হিসেবে দেওয়ার জন্য এটি একটি সেরা পণ্য। এর ফিনিশিং এবং ডিজাইন আপনাকে মুগ্ধ করবে। এটি পকেটে খুব সহজেই ফিট হয়ে যায় এবং ব্যবহার করা অত্যন্ত আরামদায়ক। আপনি যদি দীর্ঘস্থায়ী এবং মানসম্মত ওয়ালেট খুঁজে থাকেন, তবে এটিই আপনার জন্য সেরা পছন্দ হতে পারে।'
  },
  {
    id: 'p4',
    name: '4K Ultra HD Smart TV 55"',
    price: 78000,
    originalPrice: 85000,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 210,
    discount: '7000',
    category: 'ইলেকট্রনিক্স',
    vendorId: 'v3',
    stock: 15,
    description: '৫৫ ইঞ্চি ৪কে আল্ট্রা এইচডি স্মার্ট টিভি। এতে রয়েছে ক্রিস্টাল ক্লিয়ার ডিসপ্লে এবং উন্নত সাউন্ড সিস্টেম। ইউটিউব, নেটফ্লিক্স এবং অন্যান্য অ্যাপ ব্যবহারের সুবিধা। আপনার ঘরের আভিজাত্য বৃদ্ধিতে এই টিভিটি অতুলনীয়। এতে রয়েছে বিল্ট-ইন ওয়াইফাই এবং ব্লুটুথ সুবিধা। ভয়েস কন্ট্রোল ফিচারের মাধ্যমে টিভিটি সহজেই নিয়ন্ত্রণ করা যায়। ৪কে রেজোলিউশন আপনাকে দেবে সিনেমাটিক ভিউয়িং এক্সপেরিয়েন্স। স্লিম ডিজাইন এবং পাতলা বেজেল একে করে তুলেছে স্টাইলিশ।'
  },
  {
    id: 'p5',
    name: 'Wireless Noise Cancelling Headphones',
    price: 12500,
    originalPrice: 15000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 560,
    discount: '2500',
    category: 'গ্যাজেট',
    vendorId: 'v2',
    stock: 88,
    description: 'উন্নত নয়েজ ক্যানসেলিং ফিচারের ওয়্যারলেস হেডফোন। কোলাহলপূর্ণ পরিবেশে মিউজিক বা মিটিংয়ের জন্য সেরা। এর ব্যাটারি লাইফ ৩০ ঘণ্টার বেশি। চার্জিং দ্রুত এবং ব্লুটুথ কানেক্টিভিটি স্থিতিশীল। দীর্ঘ সময় ব্যবহারের জন্য এটি অত্যন্ত আরামদায়ক কান পলি। এর বেস এবং সাউন্ড ক্ল্যারিটি অতুলনীয়। এতে রয়েছে স্মার্ট টাচ কন্ট্রোল যার মাধ্যমে আপনি গান এবং কল নিয়ন্ত্রণ করতে পারবেন খুব সহজেই। প্রিমিয়াম বিল্ড কোয়ালিটি এবং ফোল্ডেবল ডিজাইন একে ভ্রমণের জন্য পারফেক্ট করে তুলেছে।'
  }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Apple Official Store', logo: 'https://logo.clearbit.com/apple.com', rating: 4.9, totalSales: 5400, status: 'active' },
  { id: 'v2', name: 'TechHaven Solutions', logo: 'https://logo.clearbit.com/intel.com', rating: 4.5, totalSales: 2100, status: 'active' },
  { id: 'v3', name: 'Global Lifestyle', logo: 'https://logo.clearbit.com/ikea.com', rating: 4.2, totalSales: 980, status: 'active' },
];
