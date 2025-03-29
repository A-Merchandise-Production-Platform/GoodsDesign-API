interface Position {
  x: number;
  y: number;
}

interface TextDesign {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  position: Position;
  rotation: number;
}

interface ImageDesign {
  type: "image";
  url: string;
  width: number;
  height: number;
  position: Position;
  rotation: number;
}

type DesignJSON = TextDesign | ImageDesign;

interface DesignPosition {
  designId: string;
  productPositionTypeId: string;
  designJSON: DesignJSON;
}

interface DesignPositionsData {
  designPositions: DesignPosition[];
}

export const designPositionsData: DesignPositionsData = {
  designPositions: [
    {
      designId: "design001",
      productPositionTypeId: "front001",
      designJSON: {
        type: "text",
        content: "Sample Text",
        fontSize: 24,
        fontFamily: "Arial",
        color: "#000000",
        position: {
          x: 100,
          y: 100,
        },
        rotation: 0,
      },
    },
    {
      designId: "design001",
      productPositionTypeId: "back001",
      designJSON: {
        type: "image",
        url: "https://example.com/images/logo.png",
        width: 200,
        height: 200,
        position: {
          x: 150,
          y: 150,
        },
        rotation: 0,
      },
    },
    {
      designId: "design002",
      productPositionTypeId: "front001",
      designJSON: {
        type: "text",
        content: "Custom Design",
        fontSize: 32,
        fontFamily: "Helvetica",
        color: "#FF0000",
        position: {
          x: 120,
          y: 120,
        },
        rotation: 45,
      },
    },
  ],
};
