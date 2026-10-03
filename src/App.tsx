/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutService } from './components/AboutService';
import { PortfolioGallery } from './components/PortfolioGallery';
import { ContactForm } from './components/ContactForm';
import { MobileFloatingBar } from './components/MobileFloatingBar';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { PortfolioItem, NavigationTab } from './types';
import { PORTFOLIO_ITEMS as DEFAULT_PORTFOLIO_ITEMS } from './data/portfolioData';
import { getAllVideoBlobs } from './utils/indexedDbHelper';
import { getStoredCustomCategories, saveStoredCustomCategories } from './utils/categoryStorage';
import { db, testFirestoreConnection, seedInitialPortfolioItems, savePortfolioItemToFirestore } from './firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'gfl_portfolio_items_v9';
const ADMIN_SESSION_KEY = 'gfl_admin_session_auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [inquiryPrefill, setInquiryPrefill] = useState<string>('');

  // 1-1. Custom Categories State (영상 관리에서 신규 추가된 카테고리 실시간 연동)
  const [customCategories, setCustomCategories] = useState<string[]>(() => getStoredCustomCategories());

  const handleSaveCustomCategories = (updatedCategories: string[]) => {
    setCustomCategories(updatedCategories);
    saveStoredCustomCategories(updatedCategories);
    try {
      setDoc(doc(db, 'settings', 'categories'), {
        list: updatedCategories,
        updatedAt: new Date().toISOString()
      }).catch((e) => console.warn('Categories cloud sync note:', e));
    } catch (e) {
      console.warn('Categories cloud sync err:', e);
    }
  };

  // 1. Dynamic Portfolio Items State with LocalStorage Persistence
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Check previous version cache and preserve any user-created custom items
      const prevSaved = localStorage.getItem('gfl_portfolio_items_v8') || localStorage.getItem('gfl_portfolio_items_v7') || localStorage.getItem('gfl_portfolio_items_v6') || localStorage.getItem('gfl_portfolio_items_v5');
      if (prevSaved) {
        const prevParsed = JSON.parse(prevSaved);
        if (Array.isArray(prevParsed)) {
          const customItems = prevParsed.filter(
            (item: PortfolioItem) => !DEFAULT_PORTFOLIO_ITEMS.some((def) => def.id === item.id)
          );
          if (customItems.length > 0) {
            return [...DEFAULT_PORTFOLIO_ITEMS, ...customItems];
          }
        }
      }
    } catch (e) {
      console.error('Failed to load portfolio items from localStorage:', e);
    }
    return DEFAULT_PORTFOLIO_ITEMS;
  });

  // 1-2. Connect to Firebase Firestore for Real-time Cloud Sync across all devices
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      if (connected) {
        seedInitialPortfolioItems(DEFAULT_PORTFOLIO_ITEMS);
      }
    });

    const unsubscribe = onSnapshot(collection(db, 'portfolio_items'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudItems: PortfolioItem[] = [];
        snapshot.forEach((docSnap) => {
          cloudItems.push(docSnap.data() as PortfolioItem);
        });

        // Maintain curated showcase order, with new custom items properly ordered
        const defaultOrderMap = new Map<string, number>();
        DEFAULT_PORTFOLIO_ITEMS.forEach((item, idx) => {
          defaultOrderMap.set(item.id, idx);
        });

        cloudItems.sort((a, b) => {
          const orderA = defaultOrderMap.has(a.id) ? defaultOrderMap.get(a.id)! : 999;
          const orderB = defaultOrderMap.has(b.id) ? defaultOrderMap.get(b.id)! : 999;
          if (orderA !== orderB) return orderA - orderB;
          return (b.updatedAt || '').localeCompare(a.updatedAt || '');
        });

        // Merge with any custom in-memory IndexedDB video blobs
        setPortfolioItems((prev) => {
          return cloudItems.map((cItem) => {
            const existing = prev.find((p) => p.id === cItem.id);
            // If the cloud item already has a valid external videoUrl (YouTube, Vimeo, MP4 direct link),
            // ALWAYS prioritize the cloud item videoUrl!
            if (
              existing &&
              existing.hasCustomVideo &&
              existing.videoUrl &&
              (!cItem.videoUrl || cItem.videoUrl.trim() === '' || cItem.videoUrl.startsWith('blob:'))
            ) {
              return {
                ...cItem,
                hasCustomVideo: true,
                videoUrl: existing.videoUrl
              };
            }
            return cItem;
          });
        });
      }
    }, (error) => {
      console.warn('Firestore real-time sync note:', error);
    });

    // Also sync categories if present
    const unsubscribeCat = onSnapshot(doc(db, 'settings', 'categories'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data?.list) && data.list.length > 0) {
          setCustomCategories(data.list);
          saveStoredCustomCategories(data.list);
        }
      }
    }, (error) => {
      console.warn('Categories sync note:', error);
    });

    return () => {
      unsubscribe();
      unsubscribeCat();
    };
  }, []);

  // Load video attachments stored in IndexedDB on application start
  useEffect(() => {
    let isMounted = true;
    getAllVideoBlobs()
      .then((videoBlobs) => {
        if (!isMounted || videoBlobs.size === 0) return;
        setPortfolioItems((prevItems) => {
          let hasUpdates = false;
          const updated = prevItems.map((item) => {
            const blob = videoBlobs.get(item.id);
            if (blob && (!item.videoUrl || item.videoUrl.startsWith('blob:'))) {
              hasUpdates = true;
              return {
                ...item,
                hasCustomVideo: true,
                videoUrl: URL.createObjectURL(blob)
              };
            }
            return item;
          });
          return hasUpdates ? updated : prevItems;
        });
      })
      .catch((err) => {
        console.warn('Could not read videos from IndexedDB:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Admin Authentication & Modal State (Password: 1111)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Hidden admin entrance: Keyboard shortcut (Ctrl+Shift+A or Cmd+Shift+A) & URL Hash/Query (#admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };

    const checkAdminUrl = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setIsAdminModalOpen(true);
      }
    };

    checkAdminUrl();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkAdminUrl);
    window.addEventListener('popstate', checkAdminUrl);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkAdminUrl);
      window.removeEventListener('popstate', checkAdminUrl);
    };
  }, []);

  // Sync admin auth status to session storage
  const handleSetAdminLoggedIn = (status: boolean) => {
    setIsAdminLoggedIn(status);
    try {
      if (status) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to update admin session in storage:', e);
    }
  };

  // Save updated portfolio items safely with storage protection and real-time Firestore sync
  const handleSavePortfolioItems = (updated: PortfolioItem[]) => {
    setPortfolioItems(updated);
    try {
      const sanitizedForStorage = updated.map((item) => {
        if (item.videoUrl && (item.videoUrl.startsWith('blob:') || item.videoUrl.startsWith('data:video/'))) {
          return {
            ...item,
            hasCustomVideo: true,
            videoUrl: undefined
          };
        }
        return item;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitizedForStorage));

      // Real-time synchronization to Google Cloud Firestore
      sanitizedForStorage.forEach((item) => {
        savePortfolioItemToFirestore(item).catch((err) => {
          console.warn('Failed to sync item to Firestore:', item.id, err);
        });
      });
    } catch (e) {
      console.warn('LocalStorage save quota exceeded, items kept in memory and IndexedDB:', e);
    }
  };

  // Seamless tab navigation helpers
  const handleSwitchTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForInquiry = (serviceName: string) => {
    setInquiryPrefill(`[${serviceName}] 관련 제작 상담 및 견적 문의드립니다.`);
    handleSwitchTab('contact');
  };

  const handleSelectWorkItem = (item: PortfolioItem) => {
    setInquiryPrefill(`[${item.badge} ${item.title}] 스타일의 작업 영상 제작 견적 및 일정 문의드립니다.`);
  };

  const activePortfolioItems = portfolioItems.filter(item => !item.isDeleted);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-zinc-200 selection:text-zinc-900 pb-16 md:pb-0">
      
      {/* 1. Fixed Top GNB Header [Home, Service, Work, Contact] */}
      <Header 
        activeTab={activeTab}
        onTabChange={handleSwitchTab}
      />

      {/* 2. SPA Dynamic Content Area with Smooth Fade-in Animation */}
      <main className="flex-1 pt-14 sm:pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full"
            >
              <Hero 
                onExploreWork={() => handleSwitchTab('work')} 
                onOpenContact={() => handleSwitchTab('contact')}
                featuredItem={activePortfolioItems[0] || portfolioItems[0]}
                onSelectWorkItem={() => handleSwitchTab('work')}
              />
            </motion.div>
          )}

          {activeTab === 'service' && (
            <motion.div
              key="tab-service"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full"
            >
              <AboutService 
                onSelectServiceForInquiry={handleSelectServiceForInquiry} 
                onExploreWork={() => handleSwitchTab('work')}
              />
            </motion.div>
          )}

          {activeTab === 'work' && (
            <motion.div
              key="tab-work"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full"
            >
              <PortfolioGallery 
                items={activePortfolioItems}
                onSelectItem={handleSelectWorkItem}
                onOpenContact={() => handleSwitchTab('contact')}
                customCategories={customCategories}
              />
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="tab-contact"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full"
            >
              <ContactForm 
                prefilledMessage={inquiryPrefill} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Footer with Navigation Links & Admin Access */}
      <Footer 
        onTabChange={handleSwitchTab}
        onOpenAdmin={() => setIsAdminModalOpen(true)} 
      />

      {/* 4. Mobile Floating Sticky Bar */}
      <MobileFloatingBar />

      {/* 5. Admin Management Modal (Password: 1111) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        items={portfolioItems}
        onSaveItems={handleSavePortfolioItems}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={handleSetAdminLoggedIn}
        customCategories={customCategories}
        onSaveCustomCategories={handleSaveCustomCategories}
      />
    </div>
  );
}
