-- =============================================
-- FuckNewsPoll - Azure SQL Schema (T-SQL)
-- Ejecutar en Azure SQL via portal o sqlcmd
-- =============================================

-- Estado de la app (1 sola fila)
CREATE TABLE app_state (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    is_active_round BIT NOT NULL DEFAULT 0,
    winner VARCHAR(10) CHECK (winner IN ('mago', 'camilo')),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

INSERT INTO app_state (id, is_active_round) VALUES (1, 0);

-- Votos individuales (dedup por device_id)
CREATE TABLE votos (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    comediante VARCHAR(10) NOT NULL CHECK (comediante IN ('mago', 'camilo')),
    device_id VARCHAR(64) NOT NULL,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT uq_votos_device_id UNIQUE (device_id)
);

-- ** TABLA DE TOTALES — lectura O(1) **
-- Una sola fila, siempre actualizada por triggers
CREATE TABLE resultados_votos (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    mago_count INT NOT NULL DEFAULT 0,
    camilo_count INT NOT NULL DEFAULT 0,
    total INT NOT NULL DEFAULT 0
);

INSERT INTO resultados_votos (id) VALUES (1);

-- Trigger: incrementa totales en cada voto
CREATE TRIGGER trg_votos_after_insert
ON votos
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE resultados_votos SET
        mago_count   = mago_count   + (SELECT COUNT(*) FROM inserted WHERE comediante = 'mago'),
        camilo_count = camilo_count + (SELECT COUNT(*) FROM inserted WHERE comediante = 'camilo'),
        total        = total        + (SELECT COUNT(*) FROM inserted)
    WHERE id = 1;
END;
GO

-- Trigger: resetea totales al borrar todos los votos
CREATE TRIGGER trg_votos_after_delete
ON votos
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    -- Solo resetea si se borraron TODOS los votos (acción reset del admin)
    IF NOT EXISTS (SELECT 1 FROM votos)
    BEGIN
        UPDATE resultados_votos SET mago_count = 0, camilo_count = 0, total = 0 WHERE id = 1;
    END
END;
GO
