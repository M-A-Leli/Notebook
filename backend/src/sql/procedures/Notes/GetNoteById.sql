-- Procedure to get a note by ID
CREATE PROCEDURE GetNoteById
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM Notes WHERE Id = @Id;
END;
