CREATE SCHEMA [ACCOUNT]
GO

CREATE TABLE [ACCOUNT].[UserAccount] (
  [userId] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [username] varchar(50) UNIQUE NOT NULL,
  [email] varchar(100) UNIQUE NOT NULL,
  [passwordHash] varchar(255) NOT NULL,
  [isActive] bit NOT NULL DEFAULT (0),
  [roleId] integer NOT NULL,
  [createdAt] datetime NOT NULL,
  [updatedAt] datetime NOT NULL
)
GO

CREATE TABLE [ACCOUNT].[Role] (
  [roleId] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [roleName] varchar(20) UNIQUE NOT NULL
)
GO

CREATE TABLE [ACCOUNT].[License] (
  [licenseId] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [key] varchar(16) UNIQUE NOT NULL,
  [createdAt] datetime NOT NULL,
  [expiresAt] datetime,
  [isUsed] bit NOT NULL DEFAULT (0)
)
GO

ALTER TABLE [ACCOUNT].[UserAccount] ADD FOREIGN KEY ([roleId]) REFERENCES [ACCOUNT].[Role] ([roleId])
GO
