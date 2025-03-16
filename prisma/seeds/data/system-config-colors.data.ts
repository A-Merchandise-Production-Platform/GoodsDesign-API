interface Color {
    name: string;
    code: string;
}

interface ColorsData {
  colors: Color[];
}

export const colorsData: ColorsData = {
  colors: [
    { name: "Red", code: "#FF0000" },
    { name: "Green", code: "#00FF00" },
  ],
};