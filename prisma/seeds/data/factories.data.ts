export const factoriesData = [
    {
        factoryOwnerId: "factory-id",
        name: "GoodsPrint Manufacturing",
        description:
            "Specialized printing factory with high-quality standards and quick turnaround times",
        businessLicenseUrl:
            "https://storage.googleapis.com/goodsdesign/licenses/factory1-license.pdf",
        taxIdentificationNumber: "TAX123456789",

        // Factory specific information
        website: "https://goodsprintmfg.com",
        yearEstablished: 2015,
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
        leadTime: 5,

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
        staffId: "staff-id",
        address: {
            provinceID: 202,
            districtID: 1462,
            wardCode: "21610",
            street: "47 Nguyễn Huy Lượng",
            formattedAddress: "47 Nguyễn Huy Lượng, Phường 14, Quận Bình Thạnh, Hồ Chí Minh"
          }
    },
    {
        factoryOwnerId: "factory-id-2",
        name: "Textile Express",
        description: "Fast and reliable textile printing factory specializing in custom apparel",
        businessLicenseUrl:
            "https://storage.googleapis.com/goodsdesign/licenses/factory2-license.pdf",
        taxIdentificationNumber: "TAX987654321",

        // Factory specific information
        website: "https://textileexpress.vn",
        yearEstablished: 2018,
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
        leadTime: 3,

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
        staffId: "staff-id-1",
        address: {
            provinceID: 202,
            districtID: 1462,
            wardCode: "21610",
            street: "93/61 Đ. Nguyễn Đình Chiểu",
            formattedAddress: "93/61 Đ. Nguyễn Đình Chiểu, Phường 14, Quận Bình Thạnh, Hồ Chí Minh"
        }
    },
    {
        factoryOwnerId: "factory-id-3",
        name: "Premium Prints Co.",
        description: "High-end printing solutions with focus on quality and innovation",
        businessLicenseUrl:
            "https://storage.googleapis.com/goodsdesign/licenses/factory3-license.pdf",
        taxIdentificationNumber: "TAX456789123",

        // Factory specific information
        website: "https://premiumprints.vn",
        yearEstablished: 2020,
        maxPrintingCapacity: 4000,

        // Quality and certifications
        qualityCertifications: "ISO 9001, ISO 14001, GOTS",
        primaryPrintingMethods: "DTG, Screen Printing, Heat Transfer",
        specializations: "Luxury apparel, Sustainable printing, Custom packaging",

        // Contact information
        contactPersonName: "Le Thi Minh",
        contactPersonRole: "Operations Director",
        contactPhone: "+84 28 4567 8901",

        // Operational details
        leadTime: 4,

        // Status tracking
        factoryStatus: "APPROVED",
        statusNote: "New partner with excellent facilities",
        contractAccepted: true,
        contractAcceptedAt: new Date("2024-01-01"),
        reviewedBy: "admin-id",
        reviewedAt: new Date("2023-12-15"),

        // Contract URL
        contractUrl: "https://storage.googleapis.com/goodsdesign/contracts/factory3-contract.pdf",

        // Contract
        contract: {
            startDate: new Date("2024-01-01"),
            endDate: new Date("2025-01-01"),
            terms: "Premium contract terms with 4% commission on all orders",
            revenueSharingPercentage: 4,
            paymentTerms: "Net 15 days",
            qualityStandards: "Less than 0.3% defect rate allowed"
        },
        staffId: "staff-id-2",
        address: {
            provinceID: 202,
            districtID: 1452,
            wardCode: "21002",
            street: "Lô Y Chung cư Ngô Gia Tự",
            formattedAddress: "Lô Y Chung cư Ngô Gia Tự, Phường 2, Quận 10, Hồ Chí Minh"
          }
    }
]
