"use client";
import React, { useState, useEffect } from "react";
import { useAddBlogReaction, useGetUserReaction } from "@/hooks/useBlogApi";
import { AuthContext } from "@/Providers/AuthProvider";
import { useContext } from "react";
import { toast } from "sonner";

interface BlogReactionsProps {
  blogId: string;
  reactCount?: number;
}

type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

const REACTION_EMOJIS: Record<ReactionType, string> = {
  LIKE: '👍',
  LOVE: '❤️',
  HAHA: '😂',
  WOW: '😮',
  SAD: '😢',
  ANGRY: '😡',
};

const REACTION_LABELS: Record<ReactionType, string> = {
  LIKE: 'Like',
  LOVE: 'Love',
  HAHA: 'Haha',
  WOW: 'Wow',
  SAD: 'Sad',
  ANGRY: 'Angry',
};

export default function BlogReactions({ blogId, reactCount = 0 }: BlogReactionsProps) {
  const { user } = useContext(AuthContext) || {};
  const addReactionMutation = useAddBlogReaction();
  const { data: userReactionData } = useGetUserReaction(blogId, user?.id);
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null);

  // Update selected reaction when user reaction data changes
  useEffect(() => {
    if (userReactionData?.data?.reactionType) {
      setSelectedReaction(userReactionData.data.reactionType as ReactionType);
    } else {
      setSelectedReaction(null);
    }
  }, [userReactionData]);

  const handleReactionClick = async (reactionType: ReactionType) => {
    if (!user?.id) {
      toast.error("Please log in to react");
      return;
    }

    try {
      // If clicking the same reaction, it will toggle (remove) it
      await addReactionMutation.mutateAsync({
        id: blogId,
        userId: user.id,
        reactionType,
      });

      // Update local state
      if (selectedReaction === reactionType) {
        setSelectedReaction(null);
      } else {
        setSelectedReaction(reactionType);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to add reaction");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          React to this blog:
        </span>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((reactionType) => {
          const isSelected = selectedReaction === reactionType;
          return (
            <button
              key={reactionType}
              onClick={() => handleReactionClick(reactionType)}
              disabled={addReactionMutation.isPending}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                ${isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 scale-110'
                  : 'bg-white dark:bg-[#0B1026] border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-105 active:scale-95
              `}
              title={REACTION_LABELS[reactionType]}
            >
              <span className="text-2xl">{REACTION_EMOJIS[reactionType]}</span>
              <span className={`text-sm font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {REACTION_LABELS[reactionType]}
              </span>
            </button>
          );
        })}
      </div>

      {reactCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">{reactCount}</span>
          <span>{reactCount === 1 ? 'reaction' : 'reactions'}</span>
        </div>
      )}
    </div>
  );
}
