"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/utils/supabase/client"
import { useUserDataStore } from "@/store/modules"
import { useSupplierStore } from "@/store/modules/supplierStore"
import SupplierProductManagement from "@/components/product-revision"

export default function ProductManagement() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="supplier" className="w-full">
        
        <TabsContent value="supplier">
          <SupplierProductManagement />
        </TabsContent>
        
      </Tabs>
    </div>
  )
} 