import { Roles } from '@prisma/client'

interface Address {
  provinceID: number
  districtID: number
  wardCode: string
  street: string
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
        districtID: 1533,
        wardCode: "22003",
        street: "89/2 Ấp 2"
      }
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
        districtID: 1533,
        wardCode: "22003",
        street: "89/2 Ấp 2"
      }
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
        districtID: 1533,
        wardCode: "22003",
        street: "89/2 Ấp 2"
      }
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
        districtID: 1533,
        wardCode: "22003",
        street: "89/2 Ấp 2"
      }
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
        districtID: 1533,
        wardCode: "22003",
        street: "89/2 Ấp 2"
      }
    },
    {
      id: "factory-id-2",
      email: "factory1@gmail.com",
      name: "Factory",
      phoneNumber: "0902331633",
      gender: true,
      dateOfBirth: "1990-01-01",
      imageUrl: "https://avatar.iran.liara.run/public/boy",
      isActive: true,
      role: Roles.FACTORYOWNER,
      address: {
        provinceID: 202,
        districtID: 1533,
        wardCode: "22003",
        street: "400"
      }
    }
  ]
}