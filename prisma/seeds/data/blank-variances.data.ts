import { variantsData } from "./system-config-variants.data";

interface BlankVariance {
  id: string;
  productId: string;
  systemVariantId: string;
  blankPrice: number;
}

interface BlankVariancesData {
  blankVariances: BlankVariance[];
}

function generateBlankVariances(): BlankVariancesData {
  // We need to ensure we're using the imported variants data
  const variants = variantsData.variants;
  
  // Generate blank variances array
  const blankVariances: BlankVariance[] = [];
  let idCounter = 1;
  
  // Create all combinations
  variants.forEach((variant) => {
      const blankVariance: BlankVariance = {
        id: `bv${String(idCounter).padStart(3, '0')}`,
        productId: variant.productId,
        systemVariantId: variant.id,
        blankPrice: 15.0 // Base price - could be dynamically calculated
      };
      
      blankVariances.push(blankVariance);
      idCounter++;
    });
  
  return { blankVariances };
}

// Export the generated blank variances
export const blankVariancesData: BlankVariancesData = generateBlankVariances();