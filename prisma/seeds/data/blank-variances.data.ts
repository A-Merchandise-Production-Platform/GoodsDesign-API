import { variantsData } from "./system-config-variants.data";

interface BlankVariance {
  id: string;
  productId: string;
  information: any;
  blankPrice: number;
}

interface BlankVariancesData {
  blankVariances: BlankVariance[];
}

function generateBlankVariances(): BlankVariancesData {
  // We need to ensure we're using the imported variants data
  const variants = variantsData.variants;
  
  // Extract the sizes and colors from the variants
  const sizeVariant = variants.find(v => v.name === "Size");
  const colorVariant = variants.find(v => v.name === "Color");
  
  if (!sizeVariant || !colorVariant) {
    throw new Error("Size or Color variant not found in the variants data");
  }
  
  const sizes = sizeVariant.value;
  const colors = colorVariant.value;
  const productId = sizeVariant.productId; // Both should have the same productId
  
  // Generate blank variances array
  const blankVariances: BlankVariance[] = [];
  let idCounter = 1;
  
  // Create all combinations
  sizes.forEach((size) => {
    colors.forEach((color) => {
      const blankVariance: BlankVariance = {
        id: `bv${String(idCounter).padStart(3, '0')}`,
        productId,
        information: {
          size: {
            name: size.name,
            code: size.code,
          },
          color: {
            name: color.name,
            code: color.code,
          }
        },
        blankPrice: 15.0 // Base price - could be dynamically calculated
      };
      
      blankVariances.push(blankVariance);
      idCounter++;
    });
  });
  
  return { blankVariances };
}

// Export the generated blank variances
export const blankVariancesData: BlankVariancesData = generateBlankVariances();