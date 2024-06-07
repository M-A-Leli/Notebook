-- Create Database Notebook
CREATE DATABASE Notebook;
GO

-- Switch to Notebook
USE Notebook;
GO

-- Create the Notes table
CREATE TABLE Notes (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR(50) NOT NULL,
    Content NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);
GO

INSERT INTO notes (id, title, content) VALUES
('eeb1a550-1234-4f63-b1d9-6787d83f2073', 'Note 1', 'Content of note 1'),
('7f9a4a35-5678-4e25-a643-209dc6912c8b', 'Note 2', 'Content of note 2'),
('a3b2c347-9101-4f91-a81e-3b5c4c8e9d57', 'Note 3', 'Content of note 3'),
('f6a3d0b1-1357-4812-94a4-8b1e7c6f2e8e', 'Note 4', 'Content of note 4'),
('3d7e4d95-2468-42f6-9b6a-947c3e0f4e7d', 'Note 5', 'Content of note 5'),
('9a0fcb8e-4820-41fa-88a3-5f6e3c0d9b9b', 'Note 6', 'Content of note 6'),
('e4f5cda9-5678-40e4-8a3e-8c9f6b5e3d7e', 'Note 7', 'Content of note 7'),
('b5a1c3d4-6789-4b2e-81a4-7c9e8f4d6e7f', 'Note 8', 'Content of note 8'),
('7e3f1a92-8901-4b1a-94a2-9e8f7c6b2e5d', 'Note 9', 'Content of note 9'),
('a4e5d1b2-9012-4f8a-81b4-6e8f9c5d2e7d', 'Note 10', 'Content of note 10');
GO
