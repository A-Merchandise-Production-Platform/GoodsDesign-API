import { Prisma } from "@prisma/client"

type EvaluationCriteriaInput = {
    name: string
    description: string
    isActive: boolean
}

export const evaluationCriteriaData: EvaluationCriteriaInput[] = [
    {
        name: "Print color accuracy",
        description: "Check the accuracy of print colors",
        isActive: true
    },
    {
        name: "Color fastness",
        description: "Check color retention after washing",
        isActive: true
    },
    {
        name: "Fabric quality",
        description: "Check softness and durability of fabric",
        isActive: true
    },
    {
        name: "Stitching quality",
        description: "Check accuracy and durability of seams",
        isActive: true
    },
    {
        name: "Product dimensions",
        description: "Check accuracy of product dimensions",
        isActive: true
    },
    {
        name: "Print durability",
        description: "Check durability of prints during washing and use",
        isActive: true
    },
    {
        name: "Finishing quality",
        description: "Check product finishing details",
        isActive: true
    },
    {
        name: "Color uniformity",
        description: "Check color consistency across the entire product",
        isActive: true
    }
]
