'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
        <Icon className="mr-3 h-4 w-4" />
        <span>{label}</span>
        {children && <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />}
      </CollapsibleTrigger>
      {children && (
        <CollapsibleContent>
          <div className="pl-4">
            {React.Children.map(children, (child) =>
              React.cloneElement(child as React.ReactElement, { className: 'py-1' })
            )}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

export default SidebarItem
