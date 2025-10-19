import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, bucket: "images" | "videos"): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully.",
      });

      return publicUrl;
    } catch (error: unknown) {
      let message = "Unknown error";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (url: string, bucket: "images" | "videos") => {
    try {
      const path = url.split(`/${bucket}/`)[1];
      const { error } = await supabase.storage.from(bucket).remove([path]);
      
      if (error) throw error;

      toast({
        title: "Delete successful",
        description: "File has been deleted successfully.",
      });

      return true;
    } catch (error: unknown) {
      let message = "Unknown error";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Delete failed",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  return { uploadFile, deleteFile, uploading };
};
