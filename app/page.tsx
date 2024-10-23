import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <header className="bg-[#1e293b] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Extej</h1>
          <nav>
            <Link href="/login" className="text-sm font-medium hover:underline">
              로그인
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">이미지 처리 서비스</h2>
          <p className="text-xl text-gray-600">
            배경 제거, AI 이미지 생성, 화질 개선을 한 곳에서
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">배경 지우기</h3>
            <p className="text-gray-600 mb-4">
              클릭 한 번으로 이미지 배경을 깔끔하게 제거하세요.
            </p>
            <Button className="bg-[#f43f5e] hover:bg-[#e11d48]">
              시작하기
            </Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">AI 이미지 생성</h3>
            <p className="text-gray-600 mb-4">
              텍스트 설명만으로 독특한 이미지를 생성해보세요.
            </p>
            <Button className="bg-[#f43f5e] hover:bg-[#e11d48]">
              시작하기
            </Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">화질 개선</h3>
            <p className="text-gray-600 mb-4">
              저해상도 이미지를 선명하고 깨끗한 고화질로 변환하세요.
            </p>
            <Button className="bg-[#f43f5e] hover:bg-[#e11d48]">
              시작하기
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-[#1e293b] text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Extej. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
