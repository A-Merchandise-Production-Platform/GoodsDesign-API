interface Size {
  code: string;
  name: string;
}
  
  interface SizesData {
    sizes: Size[];
  }
  
  export const sizesData: SizesData = {
    sizes: [
      { code: "S", name: "Small" },
      { code: "M", name: "Medium" },
      { code: "L", name: "Large" },
      { code: "XL", name: "Extra Large" },
      { code: "XXL", name: "Double Extra Large" },
      { code: "XXXL", name: "Triple Extra Large" },
    ],
  };