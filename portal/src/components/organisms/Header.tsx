import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-card text-card-foreground border-b p-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-center sm:justify-start">
        <div className="text-2xl font-bold text-primary whitespace-nowrap">
          Task Management
        </div>
      </div>
    </header>
  );
};

export default Header;
