FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/HuniBackend.API/HuniBackend.API.csproj", "src/HuniBackend.API/"]
COPY ["src/HuniBackend.Application/HuniBackend.Application.csproj", "src/HuniBackend.Application/"]
COPY ["src/HuniBackend.Domain/HuniBackend.Domain.csproj", "src/HuniBackend.Domain/"]
COPY ["src/HuniBackend.Infrastructure/HuniBackend.Infrastructure.csproj", "src/HuniBackend.Infrastructure/"]
RUN dotnet restore "src/HuniBackend.API/HuniBackend.API.csproj"
COPY . .
RUN dotnet publish "src/HuniBackend.API/HuniBackend.API.csproj" \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "HuniBackend.API.dll"]
