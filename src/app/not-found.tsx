"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 마우스 움직임에 따라 고스트 눈동자가 따라가도록 하는 효과
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* 귀여운 캘린더 고스트 캐릭터 */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative"
          >
            {/* 캘린더 모양 몸체 */}
            <div className="w-40 h-40 bg-blue-50 rounded-3xl relative shadow-lg">
              {/* 캘린더 상단 바 */}
              <div className="absolute top-0 w-full h-10 bg-blue-100 rounded-t-3xl" />

              {/* 눈동자 */}
              <div className="absolute left-1/4 top-1/2 w-6 h-6 bg-gray-800 rounded-full">
                <motion.div
                  animate={{ x: position.x, y: position.y }}
                  className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"
                />
              </div>
              <div className="absolute right-1/4 top-1/2 w-6 h-6 bg-gray-800 rounded-full">
                <motion.div
                  animate={{ x: position.x, y: position.y }}
                  className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"
                />
              </div>

              {/* 볼터치 */}
              <div className="absolute left-1/4 top-[60%] w-3 h-2 bg-pink-200 rounded-full opacity-70" />
              <div className="absolute right-1/4 top-[60%] w-3 h-2 bg-pink-200 rounded-full opacity-70" />

              {/* 귀여운 미소 */}
              <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-10 h-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-full h-full border-b-4 border-gray-800 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-900 mb-3"
        >
          앗, 이 페이지를 찾을 수 없어요
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          요청하신 페이지가 삭제되었거나 잘못된 경로예요
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors inline-block text-lg shadow-md hover:shadow-lg"
          >
            홈으로 가기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
