-- COMPLETE DATABASE CLEANUP - DELETE ALL DATA AND RESET IDENTITY
USE UpNestEdu;
GO

-- Turn off constraints temporarily
EXEC sp_MSForEachTable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';
GO

-- Delete from all tables
EXEC sp_MSForEachTable 'DELETE FROM ?';
GO

-- Re-enable constraints
EXEC sp_MSForEachTable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';
GO

-- Reset identity seeds on all tables with identity columns
DECLARE @TableName NVARCHAR(MAX);
DECLARE @SQL NVARCHAR(MAX);

DECLARE cur CURSOR FOR
    SELECT TABLE_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE COLUMNPROPERTY(OBJECT_ID(TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1
    GROUP BY TABLE_NAME;

OPEN cur;
FETCH NEXT FROM cur INTO @TableName;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @SQL = 'DBCC CHECKIDENT (''' + @TableName + ''', RESEED, 0);';
    EXEC sp_executesql @SQL;
    FETCH NEXT FROM cur INTO @TableName;
END;

CLOSE cur;
DEALLOCATE cur;

PRINT '✅ All tables truncated and identity seeds reset to 0';
