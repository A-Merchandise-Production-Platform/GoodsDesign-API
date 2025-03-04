import { PrismaClient } from '@prisma/client';

export const seedSystemConfigBanks = async (prisma: PrismaClient) => {
    const banks = [
      { id: 17, name: "Ngân hàng TMCP Công thương Việt Nam", code: "ICB", bin: "970415", shortName: "VietinBank", logo: "https://api.vietqr.io/img/ICB.png", transferSupported: true, lookupSupported: true, swiftCode: "ICBVVNVX" },
      { id: 43, name: "Ngân hàng TMCP Ngoại Thương Việt Nam", code: "VCB", bin: "970436", shortName: "Vietcombank", logo: "https://api.vietqr.io/img/VCB.png", transferSupported: true, lookupSupported: true, swiftCode: "BFTVVNVX" },
      { id: 4, name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", code: "BIDV", bin: "970418", shortName: "BIDV", logo: "https://api.vietqr.io/img/BIDV.png", transferSupported: true, lookupSupported: true, swiftCode: "BIDVVNVX" },
      { id: 42, name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", code: "VBA", bin: "970405", shortName: "Agribank", logo: "https://api.vietqr.io/img/VBA.png", transferSupported: true, lookupSupported: true, swiftCode: "VBAAVNVX" },
      { id: 26, name: "Ngân hàng TMCP Phương Đông", code: "OCB", bin: "970448", shortName: "OCB", logo: "https://api.vietqr.io/img/OCB.png", transferSupported: true, lookupSupported: true, swiftCode: "ORCOVNVX" },
      { id: 21, name: "Ngân hàng TMCP Quân đội", code: "MB", bin: "970422", shortName: "MBBank", logo: "https://api.vietqr.io/img/MB.png", transferSupported: true, lookupSupported: true, swiftCode: "MSCBVNVX" },
      { id: 38, name: "Ngân hàng TMCP Kỹ thương Việt Nam", code: "TCB", bin: "970407", shortName: "Techcombank", logo: "https://api.vietqr.io/img/TCB.png", transferSupported: true, lookupSupported: true, swiftCode: "VTCBVNVX" },
      { id: 2, name: "Ngân hàng TMCP Á Châu", code: "ACB", bin: "970416", shortName: "ACB", logo: "https://api.vietqr.io/img/ACB.png", transferSupported: true, lookupSupported: true, swiftCode: "ASCBVNVX" },
      { id: 47, name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", code: "VPB", bin: "970432", shortName: "VPBank", logo: "https://api.vietqr.io/img/VPB.png", transferSupported: true, lookupSupported: true, swiftCode: "VPBKVNVX" },
      { id: 39, name: "Ngân hàng TMCP Tiên Phong", code: "TPB", bin: "970423", shortName: "TPBank", logo: "https://api.vietqr.io/img/TPB.png", transferSupported: true, lookupSupported: true, swiftCode: "TPBVVNVX" },
      { id: 36, name: "Ngân hàng TMCP Sài Gòn Thương Tín", code: "STB", bin: "970403", shortName: "Sacombank", logo: "https://api.vietqr.io/img/STB.png", transferSupported: true, lookupSupported: true, swiftCode: "SGTTVNVX" },
      { id: 12, name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh", code: "HDB", bin: "970437", shortName: "HDBank", logo: "https://api.vietqr.io/img/HDB.png", transferSupported: true, lookupSupported: true, swiftCode: "HDBCVNVX" },
      { id: 44, name: "Ngân hàng TMCP Bản Việt", code: "VCCB", bin: "970454", shortName: "VietCapitalBank", logo: "https://api.vietqr.io/img/VCCB.png", transferSupported: true, lookupSupported: true, swiftCode: "VCBCVNVX" },
      { id: 31, name: "Ngân hàng TMCP Sài Gòn", code: "SCB", bin: "970429", shortName: "SCB", logo: "https://api.vietqr.io/img/SCB.png", transferSupported: true, lookupSupported: true, swiftCode: "SACLVNVX" },
      { id: 45, name: "Ngân hàng TMCP Quốc tế Việt Nam", code: "VIB", bin: "970441", shortName: "VIB", logo: "https://api.vietqr.io/img/VIB.png", transferSupported: true, lookupSupported: true, swiftCode: "VNIBVNVX" },
      { id: 35, name: "Ngân hàng TMCP Sài Gòn - Hà Nội", code: "SHB", bin: "970443", shortName: "SHB", logo: "https://api.vietqr.io/img/SHB.png", transferSupported: true, lookupSupported: true, swiftCode: "SHBAVNVX" },
      { id: 10, name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam", code: "EIB", bin: "970431", shortName: "Eximbank", logo: "https://api.vietqr.io/img/EIB.png", transferSupported: true, lookupSupported: true, swiftCode: "EBVIVNVX" },
      { id: 22, name: "Ngân hàng TMCP Hàng Hải", code: "MSB", bin: "970426", shortName: "MSB", logo: "https://api.vietqr.io/img/MSB.png", transferSupported: true, lookupSupported: true, swiftCode: "MCOBVNVX" },
      { id: 53, name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank", code: "CAKE", bin: "546034", shortName: "CAKE", logo: "https://api.vietqr.io/img/CAKE.png", transferSupported: true, lookupSupported: true, swiftCode: null },
      { id: 54, name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số Ubank by VPBank", code: "Ubank", bin: "546035", shortName: "Ubank", logo: "https://api.vietqr.io/img/UBANK.png", transferSupported: true, lookupSupported: true, swiftCode: null },
      { id: 58, name: "Ngân hàng số Timo by Ban Viet Bank (Timo by Ban Viet Bank)", code: "TIMO", bin: "963388", shortName: "Timo", logo: "https://vietqr.net/portal-service/resources/icons/TIMO.png", transferSupported: true, lookupSupported: false, swiftCode: null },
      { id: 57, name: "Tổng Công ty Dịch vụ số Viettel - Chi nhánh tập đoàn công nghiệp viễn thông Quân Đội", code: "VTLMONEY", bin: "971005", shortName: "ViettelMoney", logo: "https://api.vietqr.io/img/VIETTELMONEY.png", transferSupported: false, lookupSupported: true, swiftCode: null },
      { id: 34, name: "Ngân hàng TMCP Sài Gòn Công Thương", code: "SGICB", bin: "970400", shortName: "SaigonBank", logo: "https://api.vietqr.io/img/SGICB.png", transferSupported: true, lookupSupported: true, swiftCode: "SBITVNVX" },
      { id: 3, name: "Ngân hàng TMCP Bắc Á", code: "BAB", bin: "970409", shortName: "BacABank", logo: "https://api.vietqr.io/img/BAB.png", transferSupported: true, lookupSupported: true, swiftCode: "NASCVNVX" },
      { id: 30, name: "Ngân hàng TMCP Đại Chúng Việt Nam", code: "PVCB", bin: "970412", shortName: "PVcomBank", logo: "https://api.vietqr.io/img/PVCB.png", transferSupported: true, lookupSupported: true, swiftCode: "WBVNVNVX" },
      { id: 27, name: "Ngân hàng Thương mại TNHH MTV Đại Dương", code: "Oceanbank", bin: "970414", shortName: "Oceanbank", logo: "https://api.vietqr.io/img/OCEANBANK.png", transferSupported: true, lookupSupported: true, swiftCode: "OCBKUS3M" },
      { id: 24, name: "Ngân hàng TMCP Quốc Dân", code: "NCB", bin: "970419", shortName: "NCB", logo: "https://api.vietqr.io/img/NCB.png", transferSupported: true, lookupSupported: true, swiftCode: "NVBAVNVX" },
      { id: 37, name: "Ngân hàng TNHH MTV Shinhan Việt Nam", code: "SHBVN", bin: "970424", shortName: "ShinhanBank", logo: "https://api.vietqr.io/img/SHBVN.png", transferSupported: true, lookupSupported: true, swiftCode: "SHBKVNVX" },
      { id: 1, name: "Ngân hàng TMCP An Bình", code: "ABB", bin: "970425", shortName: "ABBANK", logo: "https://api.vietqr.io/img/ABB.png", transferSupported: true, lookupSupported: true, swiftCode: "ABBKVNVX" },
      { id: 41, name: "Ngân hàng TMCP Việt Á", code: "VAB", bin: "970427", shortName: "VietABank", logo: "https://api.vietqr.io/img/VAB.png", transferSupported: true, lookupSupported: true, swiftCode: "VNACVNVX" },
      { id: 23, name: "Ngân hàng TMCP Nam Á", code: "NAB", bin: "970428", shortName: "NamABank", logo: "https://api.vietqr.io/img/NAB.png", transferSupported: true, lookupSupported: true, swiftCode: "NAMAVNVX" },
      { id: 29, name: "Ngân hàng TMCP Xăng dầu Petrolimex", code: "PGB", bin: "970430", shortName: "PGBank", logo: "https://api.vietqr.io/img/PGB.png", transferSupported: true, lookupSupported: true, swiftCode: "PGBLVNVX" },
      { id: 46, name: "Ngân hàng TMCP Việt Nam Thương Tín", code: "VIETBANK", bin: "970433", shortName: "VietBank", logo: "https://api.vietqr.io/img/VIETBANK.png", transferSupported: true, lookupSupported: true, swiftCode: "VNTTVNVX" },
      { id: 33, name: "Ngân hàng TMCP Đông Nam Á", code: "SEAB", bin: "970440", shortName: "SeABank", logo: "https://api.vietqr.io/img/SEAB.png", transferSupported: true, lookupSupported: true, swiftCode: "SEAVVNVX" },
      { id: 52, name: "Ngân hàng Hợp tác xã Việt Nam", code: "COOPBANK", bin: "970446", shortName: "COOPBANK", logo: "https://api.vietqr.io/img/COOPBANK.png", transferSupported: true, lookupSupported: true, swiftCode: null },
      { id: 20, name: "Ngân hàng TMCP Lộc Phát Việt Nam", code: "LPB", bin: "970449", shortName: "LPBank", logo: "https://api.vietqr.io/img/LPB.png", transferSupported: true, lookupSupported: true, swiftCode: "LVBKVNVX" },
      { id: 19, name: "Ngân hàng TMCP Kiên Long", code: "KLB", bin: "970452", shortName: "KienLongBank", logo: "https://api.vietqr.io/img/KLB.png", transferSupported: true, lookupSupported: true, swiftCode: "KLBKVNVX" }
  ];

  console.log('Seeding system config banks...');
  
  for (const bank of banks) {
    await prisma.systemConfigBank.upsert({
      where: { id: bank.id },
      update: bank,
      create: {
        ...bank,
        support: 0,
        isTransfer: bank.transferSupported,
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
      },
    });
  }

  console.log('System config banks seeded!');
};