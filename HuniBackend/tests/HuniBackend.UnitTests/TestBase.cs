using HuniBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace HuniBackend.UnitTests;

public abstract class TestBase
{
    protected AppDbContext CreateInMemoryDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    protected Mock<T> MockOf<T>() where T : class => new Mock<T>();
}
