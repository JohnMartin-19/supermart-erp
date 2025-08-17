# SuperMart ERP - Kenyan Supermarket Chain Management System

A comprehensive ERP system designed specifically for Kenyan supermarket chains, featuring point-of-sale, inventory management, accounting, and multi-location management capabilities.

## Features

### 🏪 Supermarket Operations
- **Point of Sale (POS)** - Complete checkout system with barcode scanning, VAT calculation, and multiple payment methods (Cash, M-Pesa, Card)
- **Product Catalog** - Comprehensive product management with categories, pricing, stock levels, and supplier information
- **Customer Management** - Loyalty programs, customer tiers, and purchase history tracking
- **Supplier Management** - Vendor relationships, purchase orders, and payment tracking
- **Multi-Location Management** - Centralized control of multiple supermarket branches
- **Cash Management** - Daily cash flow tracking, drawer management, and reconciliation

### 💼 Core Business Modules
- **Accounting** - General ledger, financial reports, and bookkeeping
- **Inventory** - Stock tracking, reorder management, and warehouse operations
- **VAT Compliance** - Kenyan VAT calculations and tax reporting
- **Payroll** - Employee salary processing and statutory compliance
- **Quick Invoice & Billing** - Rapid transaction processing

### 🇰🇪 Kenya-Specific Features
- KES currency support
- 16% VAT calculation
- M-Pesa payment integration
- Multi-county branch management
- Kenyan business compliance features

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Backend Ready**: Configured for Django + DRF integration

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supermart-erp
   ```

2. **Move existing components to src directory**
   ```bash
   # Move all component files to src/components/
   mkdir -p src/components/ui
   mv components/* src/components/
   
   # Move styles if not already moved
   mv styles/* src/styles/ 2>/dev/null || true
   
   # Update import paths in all component files
   # Change relative imports from './components/' to '@/components/'
   # Change './ui/' imports to '@/components/ui/'
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── PointOfSale.tsx  # POS system
│   ├── ProductCatalog.tsx
│   ├── CustomerManagement.tsx
│   ├── SupplierManagement.tsx
│   ├── MultiLocationManagement.tsx
│   ├── CashManagement.tsx
│   └── ...
├── styles/              # Global styles
│   └── globals.css      # Tailwind + custom CSS
├── App.tsx              # Main application
└── main.tsx             # React entry point
```

## Django Integration

This frontend is designed to work with a Django REST Framework backend. The system includes:

- API endpoint configuration in settings
- Authentication handling
- Data models that match Django models
- Real-time synchronization capabilities

### Backend Setup (Optional)
If you're setting up the Django backend:

1. Create a separate Django project
2. Install Django REST Framework
3. Configure CORS for frontend integration
4. Set up models for products, customers, suppliers, etc.
5. Create API endpoints matching the frontend expectations

## Key Components

### Point of Sale (POS)
- Product search and barcode scanning
- Shopping cart management
- VAT calculations
- Multiple payment methods
- Receipt generation

### Product Management
- Product catalog with categories
- Stock level monitoring
- Supplier information
- Price management
- Low stock alerts

### Multi-Location Management
- Branch overview and performance
- Stock transfers between locations
- Centralized reporting
- Location-specific settings

### Customer Management
- Customer registration and profiles
- Loyalty point system
- Tier-based benefits (Regular, Silver, Gold, Platinum)
- Purchase history tracking

## Customization

The system is designed to be easily customizable for different supermarket chains:

- Modify branding in `Layout.tsx`
- Adjust VAT rates in tax components
- Customize loyalty tiers and rewards
- Add new product categories
- Configure payment methods

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for Kenyan supermarket businesses