import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-100 text-gov-green border-green-200'
    case 'medium':
      return 'bg-yellow-100 text-gov-orange border-yellow-200'
    case 'high':
      return 'bg-orange-100 text-gov-orange border-orange-200'
    case 'critical':
      return 'bg-red-100 text-gov-red border-red-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-gov-green border-green-200'
    case 'draft':
      return 'bg-gray-100 text-gray-600 border-gray-200'
    case 'under_review':
      return 'bg-yellow-100 text-gov-orange border-yellow-200'
    case 'completed':
      return 'bg-blue-100 text-gov-blue border-blue-200'
    case 'cancelled':
      return 'bg-red-100 text-gov-red border-red-200'
    case 'expired':
      return 'bg-red-100 text-gov-red border-red-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}
