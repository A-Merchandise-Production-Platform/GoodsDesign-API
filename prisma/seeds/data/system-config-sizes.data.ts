interface Size {
    code: string;
  }
  
  interface SizesData {
    sizes: Size[];
  }
  
  export const sizesData: SizesData = {
    sizes: [
      { code: "S" },
      { code: "M" },
      { code: "L" },
      { code: "XL" },
      { code: "XXL" },
      { code: "XXXL" },
    ],
  };