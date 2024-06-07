-- Procedure to delete a note
CREATE PROCEDURE DeleteNote
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM Notes WHERE Id = @Id;
END;
