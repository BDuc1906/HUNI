using HuniBackend.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected IActionResult ApiOk<T>(T data, string? message = null)
        => Ok(new ApiResponse<T>(true, message, data));

    protected IActionResult ApiCreated<T>(T data, string message)
        => StatusCode(201, new ApiResponse<T>(true, message, data));

    protected IActionResult ApiBadRequest(string error, List<ValidationError>? details = null)
        => BadRequest(new ApiResponse<object>(false, Error: error, Details: details));

    protected IActionResult ApiUnauthorized(string error = "Vui lòng đăng nhập để truy cập tài nguyên này.")
        => Unauthorized(new ApiResponse<object>(false, Error: error));

    protected IActionResult ApiForbidden(string error = "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền.")
        => StatusCode(403, new ApiResponse<object>(false, Error: error));

    protected IActionResult ApiNotFound(string error)
        => NotFound(new ApiResponse<object>(false, Error: error));

    protected IActionResult ApiConflict(string error)
        => Conflict(new ApiResponse<object>(false, Error: error));
}
