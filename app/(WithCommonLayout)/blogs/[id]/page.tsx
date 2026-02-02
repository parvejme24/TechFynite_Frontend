import { use } from "react";
import BlogDetailsContainer from "@/components/modules/CommonModules/blogs/BlogDetails/BlogDetailsContainer";
import Newsletter from "@/components/shared/Newsletter/Newsletter";

export default function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div>
      <BlogDetailsContainer id={id} />
      <Newsletter />
    </div>
  );
}
