FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/HuniBackend.API/HuniBackend.API.csproj", "src/HuniBackend.API/"]
COPY ["src/HuniBackend.Application/HuniBackend.Application.csproj", "src/HuniBackend.Application/"]
COPY ["src/HuniBackend.Domain/HuniBackend.Domain.csproj", "src/HuniBackend.Domain/"]
COPY ["src/HuniBackend.Infrastructure/HuniBackend.Infrastructure.csproj", "src/HuniBackend.Infrastructure/"]
RUN dotnet restore "src/HuniBackend.API/HuniBackend.API.csproj"
COPY . .
RUN dotnet build "src/HuniBackend.API/HuniBackend.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "src/HuniBackend.API/HuniBackend.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HuniBackend.API.dll"]
