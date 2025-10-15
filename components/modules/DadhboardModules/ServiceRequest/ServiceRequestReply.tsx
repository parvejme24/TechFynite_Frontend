"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FiSend, FiMessageSquare, FiClock, FiRefreshCw } from "react-icons/fi";
import { toast } from "sonner";
import { useContactApi } from "@/hooks/useContactApi";
import { AuthContext } from "@/Providers/AuthProvider";
import { useContext } from "react";

interface ServiceRequestReplyProps {
  isOpen: boolean;
  onClose: () => void;
  serviceRequest: {
    id: string;
    clientName: string;
    clientEmail: string;
    company: string;
    serviceType: string;
    budget: string;
    description: string;
  };
  onReply: (message: string) => Promise<void>;
}

interface Reply {
  id: string;
  message: string;
  subject: string;
  isAdminReply: boolean;
  senderName: string;
  senderEmail: string;
  createdAt: string;
}

export default function ServiceRequestReply({
  isOpen,
  onClose,
  serviceRequest,
  onReply,
}: ServiceRequestReplyProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user from auth context
  const { user } = useContext(AuthContext) || {};

  // Use contact API hook
  const contactApi = useContactApi();

  // For now, use empty replies since the backend endpoint doesn't exist
  const replies: Reply[] = [];
  const isLoadingReplies = false;
  const repliesError = null;
  const refetchReplies = async () => {};

  // Don't render if serviceRequest is null
  if (!serviceRequest) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(message);

      // Refresh replies from API
      await refetchReplies();
      setMessage("");
      // Success toast is handled by the parent component
    } catch (error) {
      console.error("Reply error:", error);
      // Error toast is handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiMessageSquare className="w-5 h-5" />
            Reply to Service Request
          </DialogTitle>
          <DialogDescription>
            Send a reply to the client and manage the conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Conversation Thread */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FiMessageSquare className="w-5 h-5" />
                Conversation ({replies.length} messages)
                {isLoadingReplies && (
                  <FiRefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-96">
              {isLoadingReplies ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading conversation...
                  </span>
                </div>
              ) : repliesError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">
                    Failed to load conversation
                  </div>
                  <Button
                    onClick={() => refetchReplies()}
                    size="sm"
                    variant="outline"
                  >
                    <FiRefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : replies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`flex gap-3 ${
                        reply.isAdminReply ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${
                          reply.isAdminReply
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {getInitials(reply.senderName)}
                      </div>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          reply.isAdminReply ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            reply.isAdminReply
                              ? "bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-100"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">
                            {reply.senderName}
                          </div>
                          <div className="text-sm whitespace-pre-wrap">
                            {reply.message}
                          </div>
                          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {formatDate(reply.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Send Reply Form */}
          <Card>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Send Reply
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!message.trim() || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <FiClock className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
