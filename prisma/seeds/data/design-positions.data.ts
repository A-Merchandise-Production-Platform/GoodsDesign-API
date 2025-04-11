interface Position {
    x: number
    y: number
}

interface TextDesign {
    type: "text"
    content: string
    fontSize: number
    fontFamily: string
    color: string
    position: Position
    rotation: number
}

interface ImageDesign {
    type: "image"
    src: string
    width: number
    height: number
    top: number
    left: number
    angle: number
    layer: number
    view: string
    scaleX: number
    scaleY: number
}

type DesignJSON = TextDesign | ImageDesign

interface DesignPosition {
    designId: string
    productPositionTypeId: string
    designJSON: DesignJSON[]
}

interface DesignPositionsData {
    designPositions: DesignPosition[]
}

export const designPositionsData: DesignPositionsData = {
    designPositions: [
        {
            designId: "design001",
            productPositionTypeId: "front001",
            designJSON: [
                {
                    src: "https://res.cloudinary.com/drzhutfzg/image/upload/v1743793074/files/ue0grcrazzuz7qkllhhm.gif",
                    top: 853.0000000000039,
                    left: 196.0000000000005,
                    type: "image",
                    view: "front",
                    angle: 0,
                    layer: 1,
                    width: 1480,
                    height: 2800,
                    scaleX: 0.1217289719626158,
                    scaleY: 0.1217289719626158
                }
            ]
        },
        {
            designId: "design001",
            productPositionTypeId: "back001",
            designJSON: [
                {
                    src: "https://res.cloudinary.com/drzhutfzg/image/upload/v1743793652/files/p1wnqnpvoysxh6uux7dm.png",
                    top: 886.8421052631579,
                    left: 610,
                    type: "image",
                    view: "back",
                    angle: 0,
                    layer: 1,
                    width: 2394,
                    height: 2450,
                    scaleX: 0.112781954887218,
                    scaleY: 0.112781954887218
                }
            ]
        },
        {
            designId: "design001",
            productPositionTypeId: "leftSleeve001",
            designJSON: []
        },
        {
            designId: "design001",
            productPositionTypeId: "rightSleeve001",
            designJSON: []
        },
        {
            designId: "design002",
            productPositionTypeId: "front001",
            designJSON: []
        },
        {
            designId: "design002",
            productPositionTypeId: "leftSleeve001",
            designJSON: []
        },
        {
            designId: "design002",
            productPositionTypeId: "rightSleeve001",
            designJSON: []
        },
        {
            designId: "design002",
            productPositionTypeId: "back001",
            designJSON: []
        },
        {
            designId: "63dc38b4-54de-43e7-b53d-504859e182bc",
            productPositionTypeId: "front001",
            designJSON: [
                {
                    src: "https://res.cloudinary.com/drzhutfzg/image/upload/v1743791994/files/l1vdpil16mvrzsvk29gk.jpg",
                    top: 922.6400255754476,
                    left: 161,
                    type: "image",
                    view: "front",
                    angle: 0,
                    layer: 1,
                    width: 1564,
                    height: 1043,
                    scaleX: 0.159846547314578,
                    scaleY: 0.159846547314578
                }
            ]
        },
        {
            designId: "63dc38b4-54de-43e7-b53d-504859e182bc",
            productPositionTypeId: "back001",
            designJSON: []
        },
        {
            designId: "63dc38b4-54de-43e7-b53d-504859e182bc",
            productPositionTypeId: "leftSleeve001",
            designJSON: []
        },
        {
            designId: "63dc38b4-54de-43e7-b53d-504859e182bc",
            productPositionTypeId: "rightSleeve001",
            designJSON: []
        },
        {
            designId: "4ed9558e-d486-433c-8f88-df6db2829d18",
            productPositionTypeId: "front001",
            designJSON: [
                {
                    src: "https://res.cloudinary.com/drzhutfzg/image/upload/v1743793074/files/ue0grcrazzuz7qkllhhm.gif",
                    top: 853.0000000000039,
                    left: 196.0000000000005,
                    type: "image",
                    view: "front",
                    angle: 0,
                    layer: 1,
                    width: 1480,
                    height: 2800,
                    scaleX: 0.1217289719626158,
                    scaleY: 0.1217289719626158
                }
            ]
        },
        {
            designId: "4ed9558e-d486-433c-8f88-df6db2829d18",
            productPositionTypeId: "back001",
            designJSON: []
        },
        {
            designId: "4ed9558e-d486-433c-8f88-df6db2829d18",
            productPositionTypeId: "leftSleeve001",
            designJSON: []
        },
        {
            designId: "4ed9558e-d486-433c-8f88-df6db2829d18",
            productPositionTypeId: "rightSleeve001",
            designJSON: []
        },
        {
            designId: "d0b12a64-5345-4337-a007-9e45eb53cc20",
            productPositionTypeId: "front001",
            designJSON: [
                {
                    src: "https://res.cloudinary.com/drzhutfzg/image/upload/v1743793604/files/qnrn8rzefmgxcz68xwkl.png",
                    top: 902.0760233918129,
                    left: 160,
                    type: "image",
                    view: "front",
                    angle: 0,
                    layer: 1,
                    width: 2394,
                    height: 2450,
                    scaleX: 0.1044277360066834,
                    scaleY: 0.1044277360066834
                }
            ]
        },
        {
            designId: "d0b12a64-5345-4337-a007-9e45eb53cc20",
            productPositionTypeId: "back001",
            designJSON: [
                {
                    src: "https://res.cloudinary.com/drzhutfzg/image/upload/v1743793652/files/p1wnqnpvoysxh6uux7dm.png",
                    top: 886.8421052631579,
                    left: 610,
                    type: "image",
                    view: "back",
                    angle: 0,
                    layer: 1,
                    width: 2394,
                    height: 2450,
                    scaleX: 0.112781954887218,
                    scaleY: 0.112781954887218
                }
            ]
        },
        {
            designId: "d0b12a64-5345-4337-a007-9e45eb53cc20",
            productPositionTypeId: "leftSleeve001",
            designJSON: []
        },
        {
            designId: "d0b12a64-5345-4337-a007-9e45eb53cc20",
            productPositionTypeId: "rightSleeve001",
            designJSON: []
        }
    ]
}
