interface Bank {
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: boolean;
    lookupSupported: boolean;
    swiftCode: string | null;
  }
  
  interface BanksData {
    banks: Bank[];
  }
  
  export const banksData: BanksData = {
    banks: [
      {
        name: "Ngân hàng TMCP Công thương Việt Nam",
        code: "ICB",
        bin: "970415",
        shortName: "VietinBank",
        logo: "https://api.vietqr.io/img/ICB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "ICBVVNVX",
      },
      {
        name: "Ngân hàng TMCP Ngoại Thương Việt Nam",
        code: "VCB",
        bin: "970436",
        shortName: "Vietcombank",
        logo: "https://api.vietqr.io/img/VCB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "BFTVVNVX",
      },
      {
        name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
        code: "BIDV",
        bin: "970418",
        shortName: "BIDV",
        logo: "https://api.vietqr.io/img/BIDV.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "BIDVVNVX",
      },
      {
        name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
        code: "VBA",
        bin: "970405",
        shortName: "Agribank",
        logo: "https://api.vietqr.io/img/VBA.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "VBAAVNVX",
      },
      {
        name: "Ngân hàng TMCP Phương Đông",
        code: "OCB",
        bin: "970448",
        shortName: "OCB",
        logo: "https://api.vietqr.io/img/OCB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "ORCOVNVX",
      },
      {
        name: "Ngân hàng TMCP Quân đội",
        code: "MB",
        bin: "970422",
        shortName: "MBBank",
        logo: "https://api.vietqr.io/img/MB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "MSCBVNVX",
      },
      {
        name: "Ngân hàng TMCP Kỹ thương Việt Nam",
        code: "TCB",
        bin: "970407",
        shortName: "Techcombank",
        logo: "https://api.vietqr.io/img/TCB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "VTCBVNVX",
      },
      {
        name: "Ngân hàng TMCP Á Châu",
        code: "ACB",
        bin: "970416",
        shortName: "ACB",
        logo: "https://api.vietqr.io/img/ACB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "ASCBVNVX",
      },
      {
        name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
        code: "VPB",
        bin: "970432",
        shortName: "VPBank",
        logo: "https://api.vietqr.io/img/VPB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "VPBKVNVX",
      },
      {
        name: "Ngân hàng TMCP Tiên Phong",
        code: "TPB",
        bin: "970423",
        shortName: "TPBank",
        logo: "https://api.vietqr.io/img/TPB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "TPBVVNVX",
      },
      {
        name: "Ngân hàng TMCP Sài Gòn Thương Tín",
        code: "STB",
        bin: "970403",
        shortName: "Sacombank",
        logo: "https://api.vietqr.io/img/STB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "SGTTVNVX",
      },
      {
        name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh",
        code: "HDB",
        bin: "970437",
        shortName: "HDBank",
        logo: "https://api.vietqr.io/img/HDB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "HDBCVNVX",
      },
      {
        name: "Ngân hàng TMCP Quốc tế Việt Nam",
        code: "VIB",
        bin: "970441",
        shortName: "VIB",
        logo: "https://api.vietqr.io/img/VIB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "VNIBVNVX",
      },
      {
        name: "Ngân hàng TMCP Sài Gòn - Hà Nội",
        code: "SHB",
        bin: "970443",
        shortName: "SHB",
        logo: "https://api.vietqr.io/img/SHB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "SHBAVNVX",
      },
      {
        name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
        code: "EIB",
        bin: "970431",
        shortName: "Eximbank",
        logo: "https://api.vietqr.io/img/EIB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "EBVIVNVX",
      },
      {
        name: "Ngân hàng TMCP Hàng Hải",
        code: "MSB",
        bin: "970426",
        shortName: "MSB",
        logo: "https://api.vietqr.io/img/MSB.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: "MCOBVNVX",
      },
      {
        name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank",
        code: "CAKE",
        bin: "546034",
        shortName: "CAKE",
        logo: "https://api.vietqr.io/img/CAKE.png",
        transferSupported: true,
        lookupSupported: true,
        swiftCode: null,
      },
    ],
  };
  