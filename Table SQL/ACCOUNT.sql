CREATE SCHEMA [ACCOUNT]
GO

CREATE TABLE [ACCOUNT].[User_Account] (
  [user_id] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [username] varchar(50) UNIQUE NOT NULL,
  [email] varchar(100) UNIQUE NOT NULL,
  [password_hash] varchar(255) NOT NULL,
  [is_active] bit NOT NULL DEFAULT (0),
  [role_id] integer NOT NULL,
  [created_at] datetime NOT NULL,
  [updated_at] datetime NOT NULL
)
GO

CREATE TABLE [ACCOUNT].[Role] (
  [role_id] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [role_name] varchar(20) UNIQUE NOT NULL
)
GO

CREATE TABLE [ACCOUNT].[License] (
  [license_id] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [license_key] varchar(16) NOT NULL,
  [email] varchar(100) NOT NULL,
  [created_at] datetime NOT NULL,
  [expires_at] datetime NOT NULL,
  [is_available] bit NOT NULL DEFAULT (1)
)
GO

ALTER TABLE [ACCOUNT].[User_Account] ADD FOREIGN KEY ([role_id]) REFERENCES [ACCOUNT].[Role] ([role_id])
GO
