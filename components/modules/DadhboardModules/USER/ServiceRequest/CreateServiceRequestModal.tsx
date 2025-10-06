"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
// Mock hook for now
const useCreateServiceRequest = () => ({
  mutate: (data: any) => console.log('Creating service request:', data),
  mutateAsync: async (data: any) => {
    console.log('Creating service request:', data);
    return Promise.resolve();
  },
  isPending: false,
  error: null
});
import { ServiceRequestType, ServiceRequestPriority, CreateServiceRequestData } from '@/types/serviceRequest';
import { toast } from 'sonner';

interface CreateServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateServiceRequestModal: React.FC<CreateServiceRequestModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState<CreateServiceRequestData>({
    projectType: ServiceRequestType.WEBSITE_DEVELOPMENT,
    projectName: '',
    description: '',
    budget: '',
    timeline: '',
    priority: ServiceRequestPriority.MEDIUM,
    userPhone: '',
    company: ''
  });

  const createMutation = useCreateServiceRequest();

  const handleInputChange = (field: keyof CreateServiceRequestData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success('Service request created successfully');
      setFormData({
        projectType: ServiceRequestType.WEBSITE_DEVELOPMENT,
        projectName: '',
        description: '',
        budget: '',
        timeline: '',
        priority: ServiceRequestPriority.MEDIUM,
        userPhone: '',
        company: ''
      });
      onClose();
    } catch (error) {
      toast.error('Failed to create service request');
    }
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectType">Project Type *</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) => handleInputChange('projectType', value as ServiceRequestType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ServiceRequestType.WEBSITE_DEVELOPMENT}>
                    Website Development
                  </SelectItem>
                  <SelectItem value={ServiceRequestType.MOBILE_APP}>
                    Mobile App
                  </SelectItem>
                  <SelectItem value={ServiceRequestType.UI_UX_DESIGN}>
                    UI/UX Design
                  </SelectItem>
                  <SelectItem value={ServiceRequestType.CONSULTATION}>
                    Consultation
                  </SelectItem>
                  <SelectItem value={ServiceRequestType.MAINTENANCE}>
                    Maintenance
                  </SelectItem>
                  <SelectItem value={ServiceRequestType.OTHER}>
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value as ServiceRequestPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ServiceRequestPriority.LOW}>Low</SelectItem>
                  <SelectItem value={ServiceRequestPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={ServiceRequestPriority.HIGH}>High</SelectItem>
                  <SelectItem value={ServiceRequestPriority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project requirements in detail..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="e.g., $5000 - $10000"
              />
            </div>

            <div>
              <Label htmlFor="timeline">Timeline (Optional)</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="e.g., 2-3 months"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userPhone">Phone Number (Optional)</Label>
              <Input
                id="userPhone"
                value={formData.userPhone}
                onChange={(e) => handleInputChange('userPhone', e.target.value)}
                placeholder="Your phone number"
              />
            </div>

            <div>
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Your company name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServiceRequestModal; 