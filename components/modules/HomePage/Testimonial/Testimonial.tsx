"use client";
import React from "react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import StarRatings from "react-star-ratings";
import ProfileImage from "@/public/images/profile.png";

interface TestimonialsData {
  id: number;
  content: string;
  author: string;
  avatar: any;
  position: string;
}

export const testimonials: TestimonialsData[] = [
  {
    id: 1,
    content:
      "Techfynite transformed our website into a sleek, modern platform. Their design team understood our vision perfectly, and the development was smooth and fast. We've seen a significant boost in engagement since launch!",
    author: "Mike Torello",
    avatar: ProfileImage,
    position: "Executive Engineer",
  },
  {
    id: 2,
    content:
      "The templates from Techfynite are incredibly well-designed and easy to customize. Their support team is responsive and helpful. I couldn't be happier with the results and the overall experience!",
    author: "Sarah Johnson",
    avatar: ProfileImage,
    position: "Marketing Director",
  },
  {
    id: 3,
    content:
      "Working with Techfynite has been a game-changer for our startup. Their templates are beautiful and highly functional. The level of customization and support we received was outstanding and exceeded our expectations.",
    author: "David Chen",
    avatar: ProfileImage,
    position: "Startup Founder",
  },
  {
    id: 4,
    content:
      "I've tried many template providers, but Techfynite stands out with their quality and attention to detail. The templates are modern, responsive, and perfect for our needs. Highly recommended!",
    author: "Emily Rodriguez",
    avatar: ProfileImage,
    position: "Creative Director",
  },
  {
    id: 5,
    content:
      "The templates are exactly what we needed for our agency. Clean, professional, and easy to implement. Techfynite's support team is always there when you need them. A fantastic experience overall!",
    author: "James Wilson",
    avatar: ProfileImage,
    position: "Agency Owner",
  },
  {
    id: 6,
    content:
      "Techfynite's templates have helped us launch our products faster than ever. The quality and flexibility of their designs are unmatched in the market. Their support team is exceptional and always ready to help.",
    author: "Lisa Thompson",
    avatar: ProfileImage,
    position: "Project Manager",
  },
];

const TestimonialHeader = () => (
  <div className="max-w-[570px] mx-auto">
    <h4 className="text-center text-xl md:text-[24px] font-semibold text-black dark:text-white">
      TESTIMONIALS
    </h4>
    <h2 className="text-[#0F35A7] text-2xl md:text-[34px] font-bold text-center">
      Client Success Stories
    </h2>
    <p className="text-[#636363] dark:text-[#F2F2F2] text-center text-[14px] mt-1 font-light">
      Discover how our innovative solutions and dedicated support have helped
      businesses transform their digital presence. Read what our valued clients
      have to say about their experience working with TechFynite.
    </p>
  </div>
);

const QuoteIcon = () => (
  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 z-50">
    <span className="bg-[#ACD0FF] border-4 border-[#BFDBFF] inline-block p-2 text-2xl rounded-full text-[#0F5BBD] shadow-lg">
      <BiSolidQuoteAltLeft />
    </span>
  </div>
);

const TestimonialAuthor = ({
  author,
  position,
  avatar,
}: {
  author: string;
  position: string;
  avatar: any;
}) => (
  <div className="flex justify-center items-center gap-2 mt-5">
    <Image
      src={avatar}
      alt={author}
      className="w-12 border-4 border-[#BFDBFF] rounded-full"
    />
    <div>
      <h4 className="text-[#E1AB20] font-extrabold text-[14px]">{author}</h4>
      <p className="text-[11px] font-light">{position}</p>
    </div>
  </div>
);

const TestimonialCard = ({
  content,
  author,
  position,
  avatar,
  rating = 5,
}: {
  content: string;
  author: string;
  position: string;
  avatar: any;
  rating?: number;
}) => (
  <div className="relative bg-gradient-to-b from-[#BEDAFE] to-[#88AAD7] rounded-2xl p-[2px] h-[250px]">
    <div className="bg-[#fff] dark:bg-[#010528] rounded-2xl h-full relative">
      <div className="w-full p-5 flex flex-col h-full">
        <QuoteIcon />
        <div className="flex justify-center mb-2 mt-3">
          <StarRatings
            rating={rating}
            starRatedColor="#E1AB20"
            starEmptyColor="#E4E4E7"
            starDimension="16px"
            starSpacing="2px"
            numberOfStars={5}
            name="rating"
          />
        </div>
        <p className="text-center flex-grow pt-2 line-clamp-6 text-[14px]">
          {content}
        </p>
        <TestimonialAuthor
          author={author}
          position={position}
          avatar={avatar}
        />
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b dark:bg-gradient-to-tl from-[#FAFCFF] dark:from-[#000424] to-[#EAF2FF] dark:to-[#000424] py-20">
      <div className="container mx-auto max-w-7xl px-5 lg:px-0">
        <TestimonialHeader />

        <div className="mt-12 relative">
          {/* Left gradient overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F1F6FF] dark:from-[#000424] to-transparent z-10 pointer-events-none" />
          {/* Right gradient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F1F6FF] dark:from-[#000424] to-transparent z-10 pointer-events-none" />

          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={true}
            className="py-8"
          >
            {testimonials.map((item) => (
              <div key={item.id} className="mx-4 w-[350px]">
                <TestimonialCard {...item} />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
