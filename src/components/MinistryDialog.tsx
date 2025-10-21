import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";

interface MinistryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ministry: {
    icon: LucideIcon;
    title: string;
    description: string;
    longDescription: string;
    age: string;
    schedule: string;
    leader: string;
    image: string;
  } | null;
}

const MinistryDialog = ({ open, onOpenChange, ministry }: MinistryDialogProps) => {
  if (!ministry) return null;

  const Icon = ministry.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-primary p-4">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{ministry.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Led by {ministry.leader}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src={ministry.image} 
              alt={ministry.title}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-1">Age Group</p>
              <p className="text-muted-foreground">{ministry.age}</p>
            </div>
            <div className="bg-secondary/30 p-4 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-1">Schedule</p>
              <p className="text-muted-foreground">{ministry.schedule}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">About This Ministry</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {ministry.longDescription}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MinistryDialog;
