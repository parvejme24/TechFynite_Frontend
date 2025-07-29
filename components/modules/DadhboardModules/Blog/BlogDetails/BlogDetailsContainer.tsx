import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getApiBaseUrl } from "@/hooks/useApiBaseUrl";

type BlogContentItem = {
  index: number;
  heading: string;
  description: string;
  imageUrl: string;
};

export default async function BlogDetailsContainer({
  params,
}: {
  params: { id: string };
}) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/blogs/${params.id}`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();
  const data = await res.json();
  const blog = data.data || data;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-[#1A1D37] p-5 rounded-md">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          width={1000}
          height={500}
          className="rounded-md h-[400px] object-cover"
        />

        <div className="mt-6 space-y-2">
          <h2 className="text-2xl font-bold">{blog.title}</h2>
          <p>{blog.description}</p>
        </div>

        <div className="flex flex-col gap-5 mt-10">
          {blog.content.map((item: BlogContentItem) => (
            <div key={item.index}>
              <h4 className="font-bold text-xl">{item.heading}</h4>
              <p>{item.description}</p>
              <Image
                src={item.imageUrl}
                alt={item.heading}
                width={1000}
                height={500}
                className="w-full h-[300px] object-cover mt-2 rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* comments for this blogs  */}
      <div className="bg-white dark:bg-[#1A1D37] p-5 rounded-md"></div>

      <div className="mt-10">
        <h4 className="text-xl font-bold">Leave a Comment</h4>
        <p>
          Your email address will not be published. Required fields are marked *
        </p>
        <form className="space-y-4 mt-5">
          <textarea
            placeholder="Add a comment"
            className="bg-white dark:bg-[#1A1D37] rounded-md border-none"
          />
          <input
            placeholder="Full Name"
            type="text"
            className="bg-white dark:bg-[#1A1D37] rounded-md border-none"
          />
          <input
            placeholder="Email"
            type="email"
            className="bg-white dark:bg-[#1A1D37] rounded-md border-none"
          />
          <button className="cursor-pointer">Post Comment</button>
        </form>
      </div>
    </div>
  );
}
