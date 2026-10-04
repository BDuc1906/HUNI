using HuniBackend.API.Extensions;
using HuniBackend.Application.DTOs.Auth;
using HuniBackend.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HuniBackend.API.Controllers;

[Route("api/auth")]
public class AuthController(IAuthService authService) : BaseApiController
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var (success, error, user, validationErrors) = await authService.RegisterAsync(request);

        if (!success)
        {
            if (validationErrors != null && validationErrors.Count > 0)
            {
                return ApiBadRequest(error ?? "Dữ liệu không hợp lệ.", validationErrors);
            }

            if (error != null && error.Contains("đã được đăng ký", StringComparison.OrdinalIgnoreCase))
            {
                return Conflict(new { success = false, error });
            }

            return BadRequest(new { success = false, error = error ?? "Đăng ký không thành công." });
        }

        return StatusCode(201, new
        {
            success = true,
            message = "Đăng ký thành công",
            user = new
            {
                id = user!.Id,
                email = user.Email,
                fullName = user.FullName
            }
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        var (success, error, response, validationErrors) = await authService.LoginAsync(request, clientIp);

        if (!success)
        {
            if (validationErrors != null && validationErrors.Count > 0)
            {
                return ApiBadRequest(error ?? "Dữ liệu không hợp lệ.", validationErrors);
            }

            if (error != null && (error.Contains("bị khóa", StringComparison.OrdinalIgnoreCase) || error.Contains("tạm thời", StringComparison.OrdinalIgnoreCase)))
            {
                return StatusCode(StatusCodes.Status429TooManyRequests, new { success = false, error });
            }

            return Unauthorized(new { success = false, error = error ?? "Email hoặc mật khẩu không đúng" });
        }

        return Ok(new
        {
            success = true,
            token = response!.Token,
            expiresAt = response.ExpiresAt,
            user = new
            {
                id = response.User.Id,
                email = response.User.Email,
                name = response.User.Name,
                role = response.User.Role,
                avatar = response.User.Avatar
            }
        });
    }

    [HttpGet("me")]
    [HttpPost("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.GetUserId();
        if (string.IsNullOrEmpty(userId))
        {
            return ApiUnauthorized();
        }

        var user = await authService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return ApiNotFound("Không tìm thấy thông tin tài khoản.");
        }

        return Ok(new
        {
            success = true,
            user = new
            {
                id = user.Id,
                email = user.Email,
                fullName = user.FullName,
                phone = user.Phone,
                avatar = user.Avatar,
                role = user.Role.ToString()
            }
        });
    }
}
