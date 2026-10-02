namespace HuniBackend.Domain.Enums;

public enum ReturnStatus
{
    PENDING,
    PROCESSING,
    EXCHANGED,
    REFUNDED,
    REJECTED
}

public enum ReturnType
{
    EXCHANGE,
    REFUND
}

public enum ReviewStatus
{
    PENDING,
    APPROVED,
    HIDDEN
}
