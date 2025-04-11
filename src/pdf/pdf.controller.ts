import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('hello-world')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=hello-world.pdf')
  async generateHelloWorldPdf(@Res() res: Response): Promise<void> {
    // Generate the PDF
    const pdfBuffer = await this.pdfService.generateHelloWorldPdf();
    
    // Send the PDF as a response
    res.send(pdfBuffer);
  }
} 