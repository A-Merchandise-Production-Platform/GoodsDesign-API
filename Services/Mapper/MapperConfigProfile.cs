using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.AreaDTOs;
using DataTransferObjects.BlankProductInStockDTOs;
using DataTransferObjects.CartDTOs;
using DataTransferObjects.CategoryDTOs;
using DataTransferObjects.DesignPositionDTOs;
using DataTransferObjects.FactoryDTOs;
using DataTransferObjects.OrderDTOs;
using DataTransferObjects.PaymentDTOs;
using DataTransferObjects.ProductDesignDTOs;
using DataTransferObjects.ProductDTOs;
using DataTransferObjects.ProductVarianceDTOs;
using DataTransferObjects.UserDTOs;


namespace Services.Mapper
{
    public class MapperConfigProfile : Profile
    {
        public MapperConfigProfile()
        {
            CreateMap<User, UserDTO>()
    //.ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender ? "Male" : "Female"))
    .ReverseMap();


            CreateMap<User, UserUpdateDTO>()
// .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender ? "Male" : "Female"))
 .ReverseMap();


            CreateMap<Category, CategoryDTO>()
                .ReverseMap();

            CreateMap<Product, ProductDTO>()
               .ReverseMap();

            CreateMap<Product, ProductDetailDTO>()
               .ReverseMap();

            CreateMap<FactoryDTO, Factory>()
               .ReverseMap();


            CreateMap<FactoryProductDTO, FactoryProduct>()
               .ReverseMap();

            CreateMap<ProductVarianceDTO, BlankVariance>()
               .ReverseMap();

          

            CreateMap<CartItem, CartItemDTO>()
               // .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
               .ReverseMap();

            CreateMap<CartItem, CartItemDTO>()
   .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Quantity * src.UnitPrice)).ReverseMap();

            CreateMap<CustomerOrder, CustomerOrderDTO>()
             .ReverseMap();

            CreateMap<CustomerOrderCreateDTO, CustomerOrder>()
            .ReverseMap();

            CreateMap<CustomerOrderDetail, CustomerOrderDetailDTO>()
          .ReverseMap();

            CreateMap<PaymentCreateDTO, Payment>()
        .ReverseMap();

            CreateMap<PaymentDTO, Payment>()
       .ReverseMap();

            CreateMap<ProductDesignCreateDTO, ProductDesign>()
       .ReverseMap();

            CreateMap<ProductDesignDTO, ProductDesign>()
     .ReverseMap();

            CreateMap<OverwriteDesignDTO, DesignPosition>()
   .ReverseMap(); 

            CreateMap<DesignPositionDTO, DesignPosition>()
     .ReverseMap();

        }
    }
}