"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { user } from "@prisma/client";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FeedPost, { PostwithLiked } from "../../post";

interface SinglePostMainContentProps {
  user: user;
}

const SinglePostMainContent = ({ user }: SinglePostMainContentProps) => {
  const isEdit = !!useSearchParams().get("isEdit");
  const [post, setPost] = useState<PostwithLiked | null>(null);
  const params = useParams();
  const postId = params.postId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setIsPostModalOpen(true);
    }
  }, [isEdit]);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      const res = await axios.get(`/api/post?postId=${postId}`);
      const { post } = res.data;
      if (res.status === 200) {
        setPost(post);
        setIsLoading(false);
      }
    };
    getPost();
  }, [postId]);
  if (isLoading) {
    return (
      <div className="mb-6 flex h-[250px] w-full flex-col justify-between rounded-lg border bg-gray-200 p-4">
        <div className="flex space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          <div className="flex flex-col justify-center space-y-2">
            <Skeleton className="h-3 w-[150px] bg-gray-400" />
            <Skeleton className="h-3 w-[100px] bg-gray-400" />
          </div>
        </div>
        <div className="flex justify-around">
          <Skeleton className="h-2 w-[70px] bg-gray-400" />
          <Skeleton className="h-2 w-[70px] bg-gray-400" />
          <Skeleton className="h-2 w-[70px] bg-gray-400" />
        </div>
      </div>
    );
  }
  return (
    <div className="mx-4 w-[52%] overflow-hidden pb-6 max-[1000px]:w-[65%]">
      <FeedPost
        post={post!}
        user={user}
        isPostModalOpen={isPostModalOpen}
        setIsPostModalOpen={setIsPostModalOpen}
        isEdit={isEdit}
      />
    </div>
  );
};

export default SinglePostMainContent;
