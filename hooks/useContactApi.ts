import { 
  useGetAllContactsQuery, 
  useGetContactByIdQuery, 
  useGetContactsByUserEmailQuery, 
  useCreateContactMutation,
  useUpdateContactMutation,
  useSendContactReplyMutation, 
  useDeleteContactMutation, 
  useGetContactStatsQuery
} from '@/redux/services/serviceRequestApi';
import { useGetContactRepliesQuery } from '@/redux/services/contactApi';

export const useContactApi = () => {
  // Get all contacts (Admin)
  const getAllContacts = (params: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    sortBy?: 'createdAt' | 'fullName' | 'email'; 
    sortOrder?: 'asc' | 'desc' 
  } = {}) => {
    return useGetAllContactsQuery({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc'
    });
  };

  // Get contact by ID
  const getContactById = (id: string) => {
    return useGetContactByIdQuery(id);
  };

  // Get contacts by user email
  const getContactsByUserEmail = (userEmail: string, page: number = 1, limit: number = 10) => {
    return useGetContactsByUserEmailQuery({
      userEmail,
      page,
      limit
    });
  };

  // Create new contact
  const createContact = () => {
    return useCreateContactMutation();
  };

  // Update contact
  const updateContact = () => {
    return useUpdateContactMutation();
  };

  // Send contact reply
  const sendContactReply = () => {
    return useSendContactReplyMutation();
  };

  // Delete contact
  const deleteContact = () => {
    return useDeleteContactMutation();
  };

  // Get contact stats
  const getContactStats = (params: { period?: string; startDate?: string; endDate?: string } = {}) => {
    return useGetContactStatsQuery(params);
  };

  // Get contact replies
  const getContactReplies = (contactId: string) => {
    return useGetContactRepliesQuery(contactId);
  };

  return {
    getAllContacts,
    getContactById,
    getContactsByUserEmail,
    createContact,
    updateContact,
    sendContactReply,
    deleteContact,
    getContactStats,
    getContactReplies,
  };
};

export default useContactApi;