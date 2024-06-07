-- Procedure to create a new note
CREATE PROCEDURE CreateNote
    @Id UNIQUEIDENTIFIER,
    @Title NVARCHAR(30),
    @Content NVARCHAR(255)
AS
BEGIN
    INSERT INTO Notes (Id, Title, Content)
    VALUES (@Id, @Title, @Content);
END;
