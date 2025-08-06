import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock user role - in real app this would come from context/auth
  const userRole = "admin";
  
const navItems = [
    { path: "/", label: "홈", icon: "Home" },
    { path: "/dashboard", label: "대시보드", icon: "BarChart3" },
    { path: "/membership", label: "멤버십", icon: "Users" },
    { path: "/master", label: "마스터", icon: "Crown" },
    { path: "/insights", label: "인사이트", icon: "Lightbulb" }
  ];

  const roleColors = {
    free: "default",
    member: "primary", 
    master: "secondary",
    admin: "accent"
  };

  const roleLabels = {
    free: "무료",
    member: "멤버",
    master: "마스터", 
    admin: "관리자"
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                스킬업 플러스
              </h1>
              <p className="text-xs text-gray-500 leading-none">온라인 학습 플랫폼</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
                    isActive 
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="hidden md:flex items-center gap-4">
            <Badge variant={roleColors[userRole]} className="font-semibold">
              {roleLabels[userRole]}
            </Badge>
            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={18} className="text-gray-600" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="메뉴"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg" 
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary"
                  )}
                >
                  <ApperIcon name={item.icon} size={20} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">사용자</div>
                  <Badge variant={roleColors[userRole]} className="text-xs">
                    {roleLabels[userRole]}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;