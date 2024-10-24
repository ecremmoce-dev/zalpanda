'use client'

import React from 'react'
import { Search, Bell, Globe, User, LogOut } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 border-b border-gray-200">
      <div className="flex-1 mr-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Find something"
            className="pl-10 w-full bg-gray-100 border-none focus:ring-0"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
        <Globe className="h-5 w-5 text-gray-500 cursor-pointer" />
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </div>
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
