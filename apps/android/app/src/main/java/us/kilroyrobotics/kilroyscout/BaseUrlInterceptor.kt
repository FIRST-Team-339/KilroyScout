package us.kilroyrobotics.kilroyscout

import android.content.Context
import android.content.SharedPreferences
import okhttp3.Interceptor
import okhttp3.Response

class BaseUrlInterceptor(private val context: Context, private val preferences: SharedPreferences) : Interceptor {
    val defaultBaseUrl = "http://10.0.0.1:3000"

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()

        val baseUrl = preferences.getString("baseUrl", defaultBaseUrl) ?: defaultBaseUrl // Default URL

        val newUrl = originalRequest.url().newBuilder()
            .scheme(baseUrl.substringBefore("://")) // Extract scheme (http or https)
            .host(baseUrl.substringAfter("://").substringBefore("/").substringBefore(":")) // Extract host
            .port(if (baseUrl.contains(":")) baseUrl.substringAfterLast(":").toIntOrNull() ?: 443 else if (baseUrl.startsWith("https")) 443 else 80) // Extract port or use default
            .build()

        val newRequest = originalRequest.newBuilder()
            .url(newUrl)
            .build()

        return chain.proceed(newRequest)
    }
}