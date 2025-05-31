import { Injectable } from "@nestjs/common"
import { join } from "path"
import PdfPrinter from "pdfmake"
import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import { BufferOptions, TDocumentDefinitions } from "pdfmake/interfaces"

@Injectable()
export class PdfService {
    constructor() {
        // Initialize pdfmake with the virtual file system
        ;(pdfMake as any).vfs = pdfFonts.vfs
    }

    /**
     * Generates a simple "Hello World" PDF
     * @returns Buffer containing the PDF data
     */
    generateHelloWorldPdf(): PDFKit.PDFDocument {
        // Define the document definition
        const docDefinition: TDocumentDefinitions = {
            content: [
                { text: "Hello World!", style: "header" },
                { text: "This is a PDF generated with pdfmake in NestJS", margin: [0, 10, 0, 0] },
                { text: "Current date: " + new Date().toLocaleDateString(), margin: [0, 10, 0, 0] }
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    margin: [0, 0, 0, 10]
                }
            }
        }

        const fonts = {
            CenturyGothic: {
                normal: join(process.cwd(), "assets/fonts/century-gothic/GOTHIC.woff"),
                bold: join(process.cwd(), "assets/fonts/century-gothic/GOTHICB.woff"),
                italics: join(process.cwd(), "assets/fonts/century-gothic/GOTHICI.woff"),
                bolditalics: join(process.cwd(), "assets/fonts/century-gothic/GOTHICBI.woff")
            }
        }

        const printer = new PdfPrinter(fonts)

        const options: BufferOptions = {}

        return printer.createPdfKitDocument(docDefinition, options)
    }
}
