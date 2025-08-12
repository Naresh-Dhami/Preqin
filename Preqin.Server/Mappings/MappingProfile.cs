using AutoMapper;
using InvestorCommitments.Api.DTOs;
using InvestorCommitments.Api.Models;

namespace InvestorCommitments.Api.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Investor, InvestorDto>()
            .ForMember(dest => dest.TotalCommitments, 
                       opt => opt.MapFrom(src => src.Commitments.Sum(c => c.Amount)));

        CreateMap<Commitment, CommitmentDto>();
    }
}