using AutoMapper;
using BusinessObjects.Entities;
using DataTransferObjects.AreaDTOs;
using DataTransferObjects.CategoryDTOs;
using DataTransferObjects.UserDTOs;


namespace Services.Mapper
{
    public class MapperConfigProfile : Profile
    {
        public MapperConfigProfile()
        {
            CreateMap<User, UserDTO>()
    .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender ? "Male" : "Female"))
    .ReverseMap()
    .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender != null && src.Gender.ToLower() == "male"));


            CreateMap<User, UserUpdateDTO>()
 .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender ? "Male" : "Female"))
 .ReverseMap()
 .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender != null && src.Gender.ToLower() == "male"));

            CreateMap<Area, AreaDTO>()
                .ReverseMap();

            CreateMap<Category, CategoryDTO>()
                .ReverseMap();
        }
    }
}