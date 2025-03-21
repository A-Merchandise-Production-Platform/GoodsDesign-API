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
      phoneNumber: "0909090909",
      gender: true,
      dateOfBirth: "1990-01-01",
      imageUrl: "https://example.com/admin.jpg",
      isActive: true,
      role: Roles.ADMIN,
      address: {
        provinceID: 1,
        districtID: 1,
        wardCode: "001",
        street: "123 Admin Street"
      }
    },
    {
      id: "manager-id",
      email: "manager@gmail.com",
      name: "Manager",
      phoneNumber: "0909090909",
      gender: false,
      dateOfBirth: "1992-06-15",
      imageUrl: "https://example.com/manager.jpg",
      isActive: true,
      role: Roles.MANAGER,
      address: {
        provinceID: 2,
        districtID: 2,
        wardCode: "002",
        street: "456 Manager Road"
      }
    },
    {
      id: "customer-id",
      email: "customer@gmail.com",
      name: "Customer",
      phoneNumber: "0909090909",
      gender: true,
      dateOfBirth: "1990-01-01",
      imageUrl: "https://example.com/customer.jpg",
      isActive: true,
      role: Roles.CUSTOMER,
      address: {
        provinceID: 3,
        districtID: 3,
        wardCode: "003",
        street: "789 Customer Avenue"
      }
    },
    {
      id: "staff-id",
      email: "staff@gmail.com",
      name: "Staff",
      phoneNumber: "0909090909",
      gender: true,
      dateOfBirth: "1990-01-01",
      imageUrl: "https://example.com/staff.jpg",
      isActive: true,
      role: Roles.STAFF,
      address: {
        provinceID: 4,
        districtID: 4,
        wardCode: "004",
        street: "101 Staff Lane"
      }
    },
    {
      id: "factory-id",
      email: "factory@gmail.com",
      name: "Factory",
      phoneNumber: "0909090909",
      gender: true,
      dateOfBirth: "1990-01-01",
      imageUrl: "https://example.com/factory.jpg",
      isActive: true,
      role: Roles.FACTORYOWNER,
      address: {
        provinceID: 5,
        districtID: 5,
        wardCode: "005",
        street: "101 Factory Lane"
      }
    }
  ]
}