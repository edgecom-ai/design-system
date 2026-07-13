"use client"

import { Card } from "@/components/ui/card"
import ProductDatatable, { type Item } from "@/components/shadcn-studio/blocks/datatable-product"

const productData: Item[] = [
  { id: "1", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-3.png", product: "Main Building Incomer", brand: "HQ – Bay Street", category: "smartphone", stock: "available", amount: 312, quantity: 45, status: "publish" },
  { id: "2", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png", product: "Chiller Submeter", brand: "HQ – Bay Street", category: "laptop", stock: "unavailable", amount: 890, quantity: 634, status: "publish" },
  { id: "3", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-5.png", product: "Rooftop HVAC Meter", brand: "Head Office", category: "headphone", stock: "available", amount: 120, quantity: 456, status: "inactive" },
  { id: "4", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-6.png", product: "Feeder 1", brand: "Manufacturing Plant", category: "laptop", stock: "unavailable", amount: 112, quantity: 4, status: "publish" },
  { id: "5", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-7.png", product: "Lighting Submeter", brand: "Warehouse B", category: "smartwatch", stock: "unavailable", amount: 150, quantity: 45, status: "inactive" },
  { id: "6", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-8.png", product: "Compressor Meter", brand: "Calgary Plant 2", category: "controller", stock: "available", amount: 520, quantity: 56, status: "publish" },
  { id: "7", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-9.png", product: "Process Load Meter", brand: "Calgary Plant 2", category: "smartphone", stock: "available", amount: 1200, quantity: 89, status: "publish" },
  { id: "8", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-10.png", product: "Boiler Gas Meter", brand: "Toronto DC", category: "laptop", stock: "available", amount: 980, quantity: 23, status: "scheduled" },
  { id: "9", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-11.png", product: "Water Intake Meter", brand: "Toronto DC", category: "furniture", stock: "unavailable", amount: 280, quantity: 67, status: "publish" },
  { id: "10", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-12.png", product: "Cooling Tower Meter", brand: "Data Center East", category: "fashion", stock: "available", amount: 450, quantity: 134, status: "publish" },
  { id: "11", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-13.png", product: "Backup Generator", brand: "Data Center East", category: "controller", stock: "available", amount: 499, quantity: 78, status: "publish" },
  { id: "12", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-14.png", product: "IAQ Sensor", brand: "Head Office", category: "smartwatch", stock: "unavailable", amount: 699, quantity: 45, status: "inactive" },
  { id: "13", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-15.png", product: "Feeder 2", brand: "Manufacturing Plant", category: "smartphone", stock: "available", amount: 1150, quantity: 12, status: "scheduled" },
  { id: "14", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-16.png", product: "Solar Array Meter", brand: "Warehouse B", category: "fashion", stock: "available", amount: 249, quantity: 203, status: "publish" },
  { id: "15", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png", product: "EV Charger Meter", brand: "HQ – Bay Street", category: "laptop", stock: "unavailable", amount: 349, quantity: 156, status: "inactive" },
  { id: "16", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-6.png", product: "Substation Meter", brand: "Calgary Plant 2", category: "laptop", stock: "available", amount: 329, quantity: 87, status: "publish" },
  { id: "17", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-10.png", product: "Pump Station Meter", brand: "Toronto DC", category: "laptop", stock: "available", amount: 799, quantity: 67, status: "publish" },
  { id: "18", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-16.png", product: "Refrigeration Meter", brand: "Warehouse C", category: "fashion", stock: "available", amount: 1399, quantity: 34, status: "scheduled" },
  { id: "19", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-8.png", product: "Air Handler Meter", brand: "Data Center East", category: "controller", stock: "unavailable", amount: 499, quantity: 28, status: "inactive" },
  { id: "20", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-4.png", product: "Tenant Submeter A", brand: "HQ – Front Street", category: "laptop", stock: "available", amount: 699, quantity: 19, status: "publish" },
  { id: "21", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-8.png", product: "Tenant Submeter B", brand: "HQ – Front Street", category: "controller", stock: "available", amount: 649, quantity: 89, status: "scheduled" },
  { id: "22", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-15.png", product: "Kiln Meter", brand: "Manufacturing Plant", category: "smartphone", stock: "unavailable", amount: 899, quantity: 43, status: "inactive" },
  { id: "23", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-11.png", product: "Domestic Water Meter", brand: "Warehouse C", category: "furniture", stock: "available", amount: 1299, quantity: 76, status: "publish" },
  { id: "24", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-12.png", product: "Battery Storage Meter", brand: "Data Center East", category: "fashion", stock: "available", amount: 149, quantity: 234, status: "publish" },
  { id: "25", productImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/data-table/image-7.png", product: "Emissions Monitor", brand: "Calgary Plant 2", category: "smartwatch", stock: "available", amount: 199, quantity: 167, status: "scheduled" }
]

export function DataTableAdvancedDemo() {
  return (
    <Card className="w-full py-0">
      <ProductDatatable data={productData} />
    </Card>
  )
}
