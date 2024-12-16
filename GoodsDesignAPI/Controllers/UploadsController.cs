using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;

namespace GoodsDesignAPI.Controllers
{
    [Route("api/uploads")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        // Đường dẫn thư mục lưu trữ file
        private readonly string _fileStoragePath = "/srv/goodsdesign";

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            try
            {
                // Validate file type (e.g., only images)
                var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".bmp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!validExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Invalid file type. Only image files are allowed." });
                }

                // Ensure directory exists
                if (!Directory.Exists(_fileStoragePath))
                {
                    Directory.CreateDirectory(_fileStoragePath);
                }

                // Compress the image
                string fileName = $"{Guid.NewGuid()}{fileExtension}";
                string filePath = Path.Combine(_fileStoragePath, fileName);

                using (var inputStream = file.OpenReadStream())
                using (var image = await Image.LoadAsync(inputStream))
                {
                    // Resize or compress the image
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Mode = ResizeMode.Max,
                        Size = new Size(800, 800) // Resize to max 800x800
                    }));

                    // Save the compressed image to the target folder
                    await image.SaveAsync(filePath, new PngEncoder());
                }

                // Return the public URL
                string fileUrl = $"https://api.goodsdesign.uydev.id.vn/files/goodsdesign/{fileName}";
                return Ok(new { fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("3dmodel")]
        public async Task<IActionResult> UploadThreeDModel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            try
            {
                // Validate file type (e.g., .obj, .fbx, .gltf)
                var validExtensions = new[] { ".obj", ".fbx", ".gltf", ".glb" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!validExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Invalid file type. Only 3D model files are allowed." });
                }

                // Ensure directory exists
                if (!Directory.Exists(_fileStoragePath))
                {
                    Directory.CreateDirectory(_fileStoragePath);
                }

                // Save the 3D model file
                string fileName = $"{Guid.NewGuid()}{fileExtension}";
                string filePath = Path.Combine(_fileStoragePath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the public URL
                string fileUrl = $"https://api.goodsdesign.uydev.id.vn/files/goodsdesign/{fileName}";
                return Ok(new { fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }
}
