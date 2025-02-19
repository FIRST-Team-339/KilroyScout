package us.kilroyrobotics.kilroyscout

import android.content.Context
import android.content.SharedPreferences
import android.content.SharedPreferences.Editor
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Observer
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.reflect.TypeToken
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.lang.reflect.Modifier

class MainActivity : AppCompatActivity() {
    private lateinit var eventData: MutableLiveData<EventData?>

    override fun onCreate(savedInstanceState: Bundle?) {
        val preferences = getSharedPreferences("kilroy_scouting", Context.MODE_PRIVATE)

        eventData = MutableLiveData(preferences.getObject("eventData"))
        eventData.observe(this, Observer { newData ->
            preferences.edit().putObject("eventData", newData).commit()
        })

        val baseUrlInterceptor = BaseUrlInterceptor(applicationContext, preferences)

        val okHttpClient = OkHttpClient.Builder().addInterceptor(baseUrlInterceptor).build()

        val gson = GsonBuilder().excludeFieldsWithModifiers(Modifier.VOLATILE).create()

        val retrofitApi = Retrofit.Builder().baseUrl(baseUrlInterceptor.defaultBaseUrl).addConverterFactory(GsonConverterFactory.create(gson)).client(okHttpClient).build()

        val apiService = retrofitApi.create(ApiService::class.java)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)

        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            val selectedFragment: Fragment = when (item.itemId) {
                R.id.nav_home -> HomeFragment(this, eventData, preferences, apiService)
                R.id.nav_event_info -> EventInfoFragment(eventData, this, supportFragmentManager)
                R.id.nav_matches -> MatchesFragment(eventData, supportFragmentManager)
                else -> HomeFragment(this, eventData, preferences, apiService) // Default fragment
            }

            supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, selectedFragment)
                .commitNow()

            true
        }

        // Set the default selected item
        bottomNavigationView.selectedItemId = R.id.nav_home
    }
}

inline fun <reified T> Editor.putObject(key: String, value: T): Editor {
    val json = Gson().toJson(value)
    putString(key, json).apply()

    return this
}

inline fun <reified T> SharedPreferences.getObject(key: String): T? {
    val json = getString(key, null)
    return if (json != null) {
        Gson().fromJson(json, object: TypeToken<T>() {}.type)
    } else {
        null
    }
}