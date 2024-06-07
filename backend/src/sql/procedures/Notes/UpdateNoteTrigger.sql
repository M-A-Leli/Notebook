-- Create a trigger to update UpdatedAt column on update
CREATE TRIGGER UpdateUpdatedAt
ON Notes
AFTER UPDATE
AS
BEGIN
    IF UPDATE(Content) OR UPDATE(Title) -- Update only if Content or Title are updated
    BEGIN
        UPDATE Notes
        SET UpdatedAt = GETDATE()
        FROM inserted
        WHERE Notes.Id = inserted.Id;
    END
END;
GO