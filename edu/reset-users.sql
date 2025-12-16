-- Reset users table for testing - COMPLETE DELETE WITH CASCADE
USE UpNestEdu;
GO

-- Disable constraint checking
ALTER TABLE privacy_settings NOCHECK CONSTRAINT ALL;
ALTER TABLE user_profiles NOCHECK CONSTRAINT ALL;
ALTER TABLE user_connections NOCHECK CONSTRAINT ALL;
ALTER TABLE study_groups NOCHECK CONSTRAINT ALL;
ALTER TABLE study_group_members NOCHECK CONSTRAINT ALL;
GO

-- Delete all related data
DELETE FROM privacy_settings;
DELETE FROM user_profiles;
DELETE FROM user_connections;
DELETE FROM study_group_members;
DELETE FROM study_groups;
DELETE FROM users;
GO

-- Re-enable constraints
ALTER TABLE privacy_settings WITH CHECK CHECK CONSTRAINT ALL;
ALTER TABLE user_profiles WITH CHECK CHECK CONSTRAINT ALL;
ALTER TABLE user_connections WITH CHECK CHECK CONSTRAINT ALL;
ALTER TABLE study_groups WITH CHECK CHECK CONSTRAINT ALL;
ALTER TABLE study_group_members WITH CHECK CHECK CONSTRAINT ALL;
GO

-- Reset identity seeds
DBCC CHECKIDENT ('users', RESEED, 0);
DBCC CHECKIDENT ('privacy_settings', RESEED, 0);
DBCC CHECKIDENT ('user_profiles', RESEED, 0);
GO

PRINT '✅ Database cleared. Application will recreate test users on next start.';
