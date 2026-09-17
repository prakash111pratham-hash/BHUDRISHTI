package com.example.data.repository

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import com.example.data.local.AnalysisDao
import com.example.data.local.AnalysisRecord
import com.example.data.model.AnalysisResult
import com.example.data.model.SatelliteScene
import com.example.data.remote.GeminiRemoteSenseService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import org.json.JSONArray

class RemoteSenseRepository(
    private val analysisDao: AnalysisDao,
    private val geminiService: GeminiRemoteSenseService = GeminiRemoteSenseService()
) {
    val savedAnalyses: Flow<List<AnalysisRecord>> = analysisDao.getAllAnalyses()

    suspend fun analyzeScene(
        context: Context,
        scene: SatelliteScene,
        query: String,
        spectralMode: String,
        customApiKey: String?
    ): AnalysisResult = withContext(Dispatchers.IO) {
        val bitmap = loadBitmapForScene(context, scene)
        geminiService.analyzeSatelliteImage(
            bitmap = bitmap,
            userQuery = query,
            sceneTitle = scene.title,
            coordinates = scene.coordinates,
            spectralMode = spectralMode,
            customApiKey = customApiKey
        )
    }

    suspend fun askFollowUp(
        context: Context,
        scene: SatelliteScene,
        history: String,
        question: String,
        customApiKey: String?
    ): String = withContext(Dispatchers.IO) {
        val bitmap = loadBitmapForScene(context, scene)
        geminiService.answerFollowUpQuestion(
            bitmap = bitmap,
            conversationHistory = history,
            followUpQuestion = question,
            sceneTitle = scene.title,
            customApiKey = customApiKey
        )
    }

    suspend fun getMapsGrounding(
        coordinates: String,
        locationTitle: String,
        customApiKey: String?
    ): String = withContext(Dispatchers.IO) {
        geminiService.queryGoogleMapsGrounding(coordinates, locationTitle, customApiKey)
    }

    suspend fun saveAnalysis(
        sceneTitle: String,
        coordinates: String,
        query: String,
        result: AnalysisResult,
        spectralMode: String
    ): Long = withContext(Dispatchers.IO) {
        val observationsJson = JSONArray(result.keyObservations).toString()
        val landCoverArray = JSONArray().apply {
            result.landCoverDistribution.forEach { item ->
                put("${item.name}: ${item.percentage.toInt()}%")
            }
        }.toString()

        val record = AnalysisRecord(
            sceneTitle = sceneTitle,
            coordinates = coordinates,
            queryPrompt = query,
            plainSummary = result.plainSummary,
            observationsJson = observationsJson,
            landCoverJson = landCoverArray,
            spectralBand = spectralMode,
            timestamp = result.timestamp
        )
        analysisDao.insertAnalysis(record)
    }

    suspend fun deleteSavedAnalysis(id: Long) = withContext(Dispatchers.IO) {
        analysisDao.deleteById(id)
    }

    suspend fun clearAllHistory() = withContext(Dispatchers.IO) {
        analysisDao.clearAll()
    }

    private val bitmapCache = mutableMapOf<String, Bitmap>()

    fun loadBitmapForScene(context: Context, scene: SatelliteScene): Bitmap {
        bitmapCache[scene.id]?.let { return it }

        val bmp = try {
            if (scene.customUri != null) {
                decodeSampledBitmapFromUri(context, scene.customUri)
            } else if (scene.resId != null) {
                BitmapFactory.decodeResource(context.resources, scene.resId)
            } else {
                createPlaceholderBitmap()
            }
        } catch (t: Throwable) {
            createPlaceholderBitmap()
        }
        val safeBmp = bmp ?: createPlaceholderBitmap()
        bitmapCache[scene.id] = safeBmp
        return safeBmp
    }

    private fun decodeSampledBitmapFromUri(context: Context, uri: Uri): Bitmap? {
        return try {
            val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
            context.contentResolver.openInputStream(uri)?.use { stream ->
                BitmapFactory.decodeStream(stream, null, options)
            }

            val reqWidth = 1200
            val reqHeight = 1200
            var inSampleSize = 1
            if (options.outHeight > reqHeight || options.outWidth > reqWidth) {
                val halfHeight = options.outHeight / 2
                val halfWidth = options.outWidth / 2
                while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
                    inSampleSize *= 2
                }
            }

            val decodeOptions = BitmapFactory.Options().apply {
                this.inSampleSize = inSampleSize
                inPreferredConfig = Bitmap.Config.ARGB_8888
            }
            context.contentResolver.openInputStream(uri)?.use { stream ->
                BitmapFactory.decodeStream(stream, null, decodeOptions)
            }
        } catch (t: Throwable) {
            null
        }
    }

    private fun createPlaceholderBitmap(): Bitmap {
        val bmp = Bitmap.createBitmap(256, 256, Bitmap.Config.ARGB_8888)
        val canvas = android.graphics.Canvas(bmp)
        val paint = android.graphics.Paint().apply {
            color = android.graphics.Color.DKGRAY
        }
        canvas.drawRect(0f, 0f, 256f, 256f, paint)
        return bmp
    }
}
