-- Procedure to create a new note
CREATE PROCEDURE CreateNote
    @Id UNIQUEIDENTIFIER,
    @Title NVARCHAR(50),
    @Content NVARCHAR(50)
AS
BEGIN
    INSERT INTO Notes (Id, Title, Content)
    VALUES (@Id, @Title, @Content);

    -- Return inserted record
    SELECT Id, Title, Content, CreatedAt, UpdatedAt FROM Notes WHERE Id = @Id;
END
