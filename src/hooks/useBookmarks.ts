"use client";
import { useState, useEffect } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("accesshealth_bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const newBookmarks = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    
    setBookmarks(newBookmarks);
    localStorage.setItem("accesshealth_bookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}
