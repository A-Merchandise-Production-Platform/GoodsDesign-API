using Microsoft.AspNetCore.Mvc;
using Services.Utils;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/shippings")]
    [ApiController]
    public class ShippingController : ControllerBase
    {
        private const string TOKEN = "62acc554-f25c-11ef-a653-3600c660ea00";
        private const string SHOP_ID = "196029";
        private const string BASE_URL = "https://dev-online-gateway.ghn.vn";
        private const string GET_PROVINCE_ENDPOINT = "/shiip/public-api/master-data/province";
        private const string GET_DISTRICT_ENDPOINT = "/shiip/public-api/master-data/district";
        private const string GET_WARD_ENDPOINT = "/shiip/public-api/master-data/ward";
        private const string GET_AVAILABLE_SERVICES_ENDPOINT = "/shiip/public-api/v2/shipping-order/available-services";
        private const string CALCULATE_SHIPPING_FEE_ENDPOINT = "/shiip/public-api/v2/shipping-order/fee";

        private readonly IHttpClientFactory _httpClientFactory;

        public ShippingController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        private HttpClient CreateClient()
        {
            var client = _httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(BASE_URL);
            client.DefaultRequestHeaders.Add("Token", TOKEN);
            client.DefaultRequestHeaders.Add("ShopId", SHOP_ID);
            return client;
        }

        [HttpGet("provinces")]
        public async Task<IActionResult> GetProvinces()
        {
            var _client = CreateClient();
            var response = await _client.GetAsync(GET_PROVINCE_ENDPOINT);
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<ProvinceDto>>>(content);
            return Ok(ApiResult<List<ProvinceDto>>.Success(apiResponse.Data));
        }

        [HttpGet("provinces/{id}")]
        public async Task<IActionResult> GetProvinceById(int id)
        {
            var _client = CreateClient();
            var response = await _client.GetAsync($"{GET_PROVINCE_ENDPOINT}");
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<ProvinceDto>>>(content);

            ProvinceDto provinceDto = apiResponse.Data.FirstOrDefault(x => x.ProvinceID == id);
            if (provinceDto == null)
                return NotFound(ApiResult<object>.Error("Province not found."));

            return Ok(ApiResult<ProvinceDto>.Success(provinceDto));
        }

        [HttpGet("districts")]
        public async Task<IActionResult> GetDistricts([FromQuery] int provinceId)
        {
            var _client = CreateClient();
            var response = await _client.GetAsync($"{GET_DISTRICT_ENDPOINT}?province_id={provinceId}");
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<DistrictDto>>>(content);
            return Ok(ApiResult<List<DistrictDto>>.Success(apiResponse.Data));
        }

        [HttpGet("districts/{id}")]
        public async Task<IActionResult> GetDistrictById(int id)
        {
            var _client = CreateClient();
            var response = await _client.GetAsync($"{GET_DISTRICT_ENDPOINT}");
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<DistrictDto>>>(content);

            DistrictDto districtDto = apiResponse.Data.FirstOrDefault(x => x.DistrictID == id);

            if (districtDto == null)
                return NotFound(ApiResult<object>.Error("District not found."));

            return Ok(ApiResult<DistrictDto>.Success(districtDto));
        }

        [HttpGet("wards")]
        public async Task<IActionResult> GetWards([FromQuery] int districtId)
        {
            var _client = CreateClient();
            var response = await _client.GetAsync($"{GET_WARD_ENDPOINT}?district_id={districtId}");
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<WardDto>>>(content);
            return Ok(ApiResult<List<WardDto>>.Success(apiResponse.Data));
        }

        [HttpGet("wards/{id}")]
        public async Task<IActionResult> GetWardById(string id, [FromQuery] int districtId)
        {
            var _client = CreateClient();
            var response = await _client.GetAsync($"{GET_WARD_ENDPOINT}?district_id={districtId}");
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var content = await response.Content.ReadAsStringAsync();

            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<WardDto>>>(content);

            WardDto wardDto = apiResponse.Data.FirstOrDefault(x => x.WardCode == id.ToString());

            if (wardDto == null)
                return NotFound(ApiResult<object>.Error("Ward not found."));

            return Ok(ApiResult<WardDto>.Success(wardDto));
        }

        [HttpGet("available-services")]
        public async Task<IActionResult> GetAvailableServices([FromQuery] int fromDistrict, [FromQuery] int toDistrict)
        {
            var _client = CreateClient();
            var response = await _client.GetAsync($"{GET_AVAILABLE_SERVICES_ENDPOINT}?shop_id={SHOP_ID}&from_district={fromDistrict}&to_district={toDistrict}");
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var content = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<ServiceSerialize>>>(content, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            var services = apiResponse.Data.Select(x => new ServiceDTO
            {
                ServiceId = x.ServiceId,
                ShortName = x.ShortName,
                ServiceTypeId = x.ServiceTypeId
            }).ToList();

            return Ok(ApiResult<List<ServiceDTO>>.Success(services));
        }

        [HttpPost("calculate-fee")]
        public async Task<IActionResult> CalculateShippingFee([FromBody] CalculateShippingFeeRequest request)
        {
            var _client = CreateClient();
            var payload = JsonSerializer.Serialize(request);
            var content = new StringContent(payload, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync($"{CALCULATE_SHIPPING_FEE_ENDPOINT}", content);
            if (!response.IsSuccessStatusCode)
                return await HandleErrorResponse(response);

            var responseContent = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponse<CalculateShippingFeeResponse>>(responseContent);

            return Ok(ApiResult<CalculateShippingFeeResponse>.Success(apiResponse.Data));
        }

        private async Task<IActionResult> HandleErrorResponse(HttpResponseMessage response)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            var errorMessage = "Unknown error occurred.";

            try
            {
                var errorResponse = JsonSerializer.Deserialize<ApiResponse<object>>(errorContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                errorMessage = errorResponse?.Message ?? errorMessage;
            }
            catch (JsonException)
            {
                errorMessage = $"Invalid JSON response: {errorContent}";
            }

            return StatusCode((int)response.StatusCode, ApiResult<object>.Error(errorMessage));
        }

        private async Task<T> DeserializeResponse<T>(HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }

    }
}

public class CalculateShippingFeeRequest
{
    [JsonPropertyName("service_id")]
    public int? ServiceId { get; set; }

    [JsonPropertyName("service_type_id")]
    public int? ServiceTypeId { get; set; } = 2;

    [JsonPropertyName("from_district_id")]
    public int? FromDistrictId { get; set; }

    [JsonPropertyName("from_ward_code")]
    public string? FromWardCode { get; set; }

    [JsonPropertyName("to_district_id")]
    public int? ToDistrictId { get; set; }

    [JsonPropertyName("to_ward_code")]
    public string? ToWardCode { get; set; }

    [JsonPropertyName("weight")]
    public int? Weight { get; set; } = 1000;

    [JsonPropertyName("length")]
    public int? Length { get; set; } = 10;

    [JsonPropertyName("width")]
    public int? Width { get; set; } = 10;

    [JsonPropertyName("height")]
    public int? Height { get; set; } = 10;

}

public class CalculateShippingFeeResponse
{
    [JsonPropertyName("total")]
    public int Total { get; set; }

    [JsonPropertyName("service_fee")]
    public int ServiceFee { get; set; }

    [JsonPropertyName("insurance_fee")]
    public int InsuranceFee { get; set; }

    [JsonPropertyName("pick_station_fee")]
    public int PickStationFee { get; set; }

    [JsonPropertyName("coupon_value")]
    public int CouponValue { get; set; }

    [JsonPropertyName("r2s_fee")]
    public int R2sFee { get; set; }

    [JsonPropertyName("document_return")]
    public int DocumentReturn { get; set; }

    [JsonPropertyName("double_check")]
    public int DoubleCheck { get; set; }

    [JsonPropertyName("cod_fee")]
    public int CodFee { get; set; }

    [JsonPropertyName("pick_remote_areas_fee")]
    public int PickRemoteAreasFee { get; set; }

    [JsonPropertyName("deliver_remote_areas_fee")]
    public int DeliverRemoteAreasFee { get; set; }

    [JsonPropertyName("cod_failed_fee")]
    public int CodFailedFee { get; set; }
}


public class ApiResponse<T>
{
    [JsonPropertyName("code")]
    public int Code { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonPropertyName("data")]
    public T Data { get; set; }
}


public class ServiceSerialize
{
    [JsonPropertyName("service_id")]
    public int ServiceId { get; set; }
    [JsonPropertyName("short_name")]
    public string ShortName { get; set; }
    [JsonPropertyName("service_type_id")]
    public int ServiceTypeId { get; set; }
}

public class ServiceDTO
{
    public int ServiceId { get; set; }
    public string ShortName { get; set; }
    public int ServiceTypeId { get; set; }
}
public class ProvinceDto
{
    public int ProvinceID { get; set; }
    public string ProvinceName { get; set; }
}

public class DistrictDto
{
    public int DistrictID { get; set; }
    public int ProvinceID { get; set; }
    public string DistrictName { get; set; }
}

public class WardDto
{
    public string WardCode { get; set; }
    public int DistrictID { get; set; }
    public string WardName { get; set; }
}