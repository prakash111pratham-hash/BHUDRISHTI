package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface AnalysisDao {
    @Query("SELECT * FROM satellite_analyses ORDER BY timestamp DESC")
    fun getAllAnalyses(): Flow<List<AnalysisRecord>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnalysis(record: AnalysisRecord): Long

    @Query("DELETE FROM satellite_analyses WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM satellite_analyses")
    suspend fun clearAll()
}
