"use client";
import { user } from "@prisma/client";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { Event } from "./components/post-modal";
import FeedPost, { PostwithLiked } from "./post";
import PostInput from "./post-input";

const PostModal = dynamic(() => import("./components/post-modal"), {
  ssr: false,
});
const MediaModal = dynamic(() => import("./components/media-modal"), {
  ssr: false,
});
const EventModal = dynamic(() => import("./components/event-modal"), {
  ssr: false,
});

interface FeedMainContentProps {
  user: user;
}

const FeedMainContent = ({ user }: FeedMainContentProps) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [draftContent, setDraftContent] = useState<string | null>(null);
  const [draftImage, setDraftImage] = useState<string | null>();
  const [nestedMediaModal, setNestedMediaModal] = useState(false);
  const [nestedEventModal, setNestedEventModal] = useState(false);
  const [formData, setFormData] = useState<Event | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [posts, setPosts] = useState<PostwithLiked[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if there are more posts to load
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log("Fetching posts for page:", page);

    const fetchPosts = async () => {
      // Prevent fetching if no more posts or already loading
      if (isLoading || !hasMore) return;

      setIsLoading(true);

      try {
        const response = await axios.get(`/api/posts?page=${page}`);
        if (response.status === 200) {
          const { posts: fetchedPosts } = response.data;

          console.log(`Posts fetched for page ${page}:`, fetchedPosts);

          // Check if there are no new posts
          if (!fetchedPosts || fetchedPosts.length === 0) {
            setHasMore(false); // Stop further fetches
          } else {
            // Add new posts to the state, avoiding duplicates
            setPosts((prevPosts) => [
              ...prevPosts,
              ...fetchedPosts.filter(
                (post: PostwithLiked) =>
                  !prevPosts.some((p) => p.id === post.id)
              ),
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, hasMore, isLoading]);

  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
          }, 300); // Adjust debounce timing
        }
      },
      {
        rootMargin: "50px", // Adjust margin to trigger early
      }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      clearTimeout(debounceTimeout);
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isLoading, hasMore]);

  return (
    <>
      <PostModal
        open={isPostModalOpen}
        setOpen={setIsPostModalOpen}
        image={image}
        setImage={setImage}
        draftImage={draftImage}
        draftContent={draftContent}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
        setIsOpenEditModal={setIsOpenEditModal}
        setIsEventModalOpen={setIsEventModalOpen}
        setNestedEventModal={setNestedEventModal}
        setNestedMediaModal={setNestedMediaModal}
        event={formData}
        setEvent={setFormData}
        isIn={false}
        user={currentUser!}
      />
      <MediaModal
        open={isOpenEditModal}
        setOpen={setIsOpenEditModal}
        setDraftContent={setDraftContent}
        setDraftImage={setDraftImage}
        nestedMediaModal={nestedMediaModal}
        setNestedMediaModal={setNestedMediaModal}
        isIn={false}
        user={currentUser!}
      />
      <EventModal
        open={isEventModalOpen}
        setOpen={setIsEventModalOpen}
        nestedEventModal={nestedEventModal}
        setNestedEventModal={setNestedEventModal}
        formData={formData}
        setFormData={setFormData}
        isIn={false}
        user={currentUser!}
      />
      <div className="mx-4 w-[52%] overflow-hidden pb-6 max-[1000px]:w-[65%]">
        <PostInput
          setIsPostModalOpen={() => setIsPostModalOpen(true)}
          setIsImageModalOpen={() => {
            setIsOpenEditModal(true);
          }}
          setIsEventModalOpen={setIsEventModalOpen}
          draftContent={draftContent}
          setFormData={setFormData}
          setNestedMediaModal={setNestedMediaModal}
          setNestedEventModal={setNestedEventModal}
          user={currentUser!}
        />
        {posts?.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FeedPost user={currentUser!} key={post.id} post={post} />
          </motion.div>
        ))}
        <div ref={observerRef} />
        {isLoading && hasMore && (
          <div className="flex w-full items-center justify-center">
            <Loader className="size-14 animate-spin p-3" />
          </div>
        )}
      </div>
    </>
  );
};

export default FeedMainContent;
