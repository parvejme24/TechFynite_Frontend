import React from 'react';
import BlogCard from './BlogCard';

interface BlogListProps {
  blogs: Array<any>;
  onBlogClick?: (blog: any) => void;
  onEdit?: (blog: any) => void;
  onDelete?: (blog: any) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onBlogClick, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onClick={() => onBlogClick?.(blog)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BlogList; 