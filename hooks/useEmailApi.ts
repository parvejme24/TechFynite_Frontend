import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface SendEmailData {
  to: string;
  subject: string;
  message: string;
  clientName?: string;
  requestId?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  data?: any;
}

const sendEmail = async (data: SendEmailData): Promise<SendEmailResponse> => {
  try {
    const response = await apiClient.post('/emails/send', data);
    return response.data;
  } catch (error: any) {
    console.error('Send email error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to send email'
    );
  }
};

export const useSendEmail = () => {
  return useMutation<SendEmailResponse, Error, SendEmailData>({
    mutationFn: sendEmail,
    onError: (error) => {
      console.error('Email sending failed:', error);
    },
  });
};
