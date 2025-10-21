import { Loader } from 'lucide-react';

interface LoadingProps {
    message?: string;
}

const Loading = ({ message = "Loading..." }: LoadingProps) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Loader className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default Loading;
