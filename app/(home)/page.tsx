import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Welcome to iStore</h1>
      <Button>Get Started</Button>
    </div>
  );
};

export default HomePage;
