-- Procedure to update a note
CREATE PROCEDURE UpdateNote
    @Id UNIQUEIDENTIFIER,
    @Title NVARCHAR(50),
    @Content NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Notes
    SET Title = @Title, Content = @Content
    WHERE Id = @Id;

    SELECT Id, Title, Content, CreatedAt, UpdatedAt
    FROM Notes
    WHERE Id = @Id;
END;
