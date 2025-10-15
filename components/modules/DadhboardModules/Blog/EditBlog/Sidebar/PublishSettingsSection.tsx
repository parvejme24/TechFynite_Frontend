"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PublishSettingsSectionProps {
  isPublished: boolean;
  onPublishChange: (isPublished: boolean) => void;
}

const PublishSettingsSection: React.FC<PublishSettingsSectionProps> = ({
  isPublished,
  onPublishChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublished"
            checked={isPublished}
            onCheckedChange={onPublishChange}
          />
          <Label htmlFor="isPublished" className="cursor-pointer">
            Publish immediately
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublishSettingsSection;

