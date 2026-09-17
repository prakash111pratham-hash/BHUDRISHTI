package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("BHUदृष्टि", appName)
  }

  @Test
  fun `verify preset scenes count and attributes`() {
    val scenes = com.example.data.model.PresetSatelliteScenes.all
    assertEquals(3, scenes.size)
    assert(scenes.any { it.title.contains("Port") })
    assert(scenes.any { it.title.contains("Farmland") || it.title.contains("Pivot") })
    assert(scenes.any { it.title.contains("Canopy") || it.title.contains("Tropical") })
  }
}
