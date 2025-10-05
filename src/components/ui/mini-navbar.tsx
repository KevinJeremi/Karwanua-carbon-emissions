"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Types
interface NavbarProps {
    currentPage?: string;
    onPageChange?: (page: string) => void;
}

interface NavLinkData {
    label: string;
    page: string;
    icon: string;
}

interface AnimatedNavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
}

// Constants
const NAV_LINKS: NavLinkData[] = [
    { label: 'Dashboard', page: 'dashboard', icon: '📊' },
    { label: 'Map', page: 'map', icon: '🗺️' },
    { label: 'Analytics', page: 'analytics', icon: '📈' },
    { label: 'Insights', page: 'insights', icon: '🤖' },
];

// Component: Animated Nav Link
const AnimatedNavLink = ({ href, children, onClick, isActive }: AnimatedNavLinkProps) => {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className={`group relative inline-block overflow-hidden h-5 text-sm transition-colors duration-200 ${isActive ? 'text-emerald-400 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
        >
            <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
                <span className="block h-5 leading-5">{children}</span>
                <span className="block h-5 leading-5">{children}</span>
            </div>
        </a>
    );
};

// Component: Logo
const Logo = () => (
    <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
                src="/image/logo_dashboard.png"
                alt="Karwanua Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
            />
        </div>
        <span className="text-white font-bold text-lg tracking-wide">KarWanua</span>
    </div>
);

// Component: AI Status Indicator (Display Only - Non-interactive)
const AIStatusIndicator = ({
    isActive
}: {
    isActive: boolean;
}) => (
    <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-200"
        title={`AI is ${isActive ? 'ON' : 'OFF'}`}
    >
        <span className="text-lg">🧠</span>
        <span className={`text-xs font-semibold ${isActive ? 'text-emerald-300' : 'text-gray-400'}`}>
            {isActive ? 'ON' : 'OFF'}
        </span>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></div>
    </div>
);

// Component: Search Button - REMOVED (as requested)
// const SearchButton = () => (
//     <button className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-green-700/40 bg-greenish-mid/60 text-gray-200 rounded-full hover:border-emerald-400/50 hover:text-white hover:bg-greenish-mid/80 transition-colors duration-200 w-full sm:w-auto flex items-center justify-center gap-2">
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//         </svg>
//         <span className="hidden sm:inline">Search</span>
//     </button>
// );

// Component: User Avatar
const UserAvatar = ({ onClick }: { onClick: () => void }) => (
    <div
        className="relative group cursor-pointer"
        onClick={onClick}
        title="Go to Profile"
    >
        <div className="absolute inset-0 -m-1 rounded-full hidden sm:block bg-emerald-400 opacity-40 filter blur-md pointer-events-none transition-all duration-300 ease-out group-hover:opacity-60 group-hover:blur-lg group-hover:-m-2"></div>
        <div className="relative z-10 w-9 h-9 bg-gradient-to-br from-emerald-300 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 hover:border-white/50 transition-all duration-200">
            JD
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-greenish-dark"></div>
    </div>
);

// Component: Menu Toggle Button
const MenuToggleButton = ({
    isOpen,
    onClick
}: {
    isOpen: boolean;
    onClick: () => void;
}) => (
    <button
        className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
        onClick={onClick}
        aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
    >
        {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        )}
    </button>
);

// Component: Desktop Navigation
const DesktopNav = ({
    currentPage,
    onNavClick
}: {
    currentPage: string;
    onNavClick: (page: string) => void;
}) => (
    <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
        {NAV_LINKS.map((link) => (
            <AnimatedNavLink
                key={link.page}
                href={`#${link.page}`}
                onClick={() => onNavClick(link.page)}
                isActive={currentPage === link.page}
            >
                {link.label}
            </AnimatedNavLink>
        ))}
    </nav>
);

// Component: Mobile Navigation
const MobileNav = ({
    isOpen,
    currentPage,
    onNavClick
}: {
    isOpen: boolean;
    currentPage: string;
    onNavClick: (page: string) => void;
}) => (
    <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'
        }`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
            {NAV_LINKS.map((link) => (
                <a
                    key={link.page}
                    href={`#${link.page}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onNavClick(link.page);
                    }}
                    className={`transition-colors w-full text-center ${currentPage === link.page ? 'text-emerald-400 font-semibold' : 'text-gray-300 hover:text-white'
                        }`}
                >
                    {link.label}
                </a>
            ))}
        </nav>
    </div>
);

// Component: Action Buttons
const ActionButtons = ({
    aiActive,
    onProfileClick
}: {
    aiActive: boolean;
    onProfileClick: () => void;
}) => (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
        <AIStatusIndicator isActive={aiActive} />
        <UserAvatar onClick={onProfileClick} />
    </div>
);

// Main Component: MiniNavbar
export function MiniNavbar({ currentPage = "dashboard", onPageChange }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
    const [aiActive, setAiActive] = useState(true);
    const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle shape transition based on menu state
    useEffect(() => {
        if (shapeTimeoutRef.current) {
            clearTimeout(shapeTimeoutRef.current);
        }

        if (isOpen) {
            setHeaderShapeClass('rounded-xl');
        } else {
            shapeTimeoutRef.current = setTimeout(() => {
                setHeaderShapeClass('rounded-full');
            }, 300);
        }

        return () => {
            if (shapeTimeoutRef.current) {
                clearTimeout(shapeTimeoutRef.current);
            }
        };
    }, [isOpen]);

    const handleNavClick = (page: string) => {
        if (onPageChange) {
            onPageChange(page);
        }
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleProfileClick = () => {
        handleNavClick('profile');
    };

    return (
        <header
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center px-4 sm:px-6 py-3 backdrop-blur-sm ${headerShapeClass} border border-green-700/40 bg-greenish-dark/80 transition-[border-radius] duration-300 ease-in-out w-[calc(100%-2rem)] sm:w-auto max-w-6xl`}
        >
            {/* Desktop Layout */}
            <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
                <Logo />

                <DesktopNav
                    currentPage={currentPage}
                    onNavClick={handleNavClick}
                />

                <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                    <ActionButtons
                        aiActive={aiActive}
                        onProfileClick={handleProfileClick}
                    />
                </div>

                <MenuToggleButton
                    isOpen={isOpen}
                    onClick={toggleMenu}
                />
            </div>

            {/* Mobile Menu */}
            <MobileNav
                isOpen={isOpen}
                currentPage={currentPage}
                onNavClick={handleNavClick}
            />

            {/* Mobile Action Buttons */}
            {isOpen && (
                <div className="sm:hidden w-full">
                    <ActionButtons
                        aiActive={aiActive}
                        onProfileClick={handleProfileClick}
                    />
                </div>
            )}
        </header>
    );
}