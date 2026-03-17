import { useState } from "react";
import { Menu, X, Globe, HelpCircle, User } from "lucide-react";

const navItems = ["Vehicles", "Energy", "Charging", "Discover", "Shop"];

const TeslaNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-14 bg-background/90 backdrop-blur-md border-b border-border/40">
      <a href="#" className="flex-shrink-0" style={{ letterSpacing: "0.3em" }}>
        <span className="text-[15px] font-semibold tracking-[0.3em] text-foreground" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          T E S L A
        </span>
      </a>

      <nav className="hidden md:flex items-center gap-5 lg:gap-7 absolute left-1/2 -translate-x-1/2">
        {navItems.map((item) => (
          <a key={item} href="#" className="text-[14px] font-medium text-foreground/90 hover:text-foreground transition-colors">
            {item}
          </a>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-5 text-foreground/80">
        <HelpCircle className="w-[18px] h-[18px] cursor-pointer hover:text-foreground transition-colors" strokeWidth={1.5} />
        <Globe className="w-[18px] h-[18px] cursor-pointer hover:text-foreground transition-colors" strokeWidth={1.5} />
        <User className="w-[18px] h-[18px] cursor-pointer hover:text-foreground transition-colors" strokeWidth={1.5} />
      </div>

      <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg p-6 md:hidden border-b border-border">
          {navItems.map((item) => (
            <a key={item} href="#" className="block py-3 text-lg font-medium text-foreground hover:text-muted-foreground transition-colors">
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default TeslaNavbar;
