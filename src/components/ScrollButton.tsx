"use client";
import { useState, useEffect } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const ScrollButton = () => {
  const [atBottom, setAtBottom] = useState(false);

  // 🔧 `checkScrollTop` kaldırıldı çünkü `showScroll` kullanılmıyordu
  // 🔧 `showScroll` state'i de kaldırıldı (gereksizdi)

  useEffect(() => {
    const checkScrollBottom = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 50
      ) {
        setAtBottom(true);
      } else {
        setAtBottom(false);
      }
    };

    // ✅ Scroll ve resize olayları dinleniyor
    window.addEventListener("scroll", checkScrollBottom);
    window.addEventListener("resize", checkScrollBottom);

    // ✅ İlk render'da kontrol yapılmalı
    checkScrollBottom();

    return () => {
      window.removeEventListener("scroll", checkScrollBottom);
      window.removeEventListener("resize", checkScrollBottom);
    };
  }, []);

  // 🔼 Yukarı kaydırma
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔽 En alta kaydırma
  const scrollBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* 🔻 En aşağıdayken aşağı butonu gizleniyor */}
      {!atBottom && (
        <FaArrowDown
          className="fixed bottom-5 right-5 h-10 w-10 cursor-pointer text-gray-500 hover:text-gray-700 z-50 animate-bounce"
          onClick={scrollBottom}
        />
      )}

      {/* 🔺 En aşağıdayken yukarı butonu gösteriliyor */}
      {atBottom && (
        <FaArrowUp
          className="fixed top-5 right-5 h-10 w-10 cursor-pointer text-gray-500 hover:text-gray-700 z-50 animate-bounce"
          onClick={scrollTop}
        />
      )}
    </div>
  );
};

export default ScrollButton;
