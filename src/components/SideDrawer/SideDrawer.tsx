"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { FiMenu, FiX } from "react-icons/fi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

export default function SideDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint = 1024px
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle clicking outside the drawer on desktop to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDesktop &&
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop, isOpen]);

  const DRAWER_FULL_WIDTH = 300;
  const DRAWER_COLLAPSED_WIDTH = DRAWER_FULL_WIDTH * 0.2; // 60px

  const desktopVariants = {
    open: { width: DRAWER_FULL_WIDTH },
    collapsed: { width: DRAWER_COLLAPSED_WIDTH },
  };

  const mobileVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black relative text-white">
      {/* Mobile Hamburger Button (Only visible on mobile/tablet) */}
      {!isDesktop && (
        <div className="absolute top-4 left-4 z-40">
          <Button
            isIconOnly
            variant="flat"
            onPress={() => setIsOpen(true)}
            aria-label="Open Drawer"
            className="bg-zinc-900/80 backdrop-blur-md shadow-sm text-white"
          >
            <FiMenu className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.nav
        ref={drawerRef}
        className={`bg-black border-r border-zinc-800 h-full z-50 flex flex-col overflow-hidden ${
          isDesktop
            ? "relative shrink-0 cursor-pointer shadow-md"
            : "fixed top-0 left-0 shadow-xl"
        }`}
        variants={isDesktop ? desktopVariants : mobileVariants}
        initial={isDesktop ? "collapsed" : "closed"}
        animate={
          isDesktop
            ? isOpen
              ? "open"
              : "collapsed"
            : isOpen
              ? "open"
              : "closed"
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => {
          if (isDesktop && !isOpen) {
            e.stopPropagation();
            setIsOpen(true);
          }
        }}
        style={!isDesktop ? { width: DRAWER_FULL_WIDTH } : {}}
      >
        <div className="flex flex-col h-full shrink-0">
          {/* Header */}
          <div
            className={`flex items-center p-4 min-h-[64px] ${
              isDesktop && !isOpen ? "justify-center" : "justify-between"
            }`}
          >
            {/* Show title if drawer is open, or if it's mobile */}
            {(isOpen || !isDesktop) && (
              <span className="text-xl font-bold whitespace-nowrap text-white">
                Navigation
              </span>
            )}

            {/* Toggle Button (Always visible) */}
            <Button
              isIconOnly
              variant="light"
              onPress={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close Drawer" : "Open Drawer"}
            >
              {isDesktop ? (
                <MdKeyboardDoubleArrowLeft
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isOpen ? "" : "rotate-180"
                  }`}
                />
              ) : (
                <FiX className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
            {isOpen || !isDesktop ? (
              // Open State Content
              ["Dashboard", "Analytics", "Settings", "Messages", "Help"].map(
                (item) => (
                  <Button
                    key={item}
                    variant="flat"
                    className="w-full justify-start font-medium text-white hover:bg-zinc-800 bg-transparent"
                  >
                    {item}
                  </Button>
                ),
              )
            ) : (
              // Collapsed State Content (Desktop only)
              <div className="flex flex-col items-center space-y-4 pt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors shrink-0"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-auto relative bg-black text-white">
        <div className={`p-6 ${!isDesktop ? "pt-20" : ""}`}>{children}</div>
      </main>
    </div>
  );
}
