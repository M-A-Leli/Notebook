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
