CREATE SCHEMA [ACCOUNT]
GO

CREATE SCHEMA [FORUM]
GO

CREATE SCHEMA [CHAT]
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
  [expires_at] datetime,
  [is_available] bit NOT NULL DEFAULT (1)
)
GO

CREATE TABLE [FORUM].[Post] (
  [post_id] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [user_id] integer NOT NULL,
  [title] NVARCHAR(100),
  [content] NVARCHAR(1000) NOT NULL,
  [like_count] integer DEFAULT (0),
  [dislike_count] integer DEFAULT (0),
  [comment_count] integer DEFAULT (0),
  [attach_to] integer DEFAULT (0),
  [is_active] bit NOT NULL DEFAULT (1),
  [created_at] datetime NOT NULL,
  [updated_at] datetime NOT NULL
)
GO

CREATE TABLE [FORUM].[Like] (
  [post_id] integer NOT NULL,
  [user_id] integer NOT NULL,
  PRIMARY KEY ([post_id], [user_id])
)
GO

CREATE TABLE [FORUM].[Dislike] (
  [post_id] integer NOT NULL,
  [user_id] integer NOT NULL,
  PRIMARY KEY ([post_id], [user_id])
)
GO

CREATE TABLE [FORUM].[Block] (
  [post_id] integer NOT NULL,
  [user_id] integer NOT NULL,
  PRIMARY KEY ([post_id], [user_id])
)
GO

CREATE TABLE [FORUM].[Recommendation] (
  [user_id] integer NOT NULL,
  [tag_id] integer NOT NULL,
  [score] integer NOT NULL DEFAULT (0),
  PRIMARY KEY ([user_id], [tag_id])
)
GO

CREATE TABLE [FORUM].[Tag_Data] (
  [tag_id] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [tag_name] NVARCHAR(100) NOT NULL,
  [keyword] NVARCHAR(500)
)
GO

CREATE TABLE [FORUM].[Post_Tag] (
  [post_id] integer NOT NULL,
  [tag_id] integer NOT NULL,
  PRIMARY KEY ([post_id], [tag_id])
)
GO

CREATE TABLE [FORUM].[Image_Data] (
  [image_id] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [image_name] NVARCHAR(255) NOT NULL,
  [image_data] VARBINARY(MAX) NOT NULL,
  [image_format] VARCHAR(15) NOT NULL
)
GO

CREATE TABLE [FORUM].[Post_Image] (
  [post_id] integer NOT NULL,
  [image_id] integer NOT NULL,
  PRIMARY KEY ([post_id], [image_id])
)
GO

CREATE TABLE [CHAT].[Message] (
  [message_id] integer PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [user_id_from] integer NOT NULL,
  [user_id_to] integer NOT NULL,
  [content] NVARCHAR(1000) NOT NULL,
  [attach_to] integer DEFAULT (0),
  [is_active] bit NOT NULL DEFAULT (1),
  [sent_at] datetime NOT NULL,
  [read_at] datetime NOT NULL
)
GO

CREATE TABLE [CHAT].[Message_Image] (
  [message_id] integer NOT NULL,
  [image_id] integer NOT NULL,
  PRIMARY KEY ([message_id], [image_id])
)
GO

ALTER TABLE [ACCOUNT].[User_Account] ADD FOREIGN KEY ([role_id]) REFERENCES [ACCOUNT].[Role] ([role_id])
GO

ALTER TABLE [FORUM].[Post] ADD FOREIGN KEY ([user_id]) REFERENCES [ACCOUNT].[User_Account] ([user_id])
GO

ALTER TABLE [FORUM].[Like] ADD FOREIGN KEY ([post_id]) REFERENCES [FORUM].[Post] ([post_id])
GO

ALTER TABLE [FORUM].[Like] ADD FOREIGN KEY ([user_id]) REFERENCES [ACCOUNT].[User_Account] ([user_id])
GO

ALTER TABLE [FORUM].[Block] ADD FOREIGN KEY ([post_id]) REFERENCES [FORUM].[Post] ([post_id])
GO

ALTER TABLE [FORUM].[Block] ADD FOREIGN KEY ([user_id]) REFERENCES [ACCOUNT].[User_Account] ([user_id])
GO

ALTER TABLE [FORUM].[Dislike] ADD FOREIGN KEY ([user_id]) REFERENCES [ACCOUNT].[User_Account] ([user_id])
GO

ALTER TABLE [FORUM].[Dislike] ADD FOREIGN KEY ([post_id]) REFERENCES [FORUM].[Post] ([post_id])
GO

ALTER TABLE [FORUM].[Post_Tag] ADD FOREIGN KEY ([post_id]) REFERENCES [FORUM].[Post] ([post_id])
GO

ALTER TABLE [FORUM].[Post_Tag] ADD FOREIGN KEY ([tag_id]) REFERENCES [FORUM].[Tag_Data] ([tag_id])
GO

ALTER TABLE [FORUM].[Post_Image] ADD FOREIGN KEY ([post_id]) REFERENCES [FORUM].[Post] ([post_id])
GO

ALTER TABLE [FORUM].[Post_Image] ADD FOREIGN KEY ([image_id]) REFERENCES [FORUM].[Image_Data] ([image_id])
GO

ALTER TABLE [FORUM].[Recommendation] ADD FOREIGN KEY ([user_id]) REFERENCES [ACCOUNT].[User_Account] ([user_id])
GO

ALTER TABLE [FORUM].[Recommendation] ADD FOREIGN KEY ([tag_id]) REFERENCES [FORUM].[Tag_Data] ([tag_id])
GO

ALTER TABLE [CHAT].[Message] ADD FOREIGN KEY ([user_id_from]) REFERENCES [ACCOUNT].[User_Account] ([user_id])
GO

ALTER TABLE [CHAT].[Message] ADD FOREIGN KEY ([user_id_to]) REFERENCES [ACCOUNT].[User_Account] ([user_id])
GO

ALTER TABLE [CHAT].[Message_Image] ADD FOREIGN KEY ([message_id]) REFERENCES [CHAT].[Message] ([message_id])
GO

ALTER TABLE [CHAT].[Message_Image] ADD FOREIGN KEY ([image_id]) REFERENCES [FORUM].[Image_Data] ([image_id])
GO
