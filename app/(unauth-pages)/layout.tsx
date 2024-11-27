'use client'

import React, { useEffect } from 'react'
import { supabase } from "@/utils/supabase/client";
import { useUserDataStore } from "@/store/modules";

export default function UnauthPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setUserData } = useUserDataStore()

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      await fetchUserData(data.user.id)
    }
  }

  const fetchUserData = async (supabaseuserid: string) => {
    const { data: user, error: userError } = await supabase.from('company_account')
      .select('*')
      .eq('supabaseuserid', supabaseuserid)
      .single()
    
    if (!userError) {
      const { data, error } = await supabase.from('account_company')
        .select('*')
        .eq('accountid', user.id)
        .single()

        if (!error) {
          user.companyid = data.companyid
          setUserData(user)
        }
    }
  }
  return <>{children}</>
}