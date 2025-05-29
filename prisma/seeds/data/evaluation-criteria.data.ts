import { Prisma } from "@prisma/client"

type EvaluationCriteriaInput = {
  name: string
  description: string
  isActive: boolean
}

export const evaluationCriteriaData: EvaluationCriteriaInput[] = [
  {
    name: "Mực in chuẩn màu",
    description: "Kiểm tra độ chính xác của màu sắc in ấn",
    isActive: true
  },
  {
    name: "Độ bền màu",
    description: "Kiểm tra khả năng giữ màu sau khi giặt",
    isActive: true
  },
  {
    name: "Chất lượng vải",
    description: "Kiểm tra độ mềm mại và độ bền của vải",
    isActive: true
  },
  {
    name: "Đường may",
    description: "Kiểm tra độ chính xác và độ bền của đường may",
    isActive: true
  },
  {
    name: "Kích thước sản phẩm",
    description: "Kiểm tra độ chính xác của kích thước sản phẩm",
    isActive: true
  },
  {
    name: "Độ bền của hình in",
    description: "Kiểm tra độ bền của hình in khi giặt và sử dụng",
    isActive: true
  },
  {
    name: "Chất lượng hoàn thiện",
    description: "Kiểm tra các chi tiết hoàn thiện sản phẩm",
    isActive: true
  },
  {
    name: "Độ đồng đều của màu sắc",
    description: "Kiểm tra độ đồng đều của màu sắc trên toàn bộ sản phẩm",
    isActive: true
  }
] 