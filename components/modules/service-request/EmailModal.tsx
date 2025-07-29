"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiMail, FiX, FiSend, FiUser } from 'react-icons/fi';
import { useSendEmail } from '@/hooks/useEmailApi';
import { toast } from 'sonner';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientEmail: string;
  clientName: string;
  requestId?: string;
}

export default function EmailModal({ isOpen, onClose, clientEmail, clientName, requestId }: EmailModalProps) {
  const [emailData, setEmailData] = useState({
    to: clientEmail,
    subject: '',
    message: ''
  });

  const sendEmailMutation = useSendEmail();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!emailData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendEmailMutation.mutateAsync({
        to: emailData.to,
        subject: emailData.subject,
        message: emailData.message,
        clientName,
        requestId
      });
      
      toast.success('Email sent successfully!');
      onClose();
      setEmailData({ to: clientEmail, subject: '', message: '' });
    } catch (error: unknown) {
      let message = 'Failed to send email';
      if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: string }).message === 'string') {
        message = (error as { message: string }).message;
      }
      toast.error(message);
    }
  };

  const handleClose = () => {
    setEmailData({ to: clientEmail, subject: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-[#1A1D37]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FiMail className="w-5 h-5 text-blue-600" />
            Send Email to Client
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <FiX className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Information</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Name:</strong> {clientName}</p>
                <p><strong>Email:</strong> {clientEmail}</p>
                {requestId && <p><strong>Request ID:</strong> {requestId}</p>}
              </div>
            </div>

            {/* To Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Email
              </label>
              <Input
                name="to"
                type="email"
                value={emailData.to}
                onChange={handleInputChange}
                placeholder="recipient@example.com"
                className="w-full"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <Input
                name="subject"
                type="text"
                value={emailData.subject}
                onChange={handleInputChange}
                placeholder="Enter email subject..."
                className="w-full"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <Textarea
                name="message"
                value={emailData.message}
                onChange={handleInputChange}
                placeholder="Enter your message here..."
                className="w-full min-h-[200px] resize-none"
                required
              />
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Templates
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmailData(prev => ({
                      ...prev,
                      subject: 'Service Request Update',
                      message: `Dear ${clientName},\n\nThank you for your service request. We are currently reviewing your project requirements and will get back to you with a detailed proposal soon.\n\nBest regards,\nTechFynite Team`
                    }));
                  }}
                  className="text-xs"
                >
                  Status Update
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmailData(prev => ({
                      ...prev,
                      subject: 'Project Proposal',
                      message: `Dear ${clientName},\n\nWe have prepared a detailed proposal for your project. Please find the attached document with our recommendations and pricing.\n\nWe look forward to discussing this with you.\n\nBest regards,\nTechFynite Team`
                    }));
                  }}
                  className="text-xs"
                >
                  Project Proposal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmailData(prev => ({
                      ...prev,
                      subject: 'Additional Information Required',
                      message: `Dear ${clientName},\n\nTo better understand your project requirements, we need some additional information:\n\n1. Project timeline\n2. Specific features needed\n3. Budget constraints\n\nPlease provide these details so we can serve you better.\n\nBest regards,\nTechFynite Team`
                    }));
                  }}
                  className="text-xs"
                >
                  Request Info
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={sendEmailMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sendEmailMutation.isPending || !emailData.subject.trim() || !emailData.message.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}