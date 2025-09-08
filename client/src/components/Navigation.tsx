import { Link, useLocation } from "wouter";
import { GraduationCap, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/colleges", label: "Colleges" },
    { href: "/courses", label: "Courses" },
    { href: "/quiz", label: "Assessment" },
  ];

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`transition-colors ${
            location === href
              ? "text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          } ${isMobile ? "block py-2" : ""}`}
          onClick={isMobile ? () => setIsOpen(false) : undefined}
        >
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-foreground">EduPath J&K</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </Button>
            <Button asChild data-testid="button-profile">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button 
              variant="destructive" 
              asChild
              data-testid="button-logout"
            >
              <a href="/api/logout">Logout</a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle-mobile"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks isMobile />
                  <div className="border-t pt-4 space-y-2">
                    <Button asChild className="w-full justify-start" data-testid="button-profile-mobile">
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        Profile
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      asChild 
                      className="w-full justify-start"
                      data-testid="button-logout-mobile"
                    >
                      <a href="/api/logout">Logout</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
