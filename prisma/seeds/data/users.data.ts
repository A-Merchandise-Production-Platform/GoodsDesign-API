import { Roles } from "@prisma/client"

interface Address {
    provinceID: number
    districtID: number
    wardCode: string
    street: string
    formattedAddress: string
}

interface UserSeedData {
    id: string
    email: string
    name: string
    phoneNumber: string
    gender: boolean
    dateOfBirth: string
    imageUrl: string
    isActive: boolean
    role: Roles
    address: Address
    isVerified: boolean
}

interface UsersData {
    users: UserSeedData[]
}

export const usersData: UsersData = {
    users: [
        {
            id: "admin-id",
            email: "admin@gmail.com",
            name: "Admin",
            phoneNumber: "0902331633",
            gender: true,
            dateOfBirth: "1990-01-01",
            imageUrl: "https://avatar.iran.liara.run/public/boy",
            isActive: true,
            role: Roles.ADMIN,
            address: {
                provinceID: 202,
                districtID: 1452,
                wardCode: "21002",
                street: "Lô Y Chung cư Ngô Gia Tự",
                formattedAddress: "Lô Y Chung cư Ngô Gia Tự, Phường 2, Quận 10, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "manager-id",
            email: "manager@gmail.com",
            name: "Manager",
            phoneNumber: "0902331633",
            gender: false,
            dateOfBirth: "1992-06-15",
            imageUrl: "https://avatar.iran.liara.run/public/boy",
            isActive: true,
            role: Roles.MANAGER,
            address: {
                provinceID: 202,
                districtID: 1452,
                wardCode: "21002",
                street: "Lô Y Chung cư Ngô Gia Tự",
                formattedAddress: "Lô Y Chung cư Ngô Gia Tự, Phường 2, Quận 10, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "customer-id",
            email: "customer@gmail.com",
            name: "Customer",
            phoneNumber: "0902331633",
            gender: true,
            dateOfBirth: "1990-01-01",
            imageUrl: "https://avatar.iran.liara.run/public/boy",
            isActive: true,
            role: Roles.CUSTOMER,
            address: {
                provinceID: 202,
                districtID: 1444,
                wardCode: "20304",
                street: "371 Đ. Điện Biên Phủ",
                formattedAddress: "371 Đ. Điện Biên Phủ, Phường 4, Quận 3, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "staff-id",
            email: "staff@gmail.com",
            name: "Staff",
            phoneNumber: "0902331633",
            gender: true,
            dateOfBirth: "1990-01-01",
            imageUrl: "https://avatar.iran.liara.run/public/girl",
            isActive: true,
            role: Roles.STAFF,
            address: {
                provinceID: 202,
                districtID: 1452,
                wardCode: "21002",
                street: "Lô Y Chung cư Ngô Gia Tự",
                formattedAddress: "Lô Y Chung cư Ngô Gia Tự, Phường 2, Quận 10, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "staff-id-1",
            email: "staff1@gmail.com",
            name: "Staff 1",
            phoneNumber: "0902331633",
            gender: true,
            dateOfBirth: "1990-01-01",
            imageUrl: "https://avatar.iran.liara.run/public/boy",
            isActive: true,
            role: Roles.STAFF,
            address: {
                provinceID: 202,
                districtID: 1452,
                wardCode: "21002",
                street: "Lô Y Chung cư Ngô Gia Tự",
                formattedAddress: "Lô Y Chung cư Ngô Gia Tự, Phường 2, Quận 10, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "factory-id",
            email: "factory@gmail.com",
            name: "Factory",
            phoneNumber: "0902331633",
            gender: true,
            dateOfBirth: "1990-01-01",
            imageUrl: "https://avatar.iran.liara.run/public/girl",
            isActive: true,
            role: Roles.FACTORYOWNER,
            address: {
                provinceID: 202,
                districtID: 1462,
                wardCode: "21610",
                street: "47 Nguyễn Huy Lượng",
                formattedAddress: "47 Nguyễn Huy Lượng, Phường 14, Quận Bình Thạnh, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "factory-id-1",
            email: "factory1@gmail.com",
            name: "Factory 1",
            phoneNumber: "0902331633",
            gender: true,
            dateOfBirth: "1990-01-01",
            imageUrl: "https://avatar.iran.liara.run/public/boy",
            isActive: true,
            role: Roles.FACTORYOWNER,
            address: {
                provinceID: 202,
                districtID: 1462,
                wardCode: "21610",
                street: "93/61 Đ. Nguyễn Đình Chiểu",
                formattedAddress:
                    "93/61 Đ. Nguyễn Đình Chiểu, Phường 14, Quận Bình Thạnh, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "factory-id-2",
            email: "factory2@gmail.com",
            name: "Factory 2",
            phoneNumber: "0902331634",
            gender: false,
            dateOfBirth: "1988-05-20",
            imageUrl: "https://avatar.iran.liara.run/public/girl",
            isActive: true,
            role: Roles.FACTORYOWNER,
            address: {
                provinceID: 202,
                districtID: 1452,
                wardCode: "21002",
                street: "Lô Y Chung cư Ngô Gia Tự",
                formattedAddress: "Lô Y Chung cư Ngô Gia Tự, Phường 2, Quận 10, Hồ Chí Minh"
            },
            isVerified: true
        },
        {
            id: "staff-id-2",
            email: "staff2@gmail.com",
            name: "Staff 2",
            phoneNumber: "0902331635",
            gender: false,
            dateOfBirth: "1995-03-15",
            imageUrl: "https://avatar.iran.liara.run/public/girl",
            isActive: true,
            role: Roles.STAFF,
            address: {
                provinceID: 202,
                districtID: 1452,
                wardCode: "21002",
                street: "Lô Y Chung cư Ngô Gia Tự",
                formattedAddress: "Lô Y Chung cư Ngô Gia Tự, Phường 2, Quận 10, Hồ Chí Minh"
            },
            isVerified: true
        }
    ]
}
