import React from "react";
import { Button } from "@/components/ui/button";


const Header: React.FC = () => {
  const handleGetStarted = () => {
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  return (
    <header className="flex flex-col-reverse md:flex-row items-center justify-between p-8 md:p-12 bg-gradient-to-br from-background to-muted rounded-2xl shadow-sm">
      {/* Left Section - Text */}
      <div className="max-w-xl space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          What <span className="text-primary">Archive</span> Can Do
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage all your clients, folders, and files seamlessly. Keep everything
          organized, secure, and accessible — in one dashboard.
        </p>

        <Button size="lg" className="mt-4 " onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>

      {/* Right Section - Image */}

    </header>
  );
};

export default Header;
