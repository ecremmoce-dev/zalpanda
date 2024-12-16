'use client'

import { 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Image, 
  Package2, 
  Settings, 
  Square, 
  Eraser, 
  Scissors, 
  LayoutDashboard,
  ScanSearch,
  ShoppingCart,
  Users,
  Languages,
  Globe,
  MessageSquare
} from "lucide-react"
import NextImage from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname() || ''

  const [isProductMenuOpen, setIsProductMenuOpen] = useState(pathname.startsWith('/product'))
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(pathname.startsWith('/manage'))
  const [isQoo10MenuOpen, setIsQoo10MenuOpen] = useState(pathname.startsWith('/qoo10'))
  const [isShopeeMenuOpen, setIsShopeeMenuOpen] = useState(pathname.startsWith('/shopee'))
  const [isLazadaMenuOpen, setIsLazadaMenuOpen] = useState(pathname.startsWith('/lazada'))
  const [isTmallMenuOpen, setIsTmallMenuOpen] = useState(pathname.startsWith('/tmall'))
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(pathname.startsWith('/image'))
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const toggleProductMenu = () => {
    setIsProductMenuOpen(!isProductMenuOpen)
  }

  const toggleManageMenu = () => {
    setIsManageMenuOpen(!isManageMenuOpen)
  }

  const toggleShopeeMenu = () => {
    setIsShopeeMenuOpen(!isShopeeMenuOpen)
  }

  const toggleLazadaMenu = () => {
    setIsLazadaMenuOpen(!isLazadaMenuOpen)
  }

  const toggleTmallMenu = () => {
    setIsTmallMenuOpen(!isTmallMenuOpen)
  }

  const toggleImageMenu = () => {
    setIsImageMenuOpen(!isImageMenuOpen)
  }

  const toggleQoo10Menu = () => {
    setIsQoo10MenuOpen(!isQoo10MenuOpen)
  }

  const toggleSettingsMenu = () => {
    setIsSettingsOpen(prev => !prev)
  }
  
  useEffect(() => {
    if (pathname.startsWith('/product') && !pathname.includes('/product/customer')) {
      setIsProductMenuOpen(true)
    }
    if (pathname.startsWith('/manage') || 
        pathname.includes('/product/customer') || 
        pathname === '/settings/accounts') {
      setIsManageMenuOpen(true)
    }
    if (pathname.startsWith('/qoo10')) {
      setIsQoo10MenuOpen(true)
    }
    if (pathname.startsWith('/shopee')) {
      setIsShopeeMenuOpen(true)
    }
    if (pathname.startsWith('/lazada')) {
      setIsLazadaMenuOpen(true)
    }
    if (pathname.startsWith('/tmall')) {
      setIsTmallMenuOpen(true)
    }
    if (pathname.startsWith('/image')) {
      setIsImageMenuOpen(true)
    }
  }, [pathname])

  const qoo10SubMenus = [
    {
      title: '상품관리',
      href: '/qoo10/productmanagement',
      icon: ShoppingCart
    },
    {
      title: '상품리스트',
      href: '/qoo10/productlist',
      icon: MessageSquare
    },
    {
      title: '상품관리QSM',
      href: '/qoo10/cosmos',
      icon: Globe
    },
    
  ]

  const isCurrentPath = (path: string) => {
    return pathname === path
  }

  const getLinkClassName = (path: string) => {
    const baseStyle = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
    return `${baseStyle} ${
      isCurrentPath(path) 
        ? "bg-gray-100 text-gray-900" 
        : "text-gray-500 hover:text-gray-900"
    }`
  }

  const getSubLinkClassName = (path: string) => {
    const baseStyle = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all"
    return `${baseStyle} ${
      isCurrentPath(path) 
        ? "bg-gray-100 text-gray-900" 
        : "text-gray-500 hover:text-gray-900"
    }`
  }

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <Package2 className="h-6 w-6" />
            <span>ecremmoce</span>
          </Link>
          <Button className="ml-auto h-8 w-8" size="icon" variant="ghost">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
        <div className="flex-1 px-4">
          <div className="space-y-1 p-2">
            <Input className="h-9" placeholder="Search..." />
          </div>
          <nav className="grid gap-1 px-2 py-4">
            <Link
              className={getLinkClassName("/dashboard")}
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="font-semibold">대시보드</span>
            </Link>
            <div>
              <button
                onClick={toggleProductMenu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <Package2 className="h-4 w-4" />
                  <span className="font-semibold">상품</span>
                </div>
                {isProductMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isProductMenuOpen && (
                <div className="ml-6 mt-2 space-y-1">
                  <Link
                    href="/product/public"
                    className={getSubLinkClassName("/product/public")}
                  >
                    <Users className="h-4 w-4" />
                    공용 상품
                  </Link>
                  <Link
                    href="/product/revision"
                    className={getSubLinkClassName("/product/revision")}
                  >
                    <Image className="h-4 w-4" />
                    상품 보정
                  </Link>
                  <Link 
                    href="/product/translation/names" 
                    className={getSubLinkClassName("/product/translation/names")}
                  >
                    <Languages className="h-4 w-4" />
                    상품 번역
                  </Link>
                  <Link 
                    href="/product/category/map/mapping" 
                    className={getSubLinkClassName("/product/category/map/mapping")}
                  >
                    <Globe className="h-4 w-4" />
                    카테고리 맵핑
                  </Link>
                  <Link 
                    href="/product/options/volume" 
                    className={getSubLinkClassName("/product/options/volume")}
                  >
                    <Package2 className="h-4 w-4" />
                    무게/크기 등록
                  </Link>
                  <Link 
                    href="/product/options/stock" 
                    className={getSubLinkClassName("/product/options/stock")}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    가격/재고 등록
                  </Link>
                  <Link 
                    href="/product/exchange" 
                    className={getSubLinkClassName("/product/exchange")}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    플랫폼 가격 계산
                  </Link>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={toggleManageMenu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  <span className="font-semibold">관리</span>
                </div>
                {isManageMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isManageMenuOpen && (
                <div className="ml-6 mt-2 space-y-1">
                  <Link
                    className={getSubLinkClassName("/product/customer")}
                    href="/product/customer"
                  >
                    <Users className="h-4 w-4" />
                    공급사 관리
                  </Link>
                  <Link
                    className={getSubLinkClassName("/settings/accounts")}
                    href="/settings/accounts"
                  >
                    <Users className="h-4 w-4" />
                    업체계정관리
                  </Link>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={toggleQoo10Menu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="font-semibold">QOO10</span>
                </div>
                {isQoo10MenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isQoo10MenuOpen && (
                <div className="ml-6 mt-2 space-y-1">
                  <Link
                    className={getSubLinkClassName("/qoo10/cosmos")}
                    href="/qoo10/cosmos"
                  >
                    <Globe className="h-4 w-4" />
                    상품관리
                  </Link>
                  <Link
                    className={getSubLinkClassName("/qoo10/orders")}
                    href="/qoo10/orders"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    주문관리
                  </Link>
                  <Link
                    className={getSubLinkClassName("/qoo10/inquiries")}
                    href="/qoo10/inquiries"
                  >
                    <MessageSquare className="h-4 w-4" />
                    문의관리
                  </Link>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={toggleShopeeMenu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="font-semibold">SHOPEE</span>
                </div>
                {isShopeeMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
            <div>
              <button
                onClick={toggleLazadaMenu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="font-semibold">LAZADA</span>
                </div>
                {isLazadaMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
            <div>
              <button
                onClick={toggleTmallMenu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="font-semibold">TMALL</span>
                </div>
                {isTmallMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
            <div>
              <button
                onClick={toggleImageMenu}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <Image className="h-4 w-4" />
                  <span className="font-semibold">이미지</span>
                </div>
                {isImageMenuOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {isImageMenuOpen && (
                <div className="ml-6 mt-2 space-y-1">
                  <Link
                    className={getSubLinkClassName("/image/square")}
                    href="/image/square"
                  >
                    <Square className="h-4 w-4" />
                    이미지 정사각형 변경
                  </Link>
                  <Link
                    className={getSubLinkClassName("/image/resize")}
                    href="/image/resize"
                  >
                    <Image className="h-4 w-4" />
                    이미지 사이즈 변경
                  </Link>
                  <Link
                    className={getSubLinkClassName("/image/background")}
                    href="/image/background"
                  >
                    <Eraser className="h-4 w-4" />
                    이미지 배경 제거
                  </Link>
                  <Link
                    className={getSubLinkClassName("/image/split")}
                    href="/image/split"
                  >
                    <Scissors className="h-4 w-4" />
                    이미지 분할
                  </Link>
                  <Link
                    className={getSubLinkClassName("/image/merge")}
                    href="/image/merge"
                  >
                    <Square className="h-4 w-4" />
                    이미지 합치기
                  </Link>
                  <Button
                    variant={pathname === "/image/text-detection" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/image/text-detection">
                      <ScanSearch className="mr-2 h-4 w-4" />
                      이미지 텍스트 검출
                    </Link>
                  </Button>
                  <Link
                    className={getSubLinkClassName("/image/translation")}
                    href="/image/translation"
                  >
                    <Languages className="h-4 w-4" />
                    이미지 번역
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <nav className="grid gap-1">
            <Link
              className={getLinkClassName("/settings")}
              href="/settings"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link> 
            <Link
              className={getLinkClassName("/help")}
              href="/help"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Center
            </Link>
          </nav>
          <Separator className="my-4" />
          <div className="flex items-center gap-3 px-3">
            <NextImage
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Richard Brown</span>
            </div>
            <Button className="ml-auto h-8 w-8" size="icon" variant="ghost">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 