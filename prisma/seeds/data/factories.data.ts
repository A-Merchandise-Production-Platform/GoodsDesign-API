import { usersData } from "./users.data"
import { Prisma } from "@prisma/client"

export const factoriesData = [
    {
        factoryOwnerId: "factory-id",
        name: "GoodsPrint Manufacturing",
        description:
            "Specialized printing factory with high-quality standards and quick turnaround times",
        businessLicenseUrl:
            "https://storage.googleapis.com/goodsdesign/licenses/factory1-license.pdf",
        taxIdentificationNumber: "TAX123456789",
        address: "123 Industrial Zone, District 7, Ho Chi Minh City, Vietnam",

        // Factory specific information
        website: "https://goodsprintmfg.com",
        yearEstablished: 2015,
        totalEmployees: 120,
        maxPrintingCapacity: 5000,

        // Quality and certifications
        qualityCertifications: "ISO 9001, ISO 14001",
        primaryPrintingMethods: "DTG, Screen Printing, Sublimation",
        specializations: "Premium apparel, Eco-friendly printing, High-volume production",

        // Contact information
        contactPersonName: "Nguyen Van Minh",
        contactPersonRole: "Production Manager",
        contactPhone: "+84 28 1234 5678",

        // Operational details
        operationalHours: "Monday-Friday: 8:00-17:00, Saturday: 8:00-12:00",
        leadTime: 5,
        minimumOrderQuantity: 50,

        // Status tracking
        factoryStatus: "APPROVED",
        statusNote: "Fully approved and operational",
        contractAccepted: true,
        contractAcceptedAt: new Date("2023-01-15"),
        reviewedBy: "admin-id",
        reviewedAt: new Date("2023-01-10"),

        // Contract URL
        contractUrl: "https://storage.googleapis.com/goodsdesign/contracts/factory1-contract.pdf",

        // Legacy contract data for reference
        contract: {
            startDate: new Date("2023-01-15"),
            endDate: new Date("2024-01-15"),
            terms: "Standard contract terms with 5% commission on all orders",
            revenueSharingPercentage: 5,
            paymentTerms: "Net 30 days",
            qualityStandards: "Less than 0.5% defect rate allowed"
        },
        staffId: "staff-id"
    },
    {
        factoryOwnerId: "factory-id-2",
        name: "Textile Express",
        description: "Fast and reliable textile printing factory specializing in custom apparel",
        businessLicenseUrl:
            "https://storage.googleapis.com/goodsdesign/licenses/factory2-license.pdf",
        taxIdentificationNumber: "TAX987654321",
        address: "45 Manufacturing Road, District 2, Ho Chi Minh City, Vietnam",

        // Factory specific information
        website: "https://textileexpress.vn",
        yearEstablished: 2018,
        totalEmployees: 75,
        maxPrintingCapacity: 3000,

        // Quality and certifications
        qualityCertifications: "ISO 9001",
        primaryPrintingMethods: "DTG, Embroidery",
        specializations: "Small batches, Custom designs, Quick turnaround",

        // Contact information
        contactPersonName: "Tran Thi Hoa",
        contactPersonRole: "Owner",
        contactPhone: "+84 28 9876 5432",

        // Operational details
        operationalHours: "Monday-Saturday: 7:30-18:00",
        leadTime: 3,
        minimumOrderQuantity: 20,

        // Status tracking
        factoryStatus: "APPROVED",
        statusNote: "Pending final documentation review",
        contractAccepted: false,
        contractAcceptedAt: null,
        reviewedBy: null,
        reviewedAt: null,

        // Contract URL
        contractUrl: null,

        // Contract
        contract: null,
        staffId: "staff-id-1"
    }
]
