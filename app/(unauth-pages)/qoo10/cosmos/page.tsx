'use client'

import dynamic from 'next/dynamic'

// CosmosManagementContent를 dynamic import로 변경
const CosmosManagementContent = dynamic(
    () => import('@/components/cosmos-management-content').then(mod => mod.CosmosManagementContent),
    { ssr: false }
)

export default function CosmosPage() {
    return (
        <CosmosManagementContent />
    )
} 