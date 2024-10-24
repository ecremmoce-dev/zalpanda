'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const salesData = [
  { name: 'Jan', sales: 2000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2800 },
  { name: 'Apr', sales: 3500 },
  { name: 'May', sales: 3200 },
  { name: 'Jun', sales: 3800 },
]

const productData = [
  { name: 'MacBook Pro with M2 Chip', firstStock: 4159, sold: 878, dateAdded: 'Jul 14, 2023', pricing: 1200, rating: 4.8 },
  { name: 'iPhone 15 128 / 256 / 512 IBOX', firstStock: 1590, sold: 981, dateAdded: 'Aug 09, 2023', pricing: 1060, rating: 5.0 },
  { name: 'Apple Watch Ultra 2 Alpine', firstStock: 1090, sold: 184, dateAdded: 'Aug 12, 2023', pricing: 999, rating: 4.7 },
  { name: 'iPhone 15 Pro Max 256', firstStock: 2590, sold: 995, dateAdded: 'Aug 24, 2023', pricing: 1600, rating: 4.2 },
  { name: 'MacBook Pro with M2 Chip', firstStock: 4100, sold: 645, dateAdded: 'Nov 30, 2023', pricing: 1200, rating: 5.0 },
]

export default function Dashboard() {
  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-500 mb-8">All general information appears in this field</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">December Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">Retrieve December report, analyze key data for informed strategic decisions.</p>
            <div className="flex space-x-2">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Analyze This</Button>
              <Button variant="outline">Download</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">December Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">$287,000</div>
            <div className="text-sm text-gray-500 mb-4"># Macbook m2 # iPhone 15</div>
            <div className="text-xs text-green-500">↑ 18.24%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">December Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">4.5k</div>
            <div className="text-sm text-gray-500 mb-4">1,272 iPhone 15 675 Macbook</div>
            <div className="text-xs text-red-500">↓ 3.18%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Published</CardTitle>
          <Button className="bg-indigo-600 hover:bg-indigo-700">Export Now</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PRODUCT NAME</TableHead>
                <TableHead>FIRST STOCK</TableHead>
                <TableHead>SOLD</TableHead>
                <TableHead>DATE ADDED</TableHead>
                <TableHead>PRICING</TableHead>
                <TableHead>RATING</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.firstStock}</TableCell>
                  <TableCell>{product.sold}</TableCell>
                  <TableCell>{product.dateAdded}</TableCell>
                  <TableCell>${product.pricing}</TableCell>
                  <TableCell>{product.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
